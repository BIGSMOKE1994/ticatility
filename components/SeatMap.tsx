"use client";

import { useState } from "react";

type SeatMapProps = {
  quantity: number;
  onSeatsSelected: (seats: string[]) => void;
};

export default function SeatMap({
  quantity,
  onSeatsSelected,
}: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 10;

  function toggleSeat(seat: string) {
    if (selectedSeats.includes(seat)) {
      const updated = selectedSeats.filter((s) => s !== seat);
      setSelectedSeats(updated);
      onSeatsSelected(updated);
      return;
    }

    if (selectedSeats.length >= quantity) {
      return;
    }

    const updated = [...selectedSeats, seat];
    setSelectedSeats(updated);
    onSeatsSelected(updated);
  }

  return (
    <div className="space-y-6">

      <div className="text-center">
        <h2 className="text-2xl font-bold">
          🪑 Select Your Seats
        </h2>

        <p className="text-slate-400 mt-2">
          Choose {quantity} seat{quantity > 1 ? "s" : ""}
        </p>
      </div>

      {/* Stage / Pitch */}
      <div className="bg-blue-600 rounded-lg py-3 text-center font-bold">
        STAGE / FIELD
      </div>

      {/* Seats */}
      <div className="space-y-3">

        {rows.map((row) => (
          <div
            key={row}
            className="flex items-center justify-center gap-2"
          >

            <span className="w-6 text-slate-400 font-bold">
              {row}
            </span>

            {Array.from({ length: seatsPerRow }, (_, index) => {
              const seatNumber = index + 1;
              const seat = `${row}${seatNumber}`;

              const isSelected = selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  type="button"
                  onClick={() => toggleSeat(seat)}
                  className={`
                    w-9 h-9 rounded-md text-xs font-bold
                    transition
                    ${
                      isSelected
                        ? "bg-yellow-400 text-black"
                        : "bg-slate-700 hover:bg-blue-500"
                    }
                  `}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        ))}

      </div>

      {/* Selected seats */}
      <div className="bg-slate-800 rounded-xl p-4">

        <p className="text-slate-400 mb-2">
          Selected seats
        </p>

        {selectedSeats.length === 0 ? (
          <p className="text-slate-500">
            No seats selected yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span
                key={seat}
                className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold"
              >
                {seat}
              </span>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}