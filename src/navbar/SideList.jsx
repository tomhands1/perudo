import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dice from '@material-ui/icons/Casino';
import Create from '@material-ui/icons/AddCircle';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

const sidebarLinks = [
    {
        title: 'Join Game',
        redirect: '/join-game',
        component: <Dice />
    },
    {
        title: 'Create Game',
        redirect: '/create-game',
        component: <Create />
    }
];

const SideList = props => (
    <div
        role="presentation"
        onClick={props.closeNavbar}
        onKeyDown={props.closeNavbar}
    >
        <List>
            {sidebarLinks.map(item => (
                <ListItem button key={item.title} onClick={() => props.redirect(item.redirect)}>
                    <ListItemIcon>{item.component}</ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItem>
            ))}
        </List>
        <Divider />
    </div>
);

SideList.defaultProps = {
    closeNavbar: fp.noop,
    redirect: fp.noop
};

SideList.propTypes = {
    closeNavbar: PropTypes.func,
    redirect: PropTypes.func
};


export default SideList;
