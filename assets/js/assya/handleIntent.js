import katalog from "./intents/katalog.js";
import greeting from "./intents/greeting.js";
import fallback from "./intents/fallback.js";
import help from "./intents/help.js";
import limitReached from "./intents/limitReached.js";
import produkDetail from "./classifyIntent.js";
// Pemetaan intent
const intents = {
  katalog,
  greeting,
  fallback,
  help,
  limitReached,
  produkDetail
};
export default async function handleIntent(intentName, userInput = "") {
  const handler = intents[intentName] || intents["fallback"];
  return await handler(userInput); // Boleh async jika ada fetch
}
