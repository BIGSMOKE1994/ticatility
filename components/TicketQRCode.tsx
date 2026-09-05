"use client";

import QRCode from "react-qr-code";

type Props = {
  value: string;
};

export default function TicketQRCode({ value }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl inline-block">
      <QRCode
        value={value}
        size={180}
      />
    </div>
  );
}