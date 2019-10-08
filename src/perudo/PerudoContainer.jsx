
import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

import Perudo from './Perudo';
import Button from '../common/button/Button';
import Dropdown from '../common/dropdown/Dropdown';
import { submitGuessStarted } from './actions';
import styles from './Perudo.module.scss';

const PerudoContainer = ({ submitGuess, currentGuess, ...props }) => {
    const [numOfDice, setNumOfDice] = useState(5);
    const [quantity, setQuantity] = useState('');
    const [value, setValue] = useState('');

    const submitBid = useCallback(() => { submitGuess({ quantity, value }); }, [quantity, value]);

    return (
        numOfDice > 0 ? (
            <div className={styles.perudoContainer}>
                <div className={styles.currentGuess}>{`The current bid is ${currentGuess.quantity} ${currentGuess.value}${currentGuess.quantity > 1 ? '\'s' : ''}`}</div>
                <Perudo
                    numOfDice={numOfDice}
                    onLoseDice={() => setNumOfDice(numOfDice - 1)}
                    outline={props.outline}
                    outlineColor={props.outlineColor}
                    faceColor={props.faceColor}
                    dotColor={props.dotColor}
                    dieSize={40}
                />
                <Dropdown items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} onItemClick={e => setQuantity(e)} title={`Quantity - ${quantity}`} />
                <Dropdown items={[1, 2, 3, 4, 5, 6]} onItemClick={e => setValue(e)} title={`Value - ${value}`} />
                <Button
                    onClick={submitBid}
                    text={`I think there ${quantity > 1 ? 'are' : 'is'}
                    ${quantity}
                    ${value}${quantity > 1 && value ? '\'s' : ''}`}
                    disabled={!(quantity && value)}
                />
                <Button
                    onClick={() => console.log('Exact!')}
                    text="Exact"
                />
                <Button
                    onClick={() => console.log('No!')}
                    text="No"
                    color="danger"
                />
            </div>
        )
            : (
                <div className={styles.perudoContainer}>
                    <Button onClick={() => setNumOfDice(5)} text="Play Again!" />
                </div>
            )
    );
};

PerudoContainer.propTypes = {
    dotColor: PropTypes.string,
    faceColor: PropTypes.string,
    outlineColor: PropTypes.string,
    outline: PropTypes.bool,
    submitGuess: PropTypes.func,
    currentGuess: PropTypes.shape({
        quantity: PropTypes.string,
        value: PropTypes.string
    })
};

PerudoContainer.defaultProps = {
    dotColor: '#ffffff',
    faceColor: '#FF6347',
    outlineColor: '#8B0000',
    outline: false,
    submitGuess: fp.noop,
    currentGuess: {
        quantity: '',
        value: ''
    }
};

const mapDispatchToProps = {
    submitGuess: submitGuessStarted
};

const mapStateToProps = state => ({
    currentGuess: state.perudo.guess
});

export default connect(mapStateToProps, mapDispatchToProps)(PerudoContainer);
