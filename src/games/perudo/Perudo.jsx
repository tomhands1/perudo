/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import fp from 'lodash/fp';
import React, {
    useCallback, useRef, useEffect, useMemo
} from 'react';
import PropTypes from 'prop-types';
import 'react-dice-complete/dist/react-dice-complete.css';

import Dice from './dice/Dice';
import Shaker from './shaker/Shaker';
import styles from './Perudo.module.scss';
import { colors } from './constants';


const Perudo = props => {
    const diceRef = useRef();

    const rollDice = useCallback(() => diceRef.current.rollAll(props.diceArray), [props.diceArray]);

    const readyForRoll = useCallback(() => {
        props.rollDice(props.gameId);
        setTimeout(() => props.setHidden(false), 800);
    }, [props]);

    const toggleShaker = useCallback(() => {
        props.toggleShaker();
        setTimeout(() => props.setHidden(props.shakerUp), 800);
    }, [props]);

    const color = useMemo(() => colors.find(x => x.id === props.playerNum), [props.playerNum]);

    useEffect(() => {
        if (props.diceFetched && props.rolled) {
            diceRef.current.rollAll(props.diceArray);
        }
    }, [props.rolled, props.diceFetched, props.diceArray]);

    return (
        <div className={styles.gameContainer}>
            <Shaker
                topColor={color.topColor}
                faceColor={color.faceColor}
                outlineColor={color.outlineColor}
                onClick={props.rolled ? toggleShaker : readyForRoll}
                active={props.rolled && props.shakerUp}
                rolling={props.rolling}
            />
            <div className={styles.insideCup}>
                <Dice
                    ref={diceRef}
                    faceColor={color.faceColor}
                    dotColor={color.dotColor}
                    outlineColor={color.outlineColor}
                    {...props}
                    rollDice={rollDice}
                    hidden={props.hidden}
                    margin={10}
                    rolled={props.rolled}
                />
            </div>
        </div>
    );
};

Perudo.defaultProps = {
    outline: true,
    onLoseDice: fp.noop,
    dieSize: 60,
    diceArray: [],
    rollDice: fp.noop,
    rolling: false,
    rolled: false,
    toggleShaker: fp.noop,
    gameId: '',
    playerNum: 1
};

Perudo.propTypes = {
    outline: PropTypes.bool,
    numOfDice: PropTypes.number.isRequired,
    onLoseDice: PropTypes.func,
    dieSize: PropTypes.number,
    diceArray: PropTypes.arrayOf(PropTypes.number),
    rollDice: PropTypes.func,
    rolling: PropTypes.bool,
    rolled: PropTypes.bool,
    toggleShaker: PropTypes.func,
    gameId: PropTypes.string,
    playerNum: PropTypes.number,
    shakerUp: PropTypes.bool.isRequired,
    diceFetched: PropTypes.bool.isRequired,
    hidden: PropTypes.bool.isRequired,
    setHidden: PropTypes.func.isRequired
};

export default Perudo;
