import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import StyledButton from '../StyledButton/StyledButton';
import styles from './RulesModal.module.scss';

const RulesModal = props => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <StyledButton
                onClick={() => setOpen(true)}
                text="Rules"
                color="amber"
            />
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className={styles.modal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={open}>
                    <div className={styles.paper}>
                        {props.title}
                        {props.rules.map(rule => (
                            <div className={styles.rule} key={rule.title}>
                                <div className={styles.title}>{rule.title}</div>
                                <div className={styles.content}>{rule.content}</div>
                            </div>
                        ))}
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

RulesModal.defaultProps = {
    rules: [],
    title: ''
};

RulesModal.propTypes = {
    rules: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            content: PropTypes.string
        })
    ),
    title: PropTypes.string
};

export default RulesModal;
