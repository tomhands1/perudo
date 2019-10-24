import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { MDBBtn } from 'mdbreact';
import defaultStyles from './StyledButton.module.scss';

const StyledButton = props => (
    <MDBBtn
        color={props.color}
        className={props.styles.styledButton}
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
    >
        {props.text}
    </MDBBtn>
);

StyledButton.defaultProps = {
    color: 'primary',
    onClick: noop,
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
