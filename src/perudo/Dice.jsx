import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactDice from 'react-dice-complete';
import 'react-dice-complete/dist/react-dice-complete.css';

class Dice extends Component {
    constructor(props) {
        super(props);
        this.theDice = React.createRef(null);
        this.rollDice = () => this.theDice.rollAll();
    }

    render() {
        return (
            <>
                <ReactDice
                    numDice={1}
                    rollDone={this.props.onRoll}
                    ref={dice => { this.theDice = dice; }}
                    faceColor={this.props.faceColor}
                    dotColor={this.props.dotColor}
                    disableIndividual
                    outline={this.props.outline}
                    outlineColor={this.props.outlineColor}
                    dieSize={this.props.dieSize}
                />
            </>
        );
    }
}

Dice.defaultProps = {
    dotColor: '#ffffff',
    faceColor: '#FF6347',
    outlineColor: '#8B0000',
    outline: false,
    dieSize: 60
};

Dice.propTypes = {
    dotColor: PropTypes.string,
    faceColor: PropTypes.string,
    outlineColor: PropTypes.string,
    outline: PropTypes.bool,
    onRoll: PropTypes.func.isRequired,
    dieSize: PropTypes.number
};

export default Dice;
