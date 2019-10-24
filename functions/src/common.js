const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fp = require('lodash/fp');

module.exports.isAuthenticated = context => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to call this function');
    }
};

module.exports.isAdmin = uid => admin.auth().getUser(uid).then(user => {
    if (!fp.getOr(false, 'customClaims.admin')(user)) {
        throw new functions.https.HttpsError('unauthenticated', 'You are not authorized to perform this operation');
    }
});

// https://firebase.google.com/docs/reference/functions/functions.https.HttpsError
