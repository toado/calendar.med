import React from "react";
import "./copyModal.css";
import PropTypes from "prop-types";
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";
import axios from "axios";

import Button from '@material-ui/core/Button'

import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';


export default class CopyModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            event_date: this.props.event.start,
            start_time: this.props.event.start,
            end_time: this.props.event.end
        }
    }

    handleChange = event => {
        this.setState({
            event_date: event
        })
    };

    onClose = e => {
        this.props.onClose && this.props.onClose(e);
        this.setState({
            event_date: this.props.event.start
        })
    };

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

    handleConfirmCopy = () => {
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
        } else {
            const eventObj = {
                course_id:        this.props.event.course_id,
                event_type:       this.props.event.event_type,
                event_title:      this.props.event.event_title,
                event_date:       moment(this.state.event_date).format("YYYY-MM-DD"),
                start_time:       moment(this.state.start_time).format("HH:mm:ss"),
                end_time:         moment(this.state.end_time).format("HH:mm:ss"),
                event_desc:       this.props.event.event_desc,
                training_session: this.props.event.training_session
            }

            axios
                .post(process.env.REACT_APP_HOST + 'events/', eventObj)
                .then(() => {
                    //Refreshes the calendar to show copied event
                    this.props.onPost();
                    //Closes the main modal
                    this.props.onCopy();
                    alert("Event has been copied")
                })
                .catch(function (error) {
                    alert("There was an error copying the event")
                    console.log(error);
                })
            //Closes the copy modal
            this.onClose();
        }
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
        <div class="copy-modal-container">
            <div id="overlay"></div>
            <div class="copyModal" id="copyModal">
                <div class="content">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            autoOk
                            okLabel=""
                            margin="dense"
                            inputVariant="outlined"
                            id="date-picker-dialog"
                            label="Copy event to:"
                            format="dd/MM/yyyy"
                            value={this.state.event_date}
                            onChange={this.handleChange}
                            InputAdornmentProps={{ position: "start" }}
                            KeyboardButtonProps={{'aria-label': 'change date'}}
                        />
                        <div className="copy-times">
                            {/* Event's START TIME */}
                            <div className="copy-start">
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
                            <div className="copy-end">
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
                <div class="actions">
                    <Button className="copyButton" 
                        onClick={this.handleConfirmCopy}>
                            Confirm
                    </Button>
                    <Button className="closeButton" 
                        onClick={this.onClose}>
                            Close
                    </Button>
                </div>
            </div>
        </div>
        );
    }
}
CopyModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};
