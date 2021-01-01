import React, { Component } from "react";

// import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from '@material-ui/core/FormGroup';

import './filtering.css';
import { CareerPlanningCheckbox, ClinicalShadowingCheckbox, ClinicalSkillsCheckbox, 
         DiscoveryLearningCheckbox, ExamCheckbox, LabsCheckbox, LearningCommunitiesCheckbox,
         OSCECheckbox, SelfDirectedLearningCheckbox, SmallGroupCheckbox,
         SpecialEventsCheckbox, TeamBasedLearningCheckbox, WholeClassCheckbox } from "./customCheckboxes.js"

export default class Filtering extends Component{
    constructor(props) {
        super(props)

        this.state = {
            windowWidth: window.innerWidth,
            career_planning: true,
            clinical_shadowing: true,
            clinical_skills: true,
            discovery_learning: true,
            exam: true,
            labs: true,
            learning_communities: true,
            osce: true,
            self_directed_learning: true,
            small_group: true,
            special_events: true,
            team_based_learning: true,
            whole_class: true,
            filtered_by: []
        }

        this.setStateAsync();
        this.handleChange = this.handleChange.bind(this);
    }

    // Async await to ensure data is properly loaded
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    // On checkbox changes, filtering by selection
    handleChange = async(event) => {
        let filter_list = this.state.filtered_by;
        let checked = event.target.checked;
        let checked_event = event.target.id;

        await this.setStateAsync({ ...this.state, [event.target.name]: event.target.checked });
        this.props.loading();

        /* Push checked boxes into the filter array and update the calendar */
        if (checked) {
            await this.setStateAsync({ filtered_by: [...this.state.filtered_by, checked_event ]});
            this.props.onFilter(this.state.filtered_by.toString()); /* return query for a filtered calendar */
        } 
        
        /* Box unchecked so remove it from the "filtered" list */
        else {

            var index = filter_list.indexOf(checked_event);
            if (index > -1) {
                // remove event from list
                filter_list.splice(index, 1);
                await this.setStateAsync({ filtered_by: filter_list })
                
                if (this.state.filtered_by.length === 0) {
                    // this.props.emptyFilter(); /* reset is_filtered to false */
                    // this.props.onPost();      /* render calendar back with all events */
                    this.props.onFilter("null");
                }
                else {
                    this.props.onFilter(this.state.filtered_by.toString()); /* return query for a filtered calendar */
                }
            }
            
            // filter off present filtered_by list
            else {
                this.props.onFilter(this.state.filtered_by.toString());
            }
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

    /* Update list of event_types for filtering options */
    componentDidUpdate(prevProps) {
        if (this.props.event_types !== prevProps.event_types) {
            for (const key in this.props.event_types) {
                this.setState({
                    filtered_by: [...this.state.filtered_by, key]
                });
            }
        }
    }


    render() {
        return (
            <div className="filtering-items" key={this.props.event_types}>   
                <div className="filter-category">
                    <div className="title-container">
                        <p>Event Types</p>
                    </div>
                </div>
                <FormGroup>
                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <CareerPlanningCheckbox 
                                    checked={this.state.career_planning}
                                    onChange={this.handleChange} 
                                    name='career_planning'
                                    id='Career Planning'
                                    key="0"
                                />}
                            label="Career Planning" />
                    </div>
    
                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <ClinicalShadowingCheckbox 
                                    checked={this.state.clinical_shadowing}
                                    onChange={this.handleChange} 
                                    name="clinical_shadowing" 
                                    id="Clinical Shadowing"
                                    key="1"
                                />}
                            label="Clinical Shadowing" />
                    </div>
    
                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <ClinicalSkillsCheckbox 
                                    checked={this.state.clinical_skills}
                                    onChange={this.handleChange} 
                                    name="clinical_skills" 
                                    id="Clinical Skills"
                                    key="2"
                                />}
                            label="Clinical Skills" />
                    </div>
    
                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <DiscoveryLearningCheckbox 
                                    checked={this.state.discovery_learning}
                                    onChange={this.handleChange} 
                                    name="discovery_learning" 
                                    id="Discovery Learning"
                                    key="3"
                                />}
                            label="Discovery Learning" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <ExamCheckbox 
                                    checked={this.state.exam}
                                    onChange={this.handleChange} 
                                    name="exam" 
                                    id="Exam"
                                    key="4"
                                />}
                            label="Exam" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <LabsCheckbox 
                                    checked={this.state.labs}
                                    onChange={this.handleChange} 
                                    name="labs" 
                                    id="Labs"
                                    key="5"
                                />}
                            label="Labs" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <LearningCommunitiesCheckbox 
                                    checked={this.state.learning_communities}
                                    onChange={this.handleChange} 
                                    name="learning_communities" 
                                    id="Learning Communities"
                                    key="6"
                                />}
                            label="Learning Communities" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <OSCECheckbox 
                                    checked={this.state.osce}
                                    onChange={this.handleChange} 
                                    name="osce" 
                                    id="OSCE"
                                    key="7"
                                />}
                            label="OSCE" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <SelfDirectedLearningCheckbox
                                    checked={this.state.self_directed_learning}
                                    onChange={this.handleChange} 
                                    name="self_directed_learning" 
                                    id="Self Directed Learning"
                                    key="8"
                                />}
                            label="Self Directed Learning" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <SmallGroupCheckbox 
                                    checked={this.state.small_group}
                                    onChange={this.handleChange} 
                                    name="small_group" 
                                    id="Small Group"
                                    key="9"
                                />}
                            label="Small Group" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <SpecialEventsCheckbox 
                                    checked={this.state.special_events}
                                    onChange={this.handleChange} 
                                    name="special_events" 
                                    id="Special Events"
                                    key="10"
                                />}
                            label="Special Events" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <TeamBasedLearningCheckbox 
                                    checked={this.state.team_based_learning}
                                    onChange={this.handleChange} 
                                    name="team_based_learning" 
                                    id="Team Based Learning"
                                    key="11"
                                />}
                            label="Team Based Learning" />
                    </div>

                    <div className="event-filter-types">
                        <FormControlLabel
                            control={
                                <WholeClassCheckbox 
                                    checked={this.state.whole_class}
                                    onChange={this.handleChange} 
                                    name="whole_class" 
                                    id="Whole Class"
                                    key="12"
                                />}
                            label="Whole Class" />
                    </div>
                </FormGroup>
            </div>
        )
    }
}
