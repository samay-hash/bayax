const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini
// NOTE: We are using the variable GEMINI_API_KEY from .env
console.log("Checking API Key availability:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using 1.5 flash as it is currently stable and free-tier friendly, fallback to pro if needed
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const analyzeIdea = async (req, res) => {
  const START_TIME = Date.now();
  console.log("--- IDEA ANALYSIS REQUEST START ---");

  try {
    const { step, field, intent, content, techStack, username } = req.body;

    // Construct Prompt
    let promptContext = "";

    if (intent === "need_idea") {
      promptContext = `
            USER SCENARIO: The user wants to build something in the "${field}" field but DOES NOT have a specific idea.
            USER CONSTRAINTS: "${content || 'None provided'}"
            PREFERRED TECH: "${techStack || 'Any'}"
            
            TASK: Generate a highly viable, modern startup idea for this user in the ${field} space. 
            Then analyze that generated idea as if it was their own.
        `;
    } else {
      promptContext = `
            USER SCENARIO: The user has a specific idea in the "${field}" field.
            IDEA DESCRIPTION: "${content}"
            PREFERRED TECH: "${techStack || 'Best suited for the project'}"
            
            TASK: Analyze this specific idea. Enhance it, structure it, and validate it.
        `;
    }

    const systemPrompt = `
      You are BayaX, the world's most advanced Product Architect AI.
      Your goal is to transform separate inputs into a complete EXECUTION BLUEPRINT.
      
      OUTPUT FORMAT:
      Return strictly a valid JSON object. Do not include markdown formatting (like \`\`\`json).
      
      JSON STRUCTURE:
      {
        "clarityCheck": {
           "originalInput": "String",
           "refinedConcept": "String (The 'Elevator Pitch')",
           "category": "String"
        },
        "marketAnalysis": {
           "score": Number (0-100),
           "verdict": "String (e.g. 'Blue Ocean', 'Highly Competitive')",
           "competitors": ["String", "String"],
           "targetAudience": ["String", "String"],
           "monetization": ["String", "String"]
        },
        "techStack": {
             "frontend": "String",
             "backend": "String",
             "database": "String",
             "deployment": "String",
             "rationale": "String (Why this stack?)"
        },
        "mindMap": {
            "root": "String (Central Node Name)",
            "branches": [
                {
                    "label": "String (e.g. Core Features)",
                    "children": ["String", "String"]
                },
                 {
                    "label": "String (e.g. Marketing)",
                    "children": ["String", "String"]
                }
            ]
        },
        "executionStructure": {
           "phases": [
              {
                "name": "Phase 1: MVP (Days 1-14)",
                "steps": ["Step 1", "Step 2", "Step 3"]
              },
               {
                "name": "Phase 2: Growth (Days 15-45)",
                "steps": ["Step 1", "Step 2"]
              }
           ]
        },
        "logicFlow": {
            "topic": "String (Core Topic/Theme)",
            "problem": "String (The definitive problem statement)",
            "solution": "String (The core solution/value prop)",
            "marketEffects": {
                "positive": "String (Why the market needs this)",
                "negative": "String (Potential risks or side effects)"
            }
        },
        "criticalQuestions": [
           "String (A tough question to ask the founder)",
           "String"
        ]
      }

      CONTEXT:
      ${promptContext}
    `;

    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let text = response.text();

    // Cleanup markdown if present to prevent JSON parse errors
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error. Raw Text:", text);
      throw new Error("AI returned invalid JSON structure.");
    }

    console.log(`Analysis complete. Time: ${Date.now() - START_TIME}ms`);
    return res.status(200).json({ success: true, data: jsonResponse });

  } catch (error) {
    console.error("Error in analyzeIdea:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "AI Analysis Failed",
      error: error.message
    });
  }
};

module.exports = { analyzeIdea };
