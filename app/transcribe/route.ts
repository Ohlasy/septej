export async function POST(request: Request) {
  const incomingData = await request.formData();
  const fileData = incomingData.get("file");
  if (!fileData) {
    return new Response("Missing file data", { status: 400 });
  }

  const apiToken = process.env.OPENAI_API_KEY || "";

  const payload = new FormData();
  payload.append("model", "whisper-1");
  payload.append("response_format", "text");
  payload.append("language", "cs");
  payload.append("file", fileData);

  // https://platform.openai.com/docs/api-reference/audio/create
  return await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    body: payload,
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
}
