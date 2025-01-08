import { openai } from "../../index.js";

export const analyzeMessages = async (req, res) => {
  const { messages } = req.body;

  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid input. Expecting an array of messages." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant analyzing user messages from Slack."
        },
        {
          role: "user",
          content: `Analyze the following messages and respond in JSON format:\n
            ${messages.map(
              (msg, index) =>
                `Message ${index + 1}:\nUser: ${msg.user}\nText: "${msg.text}"\nTimestamp: ${msg.timestamp}`
            ).join("\n\n")}`
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "alerts_schema",
          schema: {
            type: "object",
            properties: {
              userId: {
                type: "string",
                description: "The ID of the user."
              },
              alerts: {
                type: "array",
                description: "Array of alerts for the user.",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["behaviour", "productivity", "engagement"],
                      description: "Type of alert."
                    },
                    alertTitle: {
                      type: "string",
                      description: "Brief title summarizing the alert."
                    },
                    alertDescription: {
                      type: "string",
                      description: "Short explanation of the alert."
                    },
                    tips: {
                      type: "array",
                      items: {
                        type: "string"
                      },
                      minItems: 3,
                      maxItems: 3,
                      description: "Improvement tips for the alert."
                    }
                  },
                  required: ["type", "alertTitle", "alertDescription", "tips"]
                }
              }
            },
            required: ["userId", "alerts"]
          }
        }
      }
    });
    
    const analysisString = completion.choices[0].message.content;
    
    res.json({
      analysisString
    })

    
  
  } catch (error) {
    console.error("Error analyzing messages:", error);
    res.status(500).json({ error: "Failed to analyze messages" });
  }
};