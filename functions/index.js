const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

exports.auth = require('./src/auth');
exports.games = require('./src/games');
exports.perudo = require('./src/perudo');
