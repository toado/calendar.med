import React from "react";
import "./groupsList.css"
import GroupItem from "./groupItem.js"

export default class GroupsList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            eventGroups: this.props.eventGroups,
            instructors: [],
            newGroup: {}
        }
    }

    //Add group button with svg icon
    addGroupComponent() {
        return (
        <div className="add-container">
            <button className="add-group"
                onClick={() => this.addGroup()}>
                <svg >
                    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                </svg>
                <div>Add Group</div>
            </button>
        </div>
        )
    }

    GetNewGroup = (group) => {
        for (let key in group) {
            if (key === "group_name") {
                continue
            }
            if (!group[key]) {
                return
            }
        }
        this.props.onAddGroup(group)
    }

    async addGroup() {
        const groupObj = {
             empty: true
        }
        this.setState({
            eventGroups: [...this.state.eventGroups, groupObj]
        }, () => {
        })
    }

    render() {
        if (!this.props.groupPage) {
            if (this.state.eventGroups.length > 0) {
                return (
                <div className="groups-list">
                    {this.state.eventGroups.map((group) => {
                        return (
                        <GroupItem
                            key={group.event_group_id}
                            group={group}
                            windowWidth={this.props.windowWidth}
                            editMode={this.props.editMode}
                            onDeleteGroup={this.props.onDeleteGroup}
                            onAddGroup={this.GetNewGroup} />
                        )}
                    )}
                    {this.props.editMode ? this.addGroupComponent() : null}
                </div>
                );
            } else {
                return (
                <div className="groups-list">
                    <GroupItem
                        group={false}
                        editMode={this.props.editMode}/>
                    {this.props.editMode ? this.addGroupComponent() : null}
                </div>
                );
            }
        }

    }
}