import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
// import history from './history';
import { css } from "@emotion/react";
import SyncLoader from "react-spinners/SyncLoader";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";

import "../App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import CreateEventButton from "../components/createEventButton.js";
import CreateGroupButton from "../components/createGroupButton.js";
import Filtering from "../components/filtering.js";
import Modal from "../components/modal.js";
import NavigationBar from "../components/navBar.js";

// import EventCreate from "./pages/eventcreate.js";

const localizer = momentLocalizer(moment);
const today = new Date();
const override = css`
  position: relative;
  display: block;
  margin: 25% auto;
  top: 50%;
  left: 50%;
  transform: "translate(-50%, -50%)";
`;

export default class MainPage extends Component {    
    constructor(props) {
        super(props)
        
        this.state = { 
            selectedEvent: {},
            selectedEventGroups: {},
            selectedEventTags: {},
            show: false,
            cal_events: [],
            eventsChanged: false,
            event_types: {},
            is_filtered: false,
            event_type_query: '',
            loading: true,
            is_searched: false,
            show_search_list: false,
            search_query: '',
            search_query_results: [],
            tags: []

        }

        this.changeEvents = this.changeEvents.bind(this);
        this.isFiltered = this.isFiltered.bind(this);
        this.handleEventTypeQueryChange = this.handleEventTypeQueryChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSelectEvent = this.handleSelectEvent.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.getAllTags()
    }

    changeEvents = () => {
        this.setState({
            eventsChanged: true,
        })
    }

    getAllTags = async() => {
        const response = await axios.get(process.env.REACT_APP_HOST + 'events/tags/')
        const data = response.data
        this.setState({
            tags: data
        })
    }

    isFiltered = () => {
        this.setState({
            is_filtered: false,
        })
    }

    toggleLoading = () => {
        this.setState({
            loading: true,
        })
    }

    handleEventTypeQueryChange = (query) => {
        this.setState({
            is_filtered: true,
            event_type_query: query
        })
    }

    closeModal = () => {
        this.setState({
            show: false,
            newSelectedEvent: false
        })
    }

    refreshModal = () => {
        this.setState({
            show: false,
        }, () => {
            this.setState({
                show: true
            })
        })
    }

    onAddGroup = (group) => {
        if (group === false) {
            axios.get(process.env.REACT_APP_HOST + `events/${this.state.selectedEvent.event_id}/groups/`)
            .then(response => {
                this.setState({
                    selectedEventGroups: response.data,
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        } else {
            this.setState({
                selectedEventGroups: [...this.state.selectedEventGroups, group]
            })
        }
    }

    onSearch = (event) => {
        return null;
    }

    onDeleteGroup = (group) => {
        var groups = [...this.state.selectedEventGroups]
        var index = groups.indexOf(group)
        groups.splice(index, 1)
        this.setState({
            selectedEventGroups: groups
        }, () => {
        })
    }

    handleSelectEvent = async(event) => {
        event.start = this.convertDate(event.event_date, event.start_time)
        event.end = this.convertDate(event.event_date, event.end_time)
        event.title = `${event.event_type}: ${event.event_title}`
        const response = await axios.get(`${process.env.REACT_APP_HOST}events/${event.event_id}/tags/`)
        const data = response.data
        this.setState({
            selectedEventTags: data
        }, () => {
            if (this.state.loggedInAs === "vinshe") {
                axios.get(process.env.REACT_APP_HOST + `events/${event.event_id}/groups/?participant=${this.state.loggedInAs}`)
                .then(response => {
                    this.setState({
                        selectedEventGroups: response.data[0],
                        selectedEvent: event
                    })
                    this.refreshModal()
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            else {
                axios.get(process.env.REACT_APP_HOST + `events/${event.event_id}/groups/`)
                .then(response => {
                    this.setState({
                        selectedEventGroups: response.data,
                        selectedEvent: event
                    })
                    this.refreshModal()
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        })
    };

    eventColorSetter = function(event) {
        var backgroundColor = '#3174ad';
        var backgroundColors = ["#f07070","#97cef1","#b1e7b3","#f9d39b","#f1a4bd","#f9f1a8",
                                "#d4a0dd","#32e7d6","#8798f4","#f3b7ad","#a884ff","#d7e1ee","#b5b5b5"];
        var event_types = [ "Exam","Whole Class","Self Directed Learning","Labs","Clinical Skills",
                            "Clinical Shadowing","Learning Communities","Discovery Learning","Team Based Learning",
                            "Special Events","Small Group","Career Planning","OSCE"]
        var color = 'black';
        var visibility = 'visible'

        for (let i=0; i < event_types.length-1; i++) {
            if (event.event_type === event_types[i]) {
                backgroundColor = backgroundColors[i]
                break
            }
        }

        if (event.deleted) {
            visibility = "collapse"
        }

        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '5px',
            opacity: 1,
            color: color,
            border: '1px solid black',
            display: 'block',
            visibility: visibility,
        };
        return {
            style: style
        };
    }

    convertDate = (date, time) => {
        var dateTimeList = (date + " " + time).split(/[\s-:]+/)
        var eventDate = new Date(dateTimeList[0], dateTimeList[1]-1, dateTimeList[2],
                                dateTimeList[3], dateTimeList[4], dateTimeList[5])
        return eventDate
    }

    formatEvents = (events) => {
        for (let i = 0; i < events.length; i++) {
            events[i].start = this.convertDate(events[i].event_date, events[i].start_time)
            events[i].end = this.convertDate(events[i].event_date, events[i].end_time)
            events[i].title = `${events[i].event_type}: ${events[i].event_title}`

            // Get all event_types into a dict
            if (!([events[i].event_type] in this.state.event_types)) {
                this.setState({
                    ...this.state,
                    event_types: {  ...this.state.event_types, [events[i].event_type]:true, }
                })
            }
        }
        return events
    }

    async componentDidMount(props) {
        if (window.sessionStorage.getItem("loggedInAs") || (this.props.location.state && this.props.location.state.loggedInAs)) {
            let sessionKey = window.sessionStorage.getItem("loggedInAs") || this.props.location.state.loggedInAs;

            // Student -- vinshe
            if (sessionKey === "vinshe") {
                await axios.get(`${process.env.REACT_APP_HOST}events/?participant=${sessionKey}&event_type=`)
                .then(response => {
                    this.toggleLoading();
                    this.setState({
                        cal_events: this.formatEvents(response.data),
                        loading: false,
                        loggedInAs: sessionKey
                    })
                    window.sessionStorage.setItem("loggedInAs", sessionKey);
                })
                .catch(function (error) {
                    console.log(error);
                });
                window.sessionStorage.reload = true;
            }
            
            // Admin
            else {
                axios.get(`${process.env.REACT_APP_HOST}events/`)
                .then(response => {
                    this.toggleLoading();
                    this.setState({
                        cal_events: this.formatEvents(response.data),
                        loading: false,
                        loggedInAs: sessionKey
                    })
                    window.sessionStorage.setItem("loggedInAs", sessionKey);
                })
                .catch(function (error) {
                    console.log(error);
                });
                window.sessionStorage.reload = true;
            }
        }
    }

    componentDidUpdate() {
        // On filter update
        if (this.state.is_filtered) {
            // Student query
            if (this.state.loggedInAs === "vinshe") {
                axios.get(`${process.env.REACT_APP_HOST}events/?participant=${this.state.loggedInAs}&event_type=${this.state.event_type_query}`)
                .then(response => {
                    this.toggleLoading();
                    this.setState({
                        cal_events: this.formatEvents(response.data),
                        is_filtered: false,
                        loading: false,
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            
            // Admin query
            else {
                axios.get(`${process.env.REACT_APP_HOST}events?event_type=${this.state.event_type_query}`)
                .then(response => {
                    this.toggleLoading();
                    this.setState({
                        cal_events: this.formatEvents(response.data),
                        is_filtered: false,
                        loading: false,
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
        
        // On event data update (delete, add, edit)
        else if (this.state.eventsChanged) {
            // Student query
            if (this.state.loggedInAs === "vinshe") {
                axios.get(`${process.env.REACT_APP_HOST}events/?participant=${this.state.loggedInAs}&event_type=`)
                .then(response => {
                    this.toggleLoading();
                    this.setState({
                        cal_events: this.formatEvents(response.data),
                        eventsChanged: false,
                        loading: false,
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            
            // Admin query
            else {
                axios.get(process.env.REACT_APP_HOST + 'events/')
                .then(response => {
                    this.toggleLoading();
                    this.setState({
                        cal_events: this.formatEvents(response.data),
                        eventsChanged: false,
                        loading: false,
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
    }

    render() {
        return (
            <div className="App">
                <div className="App-layer1">
                    <NavigationBar onSearch={this.onSearch} loggedInAs={this.state.loggedInAs}/>

                    <div className="App-wholeview">
                        <div className="sideInformation">
                            <div className="sideInfoLayer">

                                {/* Maybe make this into function then return div but its kinda late */}
                                {this.state.loggedInAs === "admin" && 
                                    <div className="createEventButton">
                                        <Link to="/eventcreate" style={{ textDecoration: 'none'}}>
                                            <CreateEventButton />
                                        </Link>
                                    </div> }

                                {this.state.loggedInAs === "admin" && 
                                    <div className="createGroupButton">
                                        <Link to="/groupcreate"style={{ textDecoration: 'none'}}>
                                            <CreateGroupButton/>
                                        </Link>
                                    </div> }

                                <div className="filter-search-section">
                                    <div className="filtering-section">
                                        <Filtering
                                            onFilter={this.handleEventTypeQueryChange}
                                            onPost={this.changeEvents}
                                            emptyFilter={this.isFiltered}
                                            event_types={this.state.event_types}
                                            loading={this.toggleLoading}>
                                        </Filtering>
                                    </div> 
                                </div>
                            </div>                    
                        </div>

                        <div className="calendarFrame">
                            <div className="calendarFrameLayer">
                                { this.state.loading 
                                    ?     
                                <div className="calendarSpinner">
                                    <SyncLoader
                                        css={override}
                                        size={15}
                                        margin={2}
                                        color={"#4A90E2"}
                                        loading={this.state.loading}>
                                    </SyncLoader> 
                                </div>
                                    : 
                                <Calendar
                                    popup
                                    selectable
                                    localizer={localizer}
                                    views={['day','week','month']}
                                    defaultDate={new Date()}
                                    defaultView="month"
                                    events={this.state.cal_events}
                                    onSelectEvent={this.handleSelectEvent}
                                    onSelecting = {slot => false}
                                    style={{ height: "91.5vh", width: "86vw", float: "right", zIndex:"0"}}
                                    eventPropGetter={(this.eventColorSetter)}
                                    min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6)}
                                    max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)}>
                                </Calendar> }
                            </div>
                            
                            <Modal
                                onClose={this.closeModal}
                                refreshModal={this.handleSelectEvent}
                                show={this.state.show}
                                event={this.state.selectedEvent}
                                eventGroups={this.state.selectedEventGroups}
                                eventTags={this.state.selectedEventTags}
                                allTags={this.state.tags}
                                onAddGroup={this.onAddGroup}
                                onDeleteGroup={this.onDeleteGroup}
                                onPost={this.changeEvents}
                                loggedInAs={this.state.loggedInAs}>
                            </Modal>
                        </div>
                    </div> 
                </div>
            </div>
        );
    }
}

