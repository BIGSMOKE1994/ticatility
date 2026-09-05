import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    // =====================================================
    // 1. GET LOGGED-IN USER
    // =====================================================

    const supabase = await supabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // 2. GET TICKET NUMBER FROM URL
    // =====================================================

    const ticketNumber =
      request.nextUrl.searchParams.get("ticket");

    if (!ticketNumber) {
      return NextResponse.json(
        {
          error: "Ticket number is required.",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "Download request for ticket:",
      ticketNumber
    );

    // =====================================================
    // 3. FIND TICKET
    // =====================================================

    const {
      data: ticket,
      error: ticketError,
    } = await supabaseAdmin
      .from("tickets")
      .select(
        "ticket_number, email, pdf_path"
      )
      .eq(
        "ticket_number",
        ticketNumber
      )
      .maybeSingle();

    if (ticketError) {
      console.error(
        "Ticket lookup error:",
        ticketError
      );

      return NextResponse.json(
        {
          error: "Unable to find the ticket.",
        },
        {
          status: 500,
        }
      );
    }

    if (!ticket) {
      return NextResponse.json(
        {
          error: "Ticket not found.",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "Ticket found:",
      ticket.ticket_number
    );

    // =====================================================
    // 4. MAKE SURE THIS TICKET BELONGS TO USER
    // =====================================================

    if (
      ticket.email?.toLowerCase() !==
      user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to download this ticket.",
        },
        {
          status: 403,
        }
      );
    }

    // =====================================================
    // 5. CHECK PDF PATH
    // =====================================================

    if (!ticket.pdf_path) {
      console.error(
        "No PDF path stored for ticket:",
        ticketNumber
      );

      return NextResponse.json(
        {
          error:
            "PDF file is not available for this ticket.",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "PDF path:",
      ticket.pdf_path
    );

    // =====================================================
    // 6. CREATE TEMPORARY SIGNED URL
    // =====================================================

    const {
      data: signedUrlData,
      error: signedUrlError,
    } = await supabaseAdmin.storage
      .from("ticket-pdfs")
      .createSignedUrl(
        ticket.pdf_path,
        60 * 10
      );

    if (signedUrlError) {
      console.error(
        "Signed URL error:",
        signedUrlError
      );

      return NextResponse.json(
        {
          error:
            "Unable to prepare the ticket PDF.",
        },
        {
          status: 500,
        }
      );
    }

    if (!signedUrlData?.signedUrl) {
      console.error(
        "No signed URL returned."
      );

      return NextResponse.json(
        {
          error:
            "Unable to prepare the ticket PDF.",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "Signed PDF URL created successfully."
    );

    // =====================================================
    // 7. SEND USER DIRECTLY TO PDF
    // =====================================================

    return NextResponse.redirect(
      signedUrlData.signedUrl
    );
  } catch (error) {
    console.error(
      "DOWNLOAD TICKET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while preparing your ticket.",
      },
      {
        status: 500,
      }
    );
  }
}