/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

import styles from './Shaker.module.scss';

const Shaker = props => (
    <div className={styles.perudoCup} onClick={props.onClick}>
        <div className={styles.top} style={{ backgroundColor: `${props.topColor}`, boxShadow: `0px 1px ${props.outlineColor}` }} />
        <div
            className={styles.middle}
            style={{ borderBottom: `300px solid ${props.faceColor}` }}
        />
        <div className={styles.bottomRidge} style={{ backgroundColor: `${props.faceColor}` }} />
        <div className={styles.bottom} style={{ backgroundColor: `${props.faceColor}` }} />
        <div className={styles.bottomLip} style={{ backgroundColor: `${props.topColor}` }} />
    </div>
);

Shaker.defaultProps = {
    onClick: fp.noop,
    faceColor: '#FF6347',
    topColor: '#CF503A',
    outlineColor: '#8B0000'
};

Shaker.propTypes = {
    onClick: PropTypes.func,
    faceColor: PropTypes.string,
    topColor: PropTypes.string,
    outlineColor: PropTypes.string
};


export default Shaker;
