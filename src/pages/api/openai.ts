import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "Messages must be an array of objects with 'role' and 'content'.",
    });
  }

  try {
    const filteredMessages = messages.filter(
      (msg) =>
        msg.content !== "I couldn't understand your input. Please try again."
    );

    const lastMessage = filteredMessages[filteredMessages.length - 1]?.content;

    let prompt = "";

    if (["A1", "A2", "B1", "B2"].includes(lastMessage)) {
      prompt = `
        Now that you've selected the English level (${lastMessage}),
        let the user choose a topic for our conversation. Provide engaging and practical
        options relevant to real-life scenarios.

        Respond in this structured JSON format:
        {
          "response": "What topic would you like to discuss?",
          "options": ["Travel", "Work", "Food", "Education"]
        }
      `;
    } else {
      prompt = `
        Continue the conversation based on the user's input and previous context.
        If a topic is being discussed (e.g., Travel, Food), provide follow-up questions.
        Respond in this structured JSON format:
        {
          "response": "Your next message or follow-up question",
          "options": ["Option 1", "Option 2", "Option 3"]
        }
      `;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful English tutor." },
          ...filteredMessages,
          { role: "user", content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI.");
    }

    let parsedResponse = "I couldn't understand your input. Please try again.";
    let options = ["Retry"];
    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      parsedResponse = parsedContent.response || parsedResponse;
      options = parsedContent.options || options;
    } catch (err) {
      console.error("Error parsing OpenAI response:", err);
    }

    if (!Array.isArray(options) || options.length === 0) {
      options = ["Retry"];
    }

    res.status(200).json({ response: parsedResponse, options });
  } catch (err) {
    console.error("Error:", err);

    res.status(500).json({
      response: "An error occurred. Please try again.",
      options: ["Retry"],
    });
  }
}
