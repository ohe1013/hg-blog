import { FeedbackRepository } from "./types";
import { FirebaseFeedbackRepository } from "./firebase";
import { MemoryFeedbackRepository } from "./memory";

let singleton: FeedbackRepository | null = null;

function resolveProviderName() {
  return (process.env.FEEDBACK_REPOSITORY ?? "firebase").toLowerCase();
}

export function getFeedbackRepository(): FeedbackRepository {
  if (singleton) {
    return singleton;
  }

  const provider = resolveProviderName();
  if (provider === "memory") {
    singleton = new MemoryFeedbackRepository();
    return singleton;
  }

  singleton = new FirebaseFeedbackRepository();
  return singleton;
}
