import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from "moment";

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { FormControl, InputLabel, Select } from "@material-ui/core";
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

import "./eventcreate.css";

const muiTheme = createMuiTheme({ 
    palette: { 
        primary: { main: "#97cef1" },
        secondary: { main: "#f07070" },    
    }, 
})

const useStyles = makeStyles((theme) => ({
    root: {  
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default class EventEdit extends Component {    
    constructor(props) {
        super(props)

        this.state = {
            course_id: "",
            training_session: "",
            event_type: "",
            event_desc: "",
            event_date: new Date(),
            start_time: new moment().startOf('day').toDate(),
            end_time: new moment().endOf('day').toDate(),
            deleted: false,
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCourseIds();
        this.getEventTypes();
        this.getTrainingSess();
    }

    //Creates MenuItems for course ID dropdown
    async getCourseIds() {
        const response = await axios.get(process.env.REACT_APP_HOST + "courses/")
        const courses = response.data
        let uniqueCourseNames = [...new Set(courses.map(course => course.course_name))];
        uniqueCourseNames.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0)); ;
        
        /**
         * Course dict
         * @key - Course Name
         * @val - Course ID
         */
        const courseNameAndIDs = {}
        for (let i = 0; i < uniqueCourseNames.length; ++i) {
            if (!(uniqueCourseNames[i] in courseNameAndIDs)) {
                courseNameAndIDs[uniqueCourseNames[i]] = courses[i].course_id;
            };
        };
    
        const courseOptions = []
        uniqueCourseNames.forEach(courseName => {
            courseOptions.push(<MenuItem value={courseNameAndIDs[courseName]}>{courseName}</MenuItem>)
        });
        this.setState({
            courseOptions: courseOptions
        }) 
    }

    //Creates MenuItems for event type dropdown
    async getEventTypes() {
        const response = await axios.get(process.env.REACT_APP_HOST + "events/")
        const events = response.data
        let uniqueEvents = [...new Set(events.map(event => event.event_type))];
        uniqueEvents.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0)); 
        const eventTypeOptions = []
        uniqueEvents.forEach(eventType => {
            eventTypeOptions.push(<MenuItem value={eventType}>{eventType}</MenuItem>)
        })
        this.setState({
            eventTypeOptions: eventTypeOptions
        })
    }

    //Creates MenuItems for training session dropdown
    //Gives 5 options: currentYear-2 to currentYear+2
    async getTrainingSess() {
        const years = [-2,-1,0,1,2]
        const trainSessOptions = []
        await years.forEach(year => {
            trainSessOptions.push(
                <MenuItem 
                    value={String(`${moment().add(year,'y').format('YYYY')}-${moment().add(year+1,'y').format('YYYY')}`)}>
                    {moment().add(year,'y').format('YYYY')}-{moment().add(year+1,'y').format('YYYY')}
                </MenuItem>)
        })
        this.setState({
            trainSessOptions: trainSessOptions
        })
    }

    compareTime(dateTime_1, dateTime_2) {
        var momentDate_1 = moment({h: dateTime_1.getHours(), m: dateTime_1.getMinutes()});
        var momentDate_2 = moment({h: dateTime_2.getHours(), m: dateTime_2.getMinutes()});
        if (momentDate_1.isBefore(momentDate_2)) {
            return true
        } else if (momentDate_1.isSameOrAfter(momentDate_2)) {
            return false
        }
    }

    validDateTime(dateTime) {
        return ((dateTime === null) || (dateTime.toString() === "Invalid Date")) 
    }

    handleChange = event => {
        this.setState({ 
            [event.target.name]: event.target.value 
        })
    };

    handleSelectChange = event => {
        this.setState({ 
            event_type: event.target.value 
        })
    }

    handleDateChange = event => {
        this.setState({
            event_date: event
        })
    }

    handleStartTimeChange = event => {
        if (event > this.state.end_time) {
            alert("Specified start time is later than the end time")
        } else {
            this.setState({
                start_time: event
            })
        }
    }

    handleEndTimeChange = event => {
        if (event < this.state.start_time) {
            alert("Specified end time is earlier than the start time")
        } else {
            this.setState({
                end_time: event
            })
        }
    }
    
    handleSubmit = event => {
        // Prevents browser from reloading the page
        event.preventDefault();

        if (this.validDateTime(this.state.event_date)) {
            alert("Date is invalid")
            return
        }
        if (this.validDateTime(this.state.start_time)) {
            alert("Start time is invalid")
            return
        }
        if (this.validDateTime(this.state.end_time)) {
            alert("End time is invalid")
            return
        }
        if (!this.compareTime(this.state.start_time, this.state.end_time)) {
            alert("Start time is later than end time")
            return
        }

        // To create a new event object
        const eventObj = {
            course_id:        this.state.course_id,
            training_session: this.state.training_session,
            event_type:       this.state.event_type,
            event_desc:       this.state.event_desc,
            event_title:      this.state.event_title,
            event_date:       moment(this.state.event_date).format("YYYY-MM-DD"),
            start_time:       moment(this.state.start_time).format("HH:mm:ss"),
            end_time:         moment(this.state.end_time).format("HH:mm:ss")
        }

        // Posting to API passing eventObj as a payload
        axios
            .post(process.env.REACT_APP_HOST + 'events/', eventObj )
            .then(() => {
                this.props.history.push('/calendar')
                this.props.onPost();
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    render() {
        return(
            <div className="create-event">
                <div className="title-container">
                    <p style={{color:"black"}}> Create a New Event </p>
                </div>
                <form className={useStyles.root} onSubmit={this.handleSubmit}>
                    <div className="create-container">
                        <div className="create-misc">
                            {/* Event's COURSE ID */}
                            <div className="create-course-id">
                                <FormControl style={{minWidth: '100%'}} variant="outlined">
                                    <InputLabel>Course</InputLabel> 
                                    <Select
                                        required
                                        label="Course ID" 
                                        name="course_id" 
                                        placeholder="Add Course ID" 
                                        value={this.state.name} 
                                        onChange={this.handleChange}>  
                                        <MenuItem value="" selected disabled hidden>Select a Course ID</MenuItem>
                                        {this.state.courseOptions}
                                    </Select>
                                </FormControl>
                            </div>
                            {/* Event's TRAINING SESSION */}
                            <div className="create-train-session">
                                <FormControl style={{minWidth: '100%'}} variant="outlined">
                                    <InputLabel>Training Session</InputLabel>
                                    <Select
                                        required 
                                        label="Training Session" 
                                        name="training_session"
                                        placeholder="Select a training session" 
                                        value={this.state.name}
                                        onChange={this.handleChange}>
                                        {this.state.trainSessOptions}
                                    </Select>
                                </FormControl>
                            </div>
                            {/* Event's TYPE */}
                            <div className="create-event-type">
                                <FormControl style={{minWidth: '100%'}} variant="outlined">
                                    <InputLabel>Event Type</InputLabel>
                                    <Select
                                        required 
                                        label="Event Type" 
                                        name="event_type"
                                        placeholder="Select an Event Type" 
                                        value={this.state.name}  
                                        onChange={this.handleSelectChange}>
                                        <MenuItem value="" selected disabled hidden>Select an Event Type</MenuItem>
                                        {this.state.eventTypeOptions}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="create-title">
                            <div class="create-event-title">
                                <TextField
                                    required 
                                    style={{ minWidth: '100%'}}
                                    rows={1}
                                    variant="outlined"
                                    label="Event Title"
                                    name="event_title" 
                                    type="text" 
                                    value={this.state.name} 
                                    onChange={this.handleChange} >
                                </TextField>
                            </div>
                        </div>
                        <div className="create-description">
                            {/* Event's DESCRIPTION */}
                            <div className="create-desc">
                                <TextField 
                                    style={{ minWidth: '100%'}}
                                    required
                                    multiline
                                    variant="outlined"
                                    rows={4}
                                    label="Event Description"
                                    name="event_desc" 
                                    type="text" 
                                    value={this.state.name} 
                                    onChange={this.handleChange} >
                                </TextField>
                            </div>
                        </div>
                        <div className="create-datetime">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                {/* Event's DATE */}
                                <div className="create-date">
                                    <KeyboardDatePicker
                                        style={{ minWidth: '100%'}}
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        label="Select Date"
                                        format="MM/dd/yyyy"
                                        value={this.state.event_date}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={this.handleDateChange}
                                    />
                                </div>

                                {/* Event's START TIME */}
                                <div className="create-start">
                                    <KeyboardTimePicker
                                        autoOk
                                        style={{ minWidth: '100%'}}
                                        variant="inline"
                                        inputVariant="outlined"
                                        label="Select Start Time"
                                        format="hh:mm a"
                                        value={this.state.start_time}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={this.handleStartTimeChange}
                                    />
                                </div>
                                {/* Event's END TIME */}
                                <div className="create-end">
                                    <KeyboardTimePicker
                                        autoOk
                                        style={{ minWidth: '100%'}}
                                        variant="inline"
                                        inputVariant="outlined"
                                        label="Select End Time"
                                        format="hh:mm a"
                                        value={this.state.end_time}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={this.handleEndTimeChange}
                                    />
                                </div>
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                    <div className="event-form-buttons">
                        {/* Submit Form button */}
                        <ThemeProvider theme={ muiTheme }>
                            <Button type="submit" color="primary" variant="contained">
                                Create Event
                            </Button>
                        </ThemeProvider>
                        
                        {/* Cancel Button */}
                        <Link to='/calendar' style={{ textDecoration: 'none'}}>
                            <ThemeProvider theme={ muiTheme }>
                                <Button color="secondary" variant="contained">
                                    Cancel 
                                </Button>
                            </ThemeProvider>
                        </Link>
                    </div>
                </form>
            </div>
        )
    }
}

