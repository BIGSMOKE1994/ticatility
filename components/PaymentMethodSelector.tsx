"use client";

import { useState } from "react";
import Link from "next/link";
import PaymentQRCode from "@/components/PaymentQRCode";
import PaymentProofUpload from "@/components/PaymentProofUpload";

type PaymentMethodSelectorProps = {
  orderNumber: string;
  eventSlug: string;
  eventTitle: string;
  amount: number;
  walletAddress: string;
  paypalEmail: string;
};

export default function PaymentMethodSelector({
  orderNumber,
  eventSlug,
  eventTitle,
  amount,
  walletAddress,
  paypalEmail,
}: PaymentMethodSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    "Crypto" | "PayPal"
  >("Crypto");

  const [proofUploaded, setProofUploaded] =
    useState(false);

  function changePaymentMethod(
    method: "Crypto" | "PayPal"
  ) {
    setPaymentMethod(method);

    // Require a new proof if the customer
    // changes payment method.
    setProofUploaded(false);
  }

  return (
    <div className="space-y-8">

      {/* ----------------------------------------- */}
      {/* PAYMENT METHOD SELECTION */}
      {/* ----------------------------------------- */}

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Choose Payment Method
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {/* CRYPTO */}

          <button
            type="button"
            onClick={() =>
              changePaymentMethod("Crypto")
            }
            className={`text-left rounded-xl p-5 border-2 transition ${
              paymentMethod === "Crypto"
                ? "border-green-500 bg-green-500/10"
                : "border-slate-700 bg-slate-800 hover:border-slate-500"
            }`}
          >
            <div className="text-3xl mb-2">
              ₿
            </div>

            <h3 className="text-xl font-bold">
              Crypto
            </h3>

            <p className="text-slate-400 mt-1">
              Pay with cryptocurrency and upload your
              payment proof.
            </p>
          </button>

          {/* PAYPAL */}

          <button
            type="button"
            onClick={() =>
              changePaymentMethod("PayPal")
            }
            className={`text-left rounded-xl p-5 border-2 transition ${
              paymentMethod === "PayPal"
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-700 bg-slate-800 hover:border-slate-500"
            }`}
          >
            <div className="text-3xl mb-2">
              🅿️
            </div>

            <h3 className="text-xl font-bold">
              PayPal
            </h3>

            <p className="text-slate-400 mt-1">
              Make a manual PayPal payment and upload
              your payment proof.
            </p>
          </button>

        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* CRYPTO PAYMENT */}
      {/* ----------------------------------------- */}

      {paymentMethod === "Crypto" && (
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">

          <div>
            <h3 className="text-2xl font-bold">
              ₿ Crypto Payment
            </h3>

            <p className="text-slate-400 mt-2">
              Send the exact amount to the wallet address
              below.
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Wallet Address
            </p>

            <div className="bg-slate-900 rounded-xl p-4 mt-2 break-all">
              {walletAddress}
            </div>
          </div>

          <PaymentQRCode value={walletAddress} />

          <PaymentProofUpload
            orderNumber={orderNumber}
            eventTitle={eventTitle}
            amount={amount}
            paymentMethod="Crypto"
            onUploadSuccess={() =>
              setProofUploaded(true)
            }
          />

        </div>
      )}

      {/* ----------------------------------------- */}
      {/* PAYPAL PAYMENT */}
      {/* ----------------------------------------- */}

      {paymentMethod === "PayPal" && (
        <div className="bg-slate-800 rounded-xl p-6 space-y-6">

          <div>
            <h3 className="text-2xl font-bold">
              🅿️ PayPal Payment
            </h3>

            <p className="text-slate-400 mt-2">
              Make your PayPal payment manually using
              the account below.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-slate-400">
              Send payment to
            </p>

            <p className="text-xl font-bold mt-2 break-all">
              {paypalEmail}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Amount to Pay
            </p>

            <p className="text-3xl font-bold text-green-400 mt-1">
              ${amount.toFixed(2)}
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="font-semibold text-yellow-300">
              Important
            </p>

            <p className="text-slate-300 mt-2">
              Please make sure the amount you send matches
              the amount shown above. After making your
              payment, upload a screenshot of your PayPal
              payment confirmation.
            </p>
          </div>

          <PaymentProofUpload
            orderNumber={orderNumber}
            eventTitle={eventTitle}
            amount={amount}
            paymentMethod="PayPal"
            onUploadSuccess={() =>
              setProofUploaded(true)
            }
          />

        </div>
      )}

      {/* ----------------------------------------- */}
      {/* ZELLE */}
      {/* ----------------------------------------- */}

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">

        <h3 className="text-xl font-bold">
          Want to pay with Zelle?
        </h3>

        <p className="text-slate-300 mt-2">
          Please contact our support team for Zelle
          payment instructions and assistance with your
          order.
        </p>

        <Link
          href="/contact"
          className="inline-block mt-5 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
        >
          Contact Support
        </Link>

      </div>

      {/* ----------------------------------------- */}
      {/* PAYMENT SUBMITTED */}
      {/* ----------------------------------------- */}

      <div>

        <Link
          href={
            proofUploaded
              ? `/confirmation/${eventSlug}?order_number=${encodeURIComponent(
                  orderNumber
                )}`
              : "#"
          }
          onClick={(e) => {
            if (!proofUploaded) {
              e.preventDefault();
            }
          }}
          aria-disabled={!proofUploaded}
          className={`block w-full text-center py-4 rounded-xl text-xl font-bold transition ${
            proofUploaded
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          {proofUploaded
            ? "I've Sent Payment"
            : "Upload Payment Proof First"}
        </Link>

        {!proofUploaded && (
          <p className="text-center text-slate-500 text-sm mt-3">
            Please upload your payment screenshot before
            continuing.
          </p>
        )}

      </div>

    </div>
  );
}