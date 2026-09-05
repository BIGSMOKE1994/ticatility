"use client";

import QRCode from "react-qr-code";

type PaymentQRCodeProps = {
  value: string;
};

export default function PaymentQRCode({
  value,
}: PaymentQRCodeProps) {
  return (
    <div className="bg-white rounded-xl p-6 inline-block">
      <QRCode value={value} size={220} />
    </div>
  );
}