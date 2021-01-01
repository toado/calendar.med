import React, { Component } from "react";

import Button from '@material-ui/core/Button'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Link } from "react-router-dom";

import "./login.css"

const muiTheme = createMuiTheme({ 
    palette: { 
        primary: { main: "#eaf6fe" },  
    } 
})

export default class Login extends Component {
    render() {
        return(
            <div className="page">
                <div className="title-container">
                    <h1> calendar.med </h1>
                </div>

                <div className="container">
                    <div className="buttons">
                        <Link to={{ pathname:'/calendar', state: { loggedInAs: "admin" } }} style={{ textDecoration: 'none'}} >
                            <ThemeProvider theme={ muiTheme }>
                                    <Button color="primary"  variant="contained" style={{margin: "10px 10px"}}>
                                        Admin 
                                    </Button>
                                </ThemeProvider>
                        </Link>

                        <Link to={{ pathname: '/calendar', state: { loggedInAs: "vinshe" }}} style={{ textDecoration: 'none'}}>
                            <ThemeProvider theme={ muiTheme }>
                                <Button color="primary" variant="contained" style={{margin: "10px 10px"}}>
                                    Instructor/Student
                                </Button>
                            </ThemeProvider>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

