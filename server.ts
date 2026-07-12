import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini code generation
  app.post("/api/generate", async (req: express.Request, res: express.Response) => {
    try {
      const { prompt, customApiKey } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Fallback to server secret if user doesn't supply a key
      const apiKey = customApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(401).json({
          error: "Gemini API Key is missing. Please provide one in the UI or check your environment configuration."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Implement exponential backoff retry logic for robust transient error handling
      const executeWithRetry = async (retriesLeft = 3, delay = 1000): Promise<any> => {
        try {
          return await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: `You are an expert React developer. Generate an interactive simulation component based on the user's request.
CRITICAL RULES:

1. ONLY return the raw, valid React component code (export default function...). Do not include markdown formatting or explanations.
2. Use Tailwind CSS for all styling.
3. LIGHT MODE ONLY. NEVER use 'dark:' variants.
4. STRICT SEMANTIC COLORS: You must use our specific tailwind colors:
    • Backgrounds: 'bg-background', 'text-foreground'
    • Cards/Surfaces: 'bg-card', 'text-card-foreground', 'border-border'
    • Primary: 'bg-primary', 'text-primary-foreground'
    • Secondary: 'bg-secondary', 'text-secondary-foreground'
    • Subtle/Disabled: 'bg-muted', 'text-muted-foreground'
    • Hover states: 'hover:bg-accent', 'hover:text-accent-foreground'
    • Borders: 'border-border'
5. Make it responsive, use proper padding (p-4, p-6), rounded corners (rounded-xl), and modern clean UI.`,
            }
          });
        } catch (err: any) {
          const errText = err.message || "";
          const isTransient = errText.includes("503") || 
                              errText.includes("UNAVAILABLE") || 
                              errText.includes("high demand") || 
                              errText.includes("overloaded");
          
          if (retriesLeft > 0 && isTransient) {
            console.warn(`[Gemini Retry Handler] Encountered transient error (${errText}). Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return executeWithRetry(retriesLeft - 1, delay * 2);
          }
          throw err;
        }
      };

      const response = await executeWithRetry();

      const generatedText = response.text || "";
      
      // Strip markdown code block boundaries if they got returned despite instructions
      let cleanCode = generatedText.trim();
      if (cleanCode.startsWith("```")) {
        // match ```jsx or ```tsx or ```javascript or just ```
        cleanCode = cleanCode.replace(/^```[a-zA-Z]*\n/, "");
        cleanCode = cleanCode.replace(/\n```$/, "");
      }
      cleanCode = cleanCode.trim();

      res.json({ code: cleanCode });
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during generation." });
    }
  });

  // Serve static assets or use Vite Dev Server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
