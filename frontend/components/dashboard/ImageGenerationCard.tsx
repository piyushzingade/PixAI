"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Loader from "../ui/Loader";
import InputCard from "../ui/InputCard";

export const BACKENK_URL =
  process.env.NEXT_PUBLIC_BACKENK_URL || "http://localhost:5000";

export const ImageGenerationCard = () => {
  const [prompt, setPrompt] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus("submitted");
    setTimeout(() => setStatus("streaming"), 200);
    setTimeout(() => setStatus("ready"), 2000);

    setLoading(true);

    try {
      const res = await axios.post(`${BACKENK_URL}/generate`, { prompt });
      const base64 = res.data?.savedImages?.[0]?.image;
      if (base64) {
        setImageData(base64);
        setPrompt(""); // Clear prompt after success
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between px-4 bg-neutral-900 text-white pt-10 pb-2">
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

      {/* Prompt input */}
      <div className="relative w-full max-w-3xl mx-auto mt-8">
        <InputCard
          prompt={prompt}
          setPrompt={setPrompt}
          handleGenerate={handleGenerate}
          status={status}
          disabled={loading}
        />
      </div>
    </div>
  );
};
