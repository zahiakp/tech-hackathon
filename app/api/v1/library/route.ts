import { moduleUnavailable } from "@/server/modules/scaffold/route";

export function GET() { return moduleUnavailable("library"); }
export function POST() { return moduleUnavailable("library"); }
