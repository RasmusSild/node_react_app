import React, { Component } from 'react'
import {Button, Message, Modal, Form} from 'semantic-ui-react';
import axios from "axios";
import Translate from "../Translate/Translate";

class NewUserModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: props.open,
            emailValue: '',
            passwordValue: '',
            showMessage: false,
            errorMessage: true,
            messageText: '',
        }
    }

    submitForm = () => {
        const {emailValue, passwordValue} = this.state;
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

    close = () => this.props.closeModal();

    render() {
        const {emailValue, passwordValue, showMessage, errorMessage, messageText, open} = this.state;

        return (
            <div>
                <Modal
                    open={open}
                    onClose={this.close}
                    closeIcon
                >
                    <Modal.Header><Translate string={'addUser.header'}/></Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.submitForm}>
                            <Form.Field>
                                <label><Translate string={'addUser.email'}/></label>
                                <Form.Input
                                    name='emailValue'
                                    value={emailValue}
                                    onChange={this.handleFormValueChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label><Translate string={'addUser.password'}/></label>
                                <Form.Input
                                    type={'password'}
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
                            <Button className={'float_right mb-10'} primary type='submit'><Translate string={'addUser.add'}/></Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}

export default NewUserModal