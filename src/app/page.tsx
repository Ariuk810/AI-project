"use client";
import React, { useState, ChangeEvent } from "react";
import { SiGooglegemini } from "react-icons/si";
import { AiOutlineReload } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";

type DetectedObject = {
  label: string;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [loading, setLoading] = useState(false);

  // TAB ===2
  const [ingredientText, setIngredientText] = useState("");
  const [ingredientResult, setIngredientResult] = useState("");
  const [loading2, setLoading2] = useState(false);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setObjects([]);
  };
  const handleDetect = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setObjects([]);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const data = await (
        await fetch("/api/object-detection", {
          method: "POST",
          body: formData,
        })
      ).json();

      setObjects(data.objects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // TAB===2
  const handleIngredientDetect = async () => {
    if (!ingredientText.trim()) return;

    setLoading2(true);
    setIngredientResult("");

    try {
      const res = await fetch("/api/ingredient-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ingredientText }),
      });

      const data = await res.json();
      setIngredientResult(data.ingredients || "No result");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <>
      <p className="font-bold text-black p-10 text-2xl">AI tools</p>
      <div className="flex justify-center">
        <div className="w-[580px] h-[888px]  ">
          <div className="bg-gray-200 rounded-lg p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab(1)}
              className={`px-4 py-1 rounded ${
                activeTab === 1 ? "bg-white text-black" : "text-gray-500"
              }`}
            >
              Зургийн анализ
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-4 py-1 rounded ${
                activeTab === 2 ? "bg-white text-black" : "text-gray-500"
              }`}
            >
              Орц танилт
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`px-4 py-1 rounded ${
                activeTab === 3 ? "bg-white text-black" : "text-gray-500"
              }`}
            >
              Image creator
            </button>
          </div>
          <div>
            {activeTab === 1 && (
              <>
                <div className="flex justify-between items-center  pt-5">
                  <div className="flex items-center gap-2">
                    <SiGooglegemini />
                    <p className="text-2xl font-bold text-black">
                      Image analysis
                    </p>
                  </div>
                  <div className="">
                    <AiOutlineReload
                      size={30}
                      onClick={() => window.location.reload()}
                    />
                  </div>
                </div>
                <p className="text-gray-400 pt-5">
                  Upload a food photo, and AI will detect the ingredients.
                </p>
                <div className=" pt-2">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="border border-gray-300 px-3 py-2 rounded w-full"
                  />
                </div>
                {previewUrl && (
                  <div className="w-full h-full rounded-xl border mt-4 overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <p></p>
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded "
                    onClick={handleDetect}
                    disabled={loading}
                  >
                    Generate
                    {loading ? "..." : ""}
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <FaFileAlt />
                  <p className="text-black text-2xl font-bold">
                    Here is the summary
                  </p>
                </div>
                <textarea
                  className="text-black w-full "
                  placeholder="First, enter your image to recognize an ingredients."
                  value={
                    objects.length > 0
                      ? objects
                          .map(
                            (obj) =>
                              `${obj.label} — ${Math.round(obj.score * 100)}%`
                          )
                          .join("\n")
                      : ""
                  }
                  readOnly
                ></textarea>
              </>
            )}
            {activeTab === 2 && (
              <>
                <div className="flex justify-between items-center  pt-5">
                  <div className="flex items-center gap-2">
                    <SiGooglegemini />
                    <p className="text-2xl font-bold text-black">
                      Ingredient recognition
                    </p>
                  </div>
                  <AiOutlineReload
                    size={30}
                    onClick={() => window.location.reload()}
                  />
                </div>

                <p className="text-gray-400 pt-5">
                  Describe the food, and AI will detect the ingredients.
                </p>

                <textarea
                  placeholder="Орц тодорхойлох"
                  className="border border-gray-300 px-3 py-2 rounded w-full h-[124px]"
                  value={ingredientText}
                  onChange={(e) => setIngredientText(e.target.value)}
                />

                <div className="flex justify-between pt-2">
                  <p></p>
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded "
                    onClick={handleIngredientDetect}
                  >
                    {loading2 ? "Generating..." : "Generate"}
                  </button>
                </div>

                <div className="flex gap-3 items-center">
                  <FaFileAlt />
                  <p className="text-black text-2xl font-bold">
                    Identified Ingredients
                  </p>
                </div>

                <textarea
                  className="border border-gray-300 w-full h-[150px] mt-2 p-2 text-black"
                  value={ingredientResult}
                  readOnly
                />
              </>
            )}

            {activeTab === 3 && (
              <>
                <div className="flex justify-between items-center  pt-5">
                  <div className="flex items-center gap-2">
                    <SiGooglegemini />
                    <p className="text-2xl font-bold text-black">
                      Food image creator
                    </p>
                  </div>
                  <div className="">
                    <AiOutlineReload
                      size={30}
                      onClick={() => window.location.reload()}
                    />
                  </div>
                </div>
                <p className="text-gray-400 pt-5">
                  What food image do you want? Describe it briefly.
                </p>
                <div className=" pt-2">
                  <textarea
                    placeholder="Хоолны тайлбар"
                    className="border border-gray-300 px-3 py-2 rounded w-full h-[124px]"
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <p></p>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded ">
                    Generate
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <FaFileAlt />
                  <p className="text-black text-2xl font-bold">Result </p>
                </div>
                <p className="text-gray-400 ">
                  First, enter your text to generate an image.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
