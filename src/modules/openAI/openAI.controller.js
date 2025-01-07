import OpenAI from "openai";
const openai = new OpenAI();

export const analyzeMessages = async (req, res) => {
  const { messages } = req.body;

  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input. Expecting an array of messages." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant analyzing user messages from Slack. Identify potential alerts based on misbehavior, low productivity, or lack of engagement, and suggestions for improvement.",
        },
        {
          role: "user",
          content: `Analyze the following messages:\n
          ${messages.map(
              (msg, index) =>
                `Message ${index + 1}:\nUser: ${msg.user}\nText: "${msg.text}"\nTimestamp: ${msg.timestamp}`
            )
            .join("\n\n")}`,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    res.status(200).json({ analysis: aiResponse });
  } catch (error) {
    console.error("Error analyzing messages:", error);
    res.status(500).json({ error: "Failed to analyze messages" });
  }
};