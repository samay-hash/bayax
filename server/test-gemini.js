const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // There is no direct listModels on genAI instance in some versions, 
        // but the error message says "Call ListModels". 
        // In the Node SDK, it's often accessed via the ModelService or simply by trying a known stable model.
        // Actually, for the Node SDK, we might need to use the model manager if exposed, 
        // but the simplest debug is to try the 'gemini-pro' which is the GA model.

        // However, to strictly follow "Call ListModels", we might need the lower level API or just try to generate with a safe fallback.
        // Let's try to get the model metadata if possible, or just run a simple generation test on standard models.

        // We will test 3 common variants to see which one works.
        const modelsToTest = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

        console.log("Testing available models with provided API Key...");

        for (const modelName of modelsToTest) {
            console.log(`\nAttempting to connect to: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you working?");
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName} is working!`);
                console.log(`Response: ${response.text()}`);
                return; // Exit on first success
            } catch (error) {
                console.log(`❌ FAILED: ${modelName}`);
                console.log(`Error: ${error.message}`);
            }
        }

        console.log("\nAll common model names failed. Please check API Key permissions or Region.");

    } catch (error) {
        console.error("Fatal Error in script:", error);
    }
}

listModels();
