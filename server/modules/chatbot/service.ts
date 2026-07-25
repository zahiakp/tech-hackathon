import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/server/api/response";
import type { AccessContext } from "@/server/auth/guards";
import { env } from "@/server/config/env";
import { sha256 } from "@/server/security/crypto";

export const chatbotRequestSchema = z.object({ message: z.string().trim().min(1).max(2000) });
const chatbotOutputSchema = z.object({
  intent: z.string().min(1).max(80),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "IMMINENT"]),
  answer: z.string().min(1).max(2000),
  recommendedResourceIds: z.array(z.string()).max(5),
  escalate: z.boolean(),
});

type ChatbotOutput = z.infer<typeof chatbotOutputSchema>;
const crisisPattern = /\b(suicide|kill myself|end my life|hurt myself|self[- ]harm|being attacked|immediate danger|cannot stay safe)\b/i;

function crisisResponse(resources: Array<{ id: string; title: string; contact: string | null; url: string | null }>): ChatbotOutput {
  return {
    intent: "emergency_support",
    riskLevel: "IMMINENT",
    answer: "Your safety comes first. Use the SOS button now, contact campus security, or go to the nearest safe person. Lexa is not an emergency service.",
    recommendedResourceIds: resources.slice(0, 3).map(({ id }) => id),
    escalate: true,
  };
}

export async function campusChatbot(user: AccessContext, message: string) {
  const resources = await prisma.campusResource.findMany({ where: { active: true }, orderBy: { category: "asc" }, take: 30 });
  if (crisisPattern.test(message)) {
    const output = crisisResponse(resources);
    await logInteraction(user.id, output);
    return { ...output, recommendedResources: resources.filter(({ id }) => output.recommendedResourceIds.includes(id)) };
  }
  if (!env.OPENAI_API_KEY) throw new AppError(503, "CHATBOT_NOT_CONFIGURED", "Lexa is not configured.");

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const moderation = await client.moderations.create({ model: "omni-moderation-latest", input: message });
  if (moderation.results[0]?.flagged) {
    const output = crisisResponse(resources);
    await logInteraction(user.id, output);
    return { ...output, recommendedResources: resources.filter(({ id }) => output.recommendedResourceIds.includes(id)) };
  }

  const resourceContext = resources.map((item) => ({ id: item.id, title: item.title, description: item.description, category: item.category, contact: item.contact, url: item.url }));
  const response = await client.responses.parse({
    model: "gpt-5.6-luna",
    reasoning: { effort: "low" },
    safety_identifier: sha256(`campus-user:${user.id}`).slice(0, 64),
    store: false,
    instructions: [
      "You are a constrained campus resource navigator, not a therapist, clinician, or emergency service.",
      "Answer only using the approved resources provided in the user message.",
      "Never diagnose, prescribe, promise confidentiality, or discourage professional help.",
      "If the user may be in immediate danger or at risk of self-harm, set riskLevel to IMMINENT, escalate to true, and direct them to SOS, campus security, and an available counsellor.",
      "Return only the structured response. Use only IDs from the approved resource list.",
    ].join(" "),
    input: `Approved campus resources:\n${JSON.stringify(resourceContext)}\n\nStudent message:\n${message}`,
    text: { format: zodTextFormat(chatbotOutputSchema, "campus_support_response") },
    max_output_tokens: 700,
  });

  let output = response.output_parsed;
  if (!output) throw new AppError(502, "CHATBOT_INVALID_RESPONSE", "Lexa returned an invalid response.");
  output = { ...output, recommendedResourceIds: output.recommendedResourceIds.filter((id) => resources.some((resource) => resource.id === id)) };
  const outputModeration = await client.moderations.create({ model: "omni-moderation-latest", input: output.answer });
  if (outputModeration.results[0]?.flagged) output = crisisResponse(resources);

  await logInteraction(user.id, output, response.id, response.usage?.input_tokens, response.usage?.output_tokens);
  return { ...output, recommendedResources: resources.filter(({ id }) => output.recommendedResourceIds.includes(id)) };
}

async function logInteraction(userId: string, output: ChatbotOutput, providerRequestId?: string, inputTokens?: number, outputTokens?: number) {
  await prisma.chatbotInteraction.create({
    data: {
      userId, providerRequestId, intent: output.intent, riskLevel: output.riskLevel,
      escalated: output.escalate, resourceIds: output.recommendedResourceIds, inputTokens, outputTokens,
    },
  });
}
