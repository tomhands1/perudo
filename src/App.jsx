import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import AuthenticatedRoute from './auth/routes/AuthenticatedRoute';
import UnauthenticatedRoute from './auth/routes/UnauthenticatedRoute';
import UnauthenticatedEmailRoute from './auth/routes/UnauthenticatedEmailRoute';
import Profile from './profile/Profile';
import VerifyEmail from './auth/VerifyEmail';
import PasswordReset from './auth/PasswordReset';
import defaultStyles from './App.module.scss';
import NewNavbar from './navbar/NewNavbar';
import CreateGame from './games/creategame/CreateGame';
import JoinGame from './games/joingame/JoinGame';
import Cards from './games/Cards';
import Perudo from './games/perudo/PerudoContainer';

const App = props => (
    props.auth && props.auth.isLoaded ? (
        <ConnectedRouter history={props.history}>
            <>
                <CssBaseline />
                <div className={props.styles.app}>
                    <NewNavbar />
                    <Toolbar />
                    <Container className={props.styles.appContainer}>
                        <Switch>
                            <UnauthenticatedRoute exact path="/" component={SignIn} redirect="/profile" />
                            <AuthenticatedRoute exact path="/profile" component={Profile} />
                            <AuthenticatedRoute exact path="/join-game" component={JoinGame} />
                            <AuthenticatedRoute exact path="/create-game" component={CreateGame} />
                            <AuthenticatedRoute exact path="/cards" component={Cards} />
                            <AuthenticatedRoute exact path="/perudo" component={Perudo} />
                            <AuthenticatedRoute exact path="/game/:gameId" component={Perudo} />
                            <UnauthenticatedRoute path="/sign-in" component={SignIn} redirect="/dashboard" />
                            <UnauthenticatedRoute path="/sign-up" component={SignUp} redirect="/dashboard" />
                            <UnauthenticatedEmailRoute path="/need-to-verify-email" component={VerifyEmail} redirect="/dashboard" />
                            <UnauthenticatedRoute path="/password-reset" component={PasswordReset} redirect="/dashboard" />
                            <Route render={() => <Redirect to="/" />} />
                        </Switch>
                    </Container>
                </div>
            </>
        </ConnectedRouter>
    ) : null
);

App.defaultProps = {
    auth: {
        isLoaded: false
    },
    history: {},
    styles: defaultStyles
};

App.propTypes = {
    auth: PropTypes.shape({
        isLoaded: PropTypes.bool
    }),
    history: PropTypes.shape({}),
    styles: PropTypes.objectOf(PropTypes.string)
};

const mapStateToProps = state => ({
    auth: state.firebase.auth
});

export default connect(mapStateToProps)(App);
