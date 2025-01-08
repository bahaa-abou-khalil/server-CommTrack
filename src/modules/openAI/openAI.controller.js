import { openai } from "../../index.js";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const analyzeMessages = async (req, res) => {
  const { messages } = req.body;

  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input. Expecting an array of messages." });
    }
    const transformedMessages = messages.map((msg) => ({
      user_id: msg.user,
      message: msg.text,
      timestamp: msg.timestamp,
    }));


    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
          { role: "system", content: "You are an expert in analyzing structured data to structured output, talking with the members."  },
          { role: "user", content: "Determine if the messages of each user violate specific guidelines in behaviour, engagement, and productivity." },
          { role: "user", content: JSON.stringify(transformedMessages) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "alerts_response",
          schema: {
            type: "object",
            properties: {
              users: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    user_id: {
                      type: "string"
                    },
                    alerts: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          alert_type: {
                            type: "string",
                            enum: ["behaviour", "engagement", "productivity"]
                          },
                          alert_title: {
                            type: "string",
                            description: "2 or 3 words"
                          },
                          alert_description: {
                            type: "string",
                            description: "Maximum of 30 words"
                          }
                        },
                        required: ["alert_type", "alert_title", "alert_description"],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ["user_id", "alerts"],
                  additionalProperties: false
                }
              }
            },
            required: ["users"],
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