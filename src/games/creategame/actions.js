const pre = 'AUTH/';

export const CREATE_GAME_REQUEST = `${pre}CREATE_GAME_REQUEST`;
export const CREATE_GAME_SUCCESS = `${pre}CREATE_GAME_SUCCESS`;
export const CREATE_GAME_ERROR = `${pre}CREATE_GAME_ERROR`;

export const createGame = name => ({
    type: CREATE_GAME_REQUEST,
    name
});

export const createGameSuccess = game => ({
    type: CREATE_GAME_SUCCESS,
    game
});

export const createGameError = error => ({
    type: CREATE_GAME_ERROR,
    error
});
