"use client";

type ApprovePaymentButtonProps = {
  paymentId: string;
  orderNumber: string;
};

export default function ApprovePaymentButton({
  paymentId,
  orderNumber,
}: ApprovePaymentButtonProps) {
  async function approvePayment() {
    const response = await fetch("/api/admin/approve-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId,
        orderNumber,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Failed to approve payment.");
      return;
    }

    alert("✅ Payment approved and ticket generated!");

    location.reload();
  }

  return (
    <button
      onClick={approvePayment}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Approve
    </button>
  );
}