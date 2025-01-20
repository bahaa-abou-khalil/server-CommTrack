import { openai } from "../../index.js";

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
          { role: "system", content: "You are an expert in analyzing structured data to structured output, talking with the members directly with simple and professional english."  },
          { role: "user", content: "Determine if the messages of each user violate specific guidelines in behaviour, engagement, and productivity." },
          { role: "user", content: JSON.stringify(transformedMessages) },
          { role: "user", content: "Group all alerts by the usre_id field in the input data. Each user in the output should have a 'user_id' field and an 'alerts' array containing all alerts for that user." },
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
                          },
                          improvement_tips: {
                            type: "array",
                            items: {
                              type: "string",
                              description: "should contain no more than 10 words each."
                            },
                            description:"3 sentences",
                          }
                        },
                        required: ["alert_type", "alert_title", "alert_description","improvement_tips"],
                        additionalProperties: false
                      }
                    },
                    messages_quality: {
                      type: "string",
                      description: "Representing the quality of the messages as a percentage (e.g., '50%'). This indicates how well the message meets criteria such as clarity, relevance, grammar, and tone, with 100% being the highest quality.",
                      example: "55%"
                    }
                  },
                  required: ["user_id", "alerts", "messages_quality"],
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

export const rateMessages = async (req, res) => {
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
          { role: "system", content: "You are an expert in analyzing structured data to structured output, replying with a percentage rank for messages."  },
          { role: "user", content: "Determine the overall messages quality of each user. This indicates how well the message meets criteria such as clarity, and behaviour." },
          { role: "user", content: JSON.stringify(transformedMessages) },
          { role: "user", content: "Group all result by the user_id field in the input data. Each user in the output should have a 'user_id' field and a 'message_quality' field percentage rate of messages for that user." },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "quality_response",
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
                    messages_quality: {
                      type: "string",
                      description: "This indicates how well all the messages for that user meets criteria such as clarity, and behaviour."
                    }
                  },
                  required: ["user_id", "messages_quality"],
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