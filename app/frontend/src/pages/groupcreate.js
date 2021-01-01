import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormControl, InputLabel, Select } from "@material-ui/core";
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import "./groupcreate.css";

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

export default class GroupCreate extends Component {    
    constructor(props) {
        super(props)

        this.state = {
            course_id: "",
            group_name: "",
            groups: [],
            students: [],
            studentOptions: [],
            options: [],
            lastGroupId: ""
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCourseIds();
        this.getAllGroups();
        this.getAllStudents();
    }

    async getAllGroups() {
        const response = await axios.get(process.env.REACT_APP_HOST + "groups/")
        const data = response.data
        this.setState({
            groups: data,
            lastGroupId: data[data.length-1].group_id
        })
    }

    async getAllStudents() {
        const response = await axios.get(process.env.REACT_APP_HOST + "participants/")
        const data = response.data
        var studentOption = {}
        for (let i = 0; i <= data.length-1; i++) {
            studentOption = {};
            if (data[i].participant_type === "student") {
                studentOption = {lname:data[i].last, fname:data[i].first, ccid:data[i].participant_id}
                this.setState({
                    studentOptions: [...this.state.studentOptions, studentOption]
                })
            }
        }
        this.getFirstLetters();
    }

    //Creates MenuItems for course ID dropdown
    async getCourseIds() {
        const response = await axios.get(process.env.REACT_APP_HOST + "courses/")
        const courses = response.data
        const uniqueCourseNames = [...new Set(courses.map(course => course.course_name))];

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

    handleAutocomplete = (events, inputs) => {
        this.setState({
            students: inputs
        })
    }

    getFirstLetters() {
        //Retrieves first letter of instructors last names for sorting and grouping in autocomplete field
        const options = this.state.studentOptions.map((option) => {
            const firstLetter = option.lname[0].toUpperCase();
            return {
                firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                ...option,
            };
        });
        this.setState({
            options: options
        })
    }

    handleChange = event => {
        this.setState({ 
            [event.target.name]: event.target.value 
        })
    };

    handleSubmit = async(event) => {
        // Prevents browser from reloading the page
        event.preventDefault();

        let groupObj = {
            course_id: this.state.course_id,
            group_name: this.state.group_name
        }

        let promises = [];
        promises.push(await axios
                            .post(`${process.env.REACT_APP_HOST}groups/`, groupObj)
                            .catch(function (error) {
                                console.log(error);
                            })
                    )

        Promise.all(promises).then(() => {
            for (let i=0; i < this.state.students.length; i++) {
                axios
                    .post(`${process.env.REACT_APP_HOST}groups/${parseInt(this.state.lastGroupId)+1}/participants/${this.state.students[i].ccid}/`)
                    .then(response => {
                        this.props.history.push('/calendar')
                        this.props.onPost();
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        })
    };

    render() {
        return(
            <div className="create-group">
                <div className="title-container">
                    <p style={{color:"black"}}> Create a New Group </p>
                </div>
                <form className={useStyles.root} onSubmit={this.handleSubmit}>
                    <div className="group-container">
                        <div className="create-misc">
                            {/* Group's COURSE ID */}
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
                            {/* Group's GROUP NAME */}
                            <div class="create-group-name">
                                <TextField
                                    required 
                                    style={{ minWidth: '100%'}}
                                    rows={1}
                                    variant="outlined"
                                    label="Group Name"
                                    name="group_name" 
                                    type="text" 
                                    value={this.state.name} 
                                    onChange={this.handleChange} >
                                </TextField>
                            </div>
                        </div>
                        {/* Group's STUDENTS */}
                        <div className="student-autocomplete">
                            <Autocomplete
                                multiple
                                style={{flexGrow:1}}
                                name="students"
                                value={this.state.students}
                                onChange={this.handleAutocomplete}
                                options={this.state.options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                getOptionLabel={(option) => `${option.lname}, ${option.fname} - ${option.ccid}`}
                                getOptionSelected={(option, value) => value.ccid === option.ccid}
                                groupBy={(option) => option.firstLetter}
                                renderInput={(params) => 
                                <TextField 
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: "new-password",
                                        required: this.state.students.length === 0
                                      }}
                                    required
                                    placeholder="Students(s)"
                                    variant="outlined" />}>
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="event-form-buttons">
                        {/* Submit Form button */}
                        <ThemeProvider theme={ muiTheme }>
                            <Button type="submit" color="primary" variant="contained">
                                Create Group
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

