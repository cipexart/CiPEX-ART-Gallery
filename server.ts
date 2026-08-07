import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini AI Client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for generating artwork description via Gemini AI
app.post("/api/gemini/artwork-description", async (req, res) => {
  try {
    const { titleAr, titleFr, artistName, style, medium, language } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured.",
        description: language === "ar"
          ? `لوحة تشكيلية مميزة بعنوان "${titleAr || titleFr}" من إبداع الفنان ${artistName}، منفذة بأسلوب ${style} باستخدام ${medium}.`
          : `Une œuvre remarquable intitulée "${titleFr || titleAr}" créée par l'artiste ${artistName}, exécutée dans un style ${style} avec ${medium}.`
      });
    }

    const prompt = language === "ar"
      ? `اكتب وصفاً نقدياً وفنياً راقياً ومصمماً لمعارض الفنون اللوحة الفنية التالية:
العنوان: ${titleAr}
الفنان: ${artistName}
الأسلوب: ${style}
التقنية والخامة: ${medium}
اجعل الوصف مكوناً من فقرتين جذابين للعملاء والمقتنيين الفنيين.`
      : `Rédigez une description critique et artistique haut de gamme pour une galerie d'art concernant l'œuvre suivante:
Titre: ${titleFr || titleAr}
Artiste: ${artistName}
Style: ${style}
Médium/Technique: ${medium}
Faites une description élégante de deux paragraphes attrayante pour les collectionneurs d'art.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ description: response.text });
  } catch (error: any) {
    console.error("Error generating AI artwork description:", error);
    res.status(500).json({ error: error.message || "Failed to generate description" });
  }
});

// API Endpoint to simulate Google Sheets Sync / Drive Upload
app.post("/api/google/sync-sheets", async (req, res) => {
  try {
    const { dataCount, sheetName } = req.body;
    // Simulate cloud sync queue processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    res.json({
      status: "success",
      syncedRows: dataCount || 10,
      sheetId: "1A2B3C4D_ART_GALLERY_DB",
      timestamp: new Date().toISOString(),
      message: `Successfully synced ${dataCount || 10} records to Google Sheet: ${sheetName || 'Artworks'}`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Art Gallery Server running on http://localhost:${PORT}`);
  });
}

startServer();
