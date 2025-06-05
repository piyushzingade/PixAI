"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = require("../../db/generated/prisma");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new prisma_1.PrismaClient();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400).json({ error: "Prompt  is required." });
        return;
    }
    try {
        const response = yield ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: prompt,
            config: {
                responseModalities: [genai_1.Modality.TEXT, genai_1.Modality.IMAGE],
            },
        });
        if ((response === null || response === void 0 ? void 0 : response.candidates) &&
            response.candidates.length > 0 &&
            ((_a = response.candidates[0].content) === null || _a === void 0 ? void 0 : _a.parts)) {
            let savedImages = [];
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    console.log("Text Response:", part.text);
                }
                else if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    const buffer = Buffer.from(imageData, "base64");
                    // Save to file (optional)
                    fs_1.default.writeFileSync(`gemini-${Date.now()}.png`, buffer);
                    // Save to DB
                    const saved = yield prisma.image.create({
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
        }
        else {
            res.status(500).json({ error: "Empty response from Gemini" });
        }
    }
    catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.get("/images", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield prisma.image.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(images);
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
