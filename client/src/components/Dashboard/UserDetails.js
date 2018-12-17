import React, { Component } from 'react';
import {Segment, Header} from 'semantic-ui-react';
import {isAuthenticated, jsDateToReadable} from "../../utilities";
import {Redirect} from "react-router-dom";
import Translate from "../Translate/Translate";

class UserDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        };
    }

    render() {
        const {data} = this.state;
        let dataRows = null;

        if (!isAuthenticated()) {
            return <Redirect to='/' />
        }

        if (data && data.length > 0) {
            dataRows = data.map((row) => {
                let date = new Date(row.createdAt);
                return (
                    <Segment key={row._id}>
                        <span>
                            {jsDateToReadable(date)}
                        </span>
                    </Segment>
                )
            })
        }

        return (
            <div className="user_details">
                <Header><Translate string={'dashboard.user_logins'} /></Header>
                {dataRows}
            </div>
        );
    }
}

export default UserDetails;
