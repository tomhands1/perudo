import React, { useCallback } from 'react';
import {
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
} from 'mdbreact';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

import defaultStyles from './StyledDropdown.module.scss';

const StyledDropdown = props => {
    const clickHandler = useCallback(item => () => props.onItemClick(item), [props.onItemClick]);

    return (
        <MDBDropdown disabled={props.disabled}>
            <MDBDropdownToggle color={props.color} className={props.styles.styledDropdown}>
                {props.title}
            </MDBDropdownToggle>
            <MDBDropdownMenu basic className={props.withScroll ? props.styles.forceScroll : null}>
                {props.items.map(item => (
                    <MDBDropdownItem
                        key={item}
                        onClick={clickHandler(item)}
                        active={item === props.selected}
                    >
                        {item}
                    </MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
        </MDBDropdown>
    );
};

StyledDropdown.defaultProps = {
    color: 'primary',
    title: 'Dropdown',
    items: [],
    onItemClick: fp.noop,
    disabled: false,
    styles: defaultStyles,
    selected: '',
    withScroll: false
};

StyledDropdown.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    ),
    onItemClick: PropTypes.func,
    disabled: PropTypes.bool,
    styles: PropTypes.objectOf(
        PropTypes.string
    ),
    selected: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    withScroll: PropTypes.bool
};

export default StyledDropdown;
