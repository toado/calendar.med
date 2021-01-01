import React from "react";
import "./modal.css";
import PropTypes from "prop-types";
import axios from 'axios';
import CopyModal from "./copyModal.js"; 
import EditModal from "./editModal.js";
import GroupsList from "./groupsList.js";

import Button from '@material-ui/core/Button'
import moment from "moment";

export default class Modal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showCopyModal: false,
            showEditModal: false,
            tags: [],
        }

    }

    closeCopyModal = () => {
        this.setState({
            showCopyModal: false,
        })
    }
    
    closeEditModal = () => {
        this.setState({
            showEditModal: false
        })
    }

    onCopy = () => {
        this.setState({
            showCopyModal: true
        })
    }

    onEdit = (e) => {
        this.setState({
            showEditModal: true
        });
    }

    onClose = e => { 
        this.props.onClose(e);
        this.setState({
            showCopyModal: false,
        })
    }

    formatDate(startDate, endDate) {
        startDate = moment(startDate)
        endDate = moment(endDate)
        
        var ampm = (startDate.format("a") !== endDate.format("a"))
        endDate = endDate.format("h:mm A")

        var startDateFormat = moment()
        if (this.state.windowWidth < 1180 && this.state.windowWidth > 750) {
            startDateFormat = startDate.format("dddd, MMMM D[\n]h:mm " + (ampm ? "A" : ""))
        } else if (this.state.windowWidth <= 750) {
            startDateFormat = startDate.format("ddd, MMM D \u2022 h:mm " + (ampm ? "A" : ""))
        } else {
            startDateFormat = startDate.format("dddd, MMMM D \u2022 h:mm " + (ampm ? "A" : ""))
        }

        return startDateFormat + " - " + endDate
    }

    handleDelete = () => {
        const confirmation = window.confirm("Would you like to remove this event?\nRemoving this event will no longer be shown in the Calendar.")

        if (confirmation === true){
            axios
                .delete(`${process.env.REACT_APP_HOST}events/${this.props.event.event_id}`)
                .then(() => {
                    //Refreshes the calendar
                    this.props.onPost();
                })
                .catch(function (error) {
                    console.log(error);
                })
            //Closes the main modal
            this.onClose();
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
        if (!this.props.show) {
            return null;
        }

        var eventGroups = this.props.eventGroups

        if (this.state.showEditModal) {
            return (
                <EditModal
                    onClose={this.closeEditModal}
                    refreshModal={this.props.refreshModal}
                    show={this.state.showEditModal}
                    event={this.props.event}
                    eventGroups={eventGroups}
                    onAddGroup={this.props.onAddGroup}
                    onDeleteGroup={this.props.onDeleteGroup}
                    onPost={this.props.onPost}>
                </EditModal>
            );
        } else {
            var eventDate = this.formatDate(this.props.event.start, this.props.event.end)
            var eventDesc = this.props.event.event_desc
            var eventTags = []

            if (this.props.eventTags) {
                this.props.eventTags.forEach(tag => {
                    eventTags.push(this.props.allTags[this.props.allTags.findIndex(v => (v.tag_id === tag.tag_id))].tag_name)
                })
            }
            
            return (
            <div className="background">
                <div className="modal">
                    <div className="mainModal" id="mainModal">
                        <div className="full-width">
                            <p className="title" style={{display:"inline", fontSize:"20px"}}><b>{this.props.event.event_type}</b>: {this.props.event.event_title}</p>
                        </div>
                        <div className="content">
                            <div className="date">
                                <img className="date-image" style={{verticalAlign: "middle", paddingRight:"10px"}} src={require("../static/time.png")} alt="Datetime"/>
                                <div className="event-date">{eventDate}</div>
                            </div>
                            <div className="desc">
                                <img className="desc-image" style={{verticalAlign: "middle", paddingRight:"10px"}} src={require("../static/desc.png")} alt="Description"/>
                                <div className="event-desc">{eventDesc ? eventDesc : "There is no information on this event."}</div>
                            </div>
                            <div className="groups">
                                <img className="groups-image" style={{verticalAlign: "middle", paddingRight:"10px"}} src={require("../static/groups.png")} alt="Groups"/>
                                <GroupsList 
                                    eventGroups={eventGroups}
                                    windowWidth={this.state.windowWidth} 
                                    editMode={false}/>
                            </div>
                            <div className="tags">
                                <img className="tags-image" style={{verticalAlign: "middle", paddingRight:"10px"}} src={require("../static/info.png")} alt="Tags"/>
                                <div className="event-tags">
                                    {(eventTags.length !== 0) ? eventTags.map((tag,i) => {
                                        if (i === eventTags.length-1) {
                                            return (<span><span className="tag">{tag}</span><span> </span></span>)
                                        } else {
                                            return (<span><span className="tag">{tag}</span><span>, </span></span>)
                                        }
                                    }) : "No Tags"}
                                </div>
                            </div>
                        </div>
                        {this.props.loggedInAs === "admin" 
                            ?
                        (<div className="actions">
                            <Button className="copyButton" 
                                onClick={this.onCopy}>
                                    Copy
                            </Button>
                            <Button className="deleteButton" 
                                onClick={this.handleDelete}>
                                    Delete
                            </Button>
                            <Button className="editButton" 
                                onClick={this.onEdit}>
                                    Edit
                            </Button>
                            <Button className="closeButton" 
                                onClick={this.onClose}>
                                    Close
                            </Button>
                        </div>)
                            :
                        (<div className="actions">
                            <Button className="closeButton"
                                onClick={this.onClose}>
                                    Close
                            </Button>
                         </div>)}
                    </div>
                        <CopyModal
                            onClose={this.closeCopyModal}
                            show={this.state.showCopyModal}
                            event={this.props.event}
                            onPost={this.props.onPost}
                            onCopy={this.onClose}>
                        </CopyModal>
                </div>
            </div>
            );
        }
    }
}
Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
};
