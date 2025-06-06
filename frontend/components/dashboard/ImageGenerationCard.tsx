"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import Image from "next/image";
import Loader from "../ui/Loader";

const BACKENK_URL =
  process.env.NEXT_PUBLIC_BACKENK_URL || "http://localhost:5000";

export const ImageGenerationCard = () => {
  const [prompt, setPrompt] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post(`${BACKENK_URL}/generate`, { prompt });
      const base64 = res.data?.savedImages?.[0]?.image;
      if (base64) {
        setImageData(base64);
        setPrompt(""); // Clear the prompt after image is generated
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between px-4 bg-neutral-900 text-white py-10">
      {/* Image display */}
      <div className="flex flex-col items-center justify-center flex-1 pt-10">
        <div className="w-full max-w-3xl flex justify-center items-center min-h-[400px]">
          {loading ? (
            <Loader />
          ) : imageData ? (
            <Image
              src={`data:image/png;base64,${imageData}`}
              alt="Generated"
              width={350}
              height={200}
              className="rounded-xl shadow-xl object-contain p-5 mx-6"
            />
          ) : null}
        </div>
      </div>

      {/* Prompt input at bottom */}
      <div className="relative w-full max-w-3xl mx-auto mt-8 pb-4">
        <Input
          placeholder="Enter Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 pr-12 h-14 rounded-2xl border border-neutral-500 bg-neutral-800 text-neutral-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
        />
        <Button
          size="icon"
          onClick={handleGenerate}
          disabled={loading}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-neutral-200 hover:bg-neutral-400 text-neutral-700"
        >
          <ArrowUpRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
