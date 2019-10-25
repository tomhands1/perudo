import React from 'react';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

import StyledButton from '../../../common/StyledButton/StyledButton';
import styles from './Rounds.module.scss';

const Rounds = props => (
    props.round === 1 ? (
        <div className={styles.roundsContainer}>
            <div className={styles.headerContainer}>{`${props.activePlayer} to bid first!`}</div>
            <div className={styles.secondaryHeader}>Are you ready to play Perudo?</div>
            <div className={styles.buttonContainer}>
                <StyledButton onClick={props.startRound} text="Yes" color="green" />
            </div>
        </div>
    ) : (
        <div className={styles.roundsContainer}>
            <div className={styles.headerContainer}>
                {`${props.activePlayer} lost a dice!`}
                <div className={styles.primaryHeader}>
                    {`${props.activePlayer} starts the next round`}
                </div>
            </div>
            <div className={styles.secondaryHeader}>Are you ready to start the next round?</div>
            <div className={styles.buttonContainer}>
                <StyledButton onClick={props.startRound} text="Yes" color="green" />
            </div>
        </div>
    )
);

Rounds.propTypes = {
    activePlayer: PropTypes.string,
    startRound: PropTypes.func,
    quitGame: PropTypes.func,
    round: PropTypes.number.isRequired
};

Rounds.defaultProps = {
    activePlayer: '',
    startRound: fp.noop,
    quitGame: fp.noop
};

export default Rounds;
