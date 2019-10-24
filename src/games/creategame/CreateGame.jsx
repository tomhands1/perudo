import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StyledInput from '../../common/StyledInput/StyledInput';
import StyledButton from '../../common/StyledButton/StyledButton';
import defaultStyles from './CreateGame.module.scss';
import * as actions from './actions';

const CreateGame = ({ createGame, styles }) => {
    const [name, setName] = useState('');

    const submitGame = useCallback(() => createGame(name), [createGame, name]);

    return (
        <div className={styles.createGameWrapper}>
            <div className={styles.gameNameInput}>
                <StyledInput label="Game Name" type="text" onChange={e => setName(e)} />
            </div>
            <div className={styles.createGameButton}>
                <StyledButton
                    color="amber"
                    onClick={submitGame}
                    text="Create game"
                />
            </div>
        </div>
    );
};

CreateGame.defaultProps = {
    styles: defaultStyles
};

CreateGame.propTypes = {
    createGame: PropTypes.func.isRequired,
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapDispatchToProps = {
    createGame: actions.createGame
};

export default connect(null, mapDispatchToProps)(CreateGame);
