import React, {
    useState, useEffect, useCallback, useMemo
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import Perudo from './Perudo';
import StyledButton from '../../common/StyledButton/StyledButton';
import StyledDropdown from '../../common/StyledDropdown/StyledDropdown';
import StyledModal from '../../common/modal/StyledModal';
import * as actions from './actions';
import styles from './Perudo.module.scss';
import {
    getNumOfDice, getRolling, getGameId, getGame, getPlayers, getRolls
} from './selectors';
import RulesModal from '../../common/RulesModal/RulesModal';
import Lobby from '../../lobby/Lobby';
import Rounds from './rounds/Rounds';
import {
    rules, numFaces, maxDice, isHigherBid
} from './constants';

const PerudoContainer = ({
    submitGuess, restartGame, ...props
}) => {
    const [quantity, setQuantity] = useState('');
    const [value, setValue] = useState('');

    const [isOpen, setIsOpen] = useState(false);
    const [hidden, setHidden] = useState(true);

    const submitBid = useCallback(() => {
        const bid = { quantity, value };
        return isHigherBid(props.game.currentBid, bid) ? submitGuess(quantity, value, props.gameId) : alert('invalid guess');
    }, [quantity, value, submitGuess, props.gameId]);

    const callNo = useCallback(() => props.callNo(props.gameId), [props.callNo, props.gameId]);
    const callExact = useCallback(() => props.callExact(props.gameId), [props.callExact, props.gameId]);

    const readyUp = useCallback(() => props.readyToPlay(props.gameId), [props.readyToPlay, props.gameId]);

    const startGame = useCallback(() => props.startGame(props.gameId), [props.startGame, props.gameId]);
    const startRound = useCallback(() => {
        setIsOpen(false);
        setHidden(true);
        props.newRound();
    },
    [props.startGame, props.gameId]);

    const leaveGame = useCallback(() => props.quitGame(props.gameId), [props.quitGame, props.gameId]);

    const activePlayer = useMemo(() => props.players && props.game && fp.get('name')(Object.values(props.players).find(x => fp.get('playerNumber')(x) === props.game.activePlayerNum)));

    const playerNum = useMemo(() => props.players && fp.get('playerNumber')(Object.values(props.players).find(x => x.id === props.auth.uid)));
    const rolled = useMemo(() => props.players && fp.get('rolled')(Object.values(props.players).find(x => x.id === props.auth.uid)));

    useEffect(() => {
        if (props.game && props.game.round) {
            setIsOpen(true);
        }
    }, [props.game && props.game.round]);

    return (
        props.game && props.numOfDice > 0 ? (
            <div className={styles.perudoContainer}>
                {props.game && props.game.round && (
                    <StyledModal
                        isOpen={isOpen}
                        backdrop
                    >
                        <Rounds startRound={startRound} activePlayer={activePlayer} round={props.game.round} quitGame={leaveGame} />
                    </StyledModal>
                )}
                {props.game && props.game.gameStarted && (
                    <div className={styles.gameStarted}>
                        <div className={styles.currentGuess}>
                            {props.game && props.game.currentBid.value > 0
                                ? `The current bid is ${props.game.currentBid.quantity} ${props.game.currentBid.value}${props.game.currentBid.quantity > 1 ? '\'s' : ''}`
                                : 'Waiting for first bid'}
                        </div>
                        <Perudo
                            numOfDice={props.numOfDice}
                            outline={props.outline}
                            dieSize={40}
                            diceArray={props.diceArray}
                            rollDice={props.rollDice}
                            gameId={props.gameId}
                            diceFetched={props.diceFetched}
                            rolled={rolled}
                            shakerUp={props.shakerUp}
                            rolling={props.rolling}
                            toggleShaker={props.toggleShaker}
                            playerNum={playerNum}
                            hidden={hidden}
                            setHidden={setHidden}
                        />
                        <div className={styles.guessContainer}>
                            <div className={styles.guessDropdowns}>
                                <StyledDropdown items={maxDice} selected={quantity} onItemClick={e => setQuantity(e)} title={`Quantity - ${quantity}`} withScroll />
                                <StyledDropdown items={numFaces} selected={value} onItemClick={e => setValue(e)} title={`Value - ${value}`} withScroll />
                            </div>
                            <StyledButton
                                onClick={submitBid}
                                text={`I think there ${quantity > 1 ? 'are' : 'is'} ${quantity} ${value}${quantity > 1 && value ? '\'s' : ''}`}
                                disabled={!(quantity && value)}
                            />
                        </div>
                        {props.game.activePlayerNum === playerNum
                            && (
                                <StyledButton
                                    onClick={callNo}
                                    text="No"
                                    color="danger"
                                />
                            )}
                        <StyledButton
                            onClick={callExact}
                            text="Exact"
                            color="green"
                            disabled={props.numOfDice > 4}
                        />

                    </div>
                )}
                {props.game.creator
                    && props.players
                    && fp.all('readyToPlay')(Object.values(props.players).map(player => player))
                    && props.game.creator.id === props.auth.uid
                    && !props.game.gameStarted
                    && <StyledButton text="Start Game!" onClick={startGame} />}
                <Lobby
                    players={props.players}
                    readyUp={readyUp}
                    userId={props.auth.uid}
                    activePlayer={props.game.activePlayerNum}
                    gameStarted={props.game.gameStarted}
                />
                <RulesModal rules={rules} title="Perudo" />
                <StyledButton onClick={leaveGame} text="Quit" color="red" size="sm" />
            </div>
        )
            : (
                <div className={styles.perudoContainer}>
                    Unlucky Scrub
                    <StyledButton onClick={restartGame} text="Play Again!" />
                </div>
            )
    );
};

PerudoContainer.propTypes = {
    auth: PropTypes.shape({
        uid: PropTypes.string
    }),
    dotColor: PropTypes.string,
    faceColor: PropTypes.string,
    outlineColor: PropTypes.string,
    outline: PropTypes.bool,
    submitGuess: PropTypes.func,
    callExact: PropTypes.func,
    callNo: PropTypes.func,
    restartGame: PropTypes.func,
    rollDice: PropTypes.func,
    diceArray: PropTypes.arrayOf(
        PropTypes.number
    ),
    numOfDice: PropTypes.number.isRequired,
    shakerUp: PropTypes.bool,
    rolling: PropTypes.bool,
    toggleShaker: PropTypes.func,
    game: PropTypes.shape({
        creator: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        }),
        gameStarted: PropTypes.bool,
        name: PropTypes.string,
        activePlayerNum: PropTypes.number,
        currentBid: PropTypes.shape({
            quantity: PropTypes.number,
            value: PropTypes.number
        }),
        round: PropTypes.number
    }),
    players: PropTypes.objectOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            numOfDice: PropTypes.number,
            readyToPlay: PropTypes.bool,
            rolled: PropTypes.bool
        })
    ),
    diceRolled: PropTypes.objectOf(
        PropTypes.shape({
            userId: PropTypes.string,
            currentRoll: PropTypes.arrayOf(PropTypes.number)
        })
    ),
    gameId: PropTypes.string,
    readyToPlay: PropTypes.func,
    startGame: PropTypes.func,
    diceFetched: PropTypes.bool.isRequired,
    newRound: PropTypes.func,
    quitGame: PropTypes.func
};

PerudoContainer.defaultProps = {
    auth: {},
    dotColor: '#ffffff',
    faceColor: '#FF6347',
    outlineColor: '#8B0000',
    outline: false,
    submitGuess: fp.noop,
    callExact: fp.noop,
    callNo: fp.noop,
    restartGame: fp.noop,
    rollDice: fp.noop,
    diceArray: [],
    shakerUp: false,
    rolling: false,
    toggleShaker: fp.noop,
    game: {
        creator: {
            id: '',
            name: ''
        },
        gameStarted: false,
        name: '',
        activePlayerNum: 1,
        currentBid: {
            quantity: 0,
            value: 0
        },
        round: 1
    },
    players: {
        '': {
            id: '',
            name: '',
            numOfDice: 5,
            readyToPlay: false,
            rolled: false
        }
    },
    diceRolled: {},
    gameId: '',
    readyToPlay: fp.noop,
    startGame: fp.noop,
    newRound: fp.noop,
    quitGame: fp.noop
};

const mapDispatchToProps = {
    submitGuess: actions.submitGuess,
    rollDice: actions.diceRollStarted,
    callNo: actions.callNo,
    callExact: actions.callExact,
    restartGame: actions.restartGame,
    toggleShaker: actions.toggleShaker,
    readyToPlay: actions.readyToPlay,
    startGame: actions.startGame,
    newRound: actions.newRound,
    quitGame: actions.quitGame
};

const mapStateToProps = (state, props) => ({
    auth: state.firebase.auth,
    game: getGame(state, props),
    players: getPlayers(state),
    currentGuess: state.perudo.guess,
    diceArray: state.perudo.diceArray,
    gameId: getGameId(props),
    numOfDice: getNumOfDice(state),
    shakerUp: state.perudo.shakerUp,
    rolling: getRolling(state),
    isReady: state.perudo.isReady,
    diceRolled: getRolls(state),
    diceFetched: state.perudo.diceFetched
});


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => [
        {
            collection: 'games',
            doc: getGameId(props),
            subcollections: [
                { collection: 'players' }
            ],
            storeAs: 'players'
        },
        {
            collection: 'games',
            doc: getGameId(props)
        },
        {
            collection: 'games',
            doc: getGameId(props),
            subcollections: [
                { collection: 'diceRolled' }
            ],
            storeAs: 'secretRolls',
            where: [['userId', '==', props.auth.uid]]
        }
    ])
)(PerudoContainer);
