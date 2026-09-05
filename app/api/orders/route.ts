import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  try {
    // Get the customer's access token
    const authorization = req.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          error: "You must be logged in to view your orders.",
        },
        {
          status: 401,
        }
      );
    }

    const token = authorization.replace("Bearer ", "");

    // Verify the token with Supabase
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error("Authentication error:", userError);

      return NextResponse.json(
        {
          error: "Your session is invalid or has expired.",
        },
        {
          status: 401,
        }
      );
    }

    const email = user.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          error: "Your account does not have an email address.",
        },
        {
          status: 400,
        }
      );
    }

    // Get ONLY this customer's orders
    const { data: orders, error: ordersError } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("email", email)
        .order("created_at", {
          ascending: false,
        });

    if (ordersError) {
      console.error("Customer orders error:", ordersError);

      return NextResponse.json(
        {
          error: ordersError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (error: any) {
    console.error("Orders API error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to load your orders.",
      },
      {
        status: 500,
      }
    );
  }
}