import React, { Component } from 'react';
import axios from 'axios';
import {Form, Button, Message, Grid} from 'semantic-ui-react';
import Translate from "../Translate/Translate";
import {setLanguageCookie} from "../../utilities";
import LanguagePicker from "../Translate/LanguagePicker";

class RegistrationForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            emailValue: '',
            passwordValue: '',
            showMessage: false,
            errorMessage: true,
            messageText: '',
        }
    }

    submitForm = () => {
        const {emailValue, passwordValue} = this.state;
        setLanguageCookie();
        const reqBody = {
            email: emailValue,
            password: passwordValue
        };

        axios.post('/users/signUp', reqBody)
            .then((response) => {
                this.setState({
                    emailValue: '',
                    passwordValue: '',
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
        const {emailValue, passwordValue, showMessage, errorMessage, messageText} = this.state;

        return (
            <div className="reg_form">
                <Grid>
                    <Grid.Column width={5} />
                    <Grid.Column width={6} className={'mt-100'}>
                        <Form onSubmit={this.submitForm}>
                            <Form.Field>
                                <label><Translate string={'register.email'} /></label>
                                <Form.Input
                                    name='emailValue'
                                    value={emailValue}
                                    onChange={this.handleFormValueChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label><Translate string={'register.password'} /></label>
                                <Form.Input
                                    type='password'
                                    name='passwordValue'
                                    value={passwordValue}
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
                            <Button className={'float_right'} primary type='submit'><Translate string={'register.register'} /></Button>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <LanguagePicker changeLanguage={this.props.changeLanguage}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default RegistrationForm;
