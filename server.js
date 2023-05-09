import { createServer } from "http";
import express from "express";
import bodyParser from "body-parser";
import { askllama, init } from "./llama.js";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.post("/llamaChat", async (req, res) => {
  const { message } = req.body;
  console.log(message);
  console.log({ response: await askllama(message) });
});

init().then(() =>
  server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
  })
);

function shutDown(signal) {
  console.log(signal);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutDown);
process.on("SIGQUIT", shutDown);
process.on("SIGTERM", shutDown);
