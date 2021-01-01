import React from "react";
import "./editModal.css";
import axios from 'axios';
import GroupsList from "./groupsList.js";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';

import { FormControl, InputLabel, Select } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';


import moment from "moment";

export default class editModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            windowWidth: window.innerWidth,
            event_type:     this.props.event.event_type,
            event_title:    this.props.event.event_title,
            event_date:     this.props.event.start,
            start_time:     this.props.event.start,
            end_time:       this.props.event.end,
            event_desc:     this.props.event.event_desc,
            training_session: this.props.event.training_session,
            event_groups:   this.props.eventGroups,
            deletedGroups: [],
            addedGroups: []
        }

        this.getEventTypes();
        this.getTrainingSess();
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

    onClose = (e) => {
        this.props.onAddGroup(false)
        this.props.refreshModal(this.props.event)
        this.props.onClose(e);
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

    //EDIT FUNCTIONS
    handleEdit = event => {
        this.setState({ [event.target.name]: event.target.value })
    };
    
    handleDateChange = event => {
        this.setState({
            event_date: event
        })
    }
    handleStartTimeChange = event => {
        this.setState({
            start_time: event
        })
    }
    handleEndTimeChange = event => {
        this.setState({
            end_time: event
        })
    }

    handleDeleteGroup = (group) => {
        this.setState({
            deletedGroups: [...this.state.deletedGroups, group]
        }, () => {
        })
        this.props.onDeleteGroup(group);
    }

    handleAddGroup = (group) => {
        if (!this.state.addedGroups.length) {
            this.setState( {
                addedGroups: [...this.state.addedGroups, group]
            })
        } else {
            for (let i = 0; i <= this.state.addedGroups.length-1; i++) {
                if (group.group_id === this.state.addedGroups[i].group_id) {
                    let addedGroups = this.state.addedGroups.slice()
                    addedGroups[i] = group
                    this.setState({ addedGroups: addedGroups})
                    break
                } else {
                    this.setState( {
                        addedGroups: [...this.state.addedGroups, group]
                    })
                }
            }
        }
    }


    handleSave = async(event) => {
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

        const eventObj = {
            course_id:        this.props.event.course_id,
            event_type:       this.state.event_type,
            event_title:      this.state.event_title,
            event_date:       moment(this.state.event_date).format("YYYY-MM-DD"),
            start_time:       moment(this.state.start_time).format("HH:mm:ss"),
            end_time:         moment(this.state.end_time).format("HH:mm:ss"),
            event_desc:       this.state.event_desc,
            training_session: this.state.training_session
        }

        for (let key of Object.keys(eventObj)) {
            if (eventObj[key] !== this.props.event[key]) {
                axios.put(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}`, eventObj)
                break
            }
        }

        for (let i=0; i < this.state.deletedGroups.length; i++) {
            await axios
                .delete(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}/groups/${this.state.deletedGroups[i].group_id}`)
                .catch(function (error) {
                    console.log(error);
                })
        }

        let addedGroups = this.state.addedGroups.slice()

        this.state.addedGroups.forEach(async (group) => {
            for (let i=0; i < this.state.event_groups.length; i++) {
                if (group.group_id === this.state.event_groups[i].group_id) {
                    addedGroups.splice(addedGroups.findIndex(v => (v.group_id===group.group_id)), 1)
                    let groupObj = {
                        "location": group.location,
                        "vodcast_url": group.vodcast_url
                    }
                    axios
                        .put(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}/groups/${group.group_id}/`, groupObj)
                        .catch(function (error) {
                            console.log(error);
                        })
                    
                    var response = await axios.get(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}/groups/${group.group_id}/instructors/`)
                    var data = response.data
                    let promises = [];
                    for (let k=0; k < data.length;k++) {
                        promises.push(axios
                            .delete(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}/groups/${group.group_id}/instructors/${data[k].instructor_id}/`)
                            .catch(function (error) {
                                console.log(error);
                            }))
                    }
                    
                    Promise.all(promises).then(() => {
                        for (let j=0; j < group.instructors.length; j++) {
                            axios
                                .post(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}/groups/${group.group_id}/instructors/${group.instructors[j].instructor.ccid}/`)
                                .catch(function (error) {
                                    console.log(error);
                                })
                        }
                    })

                }
            }


        })
        addedGroups.forEach(async (group) => {
            let groupObj = {
                "location": group.location,
                "vodcast_url": group.vodcast_url
            }
            let promises2 = [];
            promises2.push(await axios
                                .post(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}/groups/${group.group_id}/`, groupObj)
                                .catch(function (error) {
                                    console.log(error);
                                })
                        )

            Promise.all(promises2).then(() => {
                for (let j=0; j < group.instructors.length; j++) {
                    axios
                        .post(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}/groups/${group.group_id}/instructors/${group.instructors[j].instructor.ccid}/`)
                        .catch(function (error) {
                            console.log(error);
                        })
                }
            })
        })
        //Refreshes the calendar
        this.props.onPost();
        //Closes the edit modal
        this.onClose();
    }

    waitHandleSave = async (event) => {
        await this.handleSave(event)
        const eventObj = {
            course_id:        this.props.event.course_id,
            event_type:       this.state.event_type,
            event_title:      this.state.event_title,
            event_date:       moment(this.state.event_date).format("YYYY-MM-DD"),
            start_time:       moment(this.state.start_time).format("HH:mm:ss"),
            end_time:         moment(this.state.end_time).format("HH:mm:ss"),
            event_desc:       this.state.event_desc,
            training_session: this.state.training_session
        }
        eventObj["event_id"] = this.props.event.event_id
        alert("Successfully edited event!")
        this.props.refreshModal(eventObj)
    }

    async getEventTypes() {
        const response = await axios.get(process.env.REACT_APP_HOST + `courses/${this.props.event.course_id}/events/`)
        const events = response.data
        const uniqueEventTypes = [...new Set(events.map(item => item.event_type))];
        const eventTypeOptions = []
        uniqueEventTypes.forEach(eventType => {
            eventTypeOptions.push(<MenuItem value={eventType}>{eventType}</MenuItem>)
        });
        this.setState({
            eventTypeOptions: eventTypeOptions
        })
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
        if (!this.props.show) {
            return null;
        }
        return (
        <div className="background">
            <div className="edit-modal">
                <div id="overlay"></div>
                <div className="editModal" id="editModal">
                    <div className="title">
                        <img className="edit-image" src={require("../static/edit.png")} alt="Edit"/>
                        <div className="event-type">
                            <FormControl style={{minWidth: '100%', textAlign: 'center'}} margin="dense" variant="outlined">
                                <InputLabel>Event Type</InputLabel>
                                <Select
                                    label="Event Type" 
                                    name="event_type"
                                    placeholder="Select an Event Type" 
                                    value={this.state.event_type}  
                                    onChange={this.handleEdit}>
                                    {this.state.eventTypeOptions}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="event-title">
                            <TextField
                                style={{ minWidth: '100%'}}
                                error={!this.state.event_title}
                                margin="dense"
                                rows={1}
                                variant="outlined"
                                label="Title"
                                name="event_title" 
                                type="text" 
                                value={this.state.event_title} 
                                onChange={this.handleEdit} >
                            </TextField>
                        </div>
                    </div>
                    <div className="content">
                        <div className="date">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                {/* Event's DATE */}
                                <div className="datepicker">
                                    <img className="date-image" src={require("../static/time.png")} alt="Datetime"/>
                                    <div className="edit-date">
                                        <KeyboardDatePicker
                                            autoOk
                                            okLabel=""
                                            error={(this.validDateTime(this.state.event_date))}
                                            invalidDateMessage={""}
                                            style={{ minWidth: '100%'}}
                                            margin="dense"
                                            inputVariant="outlined"
                                            label="Date"
                                            format="MM/dd/yyyy"
                                            value={this.state.event_date}
                                            InputAdornmentProps={{ position: "start" }}
                                            onChange={this.handleDateChange}
                                        />
                                    </div>
                                </div>
                                <div className="edit-times">
                                    <img className="date-image" src={require("../static/time.png")} alt="Datetime"/>
                                    {/* Event's START TIME */}
                                    <div className="edit-start">
                                        <KeyboardTimePicker
                                            autoOk
                                            okLabel=""
                                            style={{ minWidth: '100%'}}
                                            error={(this.validDateTime(this.state.start_time))}
                                            invalidDateMessage={""}
                                            margin="dense"
                                            inputVariant="outlined"
                                            label="Start Time"
                                            format="hh:mm a"
                                            value={this.state.start_time}
                                            InputAdornmentProps={{ position: "start" }}
                                            onChange={this.handleStartTimeChange}
                                        />
                                    </div>

                                    {/* Event's END TIME */}
                                    <div className="edit-end">
                                        <KeyboardTimePicker
                                            autoOk
                                            okLabel=""
                                            style={{ minWidth: '100%'}}
                                            error={(this.validDateTime(this.state.end_time))}
                                            invalidDateMessage={""}
                                            margin="dense"
                                            inputVariant="outlined"
                                            label="End Time"
                                            format="hh:mm a"
                                            value={this.state.end_time}
                                            InputAdornmentProps={{ position: "start" }}
                                            onChange={this.handleEndTimeChange}
                                        />
                                    </div>
                                </div>
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="desc">
                            <img className="desc-image" src={require("../static/desc.png")} alt="Description"/>
                            <div className="event-desc">
                                <TextField 
                                    style={{ minWidth: '100%'}}
                                    multiline
                                    margin="dense"
                                    rows={4}
                                    variant="outlined"
                                    label="Description"
                                    name="event_desc" 
                                    type="text" 
                                    value={this.state.event_desc} 
                                    onChange={this.handleEdit}>
                                </TextField>
                            </div>
                        </div>
                        <div className="misc-info">
                            <img className="misc-image" src={require("../static/misc.png")} alt="Miscellaneous"/>
                            <div className="train-session">
                                <FormControl style={{minWidth: '100%'}} margin="dense" variant="outlined">
                                    <InputLabel>Training Session</InputLabel>
                                    <Select
                                        required 
                                        margin="dense"
                                        label="Training Session" 
                                        name="training_session"
                                        placeholder="Select a training session" 
                                        value={this.state.training_session}
                                        onChange={this.handleEdit}>
                                        {this.state.trainSessOptions}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="groups">
                            <img className="groups-image" style={{verticalAlign: "middle", paddingRight:"10px"}} src={require("../static/groups.png")} alt="Groups"/>
                            <GroupsList 
                                eventGroups={this.props.eventGroups}
                                windowWidth={this.state.windowWidth}
                                editMode={true}
                                onAddGroup={this.handleAddGroup}
                                onDeleteGroup={this.handleDeleteGroup}/>
                        </div>
                    </div>
                    <div className="actions">
                        <Button type="submit" className="saveButton" 
                            onClick={this.waitHandleSave}>
                                Save
                        </Button>
                        <Button className="closeButton" 
                            onClick={this.onClose}>
                                Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}