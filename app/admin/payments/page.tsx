import { getPayments } from "@/lib/payments";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ApprovePaymentButton from "@/components/admin/ApprovePaymentButton";

export default async function PaymentsPage() {
  const payments = await getPayments();

  // Create temporary signed URLs for payment screenshots
  const paymentsWithUrls = await Promise.all(
    payments.map(async (payment: any) => {
      let screenshotUrl = "";

      if (payment.screenshot_url) {
        const { data, error } = await supabaseAdmin.storage
          .from("payment-proofs")
          .createSignedUrl(
            payment.screenshot_url,
            60 * 10 // URL valid for 10 minutes
          );

        if (error) {
          console.error(
            "Screenshot signed URL error:",
            error
          );
        } else {
          screenshotUrl = data?.signedUrl || "";
        }
      }

      return {
        ...payment,
        screenshotUrl,
      };
    })
  );

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Payments
      </h1>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Method</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paymentsWithUrls.map((payment: any) => (
              <tr key={payment.id} className="border-t">
                <td className="p-4 font-semibold">
                  {payment.order_number}
                </td>

                <td className="p-4">
                  ${payment.amount}
                </td>

                <td className="p-4">
  <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${
      payment.payment_method === "PayPal"
        ? "bg-blue-100 text-blue-700"
        : payment.payment_method === "Crypto"
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {payment.payment_method || "Unknown"}
  </span>
</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      payment.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(
                    payment.created_at
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 flex gap-3">

                  {/* VIEW PAYMENT SCREENSHOT */}

                  {payment.screenshotUrl ? (
                    <a
                      href={payment.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                    >
                      View
                    </a>
                  ) : (
                    <span className="bg-gray-400 px-4 py-2 rounded text-white">
                      No Proof
                    </span>
                  )}

                  {/* APPROVE */}

                  <ApprovePaymentButton
                    paymentId={payment.id}
                    orderNumber={payment.order_number}
                  />

                  {/* REJECT */}

                  <button
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                  >
                    Reject
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}