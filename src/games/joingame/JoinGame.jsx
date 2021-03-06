import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import fp from 'lodash/fp';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import defaultStyles from './JoinGame.module.scss';
import StyledModal from '../../common/modal/StyledModal';
import StyledButton from '../../common/StyledButton/StyledButton';
import * as actions from './actions';

const transformData = games => (games ? Object.keys(games).map(key => ({
    id: key,
    numberOfPlayers: games[key].numberOfPlayers,
    name: games[key].name,
    gameStarted: games[key].gameStarted ? 'Started' : 'In Lobby',
    creator: games[key].creator.name
})) : []);

const columns = [
    {
        id: 'numberOfPlayers',
        label: 'Players',
        minWidth: 170,
        align: 'center',
        format: value => value.toLocaleString()
    },
    {
        id: 'name', label: 'Game Name', minWidth: 170, align: 'center'
    },
    {
        id: 'gameStarted',
        label: 'Status',
        minWidth: 170,
        align: 'center'
    }, {
        id: 'creator', label: 'Creator', minWidth: 100, align: 'center'
    }
];

const JoinGame = props => {
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [gameToJoin, setGameToJoin] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleJoin = useCallback(row => {
        setGameToJoin(row);
        setJoinModalOpen(true);
    });

    const transformedDated = transformData(props.games);

    return (
        <div className={props.styles.joinGameWrapper}>
            <Paper className={props.styles.tableRoot}>
                <div>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map(column => (
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
                            {transformedDated.slice(
                                page * rowsPerPage, page * rowsPerPage + rowsPerPage
                            ).map(row => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={() => handleJoin(row)}>
                                    {columns.map(column => {
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
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={transformedDated.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'previous page'
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page'
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <StyledModal
                backdrop
                closeModal={() => setJoinModalOpen(false)}
                error
                isOpen={joinModalOpen}
                headerMessage={`Joining game ${gameToJoin.name}`}
                header
                toggleModal={() => setJoinModalOpen(false)}
            >
                <div className={props.styles.modalWrapper}>
                    {gameToJoin.gameStarted === 'Started' ? (
                        <div>
                            This game has already started, soz
                        </div>
                    )
                        : (
                            <div>
                                Are you sure you want to join this game?
                                <Link to={`/game/${gameToJoin.id}`}>
                                    <StyledButton text="Join" onClick={() => props.joinGame(gameToJoin.id, gameToJoin.name)} />
                                </Link>
                            </div>
                        )}
                </div>
            </StyledModal>
        </div>
    );
};

JoinGame.defaultProps = {
    games: {},
    styles: defaultStyles,
    joinGame: fp.noop
};

JoinGame.propTypes = {
    games: PropTypes.objectOf(PropTypes.shape({})),
    styles: PropTypes.objectOf(PropTypes.string),
    joinGame: PropTypes.func
};

const mapStateToProps = state => {
    const { games } = state.firestore.data;
    return {
        games
    };
};

const mapDispatchToProps = {
    joinGame: actions.joinGame
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([{
        collection: 'games'
    }])
)(JoinGame);
