import { LLM } from "llama-node";
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
import path from "path";
const model = path.resolve(process.cwd(), "./models/ggml-vic7b-uncensored-q5_1.bin");
const llama = new LLM(LLamaCpp);
const config = {
    path: model,
    enableLogging: true,
    nCtx: 1024,
    nParts: -1,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: true,
};

const prompt = (question) => `A chat between a user and an assistant.
USER: ${question}
ASSISTANT:`;

export async function init() {
   return llama.load(config);
}

export const askllama = (question) => new Promise((resolve)=> {
    const params = {
        nThreads: 4,
        nTokPredict: 2048,
        topK: 40,
        topP: 0.1,
        temp: 0.2,
        repeatPenalty: 1,
        prompt: prompt(question),
    };

   llama.createCompletion(params, resolve)
});
