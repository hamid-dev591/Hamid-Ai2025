// =============================================
// 🧠 HamidDev AI Image Generator — 3 Images Edition (Vercel Ready)
// =============================================

import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import fetch from "node-fetch";

// Hugging Face key من البيئة
const HF_KEY = process.env.HF_KEY;
if (!HF_KEY) {
  console.error("❌ Missing HF_KEY in environment variables.");
  process.exit(1);
}

const MODEL_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "10kb" }));
app.use(compression());
app.use(cors({ origin: "*", methods: ["POST"] }));

app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Too many requests, please wait a bit." },
  })
);

app.post("/api/generate", async (req, res) => {
  const prompt = String(req.body?.prompt || "").trim();
  if (!prompt) return res.status(400).json({ error: "Prompt required." });

  try {
    const images = [];

    for (let i = 0; i < 3; i++) {
      const response = await fetch(MODEL_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const err = await response.text();
        return res.status(500).json({ error: `Hugging Face error: ${err}` });
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      images.push(base64);
    }

    res.json({ data: images });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ⚠️ التعديل المهم هنا 👇
// لا نستخدم app.listen() في Vercel!
// نُصدّر التطبيق بدلاً من تشغيله:
export default app;
