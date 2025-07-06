import React from 'react';
import Card from './card';


export default function PlayerHand({ cards, onCardClick }) {
    return (
        <div className="hand">
            {cards.map((card, index) => (
                <div
                    key={card.id || index}
                    className="card"
                    onClick={() => onCardClick && onCardClick(card)}
                >
                    {card.rank} {card.suit}
                </div>
            ))}
        </div>
    );
}
