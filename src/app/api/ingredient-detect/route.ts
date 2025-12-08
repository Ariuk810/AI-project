import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { text } = await req.json();

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "No API key" }, { status: 500 });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Дараах хоолны тайлбараас ОРЦ-уудыг нь ялгаж аваад МОНГОЛООР буцаа.  


Хоолны текст:${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini Response:", data);

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No ingredients found.";

    return NextResponse.json({ ingredients: output });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error" },
      { status: 500 }
    );
  }
};
