import { GoogleGenAI } from "@google/genai";

async function main(input) {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDAYa_KeA6LSoXCfhFKnrtaejpZmVlRjJU",
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    temperature: 0.95,
    tools,
  };
  const model = "gemini-2.0-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: input
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let completeResponse = ""; // Initialize an empty string to accumulate the response

  for await (const chunk of response) {
    completeResponse += chunk.text; // Append each chunk to the completeResponse string
  }
  console.log("Complete Response:", completeResponse);
  

  const start = completeResponse.indexOf("[");
  const end = completeResponse.lastIndexOf("]") + 1;
  const jsonString = completeResponse.slice(start, end);

  const data = JSON.parse(jsonString);
  console.log(data);
  return data;

//   console.log(completeResponse);
}

export default main;
