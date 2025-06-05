import express, { Request, Response } from "express";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import {PrismaClient} from "../../db/generated/prisma";

dotenv.config();
const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


app.post("/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
     res.status(400).json({ error: "Prompt  is required." });
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

    if (
      response?.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content?.parts
    ) {
      let savedImages = [];

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log("Text Response:", part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data as string;
          const buffer = Buffer.from(imageData, "base64");

          // Save to file (optional)
          fs.writeFileSync(`gemini-${Date.now()}.png`, buffer);

          // Save to DB
          const saved = await prisma.image.create({
            data: {
              prompt,
              image: imageData,
            },
          });

          savedImages.push(saved);
          console.log("Image saved to DB");
        }
      }

       res.status(200).json({ success: true, savedImages });
    } else {
       res.status(500).json({ error: "Empty response from Gemini" });
    }
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


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
