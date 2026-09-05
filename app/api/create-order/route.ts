import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      orderNumber,
      fullName,
      email,
      eventSlug,
      quantity,
      ticketType,
    } = body;

    // -----------------------------
    // VALIDATE INPUT
    // -----------------------------

    if (
      !orderNumber ||
      !fullName ||
      !email ||
      !eventSlug ||
      !quantity ||
      !ticketType
    ) {
      return NextResponse.json(
        {
          error: "Missing or invalid order information.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // VALIDATE TICKET TYPE
    // -----------------------------

    if (
      ticketType !== "Premium" &&
      ticketType !== "VIP"
    ) {
      return NextResponse.json(
        {
          error: "Invalid ticket type.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // VALIDATE QUANTITY
    // -----------------------------

    const ticketQuantity = Number(quantity);

    if (
      !Number.isInteger(ticketQuantity) ||
      ticketQuantity < 1
    ) {
      return NextResponse.json(
        {
          error: "Quantity must be at least 1.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // GET REAL EVENT FROM DATABASE
    // -----------------------------

    const { data: event, error: eventError } =
      await supabaseAdmin
        .from("events")
        .select(
          "id, title, slug, price, published"
        )
        .eq("slug", eventSlug)
        .single();

    if (eventError || !event) {
      console.error(
        "Event lookup error:",
        eventError
      );

      return NextResponse.json(
        {
          error: "Event not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------
    // MAKE SURE EVENT IS PUBLISHED
    // -----------------------------

    if (event.published !== true) {
      return NextResponse.json(
        {
          error:
            "This event is not currently available.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // CALCULATE PRICE SERVER-SIDE
    // -----------------------------

    const premiumPrice = Number(event.price);

    if (
      !Number.isFinite(premiumPrice) ||
      premiumPrice <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid event price.",
        },
        {
          status: 400,
        }
      );
    }

    // VIP is currently 2x Premium
    const ticketPrice =
      ticketType === "VIP"
        ? premiumPrice * 2
        : premiumPrice;

    const total =
      ticketPrice * ticketQuantity;

    if (
      !Number.isFinite(total) ||
      total <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid order total.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // CREATE ORDER
    // -----------------------------

    const { error: orderError } =
      await supabaseAdmin
        .from("orders")
        .insert([
          {
            order_number: orderNumber,
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            event_slug: eventSlug,
            quantity: ticketQuantity,
            ticket_type: ticketType,
            total_price: total,
            payment_status: "Pending",
            seat_numbers: [],
          },
        ]);

    if (orderError) {
      console.error(
        "Order creation error:",
        orderError
      );

      return NextResponse.json(
        {
          error: orderError.message,
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------
    // CREATE PAYMENT
    // -----------------------------

    const { error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .insert([
          {
            order_number: orderNumber,
            event_title: event.title,
            amount: total,
            screenshot_url: "",
            status: "Pending",
          },
        ]);

    if (paymentError) {
      console.error(
        "Payment creation error:",
        paymentError
      );

      // Remove order if payment creation fails
      await supabaseAdmin
        .from("orders")
        .delete()
        .eq(
          "order_number",
          orderNumber
        );

      return NextResponse.json(
        {
          error: paymentError.message,
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------
    // SUCCESS
    // -----------------------------

    return NextResponse.json({
      success: true,
      orderNumber,
      eventTitle: event.title,
      ticketType,
      quantity: ticketQuantity,
      ticketPrice,
      amount: total,
    });
  } catch (error: any) {
    console.error(
      "Create order API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to create order.",
      },
      {
        status: 500,
      }
    );
  }
}