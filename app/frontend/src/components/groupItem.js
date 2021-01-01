import React from "react"
import Expand from "react-expand-animated";
import axios from "axios";


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default class GroupItem extends React.Component{
    
    constructor(props) {
        super(props)

        this.state = {
            group: {
                group_id:	    this.props.group.group_id,
                group_name:     this.props.group.group_name,
                instructors:	[],
                location:	    this.props.group.location,
                vodcast_url:	this.props.group.vodcast_url
            },
            selected: false,
            deletedGroups: [],
            style: "",
            loading: true,
            instructorOptions: [],
            groupOptions: [],
            options: [],
            group_id: this.props.group.group_id,
            instructors: [],
            vodcast_url: this.props.group.vodcast_url,
            location: this.props.group.location
        }
        this.togglePanel = this.togglePanel.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.handleAutocomplete = this.handleAutocomplete.bind(this);
        this.getInfo()
        this.getGroupInstructors()
    }

    //Toggle for expansion of group
    togglePanel = async() => {
        const { selected } = this.state;
        this.setState({selected: !selected})
    }

    onDelete = () => {
        this.props.onDeleteGroup(this.props.group)
        this.setState({
            style: "none"
        })
    }

    onAdd = () => {
        const groupObj = {
            group_id:	    this.state.group_id,
            instructor:	    this.state.instructors,
            location:	    this.state.location,
            vodcast_url:	this.state.vodcast_url 
        }
        this.props.onAddGroup(groupObj)
    }

    handleEdit = event => {
        this.setState({
            group: {
                ...this.state.group,
                [event.target.name]: event.target.value 
            }
        }, () => {
            this.props.onAddGroup(this.state.group)
        })
    };

    handleAutocomplete = (events, inputs) => {
        this.setState({
            group: {
                ...this.state.group,
                instructors: inputs
            }
        }, () => {
            this.props.onAddGroup(this.state.group)
        })
    }

    handleGroupAutocomplete = (events, inputs) => {
        this.setState({
            group: {
                ...this.state.group,
                group_id: inputs.id,
                group_name: inputs
            }
        }, () => {
            this.props.onAddGroup(this.state.group)
        })
    }

    async getGroupInstructors() {
        //Gets current group's instructors
        if (this.props.group.group_id) {
            var response = await axios.get(process.env.REACT_APP_HOST + "events/" + this.props.group.event_id + "/groups/" + this.props.group.group_id + "/instructors/")
            var data = response.data
            
            var participant = {};
            for (let i = 0; i <= data.length-1; i++) {
                var instructorResponse = await axios.get(process.env.REACT_APP_HOST + "participants/" + data[i].instructor_id)
                var instructorData = instructorResponse.data
                participant = {};
                participant["instructor"] = {lname:instructorData.last, fname:instructorData.first, ccid:instructorData.participant_id}
                this.setState({
                    group: {
                        ...this.state.group,
                        instructors: [...this.state.group.instructors, participant]
                    }
                })
            }
        }
    }

    getInfo = async() =>  {
        //Gets group names for input field
        var response = await axios.get(process.env.REACT_APP_HOST + "groups/")
        var data = response.data
        var groupOption = {}
        for (let i=0; i < data.length; i++) {
            groupOption = {}
            groupOption = {name:data[i].group_name, id:data[i].group_id}
            this.setState({
                groupOptions: [...this.state.groupOptions, groupOption]
            })
        }


        //Gets all instructors in format (Lname, Fname - CCID) from database for input field
        response = await axios.get(process.env.REACT_APP_HOST + "participants/")
        data = response.data
        var instructorOption = {}
        for (let i = 0; i < data.length; i++) {
            instructorOption = {}
            if (data[i].participant_type === "instructor") {
                instructorOption["instructor"] = {lname:data[i].last, fname:data[i].first, ccid:data[i].participant_id}
                this.setState({
                    instructorOptions: [...this.state.instructorOptions, instructorOption]
                })
            }
        }
        this.getFirstLetters();
    }

    getFirstLetters() {
        //Retrieves first letter of instructors last names for sorting and grouping in autocomplete field
        const options = this.state.instructorOptions.map((option) => {
            const firstLetter = option.instructor.lname[0].toUpperCase();
            return {
                firstLetter: firstLetter,
                ...option,
            };
        });
        this.setState({
            options: options
        })

    }

    groupIdField() {
        return (
        <Autocomplete
            style={{flexGrow:1}}
            margin="dense"
            size="small"
            name="groupID"
            value={this.state.group.group_name}
            onChange={this.handleGroupAutocomplete}
            options={this.state.groupOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} placeholder="Group" variant="outlined" />}>
        </Autocomplete>
        )
    }

    autocompleteField() {
        return (
        <Autocomplete
            multiple
            style={{flexGrow:1}}
            margin="dense"
            size="small"
            name="instructors"
            value={this.state.group.instructors}
            onChange={this.handleAutocomplete}
            options={this.state.options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            getOptionLabel={(option) => `${option.instructor.lname}, ${option.instructor.fname} - ${option.instructor.ccid}`}
            getOptionSelected={(option, value) => value.instructor === option.instructor}
            groupBy={(option) => option.firstLetter}
            renderInput={(params) => <TextField {...params} placeholder="Instructor(s)" variant="outlined" />}>
        </Autocomplete>
        )
    }

    vodcastField() {
        return (
        <TextField 
            error={this.state.group.vodcast_url === ""}
            style={{flexGrow:1}}
            margin="dense"
            size="small"
            variant="outlined"
            name="vodcast_url"
            placeholder="Vodcast URL" 
            value={this.state.group.vodcast_url}  
            onChange={this.handleEdit}>
        </TextField>
        )
    }

    locationField() {
        return (
        <TextField 
            error={this.state.group.location === ""}
            style={{flexGrow:1}}
            margin="dense"
            size="small"
            variant="outlined"
            name="location"
            placeholder="Location" 
            value={this.state.group.location}  
            onChange={this.handleEdit}>
        </TextField>
        )
    }

    expandComponent() {
        const vodcast_url = () => {
            var protocols = ["http://www", "https://www"]
            var URL = this.props.group.vodcast_url
            if (!protocols.includes(this.props.group.vodcast_url.split(".")[0])){
                URL = "//" + URL
            }
            if (this.props.windowWidth <= 1500) {
                return <a href={URL} target="_blank" rel="noopener noreferrer">Link</a>
            } else {
                return <a href={URL} target="_blank" rel="noopener noreferrer">{this.props.group.vodcast_url}</a>
            }
        }
        if (this.props.editMode) {
            return (
                <Expand
                    open={(this.props.group.empty) ? true : this.state.selected}
                    duration={400}>
                    {(this.props.group.empty) ? 
                        <div className="choose-id">
                            <b className="edit-b" style={{whiteSpace:'nowrap'}}>Group ID: </b>
                            {this.groupIdField()}
                        </div> : null}
                    <div className="choose-instructor">
                        <b className="edit-b" style={{whiteSpace:'nowrap'}}>Instructor:</b>
                        {this.autocompleteField()}
                    </div>
                    <div className="choose-vodcast">
                        <b className="edit-b" style={{whiteSpace:'nowrap'}}>Vodcast Link:</b>
                        {this.vodcastField()}
                    </div>
                    <div className="choose-location">
                        <b className="edit-b" style={{whiteSpace:'nowrap'}}>Location:</b>
                        {this.locationField()}
                    </div>
                </Expand>
                )
        } else {
            return (
                <Expand
                    open={this.state.selected}
                    duration={400}>
                    <div className="instructor">
                        <b>Instructor:</b> {this.state.group.instructors.map((instructor, i) => (this.state.group.instructors.length-1 === i) ?
                                                `${instructor.instructor.fname} ${instructor.instructor.lname}` :
                                                `${instructor.instructor.fname} ${instructor.instructor.lname}, `)}
                    </div>
                    <div className="vodcast">
                        <b>Vodcast Link:</b> {vodcast_url()}
                    </div>
                    <div className="location">
                        <b>Location:</b> {this.props.group.location}
                    </div>
                </Expand>
            )
        }

    }

    

    render(){
        if (this.props.group) {
            return (
                <div className="edit-group-item" style={{display:this.state.style}}>
                    <div className="edit-group">
                        <button className={(this.props.group.empty) ? 'selected' : (this.state.selected ? 'selected' : 'not-selected')} onClick= {() => this.togglePanel()}>
                            {(this.props.group.empty) ? "New Group" : `Group ${this.props.group.group_id}`}
                        </button>
                        {(this.props.editMode) ? <button className="delete-group" onClick={() => this.onDelete()}>&#10006;</button> : null}
                    </div>
                    {this.expandComponent()}
                </div>
            )
        } else {
            return (
                <div className="no-groups">
                    {(this.props.editMode) ? "" : "There are no groups assigned to this event."}
                </div>
            )
        }
    }
} 