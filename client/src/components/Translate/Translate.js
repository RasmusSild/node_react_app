import React, { Component } from "react";
import { LocaleContext } from "./locale-context";

import en from "./en.json";
import et from "./et.json";

export default class Translate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            langs: {
                en,
                et
            }
        };
    }
    render() {
        const {langs} = this.state;
        const {string} = this.props;
        return (
            <LocaleContext.Consumer>
                {value => langs[value][string]}
            </LocaleContext.Consumer>
        );
    }
}