/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
import fp from 'lodash/fp';
import React, {
    useState, useCallback, createRef, useEffect, useLayoutEffect
} from 'react';
import PropTypes from 'prop-types';

import Shaker from './Shaker';
import Button from '../common/button/Button';
import Dice from './Dice';
import styles from './Perudo.module.scss';

const Perudo = props => {
    const [numOfDice, setNumOfDice] = useState(props.numOfDice);
    const [dice, setDice] = useState([]);
    const [rolls, setRolls] = useState([]);
    const [rolled, setRolled] = useState(false);
    const [hidden, setHidden] = useState(false);


    const getRefs = useCallback(() => {
        const refs = [];
        for (let i = 0; i < numOfDice; i++) {
            const newRef = createRef();
            refs.push(newRef);
        }
        setDice(refs);
    }, [numOfDice, dice]);

    const rollDice = useCallback(() => {
        setRolls([]);
        dice.map(i => i.current.rollDice());
    });

    const readyForRoll = useCallback(() => {
        getRefs();
        setRolled(true);
        rollDice();
    }, [numOfDice]);

    const reduceDice = useCallback(() => {
        setNumOfDice(numOfDice - 1);
        setRolls([]);
        getRefs();
        props.onLoseDice();
    }, [numOfDice, props.onLoseDice]);

    const toggleHidden = useCallback(() => { setHidden(!hidden); }, [hidden]);

    useEffect(() => { rollDice(); }, [rolled]);
    useLayoutEffect(() => { getRefs(); }, [numOfDice]);

    return (
        <div className={styles.perudoContainer}>
            {rolled && (
                <div className={styles.buttonContainer}>
                    <Button onClick={rollDice} text="Roll the dice!" />
                    <Button onClick={reduceDice} text="Lose a dice!" />
                    <Button onClick={toggleHidden} text={hidden ? 'Reveal the dice!' : 'Hide the dice!'} />
                </div>
            )}
            {rolled
                ? (
                    <div className={styles.diceContainer} style={hidden ? { visibility: 'hidden' } : { visibility: 'unset' }}>
                        {dice.map((d, i) => (
                            <Dice
                                ref={d}
                                onRoll={val => setRolls([...rolls, val])}
                                dotColor={props.dotColor}
                                faceColor={props.faceColor}
                                outline={props.outline}
                                outlineColor={props.outlineColor}
                                key={i}
                                dieSize={props.dieSize}
                            />
                        ))}
                    </div>
                )
                : (
                    <Shaker
                        topColor={props.topColor}
                        faceColor={props.faceColor}
                        outlineColor={props.outlineColor}
                        onClick={readyForRoll}
                    />
                )}
            <div className={styles.valueContainer} style={hidden ? { visibility: 'hidden' } : { visibility: 'unset' }}>
                {rolls.map((value, i) => (
                    <div key={i} className={styles.diceValue} style={{ marginRight: `${props.dieSize / 2}`, marginLeft: `${props.dieSize / 2}` }}>{value}</div>
                ))}
            </div>
        </div>
    );
};

Perudo.defaultProps = {
    dotColor: '#ffffff',
    faceColor: '#FF6347',
    topColor: '#CF503A',
    outlineColor: '#8B0000',
    outline: false,
    numOfDice: 5,
    onLoseDice: fp.noop,
    dieSize: 60
};

Perudo.propTypes = {
    dotColor: PropTypes.string,
    faceColor: PropTypes.string,
    topColor: PropTypes.string,
    outlineColor: PropTypes.string,
    outline: PropTypes.bool,
    numOfDice: PropTypes.number,
    onLoseDice: PropTypes.func,
    dieSize: PropTypes.number
};

export default Perudo;
