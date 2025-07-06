const suits = ['♥️', '♦️', '♣️', '♠️'];
const ranks = ['6', '7', '8', '9', '10', 'Valet', 'Queen', 'King', 'Tuz'];

export function generateDeck() {
  const deck = [];
  
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank
      });
    }
  }
  return shuffle(deck);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
