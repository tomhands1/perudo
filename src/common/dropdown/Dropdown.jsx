import React, { useCallback } from 'react';
import {
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem
} from 'mdbreact';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

const Dropdown = props => {
    const clickHandler = useCallback(item => () => props.onItemClick(item), [props]);

    return (
        <MDBDropdown disabled={props.disabled}>
            <MDBDropdownToggle color={props.color}>
                {props.title}
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
                {props.items.map(item => (
                    <MDBDropdownItem onClick={clickHandler(item)}>{item}</MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
        </MDBDropdown>
    );
};

Dropdown.defaultProps = {
    color: 'primary',
    title: 'Dropdown',
    items: [],
    onItemClick: fp.noop,
    disabled: false
};

Dropdown.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string),
    onItemClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default Dropdown;
