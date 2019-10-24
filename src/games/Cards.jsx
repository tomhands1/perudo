import React from 'react';

import styles from './Cards.module.scss';

const cards = [
    { value: '1', suit: 'clubs' },
    { value: '2', suit: 'clubs' },
    { value: '3', suit: 'clubs' },
    { value: '4', suit: 'clubs' },
    { value: '5', suit: 'clubs' },
    { value: '6', suit: 'clubs' },
    { value: '7', suit: 'clubs' },
    { value: '8', suit: 'clubs' },
    { value: '9', suit: 'clubs' },
    { value: '10', suit: 'clubs' },
    { value: 'J', suit: 'clubs' },
    { value: 'Q', suit: 'clubs' },
    { value: 'K', suit: 'clubs' },
    { value: '1', suit: 'hearts' },
    { value: '2', suit: 'hearts' },
    { value: '3', suit: 'hearts' },
    { value: '4', suit: 'hearts' },
    { value: '5', suit: 'hearts' },
    { value: '6', suit: 'hearts' },
    { value: '7', suit: 'hearts' },
    { value: '8', suit: 'hearts' },
    { value: '9', suit: 'hearts' },
    { value: '10', suit: 'hearts' },
    { value: 'J', suit: 'hearts' },
    { value: 'Q', suit: 'hearts' },
    { value: 'K', suit: 'hearts' },
    { value: '1', suit: 'spades' },
    { value: '2', suit: 'spades' },
    { value: '3', suit: 'spades' },
    { value: '4', suit: 'spades' },
    { value: '5', suit: 'spades' },
    { value: '6', suit: 'spades' },
    { value: '7', suit: 'spades' },
    { value: '8', suit: 'spades' },
    { value: '9', suit: 'spades' },
    { value: '10', suit: 'spades' },
    { value: 'J', suit: 'spades' },
    { value: 'Q', suit: 'spades' },
    { value: 'K', suit: 'spades' },
    { value: '1', suit: 'diamonds' },
    { value: '2', suit: 'diamonds' },
    { value: '3', suit: 'diamonds' },
    { value: '4', suit: 'diamonds' },
    { value: '5', suit: 'diamonds' },
    { value: '6', suit: 'diamonds' },
    { value: '7', suit: 'diamonds' },
    { value: '8', suit: 'diamonds' },
    { value: '9', suit: 'diamonds' },
    { value: '10', suit: 'diamonds' },
    { value: 'J', suit: 'diamonds' },
    { value: 'Q', suit: 'diamonds' },
    { value: 'K', suit: 'diamonds' }
];

const getColor = suit => (suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black');

const getSuit = suit => {
    switch (suit) {
    case 'hearts':
        return '♥';
    case 'spades':
        return '♠';
    case 'clubs':
        return '♣';
    case 'diamonds':
        return '♦';
    default:
    }
};

const Cards = () => (
    <div className={styles.cardsContainer}>
        {cards.map((card, index) => (
            <div key={index} className={styles.cardContainer}>
                <div className={styles.cardTopValue} style={{ color: getColor(card.suit) }}>
                    {card.value}
                </div>
                <div className={styles.cardMainValue} style={{ color: getColor(card.suit) }}>
                    {getSuit(card.suit)}
                </div>
                <div className={styles.cardBottomValue} style={{ color: getColor(card.suit) }}>
                    {card.value}
                </div>
            </div>
        ))}
    </div>
);

export default Cards;
