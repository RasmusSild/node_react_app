import React, { Component } from 'react';
import Translate from "../Translate/Translate";

class NoRoute extends Component {
    render() {
        return (
            <div className="404">
                <Translate string={'404.text'}/>
            </div>
        );
    }
}

export default NoRoute;