import { moduleUnavailable } from "@/server/modules/scaffold/route";

export function GET() { return moduleUnavailable("events"); }
export function POST() { return moduleUnavailable("events"); }
