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

interface Message {
  role: "user" | "assistant";
  content: string;
}

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

  // TAB===3
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading3, setLoading3] = useState(false);

  // CHAT BOT
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading4, setLoading4] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  console.log(messages, "messages");

  const handleSend = async () => {
    if (!input.trim() || loading4) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading4(true);

    try {
      const response = await fetch("/api/chatBot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat: userMessage }),
      });

      const data = await response.json();

      if (data.err) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.err}` },
        ]);
      } else if (data.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err}` },
      ]);
    } finally {
      setLoading4(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  // TAB===1

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
  // TAB===3
  const handleImageGenerate = async () => {
    if (!imagePrompt.trim()) return;

    setLoading3(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/image-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      const data = await res.json();

      if (data.image) {
        setGeneratedImage(`data:image/png;base64,${data.image}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading3(false);
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
              Зураг үүсгэгч
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
                  placeholder="Ямар нэгэн хоол бичнэ үү"
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
                  <AiOutlineReload
                    size={30}
                    onClick={() => window.location.reload()}
                  />
                </div>

                <p className="text-gray-400 pt-5">
                  What food image do you want? Describe it briefly.
                </p>

                <textarea
                  placeholder="Хоолны тайлбар"
                  className="border border-gray-300 px-3 py-2 rounded w-full h-[124px]"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />

                <div className="flex justify-between pt-2">
                  <p></p>
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded"
                    onClick={handleImageGenerate}
                  >
                    {loading3 ? "Generating..." : "Generate"}
                  </button>
                </div>

                <div className="flex gap-3 items-center pt-4">
                  <FaFileAlt />
                  <p className="text-black text-2xl font-bold">Result</p>
                </div>

                {!generatedImage && (
                  <p className="text-gray-400 ">
                    First, enter your text to generate an image.
                  </p>
                )}

                {generatedImage && (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full mt-4 rounded-xl border"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* FLOATING CHAT BUTTON + PANEL */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Floating Bubble Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center hover:opacity-80 transition"
          >
            💬
          </button>
        )}

        {/* Chat Panel */}
        {isOpen && (
          <div className="w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <p className="font-semibold text-black">Chat assistant</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div
              id="chat-scroll"
              className="flex-1 overflow-y-auto p-3 space-y-3 bg-white"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10 text-sm">
                  How can I help you today?
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black border"
                }
              `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading4 && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading4}
                className="flex-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
              <button
                onClick={handleSend}
                disabled={loading4 || !input.trim()}
                className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition disabled:opacity-40"
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
