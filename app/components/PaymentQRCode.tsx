"use client";

import QRCode from "react-qr-code";

type Props = {
  value: string;
};

export default function PaymentQRCode({ value }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl inline-block">
      <QRCode value={value} size={220} />
    </div>
  );
}