import { openai } from "../../index.js";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const analyzeMessages = async (req, res) => {
  const { messages } = req.body;

  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input. Expecting an array of messages." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
          { role: "system", content: "You are an expert in analyzing structured data to structured output." },
          { role: "user", content: "Determine if the users messages violates specific guidlines in behaviour, engagement, and productivty." }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
            name: "alerts_response",
            schema: {
                type: "object",
                properties: {
                    alerts: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                alert_title: { type: "string" },
                                alert_description: { type: "string" }
                            },
                            required: ["alert_title", "alert_description"],
                            additionalProperties: false
                        }
                    },
                    user_id: { type: "string" }
                },
                required: ["alerts", "user_id"],
                additionalProperties: false
            },
            strict: true
        }
      }
    });
    
    const result = response.choices[0].message.content;
    
    res.json({
      result
    })

    
  
  } catch (error) {
    console.error("Error analyzing messages:", error);
    res.status(500).json({ error: "Failed to analyze messages" });
  }
};