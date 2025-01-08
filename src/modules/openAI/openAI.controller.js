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
              name: "math_response",
              schema: {
                  type: "object",
                  properties: {
                      steps: {
                          type: "array",
                          items: {
                              type: "object",
                              properties: {
                                  explanation: { type: "string" },
                                  output: { type: "string" }
                              },
                              required: ["explanation", "output"],
                              additionalProperties: false
                          }
                      },
                      final_answer: { type: "string" }
                  },
                  required: ["steps", "final_answer"],
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