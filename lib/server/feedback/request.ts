import { NextRequest } from "next/server";
import { RequestContext } from "./types";

const UNKNOWN_IP = "0.0.0.0";
const MAX_USER_AGENT_LENGTH = 512;

export function getRequestContext(req: NextRequest): RequestContext {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  const ip = firstForwardedIp || realIp?.trim() || UNKNOWN_IP;
  const userAgent = req.headers.get("user-agent");

  return {
    ip,
    userAgent: userAgent ? userAgent.slice(0, MAX_USER_AGENT_LENGTH) : null,
  };
}
