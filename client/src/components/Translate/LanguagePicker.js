import React, { Component } from "react";
import {Flag} from 'semantic-ui-react';

export default class LanguagePicker extends Component {
    render() {
        return (
            <div className={'lang_picker'}>
                <Flag className={'pointer'} id="en" onClick={this.props.changeLanguage} name='gb' />
                <Flag className={'pointer'} id="et" onClick={this.props.changeLanguage} name='ee' />
            </div>
        );
    }
}