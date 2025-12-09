import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { prompt, model = "stabilityai/stable-diffusion-xl-base-1.0" } =
    await req.json();
  const token = process.env.NEXT_PUBLIC_HF_TOKEN;

  const res = await fetch(
    `https://router.huggingface.co/hf-inference/models/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json(
      { error: `Generation failed: ${err}` },
      { status: 500 }
    );
  }

  const buf = await res.arrayBuffer();
  const base64 = Buffer.from(buf).toString("base64");
  return NextResponse.json({ image: base64 });
};
