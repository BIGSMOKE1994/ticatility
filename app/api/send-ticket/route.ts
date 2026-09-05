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
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("event-images")
      .upload(fileName, file);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(fileName);

    return NextResponse.json({
      imageUrl: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}