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
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prisma = new prisma_1.PrismaClient();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400).json({ error: "Prompt is required." });
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
        const parts = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts;
        if (!parts || parts.length === 0) {
            res.status(500).json({ error: "Empty response from Gemini" });
            return;
        }
        const savedImages = [];
        for (const part of parts) {
            if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, "base64");
                const filename = `gemini-${Date.now()}.png`;
                const filepath = `./${filename}`;
                // Save to DB first
                const saved = yield prisma.image.create({
                    data: {
                        prompt,
                        image: imageData,
                    },
                });
                try {
                    // Then save to file
                    fs_1.default.writeFileSync(filepath, buffer);
                }
                catch (fileErr) {
                    // If file save fails, roll back DB save
                    yield prisma.image.delete({ where: { id: saved.id } });
                    console.error("File write failed, DB entry rolled back.");
                    res.status(500).json({ error: "Failed to write image file." });
                }
                savedImages.push(saved);
            }
        }
        res.status(200).json({ success: true, savedImages });
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
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
