const dotenv = require("dotenv-flow");
const express = require("express");
const multer = require("multer");

dotenv.config();

const port = 8000;

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30_000_000 },
});

app.post("/", upload.single("file"), async (request, response) => {
  const { file } = request;
  if (!file) {
    response.status(400);
    response.send("Missing file data");
    return;
  }

  console.debug(
    `Have file data (file name “${file.originalname ?? "unknown"}”), size ${
      file.size
    } bytes.`
  );

  const apiToken = process.env.OPENAI_API_KEY || "";
  if (!apiToken) {
    response.status(500);
    response.send("Missing OpenAI API key");
    return;
  }

  const payload = new FormData();
  payload.append("model", "whisper-1");
  payload.append("response_format", "text");
  payload.append("language", "cs");
  payload.append("file", new Blob([file.buffer]), file.originalname);

  console.debug(`Sending request to origin server.`);

  // https://platform.openai.com/docs/api-reference/audio/create
  const originResponse = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      body: payload,
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    }
  );

  console.debug(
    `Origin server status ${originResponse.status} (${originResponse.statusText}).`
  );

  response.contentType(originResponse.headers.get("content-type"));
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://septej.ohlasy.info"
  );
  response.status(originResponse.status);
  response.send(await originResponse.text());
});

app.listen(port, () => {
  console.log(`API proxy listening on port ${port}`);
});
