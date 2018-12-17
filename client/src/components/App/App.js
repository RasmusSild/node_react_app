import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Homepage from "../Homepage/Homepage";
import RegistrationForm from "../Homepage/RegistrationForm";
import Dashboard from "../Dashboard/Dashboard";
import ResetPassword from "../Homepage/ResetPassword";
import NoRoute from "./NoRoute";
import { LocaleContext } from "../Translate/locale-context";

class App extends Component {

    constructor(props) {
        super(props);
        const languageSet = window.localStorage.getItem("language");

        this.state = {
            currentLanguage: languageSet ? languageSet : "en"
        };
        if (!languageSet) window.localStorage.setItem("language", "en");
    }

    changeLanguage = ({ currentTarget: { id } }) => {
        this.setState({
            currentLanguage: id
        });
        window.localStorage.setItem("language", id);
    };

    render() {
        return (
            <LocaleContext.Provider value={this.state.currentLanguage}>
                <div className="app">
                    <Switch>
                        <Route exact path='/' render={(props) => <Homepage {...props} changeLanguage={this.changeLanguage} />} />
                        <Route exact path='/register' render={(props) => <RegistrationForm {...props} changeLanguage={this.changeLanguage} />} />
                        <Route exact path='/reset' render={(props) => <ResetPassword {...props} changeLanguage={this.changeLanguage} />}  />
                        <Route exact path='/dashboard' render={(props) => <Dashboard {...props} changeLanguage={this.changeLanguage} />} />
                        <Route component={NoRoute} />
                    </Switch>
                </div>
            </LocaleContext.Provider>
        );
    }
}
export default App;