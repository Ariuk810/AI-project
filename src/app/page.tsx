"use client";
import { useState, ChangeEvent } from "react";
import { SiGooglegemini } from "react-icons/si";
import { AiOutlineReload } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
export default function Home() {
  const [activeTab, setActiveTab] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
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
              Image analysis
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-4 py-1 rounded ${
                activeTab === 2 ? "bg-white text-black" : "text-gray-500"
              }`}
            >
              Ingredient recognition
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
                    onChange={handleImageChange}
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
                  <button className="px-4 py-2 bg-gray-600 text-white rounded ">
                    Generate
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <FaFileAlt />
                  <p className="text-black text-2xl font-bold">
                    Here is the summary
                  </p>
                </div>
                <p className="text-gray-400 ">
                  First, enter your image to recognize an ingredients.
                </p>
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
                  <textarea
                    placeholder="Орц тодорхойлох"
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
                  <p className="text-black text-2xl font-bold">
                    Identified Ingredients
                  </p>
                </div>
                <p className="text-gray-400 ">
                  First, enter your text to recognize an ingredients.
                </p>
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
