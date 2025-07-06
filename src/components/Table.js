import React from 'react';
import Card from './card';

export default function Table({ attack, defense }) {
    return (
        <div className="table-wrapper">
            <div className="card-group attack-group">
                <h3 className="group-label">🟥 Hücum</h3>
                {attack ? <Card card={attack} /> : <div className="empty-slot">Kart yoxdur</div>}
            </div>
            <div className="card-group defense-group">
                <h3 className="group-label">🟩 Müdafiə</h3>
                {defense ? <Card card={defense} /> : <div className="empty-slot">Kart yoxdur</div>}
            </div>
        </div>
    );
}
