import fp from 'lodash/fp';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDice from 'react-dice-complete';
import styles from '../Perudo.module.scss';

const Dice = React.forwardRef((props, ref) => {
    useEffect(() => {
        props.rollDice();
    }, []);

    return (
        <div className={styles.diceContainer} style={props.hidden ? { visibility: 'hidden' } : { visibility: 'unset' }}>
            <ReactDice
                numDice={props.numOfDice}
                ref={ref}
                faceColor={props.faceColor}
                dotColor={(!props.rolled && !props.hidden) ? props.faceColor : props.dotColor}
                disableIndividual
                outline={props.outline}
                outlineColor={props.outlineColor}
                dieSize={props.dieSize}
                rollDone={fp.noop}
                margin={props.margin}
                rollTime={4}
            />
        </div>
    );
});

Dice.propTypes = {
    rollDice: PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired,
    numOfDice: PropTypes.number.isRequired,
    faceColor: PropTypes.string.isRequired,
    dotColor: PropTypes.string.isRequired,
    outline: PropTypes.bool.isRequired,
    outlineColor: PropTypes.string.isRequired,
    dieSize: PropTypes.number.isRequired,
    margin: PropTypes.number.isRequired,
    rolled: PropTypes.bool.isRequired
};

export default Dice;
