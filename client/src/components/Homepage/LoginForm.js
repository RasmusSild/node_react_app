import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {Form, Button, Message} from 'semantic-ui-react';
import {setAuthToken, setLanguageCookie} from "../../utilities";
import Translate from '../Translate/Translate';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            emailValue: '',
            passwordValue: '',
            loggedIn: false,
            showMessage: false,
            messageText: ''
        }
    }

    logIn = () => {
        const {emailValue, passwordValue} = this.state;
        setLanguageCookie();
        const reqBody = {
            email: emailValue,
            password: passwordValue
        };

        axios.post('/auth/login', reqBody,{withCredentials: true})
            .then((response) => {
                setAuthToken(response.data.token);
                this.setState({
                    loggedIn: true
                })
            })
            .catch((error) => {
                this.setState({
                    showMessage: true,
                    messageText: error.response ? error.response.data.error : error.message
                })
            })
    };

    handleFormValueChange = (e, { name, value }) => this.setState({ [name]: value });

    render() {
        const {emailValue, passwordValue, loggedIn, showMessage, messageText} = this.state;

        if (loggedIn === true) {
            return <Redirect to='/dashboard' />
        }

        return (
            <div className="login_form">
                <Form onSubmit={this.logIn}>
                    <Form.Field>
                        <label><Translate string={'login.email'}/></label>
                        <Form.Input
                            name='emailValue'
                            value={emailValue}
                            onChange={this.handleFormValueChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label><Translate string={'login.password'}/></label>
                        <Form.Input
                            type='password'
                            name='passwordValue'
                            value={passwordValue}
                            onChange={this.handleFormValueChange}
                        />
                    </Form.Field>
                    {showMessage &&
                        <Message negative>
                            {messageText}
                        </Message>
                    }
                    <div className={'float_right'}>
                        <Button primary type='submit'><Translate string={'login.login'}/></Button>
                        <Link to='/register'>
                            <Button basic><Translate string={'login.register'}/></Button>
                        </Link>
                        <Link to='/reset'>
                            <Button basic><Translate string={'login.forgot'}/></Button>
                        </Link>
                    </div>
                </Form>
            </div>
        );
    }
}

export default LoginForm;
