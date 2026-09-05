import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateTicket } from "@/lib/ticketEngine";

export async function POST(req: NextRequest) {
  try {
    const { paymentId, orderNumber } = await req.json();

    // ==================================================
    // GET PAYMENT
    // ==================================================

    const {
      data: payment,
      error: paymentError,
    } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (paymentError) {
      throw paymentError;
    }

    if (!payment) {
      throw new Error("Payment not found.");
    }

    // ==================================================
    // APPROVE PAYMENT
    // ==================================================

    const {
      error: approveError,
    } = await supabaseAdmin
      .from("payments")
      .update({
        status: "Approved",
      })
      .eq("id", paymentId);

    if (approveError) {
      throw approveError;
    }

    // ==================================================
    // UPDATE ORDER
    // ==================================================

    const {
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "Approved",
      })
      .eq("order_number", orderNumber);

    if (orderError) {
      throw orderError;
    }

    // ==================================================
    // GET COMPLETE ORDER
    // ==================================================

    const {
      data: order,
      error: orderFetchError,
    } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    if (orderFetchError) {
      throw orderFetchError;
    }

    if (!order) {
      throw new Error("Order not found.");
    }

    console.log(
      "Approved order:",
      order
    );

    // ==================================================
    // VALIDATE TICKET TYPE
    // ==================================================

    if (
      order.ticket_type !== "Premium" &&
      order.ticket_type !== "VIP"
    ) {
      throw new Error(
        "Invalid ticket type on order."
      );
    }

    // ==================================================
    // CREATE TICKET
    // ==================================================

    await generateTicket({
      orderNumber,
      customerName: order.full_name,
      customerEmail: order.email,
      eventTitle: order.event_slug,
      quantity: order.quantity,
      seatNumbers:
        order.seat_numbers || [],
      ticketType:
        order.ticket_type,
    });

    // ==================================================
    // SUCCESS
    // ==================================================

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error(
      "Approve payment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to approve payment.",
      },
      {
        status: 500,
      }
    );
  }
}