import React from 'react';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';
import { MDBBtn } from 'mdbreact';
import defaultStyles from './Button.module.scss';

const StyledButton = props => (
    <MDBBtn
        color={props.color}
        className={props.styles.Button}
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
    >
        {props.text}
    </MDBBtn>
);

StyledButton.defaultProps = {
    color: 'primary',
    onClick: fp.noop,
    styles: defaultStyles,
    text: 'Button',
    type: '',
    disabled: false
};

StyledButton.propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string),
    text: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool
};

export default StyledButton;
