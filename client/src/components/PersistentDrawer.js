/// Tomorrow to do.
// Put request to update user articles when a reaction is submitted
// Put request to update reaction wantsdiscussions to false when a discussion is created
// Get current discussion based on userId and Article
// Chat
// Reaction Submit (if user has already reacted disable reaction form) 
// (show comments/context)
// hide title until reacted show title author website after reacted

// Clean up code / styling
// Previous Articles List and update components on selection
// server scheduler for scrape (or manual scrape route)
// deploy


import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CallMade from '@material-ui/icons/CallMade'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LogoutIcon from '@material-ui/icons/RemoveCircleOutline';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import QuestionAnswer from '@material-ui/icons/QuestionAnswer';


import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import Reactions from "./Reactions.jsx";
import Article from "./Article.jsx";
import "./drawer.css";
import SignIn from "../pages/SignIn.js";

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';

// import Input from "../components/Input.js";

const drawerWidth = 300;



const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appFrame: {
        height: "100vh",
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },

    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    'content-left': {
        marginLeft: -drawerWidth,
    },
    'content-right': {
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
    },
    'contentShift-right': {
        marginRight: 0,
    },
});

class PersistentDrawer extends React.Component {
    constructor(props) {
        super(props);



        fetch('/api/currentarticle')
            .then(response => response.json())
            .then(myJson => {
                this.setState({ currentArticleId: myJson._id });
                console.log("currentArticleId", myJson._id);
            })
            .catch(err => console.log(err))


        this.state = {
            open: false,
            left: false,
            anchor: 'right',

            article_id: [],
            articleText: "",

            currentArticleId: "",

            regusername: "",
            logusername: "",
            regpssw: "",
            logpssw: "",
            conpssw: "",
            email: "",

            user: {},
            loggedIn: false,

            message: "",
            wantsDiscussion: true,
            reactionLine: "",
            reacted: false,
            messagesArray: [],

            forceUpdate: "value",

            chatCreated: false,
            chat: "",

            discussionId: "",

            error: "",


        };
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////


    componentDidMount() {

        Promise.all([
            fetch('/api/currentarticle').then(response => response.json()),
            fetch('/api/user').then(response => response.json())
        ]).then(data => {
            if (data[1].user) {
                this.setState({
                    user: data[1].user,
                    loggedIn: true,
                    currentArticleId: data[0]._id,
                })
            }
            console.log("user", this.state.user)
        })
    }



    handleLogout = () => {

        fetch('/api/logout', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            this.setState({ "user": null, "loggedIn": false });
        }).catch((error) => {
            this.setState({ "user": null, "loggedIn": false });
        });

    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleToggle = name => event => {
        this.setState({ [name]: event.target.checked });
    };


    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleUser = (userData) => {
        this.setState({ "user": userData, "loggedIn": true });
    }

    handleReaction = (event) => {

        event.preventDefault();

        console.log(this.state.user._id)
        console.log(this.state.currentArticleId)

        let articlesData = {
            _id: this.state.user._id,
            articles: this.state.currentArticleId
        };

        console.log(articlesData);

        fetch('/api/users/' + this.state.user._id, {
            method: 'Put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(articlesData)
        }).then((response) => {
            return response.json();
        }).then((myJSON) => {
            console.log(myJSON);
            if (myJSON) {

                this.setState(
                    {
                        // user: [...this.state.messagesArray, myJSON.messages[myJSON.messages.length - 1]]
                        forceUpdate: Math.random(),
                        reacted: true,
                    }
                );
            } else {
                this.setState(
                    {
                        message: "error"
                    }
                );
            }
        }).catch((reason) => {
            this.setState({ "error": "Username or password incorrect!" });
        });


        let reactionData = {
            _userId: this.state.user._id,
            _articleId: this.state.currentArticleId,
            wants_discussion: this.state.wantsDiscussion,
            initial_opinion: this.state.reactionLine
        };

        console.log(reactionData);

        fetch('/api/reactions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reactionData)
        }).then((response) => {
            return response.json();
        }).then((myJSON) => {
            console.log(myJSON);
            if (myJSON) {

                this.setState(
                    {
                        // user: [...this.state.messagesArray, myJSON.messages[myJSON.messages.length - 1]]
                    }
                );
            } else {
                this.setState(
                    {
                        // message: "error"
                    }
                );
            }
        }).catch((reason) => {
            this.setState({ "error": "Username or password incorrect!" });
        });

        
    }

    handleCreateChat = (value) => {
        // this.setState({ "user": userData, "loggedIn": true });
        console.log("value", value);

        if(value){
            // console.log(this.state.user._id)

        let formData = {
            _articleId: this.state.currentArticleId,
            user_one: this.state.user._id,
            user_two: value, 
        };

        console.log(formData);

        fetch('/api/discussion', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then((response) => {
            return response.json();
        }).then((myJSON) => {
            console.log("discussion response",myJSON);
            if (myJSON) {

                this.setState(
                    {
                        chatCreated: true,
                        discussionId: myJSON._id
                    }
                );

            } else {

            }
        }).catch((reason) => {
            this.setState({ "error": "Username or password incorrect!" });
        });
    }
    else {
        console.log("didn't work")
    }
        
    }


    handleMessage = event => {

        event.preventDefault();

            console.log(this.state.user._id)
            // console.log(event)

            // console.log(this.state)
            let formData = {
                _id: this.state.discussionId,
                messages: this.state.message
            };

            console.log(formData);

            fetch('/api/discussion/' + this.state.discussionId, {
                method: 'Put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            }).then((response) => {
                return response.json();
            }).then((myJSON) => {
                console.log(myJSON);
                if (myJSON) {

                    this.setState(
                        {
                            message: "",
                            messagesArray: [...this.state.messagesArray, myJSON.messages[myJSON.messages.length-1]] 
                        }
                    );
                    console.log(this.state.messagesArray)
                } else {
                    this.setState(
                        {
                            message: "error"
                        }
                    );
                }
            }).catch((reason) => {
                this.setState({ "error": "Username or password incorrect!" });
            });
        
    }



////Drawer Methods/////////////////////////////////////////////////////////////////////////////////////


    handleDrawerOpen = () => {
        if (!this.state.open) {
            this.setState({ open: true });
        }
        else {
            this.setState({ open: false });
        }
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    toggleDrawer = () => () => {
        if (!this.state.left) {
            this.setState({ left: true });
        }
        else {
            this.setState({ left: false });
        }
    };

/////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {

        const { classes } = this.props;
        const { anchor, open, currentArticleId} = this.state;

        const drawer = (
            <Drawer
                variant="persistent"
                anchor={anchor}
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.handleDrawerClose}>
                        <CallMade />
                    </IconButton>
                </div>
                <Divider />


                {/* Chat Message Div */}
                <div id={"container"} style={{height: "80%"}}>

                

                    {/* {this.messagesArray.map((message) => {<ListItem>{message}</ListItem>})} */}


                    {this.state.messagesArray.map((value,index) => (
                        <ListItem
                            key={index}
                            role={undefined}
                            // dense
                            button
                        >

                            <ListItemText primary={`${value}`} /></ListItem>
                    ))}


                </div>
                
                <Divider />


                    <div>
                    {/* Chat send message */}
                        
                    <form className={classes.form} onSubmit={this.handleMessage}>
                          

                            <FormControl margin="normal" required fullWidth>
                            <TextField
                                id="multiline-flexible"
                                label="Message"
                                multiline
                                rowsMax="4"
                                value={this.state.message}
                                onChange={this.handleChange('message')}
                                // className={classes.textField}
                                margin="normal"
                            />
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                color="primary"
                                label="submit"
                                className={classes.submit}
                                
                            >
                                Send Message
                               
                        </Button>
                        </form>



                    </div>

            </Drawer>
        );


        const home = (
            <div className={classes.root}>

                <div className={classes.appFrame}>

                    <Drawer open={this.state.left} onClose={this.toggleDrawer()}>
                       

            {/* Logout Button */}
                        <ListItem button onClick={this.handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </ListItem>
                        
            {/* All mail button to test sending a message */}
                        {/* <ListItem button onClick={this.handleMessage}>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary="All mail" />
                        </ListItem> */}

                    
            {/* Map of past articles should go here */}

                    

                    </Drawer>

                    <main
                        className={classNames(classes.content, classes[`content-${anchor}`], {
                            [classes.contentShift]: open,
                            [classes[`contentShift-${anchor}`]]: open,
                        })}
                    >

                        <QuestionAnswer style={{ position: "absolute", top: "50px", right: "20px" }} onClick={this.handleDrawerOpen} />
                        <MenuIcon style={{ position: "absolute", top: "50px", left: "20px" }} onClick={this.toggleDrawer()} />
                        <div id="scrollDiv" style={{width: "100%", height: "100%", overflow: "scroll"}}>
                        

            {/* The article */}
                            <Article article={currentArticleId}/>

            {/* Reactions */}
                            {this.state.reacted ? <Reactions key={this.state.forceUpdate} handleUser={this.handleCreateChat} articleId={currentArticleId} /> : ""}
                            
                            
            {/* Post a reaction form */}
                            <form
                             className={classes.form}
                             onSubmit={this.handleReaction}
                              style={{maxWidth: 800, marginRight: "auto",marginLeft: "auto" }}>


                                <FormControl margin="normal" required fullWidth>
                                    <TextField
                                        id="multiline-flexible"
                                        label="Reaction"
                                        multiline
                                        rowsMax="4"
                                        value={this.state.reactionLine}
                                        onChange={this.handleChange('reactionLine')}
                                        // className={classes.textField}
                                        margin="normal"
                                    />
                                </FormControl>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.wantsDiscussion}
                                            onChange={this.handleToggle('wantsDiscussion')}
                                            value="wantsDiscussion"
                                            color="primary"
                                        />
                                    }
                                    label="Open for discussion?"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Post Reaction
                                </Button>
                            </form>
                            {/* {this.props.children} */}

                        </div>
                    </main>
               
    
                    {drawer}
                </div>
            </div>
        );


        // Sign In conditional
        if (!this.state.loggedIn) {
            return <SignIn handleUser={this.handleUser} />;
        } else {
            return home;
        }
    }         
}

PersistentDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);