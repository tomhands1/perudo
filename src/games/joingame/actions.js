const pre = 'AUTH/';

export const JOIN_GAME_REQUEST = `${pre}JOIN_GAME_REQUEST`;
export const JOIN_GAME_SUCCESS = `${pre}JOIN_GAME_SUCCESS`;
export const JOIN_GAME_ERROR = `${pre}JOIN_GAME_ERROR`;

export const joinGame = (gameId, name) => ({
    type: JOIN_GAME_REQUEST,
    gameId,
    name
});

export const joinGameSuccess = () => ({
    type: JOIN_GAME_SUCCESS
});

export const joinGameError = error => ({
    type: JOIN_GAME_ERROR,
    error
});
