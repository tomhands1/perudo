const admin = require('firebase-admin');
const functions = require('firebase-functions');
const common = require('./common');

const db = admin.firestore();

exports.createGame = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        const gameWithThatName = db
            .collection('games')
            .where('name', '==', data.name);

        const getDisplayName = id => db
            .collection('users')
            .doc(id)
            .get()
            .then(
                user => user.data().displayName
            );

        return getDisplayName(context.auth.uid)
            .then(
                displayName => gameWithThatName
                    .get()
                    .then(
                        doc => {
                            if (doc.empty) {
                                return db
                                    .collection('games')
                                    .add({
                                        name: data.name,
                                        creator: {
                                            id: context.auth.uid,
                                            name: displayName
                                        },
                                        gameStarted: false,
                                        activePlayerNum: 1,
                                        numberOfPlayers: 1
                                    }).then(result => {
                                        db.collection('games')
                                            .doc(result.id)
                                            .collection('players')
                                            .add({
                                                id: context.auth.uid,
                                                name: displayName,
                                                readyToPlay: false,
                                                numOfDice: 5
                                            });
                                        return db
                                            .collection('games')
                                            .doc(result.id)
                                            .get()
                                            .then(
                                                docs => ({ ...docs.data(), id: docs.id })
                                            );
                                    });
                            }
                            throw new functions.https.HttpsError('already-exists', 'A game with that name already exists');
                        }
                    )
            );
    });


exports.joinGame = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        const playerInGame = db
            .collection('games')
            .doc(data.gameId)
            .collection('players')
            .where('id', '==', context.auth.uid);

        const gameWithThatId = db
            .collection('games')
            .doc(data.gameId)
            .collection('players');

        const getDisplayName = id => db
            .collection('users')
            .doc(id)
            .get()
            .then(
                user => user.data().displayName
            );

        return playerInGame
            .get()
            .then(
                result => {
                    if (result.size > 0) {
                        throw new functions.https.HttpsError('already-exists', 'You are already in that game');
                    }
                    return getDisplayName(context.auth.uid)
                        .then(
                            displayName => gameWithThatId
                                .add({
                                    id: context.auth.uid,
                                    name: displayName,
                                    readyToPlay: false,
                                    numOfDice: 5
                                })
                        );
                }
            ).then(
                () => db.collection('games')
                    .doc(data.gameId)
                    .update({
                        numberOfPlayers: admin.firestore.FieldValue.increment(1)
                    })
            );
    });

exports.readyUp = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        const playerInGame = db
            .collection('games')
            .doc(data.gameId)
            .collection('players')
            .where('id', '==', context.auth.uid);

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

const getOrderOfPlay = numberOfPlayers => Array.from(Array(numberOfPlayers).keys()).map(x => x + 1);

exports.startGame = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        const playersNotReady = db
            .collection('games')
            .doc(data.gameId)
            .collection('players')
            .where('readyToPlay', '==', false);

        return playersNotReady
            .get()
            .then(
                result => {
                    if (result.size > 0) {
                        throw new functions.https.HttpsError('invalid-argument', 'Not all players are ready to play');
                    }
                    return db.collection('games').doc(data.gameId).get().then(game => game.ref.update({
                        gameStarted: true,
                        currentBid: {
                            quantity: 0,
                            value: 0
                        },
                        round: 1,
                        orderOfPlay: getOrderOfPlay(game.data().numberOfPlayers)
                    }));
                }
            ).then(() => db
                .collection('games')
                .doc(data.gameId)
                .collection('players')
                .get()
                .then(
                    result => result
                        .docs
                        .forEach(
                            (doc, index) => doc.ref.update({
                                playerNumber: index + 1
                            })
                        )
                ));
    });

exports.quitGame = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db
            .collection('games')
            .doc(data.gameId)
            .get()
            .then(
                game => {
                    if (game.data().numberOfPlayers <= 1) {
                        return db
                            .collection('games')
                            .doc(data.gameId)
                            .collection('allRolls')
                            .get()
                            .then(allRolls => allRolls.docs.forEach(x => x.ref.delete()))
                            .then(() => game.ref.delete());
                    }
                    if (!game.data().gameStarted) {
                        if (game.data().creator.id === context.auth.uid) {
                            db.collection('games').doc(data.gameId).collection('players')
                                .get()
                                .then(
                                    result => {
                                        const newDocs = result.docs.filter(x => x.data().id !== context.auth.uid);

                                        const newGameOwner = newDocs[0].data();
                                        db.collection('games').doc(data.gameId).update({
                                            creator: {
                                                id: newGameOwner.id,
                                                name: newGameOwner.name
                                            }
                                        });
                                    }
                                );
                        }
                        return game.ref.update({
                            numberOfPlayers: admin.firestore.FieldValue.increment(-1)
                        });
                    }
                    return db
                        .collection('games')
                        .doc(data.gameId)
                        .collection('players')
                        .where('id', '==', context.auth.uid)
                        .get()
                        .then(
                            player => {
                                if (player.size < 1) {
                                    throw new functions.https.HttpsError('not-found', 'You are not in the game');
                                }
                                if (player.size > 1) {
                                    throw new functions.https.HttpsError('invalid-argument', 'You are in the game multiple times');
                                }
                                const { playerNumber } = player.docs[0].data();
                                return game.ref.update({
                                    round: admin.firestore.FieldValue.increment(1),
                                    numberOfPlayers: admin.firestore.FieldValue.increment(-1),
                                    orderOfPlay: admin.firestore.FieldValue.arrayRemove(playerNumber)
                                });
                            }
                        );
                }
            )
            .then(() => db
                .collection('games')
                .doc(data.gameId)
                .collection('diceRolled')
                .where('userId', '==', context.auth.uid)
                .get()
                .then(
                    query => query.docs.forEach(x => x.ref.delete())
                ))
            .then(() => db
                .collection('games')
                .doc(data.gameId)
                .collection('players')
                .where('id', '==', context.auth.uid)
                .get()
                .then(
                    query => query.docs.forEach(x => x.ref.delete())
                ));
    });
