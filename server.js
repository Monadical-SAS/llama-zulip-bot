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
  const { tokens } = await askllama(message);
  console.log(tokens);
  const responseString = tokens.filter((t) => t !== "\n\n<end>\n").join("");
  const response = responseString.slice(0, responseString.indexOf("USER"));

  res.json({
    response,
  });
});

init().then(() =>
  server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
  })
);
