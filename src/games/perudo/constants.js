export const rules = [
    { title: 'Setup', content: 'Each player starts having five dice and a cup, which is used for shaking the dice and concealing the dice from the other players. Players roll die in order, to determine where and in what order they sit. Highest first, then next lowest and so on. In the event of a tie between 2 players, they simply re-roll until one gains a higher score. After deciding who starts the game, the players shake their dice in their cups, and then each player looks at their own dice, keeping their dice concealed from other players. Then, the first player makes a bid about how many dice of a certain value are showing among all players, at a minimum.' },
    { title: 'Aces', content: 'Dice showing a one, are wild, meaning that they count as every number! For example, a bid of \'five threes\' is a claim that between all players, there are at least five dice showing a three or a one. The player challenges the next player (moving clockwise) to raise the bid or call dudo to end the round.' },
    { title: 'Bidding', content: 'A player can increase the quantity of dice ( e.g. from \'five threes\' to \'six threes\' ) or the die number ( e.g. \'five threes\' to \'five sixes\' ) or both! If a player increases the quantity, they can choose any number e.g. a bid may increase from \'five threes\' to \'six twos\'.' },
    { title: 'Bidding aces', content: 'A player who wishes to bid aces can halve the quantity of dice, rounding upwards. For instance, if the current bid is \'five threes\' then the next player would have to bid at least three aces. If the current bid is aces, the next player can call dudo ( no ) or increase the quantity ( e.g. \'four aces\' ) or bid a different number, in which case the lower bound on the quantity is one more than double the previous quantity. For example, from \'three aces\', a player wishing to bid fours would have to bid \'seven fours\' or higher.' },
    { title: 'Call/No', content: 'Also known as dudo, if the player calls, it means that they do not believe the previous bid was correct. All dice are then shown and, if the guess is not correct, the previous player (the player who made the bid) loses a die. If it is correct, the player who called loses a die.' },
    { title: 'How to lose', content: 'A player with no dice remaining is eliminated from the game.' },
    { title: 'Who starts', content: 'A new round starts with the player that lost a die making the first bid, or ( if that player was eliminated ) the player to that player\'s left.' },
    { title: 'Exact', content: 'The player claims that the previous bidder\'s bid is exactly right. If the number is higher or lower, the claimant loses the round. If a correct call of exact is made a player gets to gain a previously lost die ( max of 5 ).' },
    { title: 'Final round', content: 'When a player first reaches one die ( i.e. loses a round and goes from two dice to one ), a Palifico round is played. During this round, the player makes an opening bid and their choice of die number cannot be changed. For instance, the player who is down to one die may bid \'two fours\', and the next player\'s only options are to raise the quantity ( to \'three fours\' or higher ), or to call No/Exact.' },
    { title: 'How to win', content: 'The game ends when only one player has dice remaining; that player is the winner.' }
];

export const numFaces = [1, 2, 3, 4, 5, 6];

export const maxDice = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

export const colors = [
    {
        id: 1,
        dotColor: '#FFFFFF',
        faceColor: '#FF6347',
        topColor: '#CF503A',
        outlineColor: '#8B0000'
    },
    {
        id: 2,
        dotColor: '#FFFFFF',
        faceColor: '#06417D',
        topColor: '#053A70',
        outlineColor: '#042D57'
    },
    {
        id: 3,
        dotColor: '#FFFFFF',
        faceColor: '#FFC125',
        topColor: '#E5AD21',
        outlineColor: '#B28719'
    },
    {
        id: 4,
        dotColor: '#FFFFFF',
        faceColor: '#116133',
        topColor: '#0F572D',
        outlineColor: '#0A3A1E'
    },
    {
        id: 5,
        dotColor: '#000000',
        faceColor: '#FFFFFF',
        topColor: '#F5F5F5',
        outlineColor: '#D3D3D3'
    },
    {
        id: 6,
        dotColor: '#FFFFFF',
        faceColor: '#9365A8',
        topColor: '#845A97',
        outlineColor: '#694878'
    }
];

export const isHigherBid = (previousBid, currentBid) => {
    if (currentBid.value < 0 || currentBid.value > 6) {
        return false;
    }
    if (previousBid.value === 1) {
        if (currentBid.value === 1 && currentBid.quantity > previousBid.quantity) {
            return true;
        }
        if (currentBid.value !== 1 && currentBid.quantity > (previousBid.quantity * 2)) {
            return true;
        }
        return false;
    }
    if (currentBid.value === 1 && currentBid.quantity >= Math.ceil(previousBid.quantity / 2)) {
        return true;
    }
    if (
        (currentBid.quantity === previousBid.quantity && currentBid.value > previousBid.value)
        || (currentBid.quantity > previousBid.quantity)
    ) {
        return true;
    }
    return false;
};
