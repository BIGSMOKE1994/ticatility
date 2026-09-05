import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const orderNumber = formData.get("orderNumber");

    if (!(file instanceof File) || typeof orderNumber !== "string") {
      return NextResponse.json(
        {
          error: "Payment proof file and order number are required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // BASIC FILE VALIDATION
    // -----------------------------------------

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Only image files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // 10 MB maximum
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "The payment screenshot must be smaller than 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // VERIFY ORDER EXISTS
    // -----------------------------------------

    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select("order_number, payment_status")
        .eq("order_number", orderNumber)
        .single();

    if (orderError || !order) {
      console.error(
        "Payment proof order lookup error:",
        orderError
      );

      return NextResponse.json(
        {
          error: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // DON'T ACCEPT PROOF FOR APPROVED ORDERS
    // -----------------------------------------

    if (
      String(order.payment_status || "").toLowerCase() ===
      "approved"
    ) {
      return NextResponse.json(
        {
          error: "This order has already been approved.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // CREATE SAFE FILE NAME
    // -----------------------------------------

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      "jpg";

    const fileName = `${orderNumber}-${Date.now()}.${extension}`;

    // -----------------------------------------
    // CONVERT FILE TO BUFFER
    // -----------------------------------------

    const arrayBuffer = await file.arrayBuffer();

    const fileBuffer = Buffer.from(arrayBuffer);

    // -----------------------------------------
    // UPLOAD TO PRIVATE STORAGE
    // -----------------------------------------

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from("payment-proofs")
        .upload(
          fileName,
          fileBuffer,
          {
            contentType: file.type,
            upsert: false,
          }
        );

    if (uploadError) {
      console.error(
        "Payment proof upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error: uploadError.message,
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------------
    // STORE STORAGE PATH
    // -----------------------------------------

    const { error: updateError } =
      await supabaseAdmin
        .from("payments")
        .update({
          screenshot_url: fileName,
        })
        .eq("order_number", orderNumber)
        .eq("status", "Pending");

    if (updateError) {
      console.error(
        "Payment proof database update error:",
        updateError
      );

      // Remove uploaded file if database update fails
      await supabaseAdmin.storage
        .from("payment-proofs")
        .remove([fileName]);

      return NextResponse.json(
        {
          error: updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------------
    // SUCCESS
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      fileName,
    });
  } catch (error: any) {
    console.error(
      "Upload payment proof API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to upload payment proof.",
      },
      {
        status: 500,
      }
    );
  }
}