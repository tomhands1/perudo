import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tick from '@material-ui/icons/DoneOutline';
import Cross from '@material-ui/icons/Close';

import defaultStyles from './Lobby.module.scss';
import StyledButton from '../common/StyledButton/StyledButton';

const columns = [
    {
        id: 'name',
        label: 'Players',
        minWidth: 100,
        align: 'center',
        always: true
    },
    {
        id: 'numOfDice',
        label: 'Number of Dice',
        minWidth: 50,
        align: 'center',
        format: value => value.toLocaleString(),
        gameStarted: true
    },
    {
        id: 'readyToPlay',
        label: 'Ready to Play',
        minWidth: 50,
        align: 'center',
        gameStarted: false
    },
    {
        id: 'rolled',
        label: 'Rolled',
        minWidth: 50,
        align: 'center',
        gameStarted: true
    },
    {
        id: 'active',
        label: 'Bidding',
        minWidth: 50,
        align: 'center',
        gameStarted: true
    }
];

const Lobby = ({
    players, styles, userId, readyUp, activePlayer, gameStarted
}) => {
    const transformData = players => (players ? Object.keys(players).map(key => ({
        id: key,
        name: players[key].name || players[key].id,
        numOfDice: players[key].numOfDice,
        readyToPlay: players[key].readyToPlay ? <Tick /> : <StyledButton text="Ready?" disabled={players[key].id !== userId} onClick={readyUp} />,
        rolled: players[key].rolled ? <Tick /> : <Cross />,
        active: players[key].playerNumber === activePlayer ? <div className={styles.activeLED} /> : ''
    })) : []);

    const playersTable = transformData(players);

    return (
        <div className={styles.lobbyWrapper}>
            <Paper className={styles.tableRoot}>
                <div>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.filter(x => x.gameStarted === gameStarted || x.always).map(column => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {playersTable.map(row => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.filter(x => x.gameStarted === gameStarted || x.always).map(column => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        </div>
    );
};

Lobby.defaultProps = {
    players: {},
    styles: defaultStyles
};

Lobby.propTypes = {
    players: PropTypes.objectOf(PropTypes.shape({})),
    styles: PropTypes.objectOf(PropTypes.string)
};

export default Lobby;
