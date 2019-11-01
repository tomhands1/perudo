import React from 'react';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

import StyledButton from '../../../common/StyledButton/StyledButton';
import styles from './Rounds.module.scss';

const Rounds = props => (
    <div className={styles.roundsContainer}>
        <div className={styles.primaryMessage}>
            {props.primaryMessage}
        </div>
        <div className={styles.secondaryMessage}>
            {props.secondaryMessage}
        </div>
        <div className={styles.buttonContainer}>
            <StyledButton onClick={props.negativeAction} outline text={props.negativeText} color="red" />
            <StyledButton onClick={props.positiveAction} text={props.positiveText} color="green" />
        </div>
    </div>

);


Rounds.propTypes = {
    positiveText: PropTypes.string,
    negativeText: PropTypes.string,
    primaryMessage: PropTypes.string,
    secondaryMessage: PropTypes.string,
    positiveAction: PropTypes.func,
    negativeAction: PropTypes.func
};

Rounds.defaultProps = {
    positiveText: '',
    negativeText: '',
    primaryMessage: '',
    secondaryMessage: '',
    positiveAction: fp.noop,
    negativeAction: fp.noop
};

export default Rounds;
