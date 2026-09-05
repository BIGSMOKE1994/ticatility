import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("event-images")
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      return NextResponse.json(error, { status: 400 });
    }

    const imageUrl =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-images/${fileName}`;

    return NextResponse.json({
      imageUrl,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed." },
      { status: 500 }
    );
  }
}