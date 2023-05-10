import { LLM } from "llama-node";
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
import path from "path";
const model = path.resolve(process.cwd(), "./models/ggml-alpaca-7b-q4.bin");
const llama = new LLM(LLamaCpp);
const config = {
  path: model,
  enableLogging: true,
  nCtx: 1024,
  nParts: -1,
  seed: 89787696,
  f16Kv: false,
  logitsAll: false,
  vocabOnly: false,
  useMlock: false,
  embedding: false,
  useMmap: true,
};

const prompt = (question) => `Answer as an AI sassy assistant.
USER: (asks a question) ${question}
ASSISTANT: `;

export function init() {
  console.log(config);
  return llama.load(config);
}

export const llamaParams = (question) => ({
  nThreads: 10,
  nTokPredict: 2048,
  topK: 40,
  topP: 0.1,
  temp: 0.2,
  repeatPenalty: 1,
  prompt: prompt(question),
});

export const askllama = async ({ question, params, cb }) => {
  const { tokens } = await llama.createCompletion(
    params || llamaParams(question),
    cb || Function.prototype
  );
  const responseString = tokens.filter((t) => t !== "\n\n<end>\n").join("");
  const responseWithoutExtraDialog = responseString.slice(
    0,
    responseString.indexOf("USER")
  );
  return responseWithoutExtraDialog;
};
