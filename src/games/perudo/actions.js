export const CALL_NO = 'CALL_NO';
export const CALL_NO_SUCCESS = 'CALL_NO_SUCCESS';
export const CALL_NO_ERROR = 'CALL_NO_ERROR';

export const CALL_EXACT = 'CALL_EXACT';
export const CALL_EXACT_SUCCESS = 'CALL_EXACT_SUCCESS';
export const CALL_EXACT_ERROR = 'CALL_EXACT_ERROR';

export const TOGGLE_SHAKER = 'TOGGLE_SHAKER';

export const SUBMIT_GUESS = 'SUBMIT_GUESS';
export const SUBMIT_GUESS_SUCCESS = 'SUBMIT_GUESS_SUCCESS';
export const SUBMIT_GUESS_ERROR = 'SUBMIT_GUESS_ERROR';

export const DICE_ROLL_STARTED = 'DICE_ROLL_STARTED';
export const DICE_ROLL_SUCCESS = 'DICE_ROLL_SUCCESS';
export const DICE_ROLL_ERROR = 'DICE_ROLL_ERROR';

export const READY_TO_PLAY = 'READY_TO_PLAY';
export const READY_UP_SUCCESS = 'READY_UP_SUCCESS';
export const READY_UP_ERROR = 'READY_UP_ERROR';

export const START_GAME = 'START_GAME';
export const START_GAME_SUCCESS = 'START_GAME_SUCCESS';
export const START_GAME_ERROR = 'START_GAME_ERROR';

export const NEW_ROUND = 'NEW_ROUND';

export const QUIT_GAME = 'QUIT_GAME';
export const QUIT_GAME_SUCCESS = 'QUIT_GAME_SUCCESS';
export const QUIT_GAME_ERROR = 'QUIT_GAME_ERROR';

export const callNo = (gameId, bid) => ({
    type: CALL_NO,
    gameId,
    bid
});

export const callNoSuccess = () => ({
    type: CALL_NO_SUCCESS
});

export const callNoError = error => ({
    type: CALL_NO_ERROR,
    error
});

export const callExact = (gameId, bid) => ({
    type: CALL_EXACT,
    gameId,
    bid
});

export const callExactSuccess = () => ({
    type: CALL_EXACT_SUCCESS
});

export const callExactError = error => ({
    type: CALL_EXACT_ERROR,
    error
});

export const newRound = () => ({
    type: NEW_ROUND
});

export const diceRollStarted = gameId => ({
    type: DICE_ROLL_STARTED,
    gameId
});

export const diceRollSuccess = diceArray => ({
    type: DICE_ROLL_SUCCESS,
    diceArray
});

export const diceRollError = message => ({
    type: DICE_ROLL_ERROR,
    message
});

export const submitGuess = (quantity, value, gameId) => ({
    type: SUBMIT_GUESS,
    quantity,
    value,
    gameId
});

export const submitGuessSuccess = guess => ({
    type: SUBMIT_GUESS_SUCCESS,
    guess
});

export const submitGuessError = error => ({
    type: SUBMIT_GUESS_ERROR,
    error
});

export const toggleShaker = () => ({
    type: TOGGLE_SHAKER
});

export const readyToPlay = gameId => ({
    type: READY_TO_PLAY,
    gameId
});

export const readyUpSuccess = () => ({
    type: READY_UP_SUCCESS
});

export const readyUpError = error => ({
    type: READY_UP_ERROR,
    error
});

export const startGame = gameId => ({
    type: START_GAME,
    gameId
});

export const startGameSuccess = () => ({
    type: START_GAME_SUCCESS
});

export const startGameError = error => ({
    type: START_GAME_ERROR,
    error
});

export const quitGame = gameId => ({
    type: QUIT_GAME,
    gameId
});

export const quitGameSuccess = () => ({
    type: QUIT_GAME_SUCCESS
});

export const quitGameError = error => ({
    type: QUIT_GAME_ERROR,
    error
});
