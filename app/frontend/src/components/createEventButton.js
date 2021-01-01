import React, { Component } from "react";

import Button from '@material-ui/core/Button'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const muiTheme = createMuiTheme({ 
    palette: { 
        primary: { main: "#eaf6fe" },  
    } 
})


// class CreateEvent extends Component {}
export default class CreateEventButton extends Component {
    constructor(props) {
        super(props)

        this.state = {
            windowWidth: window.innerWidth,
        }
    }

    //Updates width of window
    updateWidth() {
        this.setState({ windowWidth: window.innerWidth});
    }

    componentDidMount() {
        this.updateWidth();
        //Listener for window resize
        window.addEventListener("resize", this.updateWidth.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWidth.bind(this));
    }
    
    render() {
        if (this.state.windowWidth < 700) {
            return(
                <div>                
                    <ThemeProvider theme={ muiTheme }>
                        <Button color="primary" variant="contained" >
                            + E
                        </Button>
                    </ThemeProvider>
                </div>
            )
        } else if (this.state.windowWidth < 1200) {
            return(
                <div>                
                    <ThemeProvider theme={ muiTheme }>
                        <Button color="primary" variant="contained" >
                            + Event
                        </Button>
                    </ThemeProvider>
                </div>
            )
        } else {
            return(
                <div>                
                    <ThemeProvider theme={ muiTheme }>
                        <Button color="primary" variant="contained" >
                            Create An Event
                        </Button>
                    </ThemeProvider>
                </div>
            )
        }
    }
}