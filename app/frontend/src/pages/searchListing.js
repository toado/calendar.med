import React, { Component } from "react";
import axios from "axios";
import moment from "moment"

import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import NavigationBar from "../components/navBar.js";
import "./searchListing.css"

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#424242",
        color: theme.palette.common.white,
        fontWeight: "bold",
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
  });

export default class SearchListing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search_query: "",
            did_search: false,
            search_results: [],
        };

        this.onSearch = this.onSearch.bind(this);
    }

    onSearch = (query) => {
        this.setState({
            did_search: true,
            search_query: query
        })
    }

    // Formatting on query results
    convertDate = (date, time) => {
        var dateTimeList = (date + " " + time).split(/[\s-:]+/)
        var eventDate = new Date(dateTimeList[0], dateTimeList[1]-1, dateTimeList[2],
                                dateTimeList[3], dateTimeList[4], dateTimeList[5])
        return eventDate
    }

    // Formatting on query results
    formatEvents = (events) => {
        for (let i = 0; i < events.length; i++) {
            events[i].start = this.convertDate(events[i].event_date, events[i].start_time)
            events[i].end = this.convertDate(events[i].event_date, events[i].end_time)
            events[i].title = `${events[i].event_type}: ${events[i].event_title}`
        }
        return events
    }

    // Formatting for table display
    formatDateTime(eventDate, startDate, endDate) {
        startDate = moment(eventDate+" "+startDate, "YYYY-MM-DD hh:mm:ss")
        endDate = moment(eventDate+" "+endDate, "YYYY-MM-DD hh:mm:ss")
        
        var ampm = (startDate.format("a") !== endDate.format("a"))
        endDate = endDate.format("h:mm A")

        var startDateFormat = moment()
        startDateFormat = startDate.format("dddd, MMMM D, YYYY  \u2022  h:mm " + (ampm ? "A" : ""))

        return startDateFormat + " - " + endDate
    }

    getSearchResults() {
        let query = ""
        if (this.state.search_query) { 
            query = this.state.search_query 
        }
        else { 
            query = this.props.location.state.search_content 
        }

        // Get current login (student/instructor or Admin)
        if (this.props.location.state.loggedInAs) {
            this.setState({
                loggedInAs: this.props.location.state.loggedInAs
            }, () => {
                
                 // Student search query
                if (this.state.loggedInAs === "vinshe") {
                    axios.get(`${process.env.REACT_APP_HOST}events?search=${query}&participant=${this.state.loggedInAs}`)
                    .then(response => {
                        this.setState({
                            search_query_results: this.formatEvents(response.data),
                        })            
                        const search_results = []
                        this.state.search_query_results.forEach(result => {
                            search_results.push(
                                <StyledTableRow key={result.event_id}>
                                    <StyledTableCell scope="row" component="th"> {result.event_title} </StyledTableCell>    
                                    <StyledTableCell> {result.event_type} </StyledTableCell>  
                                    <StyledTableCell> {this.formatDateTime(result.event_date, result.start_time, result.end_time)} </StyledTableCell>  
                                </StyledTableRow>
                            )
                        })
            
                        this.setState({
                            search_results: search_results
                        })
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                }

                // Admin search query
                else {
                    axios.get(`${process.env.REACT_APP_HOST}events?search=${query}`)
                    .then(response => {
                        this.setState({
                            search_query_results: this.formatEvents(response.data),
                        })            
                        const search_results = []
                        this.state.search_query_results.forEach(result => {
                            search_results.push(
                                <StyledTableRow key={result.event_id}>
                                    <StyledTableCell scope="row" component="th"> {result.event_title} </StyledTableCell>    
                                    <StyledTableCell> {result.event_type} </StyledTableCell>  
                                    <StyledTableCell> {this.formatDateTime(result.event_date, result.start_time, result.end_time)} </StyledTableCell>  
                                </StyledTableRow>
                            )
                        })
                        this.setState({
                            search_results: search_results
                        })
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                }
            })
        }
        else if (window.sessionStorage.getItem("loggedInAs")) {
            this.setState({
                loggedInAs: window.sessionStorage.getItem("loggedInAs")
            }, () => {
                
                 // Student search query
                if (this.state.loggedInAs === "vinshe") {
                    axios.get(`${process.env.REACT_APP_HOST}events?search=${query}&participant=${this.state.loggedInAs}`)
                    .then(response => {
                        this.setState({
                            search_query_results: this.formatEvents(response.data),
                        })            
                        const search_results = []
                        this.state.search_query_results.forEach(result => {
                            search_results.push(
                                <StyledTableRow key={result.event_id}>
                                    <StyledTableCell scope="row" component="th"> {result.event_title} </StyledTableCell>    
                                    <StyledTableCell> {result.event_type} </StyledTableCell>  
                                    <StyledTableCell> {this.formatDateTime(result.event_date, result.start_time, result.end_time)} </StyledTableCell>  
                                </StyledTableRow>
                            )
                        })
            
                        this.setState({
                            search_results: search_results
                        })
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                }

                // Admin search query
                else {
                    axios.get(`${process.env.REACT_APP_HOST}events?search=${query}`)
                    .then(response => {
                        this.setState({
                            search_query_results: this.formatEvents(response.data),
                        })            
                        const search_results = []
                        this.state.search_query_results.forEach(result => {
                            search_results.push(
                                <StyledTableRow key={result.event_id}>
                                    <StyledTableCell scope="row" component="th"> {result.event_title} </StyledTableCell>    
                                    <StyledTableCell> {result.event_type} </StyledTableCell>  
                                    <StyledTableCell> {this.formatDateTime(result.event_date, result.start_time, result.end_time)} </StyledTableCell>  
                                </StyledTableRow>
                            )
                        })
                        this.setState({
                            search_results: search_results
                        })
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                }
            })
        }
        
    }

    componentDidUpdate() {
        if (this.state.did_search) {
            this.setState({ did_search: false, })
            this.getSearchResults();
        }
    }

    componentDidMount(props) {
        this.getSearchResults();
    }

    render() {
        return(
            <div className="search-page">
                <div className="search-navbar">
                    <NavigationBar onSearch={this.onSearch}/>
                </div>

                {/* Display list / No result found, depending on return of search query */}
                {
                    this.state.search_results.length
                    ? 
                    ( <div className="search-container">
                            <TableContainer component={Paper}>
                                <Table className={useStyles.table} aria-label="Searched Events Table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Event Title</StyledTableCell>
                                            <StyledTableCell>Event Type</StyledTableCell>
                                            <StyledTableCell>Start & End Date</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.search_results}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div> )
                    :
                    ( <div className="no-search-results">
                            <h2>No results found</h2>
                        </div> )
                }
            </div>
        )
    }
}

