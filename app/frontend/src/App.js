import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import history from './history';

import EventCreate from "./pages/eventcreate.js";
import GroupCreate from "./pages/groupcreate.js";

import MainPage from "./pages/index.js"
import SearchListing from "./pages/searchListing.js"
import Login from "./pages/login.js"

class App extends Component {
    constructor(props) {
        super(props)
        
        this.state = { 
            eventsChanged: false,
            loading: true,
        }

        // Bind -> keeps 'this' in the scope of app
        this.changeEvents = this.changeEvents.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
    }

    changeEvents = () => {
        this.setState({
            eventsChanged: true,
        })
    }

    toggleLoading = () => {
        this.setState({
            loading: true,
        })
    }

    render() {
        // On refresh and not homepage, redirect to homepage
        if(sessionStorage.reload && history.location.pathname!=='/') {
            sessionStorage.reload = "";
            history.push('/');
        } 
        return (
            <Router history={ history }>
                <Switch>
                    <Route exact path="/" component={ (props) => <Login {...props} />} />

                    <Route path="/calendar" component={ (props) => <MainPage {...props} />} />

                    <Route
                        path="/eventcreate"
                        render={ (props) => <EventCreate {...props} 
                                                onPost={this.changeEvents} 
                                                loading={this.state.toggleLoading} />} />
                                                
                    <Route path="/search" component={ (props) => <SearchListing {...props} />}/>
                    
                    <Route
                        path="/groupcreate"
                        render={ (props) => <GroupCreate {...props} 
                                                onPost={this.changeEvents} 
                                                loading={this.state.toggleLoading} />  
                                }
                        />
                    <Route path="/search" render={ (props) => <SearchListing {...props}/>}/>
                </Switch>
            </Router>
        );
    }
}

export default App;

