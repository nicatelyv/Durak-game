import React, { useEffect, useState, useRef } from 'react';
import { generateDeck } from './utils/deck';
import PlayerHand from './components/PlayerHand';
import Table from './components/Table';
import './App.css';

function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [opponentHand, setOpponentHand] = useState([]);
  const [trumpSuit, setTrumpSuit] = useState(null);
  const [attackingCard, setAttackingCard] = useState(null);
  const [defendingCard, setDefendingCard] = useState(null);
  const [tableCards, setTableCards] = useState([]);
  const gameOverRef = useRef(false);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [lastRoundWinner, setLastRoundWinner] = useState(null);

  const getRankValue = (rank) => {
    const order = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return order.indexOf(rank);
  };

  const handleCardClick = (card) => {
    if (currentTurn !== 'player' || attackingCard) return;
    if (currentTurn !== 'player' || attackingCard !== null) return;
    setAttackingCard(card);
    setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    setTimeout(() => {
      opponentDefend(card);
    }, 1000);
  };

  const opponentDefend = (attackCard) => {
    const defense = opponentHand.find(card =>
      (card.suit === attackCard.suit && getRankValue(card.rank) > getRankValue(attackCard.rank)) ||
      (card.suit === trumpSuit && attackCard.suit !== trumpSuit)
    );

    if (defense) {
      setTimeout(() => {
        setDefendingCard(defense);
        setOpponentHand(prev => prev.filter(c => c.id !== defense.id));
        setTableCards(prev => [...prev, attackCard, defense]);
        setLastRoundWinner('opponent');
        setTimeout(cleanupRound, 1000);
      }, 1000);
    } else {
      setTimeout(() => {
        setOpponentHand(prev => [...prev, attackCard]);
        setAttackingCard(null);
        setDefendingCard(null);
        setLastRoundWinner('player');
        drawCards();
        setCurrentTurn('opponent');
        checkGameOver();
      }, 1000);
    }
  };
  const opponentAttack = () => {
    if (opponentHand.length === 0 || attackingCard) return;

    const attackCard = opponentHand.find(c => true); // ən sadə ilk kartı seçsin
    if (!attackCard) return;

    setAttackingCard(attackCard);
    setOpponentHand(prev => prev.filter(c => c.id !== attackCard.id));

    // 1 saniyə sonra müdafiə
    setTimeout(() => {
      playerDefend(attackCard);
    }, 1000);
  };

  const playerDefend = (attackCard) => {
    const defense = playerHand.find(card =>
      (card.suit === attackCard.suit && getRankValue(card.rank) > getRankValue(attackCard.rank)) ||
      (card.suit === trumpSuit && attackCard.suit !== trumpSuit)
    );

    if (defense) {
      setDefendingCard(defense);
      setPlayerHand(prev => prev.filter(c => c.id !== defense.id));
      setTableCards(prev => [...prev, attackCard, defense]);
      setLastRoundWinner('player');

      setTimeout(() => {
        cleanupRound();
        setCurrentTurn('player'); // Playerin növbəsi davam edir
      }, 1000);
    } else {
      // Müdafiə edə bilmir, amma avtomatik götürmək YOX!
      // Sadəcə masaya qoy, düyməni göstərəcək
      setAttackingCard(attackCard);
      setDefendingCard(null);
      setTableCards(prev => [...prev, attackCard]);
      setCurrentTurn('player'); // Sən qərar verirsən: vurasan ya götürəsən
    }
  };

  useEffect(() => {
    if (currentTurn === 'opponent' && !attackingCard && !defendingCard) {
      setTimeout(() => {
        opponentAttack();
      }, 1000);
    }
  }, [currentTurn, attackingCard, defendingCard]);


  const cleanupRound = () => {
    setAttackingCard(null);
    setDefendingCard(null);
    setTableCards([]);
    drawCards();
    setCurrentTurn(lastRoundWinner === 'player' ? 'player' : 'opponent');
    checkGameOver();
  };

  const drawCards = () => {
    setPlayerHand(prev => {
      const needed = 6 - prev.length;
      const drawn = deck.slice(0, needed);
      setDeck(d => d.slice(needed));
      return [...prev, ...drawn];
    });

    setOpponentHand(prev => {
      const needed = 6 - prev.length;
      const drawn = deck.slice(0, needed);
      setDeck(d => d.slice(needed));
      return [...prev, ...drawn];
    });
  };

  const checkGameOver = () => {
    if (gameOverRef.current) return;
    const noDeck = deck.length === 0;
    const playerEmpty = playerHand.length === 0;
    const opponentEmpty = opponentHand.length === 0;

    if (noDeck && playerEmpty && opponentEmpty) {
      alert("Oyun bitdi! Heç-heçə!");
      gameOverRef.current = true;
    } else if (noDeck && playerEmpty) {
      alert("Sən qalib gəldin!");
      gameOverRef.current = true;
    } else if (noDeck && opponentEmpty) {
      alert("Rəqib qalib gəldi!");
      gameOverRef.current = true;
    }
  };

  useEffect(() => {
    const newDeck = generateDeck();
    const player = newDeck.slice(0, 6);
    const opponent = newDeck.slice(6, 12);
    const rest = newDeck.slice(12);
    const trumpCard = rest[rest.length - 1];
    setTrumpSuit(trumpCard.suit);
    setPlayerHand(player);
    setOpponentHand(opponent);
    setDeck(rest);
  }, []);

  const takeTableCards = () => {
    if (attackingCard) {
      const cardsToTake = [attackingCard];
      if (defendingCard) cardsToTake.push(defendingCard);
      setPlayerHand(prev => [...prev, ...cardsToTake]);
      setAttackingCard(null);
      setDefendingCard(null);
      setTableCards([]);
      drawCards();
      setCurrentTurn('opponent'); // rəqib növbəsinə keç
    }
  };



  return (
    <div className="app-container">
      <h1 className="title">🃏 Durak Oyunu</h1>
      <div className="deck-info">
        <h3>🂠 Masada qalan kartlar: {deck.length}</h3>
      </div>

      <h2 className="section-title">Kozır (Trump): <span className="trump">{trumpSuit}</span></h2>

      <div>
        <h2 className="section-title">Rəqib</h2>
        <div className="hand">
          <PlayerHand cards={opponentHand.map(() => ({ rank: '🂠', suit: '', id: Math.random() }))} />
        </div>
      </div>

      <div className="table">
        <Table attack={attackingCard} defense={defendingCard} tableCards={tableCards} />
      </div>

      <div>
        <h2 className="section-title">Sənin Kartların</h2>
        <div className="hand">
          <PlayerHand cards={playerHand} onCardClick={handleCardClick} />
          {currentTurn === 'player' && attackingCard && (
            <button onClick={takeTableCards}>Masadakı kart(lar)ı götür</button>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;