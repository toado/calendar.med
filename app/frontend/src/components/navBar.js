import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import Button from '@material-ui/core/Button'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import "./navBar.css"

const muiTheme = createMuiTheme({ 
    palette: { 
        primary: { main: "#eaf6fe !important", contrastText: "#000 !important" },  
    } 
})

export default class NavigationBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            search_content: "",
            on_enter: false,
        }
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            this.setState({
                search_content: e.target.value,
                on_enter: true,
                did_search: true,
            })

            if (this.props.loggedInAs) {
                this.setState({
                    loggedInAs: this.props.loggedInAs
                })
            }
            this.props.onSearch(this.state.search_content)
        }
    }

    // Get change of input in the "search" box
    handleChange = event => {
        this.setState({ 
            [event.target.name]: event.target.value,
        })
    };

    render(){
        return(
            <div className="topnav">

                {/* On key "enter", redirect users to /search */}
                { this.state.on_enter 
                    ? <Redirect to={{
                                pathname: "/search",
                                state: { search_content: this.state.search_content, loggedInAs: this.state.loggedInAs }
                            }}
                        />
                    : null }

                {/* Return users back to home page on logo click */}
                <Link to="/calendar">
                    <button className="logo">
                         <h1>calendar.med</h1>
                    </button>
                </Link>

                <input 
                    type="text" 
                    placeholder="Search..." 
                    name="search_content"
                    onChange={this.handleChange} 
                    onKeyDown={this.handleKeyDown}/>
                <span style={{fontWeight:"600"}}>{this.props.loggedInAs}</span>
                <div className="logout-button-container">
                    <ThemeProvider theme={muiTheme}>
                        <Button color="primary" variant="contained" onClick={() => {window.sessionStorage.clear()}} href="/" >
                            Logout
                        </Button>
                    </ThemeProvider>   
                </div>

                {/* <a className="active" href="/" onClick={() => {window.sessionStorage.clear()}}>Signout</a> */}
            </div>
        );
    }
}
