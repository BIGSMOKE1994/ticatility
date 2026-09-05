import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authorization.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the logged-in user
    const {
      data: { user },
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow the admin email
    const adminEmail =
      process.env.ADMIN_EMAIL;

    if (
      !adminEmail ||
      user.email?.toLowerCase() !==
        adminEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get orders
    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
      .from("orders")
      .select(
        "id, full_name, email, event_slug, quantity, total_price, payment_status, order_number, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (ordersError) {
      console.error(
        "Analytics orders error:",
        ordersError
      );

      return NextResponse.json(
        {
          error:
            "Failed to load orders.",
        },
        { status: 500 }
      );
    }

    // Get events
    const {
      data: events,
      error: eventsError,
    } =
      await supabaseAdmin
        .from("events")
        .select(
          "id, title, slug, published, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

    if (eventsError) {
      console.error(
        "Analytics events error:",
        eventsError
      );

      return NextResponse.json(
        {
          error:
            "Failed to load events.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orders: orders || [],
      events: events || [],
    });
  } catch (error) {
    console.error(
      "Admin analytics API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong loading analytics.",
      },
      { status: 500 }
    );
  }
}