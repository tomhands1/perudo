const admin = require('firebase-admin');
const functions = require('firebase-functions');
const common = require('./common');

const db = admin.firestore();
const config = functions.config();

exports.userSignUp = functions
    .region('europe-west2')
    .auth.user()
    .onCreate(user => {
        const userObject = {
            displayName: user.displayName,
            email: user.email
        };
        // If Facebook provider, assume the email is verified
        return db.doc(`users/${user.uid}`).set(userObject).then(() => {
            if (user.email === config.admin.email) {
                return admin.auth().setCustomUserClaims(user.uid, {
                    admin: true
                });
            }
            return false;
        }).then(() => {
            if (user.providerData.length && user.providerData[0].providerId === 'facebook.com') {
                admin.auth().updateUser(user.uid, {
                    emailVerified: true
                });
            }
        });
    });

exports.updateDisplayName = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('users').doc(context.auth.uid).update({
            displayName: data.displayName
        });
    });

exports.getUserProfile = functions
    .region('europe-west2')
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db
            .collection('users').doc(context.auth.uid).get()
            .then(user => ({ data: user.data(), id: user.id }));
    });
