import React, { Component } from 'react';
import axios from 'axios';
import {Form, Button, Message, Grid} from 'semantic-ui-react';
import {isAuthenticated, setLanguageCookie} from "../../utilities";
import {Redirect} from "react-router-dom";
import Translate from "../Translate/Translate";
import LanguagePicker from "../Translate/LanguagePicker";

class ResetPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            emailValue: '',
            showMessage: false,
            errorMessage: true,
            messageText: '',
        }
    }

    submitForm = () => {
        const {emailValue} = this.state;
        setLanguageCookie();
        const reqBody = {
            email: emailValue
        };

        axios.post('/users/resetPassword', reqBody)
            .then((response) => {
                this.setState({
                    emailValue: '',
                    showMessage: true,
                    errorMessage: false,
                    messageText: response.data.message
                })
            })
            .catch((error) => {
                this.setState({
                    showMessage: true,
                    errorMessage: true,
                    messageText: error.response ? error.response.data.error : error.message
                })
            })
    };

    handleFormValueChange = (e, { name, value }) => this.setState({ [name]: value });

    render() {
        const {emailValue, showMessage, errorMessage, messageText} = this.state;

        if (isAuthenticated()) {
            return <Redirect to='/dashboard' />
        }

        return (
            <div className="reset_pw_form">
                <Grid>
                    <Grid.Column width={5} />
                    <Grid.Column width={6} className={'mt-100'}>
                        <Form onSubmit={this.submitForm}>
                            <Form.Field>
                                <label><Translate string={'reset.email'} /></label>
                                <Form.Input
                                    name='emailValue'
                                    value={emailValue}
                                    onChange={this.handleFormValueChange}
                                />
                            </Form.Field>
                            {showMessage &&
                                <Message
                                    negative={errorMessage}
                                    positive={!errorMessage}
                                >
                                    {messageText}
                                </Message>
                            }
                            <Button className={'float_right'} primary type='submit'><Translate string={'reset.reset'} /></Button>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={5} >
                        <LanguagePicker changeLanguage={this.props.changeLanguage}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default ResetPassword;
