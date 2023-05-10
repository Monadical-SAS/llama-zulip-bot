import { createServer } from "http";
import express from "express";
import bodyParser from "body-parser";
import { askllama, init, llamaParams } from "./llama.js";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  console.log(`Request: ${message}`);
  const response = await askllama({ question: message });
  console.log("Finished");
  res.json({
    response,
  });
});

init().then(() =>
  server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
    console.log("Using llama params:\n", llamaParams());
  })
);
