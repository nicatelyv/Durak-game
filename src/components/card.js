import React from 'react';

export default function Card({ card }) {
  return (
    <div className="border p-2 m-1 bg-white rounded shadow text-center w-12 h-16 text-sm">
      <div>{card.rank}</div>
      <div>{card.suit}</div>
    </div>
  );
}