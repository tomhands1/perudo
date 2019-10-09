export const SUBMIT_GUESS_STARTED = 'SUBMIT_GUESS_STARTED';
export const SUBMIT_GUESS_SUCCESS = 'SUBMIT_GUESS_SUCCESS';
export const SUBMIT_GUESS_ERROR = 'SUBMIT_GUESS_ERROR';

export const RECEIVED_GUESS_SUCCESS = 'RECEIVED_GUESS_SUCCESS';

export const submitGuessStarted = guess => ({
    type: SUBMIT_GUESS_STARTED,
    guess
});
