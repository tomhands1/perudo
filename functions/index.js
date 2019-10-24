const fp = require('lodash/fp');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const common = require('./src/common');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.auth = require('./src/auth');
exports.games = require('./src/games');

exports.createGame = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        const gameWithThatName = db.collection('available_games')
            .where('name', '==', data.name);

        const getDisplayName = id => db.collection('users').doc(id).get().then(user => user.data().displayName);

        return getDisplayName(context.auth.uid).then(displayName => gameWithThatName.get()
            .then(doc => {
                if (doc.empty) {
                    return db.collection('available_games').add({
                        name: data.name,
                        creator: {
                            id: context.auth.uid,
                            name: displayName
                        },
                        game_started: false,
                        activePlayerNum: 1,
                        numberOfPlayers: 1
                    }).then(result => {
                        db.collection('available_games').doc(result.id).collection('players').add({
                            id: context.auth.uid,
                            name: displayName,
                            readyToPlay: false,
                            numOfDice: 5
                        });
                        return db.collection('available_games').doc(result.id).get().then(docs => ({ ...docs.data(), id: docs.id }));
                    });
                }
                throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
            }));
    });


exports.joinGame = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        const playerInGame = db.collection('available_games').doc(data.gameId).collection('players').where('id', '==', context.auth.uid);

        const gameWithThatId = db.collection('available_games').doc(data.gameId).collection('players');

        const getDisplayName = id => db.collection('users').doc(id).get().then(user => user.data().displayName);

        return playerInGame.get().then(result => {
            if (result.size > 0) {
                throw new functions.https.HttpsError('already-exists', 'You are already in that game');
            }
            return getDisplayName(context.auth.uid).then(displayName => gameWithThatId.add({
                id: context.auth.uid,
                name: displayName,
                readyToPlay: false,
                numOfDice: 5
            }));
        }).then(() => db.collection('available_games').doc(data.gameId).update({
            numberOfPlayers: admin.firestore.FieldValue.increment(1)
        }));
    });

exports.readyUp = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        const playerInGame = db.collection('available_games').doc(data.gameId).collection('players').where('id', '==', context.auth.uid);
        return playerInGame.get().then(result => {
            if (result.size > 1) {
                throw new functions.https.HttpsError('invalid-argument', 'You are in that game twice');
            } else if (result.size === 0) {
                throw new functions.https.HttpsError('not-found', 'You are not in that game');
            }
            return result.docs[0].ref.update({
                readyToPlay: true
            });
        });
    });

exports.startGame = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        const playersNotReady = db.collection('available_games').doc(data.gameId).collection('players').where('readyToPlay', '==', false);
        return playersNotReady.get().then(result => {
            if (result.size > 0) {
                throw new functions.https.HttpsError('invalid-argument', 'Not all players are ready to play');
            }
            return db.collection('available_games').doc(data.gameId).update({
                game_started: true,
                currentBid: {
                    quantity: 0,
                    value: 0
                },
                round: 1
            });
        }).then(() => db.collection('available_games').doc(data.gameId).collection('players').get()
            .then(
                result => result.docs.forEach((doc, index) => doc.ref.update({
                    playerNumber: index + 1
                }))
            ));
    });

const isHigherBid = (previousBid, currentBid) => {
    if (currentBid.value < 0 || currentBid.value > 6) {
        return false;
    }

    if (previousBid.value === 1) {
        if (currentBid.value === 1 && currentBid.quantity > previousBid.quantity) {
            return true;
        }
        if (currentBid.value !== 1 && currentBid.quantity > (previousBid.quantity * 2)) {
            return true;
        }
        return false;
    }

    if (currentBid.value === 1 && currentBid.quantity >= Math.ceil(previousBid.quantity / 2)) { return true; }

    if ((currentBid.quantity === previousBid.quantity && currentBid.value > previousBid.value) || (currentBid.quantity > previousBid.quantity)) {
        return true;
    }
    return false;
};

exports.submitGuess = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('available_games').doc(data.gameId).get().then(
            result => (result.data())
        )
            .then(
                gameObj => db.collection('available_games').doc(data.gameId).collection('players').where('id', '==', context.auth.uid)
                    .get()
                    .then(
                        result => {
                            if (result.size === 0) {
                                throw new functions.https.HttpsError('not-found', 'You are not in that game');
                            } else if (result.size > 1) {
                                throw new functions.https.HttpsError('invalid-argument', 'You are in that game twice');
                            }
                            if (gameObj.activePlayerNum !== result.docs[0].data().playerNumber) {
                                throw new functions.https.HttpsError('invalid-argument', 'It is not your go');
                            }
                        }
                    )
                    .then(() => {
                        const higherBid = isHigherBid(gameObj.currentBid, data.bid);
                        if (!higherBid) {
                            throw new functions.https.HttpsError('invalid-argument', `Your bid of ${data.bid} is less than ${gameObj.currentBid}`);
                        }
                    })
                    .then(() => db.collection('available_games').doc(data.gameId).update({
                        currentBid: {
                            quantity: data.bid.quantity,
                            value: data.bid.value,
                            playerNumber: gameObj.activePlayerNum
                        },
                        activePlayerNum: ((gameObj.activePlayerNum) % gameObj.numberOfPlayers) + 1
                    }))
            );
    });

exports.rollDice = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        return db.collection('available_games').doc(data.gameId).collection('players').where('id', '==', context.auth.uid)
            .get()
            .then(player => {
                if (player.size > 1) {
                    throw new functions.https.HttpsError('invalid-argument', 'You are in this game twice');
                } else if (player.size === 0) {
                    throw new functions.https.HttpsError('invalid-argument', 'You are not in this game');
                } else if (player.docs[0].data().rolled === true) {
                    throw new functions.https.HttpsError('invalid-argument', 'You have already rolled');
                } else {
                    player.docs[0].ref.update({
                        rolled: true
                    });
                    const numDice = player.docs[0].data().numOfDice;
                    const diceArray = [];
                    for (let i = 0; i < numDice; i++) {
                        diceArray.push(fp.random(1, 6));
                    }
                    return db.collection('available_games').doc(data.gameId).collection('diceRolled').where('userId', '==', context.auth.uid)
                        .get()
                        .then(
                            result => {
                                if (result.size > 1) {
                                    throw new functions.https.HttpsError('invalid-argument', 'You have multiple rolls for the same game');
                                } else if (result.size === 0) {
                                    db.collection('available_games').doc(data.gameId).collection('diceRolled').add({
                                        userId: context.auth.uid,
                                        currentRoll: diceArray
                                    });
                                } else if (result.docs[0].data().rolled === true) {
                                    throw new functions.https.HttpsError('invalid-argument', 'You have already rolled');
                                } else {
                                    result.docs[0].ref.update({
                                        currentRoll: diceArray
                                    });
                                }
                                if (result.size <= 1) {
                                    db.collection('available_games').doc(data.gameId).collection('allRolls').get()
                                        .then(query => {
                                            if (query.size > 1) {
                                                throw new functions.https.HttpsError('invalid-argument', 'Server Error. Should just be 1 set of rolls per game');
                                            } else if (query.size === 0) {
                                                db.collection('available_games').doc(data.gameId).collection('allRolls').add({
                                                    1: diceArray.filter(x => x === 1).length,
                                                    2: diceArray.filter(x => x === 2).length,
                                                    3: diceArray.filter(x => x === 3).length,
                                                    4: diceArray.filter(x => x === 4).length,
                                                    5: diceArray.filter(x => x === 5).length,
                                                    6: diceArray.filter(x => x === 6).length
                                                });
                                            } else {
                                                query.docs[0].ref.update({
                                                    1: admin.firestore.FieldValue.increment(diceArray.filter(x => x === 1).length),
                                                    2: admin.firestore.FieldValue.increment(diceArray.filter(x => x === 2).length),
                                                    3: admin.firestore.FieldValue.increment(diceArray.filter(x => x === 3).length),
                                                    4: admin.firestore.FieldValue.increment(diceArray.filter(x => x === 4).length),
                                                    5: admin.firestore.FieldValue.increment(diceArray.filter(x => x === 5).length),
                                                    6: admin.firestore.FieldValue.increment(diceArray.filter(x => x === 6).length)
                                                });
                                            }
                                        });
                                }
                            }
                        )
                        .then(() => diceArray);
                }
            });
    });

const correctCallOfNo = (bid, rolls) => {
    if (bid.value === 1) {
        if (bid.quantity > rolls[1]) {
            return true;
        }
        return false;
    }
    if (bid.quantity > (rolls[1] + rolls[bid.value])) {
        return true;
    }
    return false;
};

exports.callNo = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);


        const removeDiceFromPlayer = playerNumber => db.collection('available_games').doc(data.gameId).collection('players')
            .where('playerNumber', '==', playerNumber)
            .get()
            .then(
                playerWhoLost => {
                    if (playerWhoLost.size === 0) {
                        throw new functions.https.HttpsError('not-found', 'NOBODY LOST');
                    } else if (playerWhoLost.size > 1) {
                        throw new functions.https.HttpsError('invalid-argument', 'Too many people lost');
                    } else {
                        playerWhoLost.docs[0].ref.update({
                            numOfDice: admin.firestore.FieldValue.increment(-1)
                        });
                    }
                }
            )
            .then(
                () => {
                    // Reset game bid
                    db.collection('available_games').doc(data.gameId).update({
                        activePlayerNum: playerNumber,
                        currentBid: {
                            playerNumber: null,
                            quantity: 0,
                            value: 0
                        },
                        round: admin.firestore.FieldValue.increment(1)
                    });
                }
            );


        return db.collection('available_games').doc(data.gameId).get().then(
            result => result.data()
        )
            .then(
                currentGame => db.collection('available_games').doc(data.gameId).collection('allRolls').get()
                    .then(
                        allRolls => {
                            if (allRolls.size === 0) {
                                throw new functions.https.HttpsError('not-found', 'There are no rolls');
                            } else if (allRolls.size > 1) {
                                throw new functions.https.HttpsError('invalid-argument', 'Too many rolls');
                            } else {
                                const rolls = allRolls.docs[0].data();
                                if (correctCallOfNo(currentGame.currentBid, rolls)) {
                                    removeDiceFromPlayer(currentGame.currentBid.playerNumber);
                                } else {
                                    removeDiceFromPlayer(currentGame.activePlayerNum);
                                }
                            }
                        }
                    )
            );
    });

const correctCallOfExact = (bid, rolls) => {
    if (bid.value === 1) {
        if (bid.quantity === rolls[1]) {
            return true;
        }
        return false;
    }

    if (bid.quantity === (rolls[1] + rolls[bid.value])) {
        return true;
    }
    return false;
};

exports.callExact = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);


        const updateDiceForPlayer = (playerNumber, increment) => db.collection('available_games').doc(data.gameId).collection('players')
            .where('playerNumber', '==', playerNumber)
            .get()
            .then(
                playerWhoCalled => {
                    if (playerWhoCalled.size === 0) {
                        throw new functions.https.HttpsError('not-found', 'Nobody called');
                    } else if (playerWhoCalled.size > 1) {
                        throw new functions.https.HttpsError('invalid-argument', 'Too many people called');
                    } else if ((increment === 1 && playerWhoCalled.numOfDice < 5) || increment === -1) {
                        playerWhoCalled.docs[0].ref.update({
                            numOfDice: admin.firestore.FieldValue.increment(increment)
                        });
                    }
                }
            )
            .then(
                () => {
                    // Reset game bid
                    db.collection('available_games').doc(data.gameId).update({
                        activePlayerNum: playerNumber,
                        currentBid: {
                            playerNumber: null,
                            quantity: 0,
                            value: 0
                        },
                        round: admin.firestore.FieldValue.increment(1)
                    });
                }
            );


        return db.collection('available_games').doc(data.gameId).get().then(
            result => result.data()
        )
            .then(
                currentGame => db.collection('available_games').doc(data.gameId).collection('allRolls').get()
                    .then(
                        allRolls => {
                            if (allRolls.size === 0) {
                                throw new functions.https.HttpsError('not-found', 'There are no rolls');
                            } else if (allRolls.size > 1) {
                                throw new functions.https.HttpsError('invalid-argument', 'Too many rolls');
                            } else {
                                const rolls = allRolls.docs[0].data();
                                if (correctCallOfExact(currentGame.currentBid, rolls)) {
                                    updateDiceForPlayer(currentGame.currentBid.playerNumber, 1);
                                } else {
                                    updateDiceForPlayer(currentGame.currenBid.playerNumber, -1);
                                }
                            }
                        }
                    )
            );
    });


exports.resetGameState = functions.region('europe-west2').firestore
    .document('available_games/{id}')
    .onWrite((change, context) => {
        if (change.before.data() !== null && change.before.data().round < change.after.data().round) {
            // Resetting server roll
            db.collection('available_games').doc(context.params.id).collection('allRolls').get()
                .then(allRolls => {
                    if (allRolls.size === 0) {
                        throw new functions.https.HttpsError('not-found', 'There are no rolls');
                    } else if (allRolls.size > 1) {
                        throw new functions.https.HttpsError('invalid-argument', 'Too many rolls exist');
                    } else {
                        console.log('into the rolls');
                        allRolls.docs[0].ref.update({
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0
                        });
                    }
                });
            // Set all players rolled to false
            db.collection('available_games').doc(context.params.id).collection('players').get()
                .then(
                    players => players.docs.forEach(x => {
                        console.log('into the players');
                        x.ref.update({
                            rolled: false
                        });
                    })
                );
            // Reset all players rolls
            db.collection('available_games').doc(context.params.id).collection('diceRolled').get()
                .then(
                    diceRolled => diceRolled.docs.forEach(doc => {
                        console.log('into the players');
                        doc.ref.update({
                            currentRoll: []
                        });
                    })
                );
        }
        return Promise.resolve();
    });
