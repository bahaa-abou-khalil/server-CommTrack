import { openai } from "../../index.js";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const analyzeMessages = async (req, res) => {
  const { messages } = req.body;

  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input. Expecting an array of messages." });
    }

    const alertEvent = z.object({
      alertTitle: z.string(),
      description: z.string(),
      tips: z.array(z.string()),
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are a company manager analyzing user messages and tone from Slack and providing alerts on missbehaviour, lack of enagement, and unproductivity."
        },
        {
          role: "user",
          content: `Analyze messages and alert users:\n
            ${messages.map(
              (msg, index) =>
                `Message ${index + 1}:\nUser: ${msg.user}\nText: "${msg.text}"\nTimestamp: ${msg.timestamp}`
            ).join("\n\n")}`
        },
      ],
      response_format:zodResponseFormat(alertEvent, "alert-event"),
    })
    
    const result = completion.choices[0].message.content;
    
    res.json({
      result
    })

    
  
  } catch (error) {
    console.error("Error analyzing messages:", error);
    res.status(500).json({ error: "Failed to analyze messages" });
  }
};