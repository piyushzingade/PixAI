import express, { Request, Response } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import {PrismaClient} from "../../db/generated/prisma";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


app.post("/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
     res.status(400).json({ error: "Prompt is required." });
     return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts;

    if (!parts || parts.length === 0) {
       res.status(500).json({ error: "Empty response from Gemini" });
       return;
    }

    const savedImages = [];

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data as string;
        const buffer = Buffer.from(imageData, "base64");
        const filename = `gemini-${Date.now()}.png`;
        const filepath = `./${filename}`;

        // Save to DB first
        const saved = await prisma.image.create({
          data: {
            id: filename,
            prompt,
            image: imageData,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        try {
          // Then save to file
          fs.writeFileSync(filepath, buffer);
        } catch (fileErr) {
          // If file save fails, roll back DB save
          await prisma.image.delete({ where: { id: saved.id } });
          console.error("File write failed, DB entry rolled back.");
           res.status(500).json({ error: "Failed to write image file." });
        }

        savedImages.push(saved);
      }
    }

     res.status(200).json({ success: true, savedImages });
  } catch (error) {
    console.error("Error generating content:", error);
     res.status(500).json({ error: "Internal server error" });
  }
});
  
app.get("/images", async (req: Request, res: Response) => {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(images);
});


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
