import React, { Component } from 'react';
import axios from 'axios';
import {Grid, Pagination, Modal, Icon, Table, Popup, Message} from 'semantic-ui-react';
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import NewUserModal from "./NewUserModal";
import {createAuthorizationHeader, isAuthenticated} from "../../utilities";
import {Redirect} from "react-router-dom";
import './Dashboard.css';
import UserDetails from "./UserDetails";
import LanguagePicker from "../Translate/LanguagePicker";
import Translate from "../Translate/Translate";

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            usersList: null,
            detailsData: null,
            activePage: 1,
            addNewUserActive: false,
            deleteUserActive: false,
            detailsOpen: false,
            showMessage: false,
            errorMessage: true,
            messageText: '',
        };
    }

    componentDidMount() {
        if (isAuthenticated()) this.getUsersList();
    }

    getUsersList = () => {
        const headers = createAuthorizationHeader();
        axios.get('/users/usersList', headers)
            .then((response) => {
                let list = this.paginateData(response.data.data, 5);
                this.setState({
                    usersList: list,
                    activePage: 1
                })
            })
            .catch((error) => {
                this.setState({
                    showMessage: true,
                    errorMessage: true,
                    messageText: error.response ? error.response.data.error : error.message
                });
            })
    };

    getUserDetails = (id) => {
        const headers = createAuthorizationHeader();
        axios.get(`/users/userLogins/${id}`, headers)
            .then((response) => {
                this.setState({
                    detailsOpen: true,
                    detailsData: response.data.data,
                    showMessage: false
                })
            })
            .catch((error) => {
                this.setState({
                    showMessage: true,
                    errorMessage: true,
                    messageText: error.response ? error.response.data.error : error.message
                });
            })
    };

    deleteUser = () => {
        const {activeDelete} = this.state;
        const headers = createAuthorizationHeader();
        axios.delete(`/users/deleteUser/${activeDelete}`, headers)
            .then((response) => {
                this.setState({
                    showMessage: true,
                    errorMessage: false,
                    messageText: response.data.message
                });
                this.closeDeleteUserModal();
            })
            .catch((error) => {
                this.setState({
                    showMessage: true,
                    errorMessage: true,
                    messageText: error.response ? error.response.data.error : error.message
                });
                this.closeDeleteUserModal();
            })
    };

    logOut = () => {
        window.localStorage.removeItem('authToken');
        this.setState({loggedOut: true});
    };

    paginateData = (data, pageSize) => {
        let pages = [],
            i = 0,
            n = data.length;

        while (i < n) {
            pages.push(data.slice(i, i += pageSize));
        }

        return pages;
    };

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

    openAddUserModal = () => this.setState({addNewUserActive: true});

    closeAddUserModal = () => {
        this.setState({
            addNewUserActive: false
        }, () => this.getUsersList());
    };

    openDeleteUserModal = (evt, id) => {
        evt.stopPropagation();
        this.setState({deleteUserActive: true, activeDelete: id});
    };

    closeDeleteUserModal = () => {
        this.setState({
            deleteUserActive: false,
            activeDelete: null
        }, () => this.getUsersList());
    };

    closeDetails = () => {
        this.setState({
            detailsOpen: false,
            detailsData: null
        });
    };

    resetMessage = () => {
        this.setState({
            showMessage: false,
            errorMessage: true,
            messageText: '',
        })
    };

    render() {
        const {usersList, activePage, addNewUserActive, deleteUserActive, loggedOut, detailsOpen, detailsData, showMessage, errorMessage, messageText} = this.state;
        let usersTable = null;

        if (!isAuthenticated() || loggedOut) {
            return <Redirect to='/' />
        }

        if (usersList && usersList.length > 0) {
            let usersRows = usersList[activePage - 1].map((user) => {
                return (
                    <Table.Row
                        key={user.email}
                        onClick={() => this.getUserDetails(user._id)}
                        className={'pointer'}
                    >
                        <Table.Cell>
                            <span>{user.email}</span>
                        </Table.Cell>
                        <Table.Cell>
                            <span>{user.isVerified ?
                                <Translate string={'dashboard.yes'} /> :
                                <Translate string={'dashboard.no'} />}
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            <Popup
                                trigger={
                                    <Button
                                        size={'tiny'}
                                        color='red'
                                        icon={'trash'}
                                        onClick={(evt) => this.openDeleteUserModal(evt, user._id)}
                                    />
                                }
                                content={<Translate string={'dashboard.delete_user_popup'} />}
                            />
                        </Table.Cell>
                    </Table.Row>
                )
            });
            usersTable = (
                <div>
                    <Table celled selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell><Translate string={'dashboard.email'} /></Table.HeaderCell>
                                <Table.HeaderCell><Translate string={'dashboard.verified'} /></Table.HeaderCell>
                                <Table.HeaderCell><Translate string={'dashboard.actions'} /></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {usersRows}
                        </Table.Body>
                    </Table>
                    <Pagination
                        className={'pagination'}
                        activePage={activePage}
                        onPageChange={this.handlePaginationChange}
                        totalPages={usersList.length}
                    />
                </div>

            )
        }

        return (
            <div className="dashboard">
                {addNewUserActive && <NewUserModal open={addNewUserActive} closeModal={this.closeAddUserModal} />}
                {deleteUserActive &&
                    <Modal
                        open={deleteUserActive}
                        onClose={this.closeDeleteUserModal}
                        closeIcon
                    >
                        <Modal.Header><Translate string={'dashboard.delete_user'} /></Modal.Header>
                        <Modal.Content>
                            <span><Translate string={'dashboard.confirm_delete'} /></span>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button
                                color='red'
                                content={<Translate string={'dashboard.no'} />}
                                onClick={this.closeDeleteUserModal}
                            />
                            <Button
                                primary
                                content={<Translate string={'dashboard.yes'} />}
                                onClick={this.deleteUser}
                            />
                        </Modal.Actions>
                    </Modal>
                }
                <Grid>
                    <Grid.Column width={4} className={'mt-50'}>
                        {!detailsOpen &&
                            <Popup
                                trigger={
                                    <Button
                                        className={'float_right'}
                                        onClick={this.openAddUserModal}
                                        color='green'
                                    >
                                        <Icon name='plus' />
                                        <Translate string={'dashboard.new_user_btn'} />
                                    </Button>
                                }
                                content={<Translate string={'dashboard.new_user_popup'} />}
                            />
                        }
                        {detailsOpen &&
                            <Popup
                                trigger={
                                    <Button
                                        primary
                                        basic
                                        className={'float_right'}
                                        onClick={this.closeDetails}
                                    >
                                        <Icon name='arrow left' />
                                        <Translate string={'dashboard.back'} />
                                    </Button>
                                }
                                content={<Translate string={'dashboard.close_details_popup'} />}
                            />
                        }
                    </Grid.Column>
                    <Grid.Column width={8} className={'mt-50'}>
                        {showMessage &&
                            <Message
                                onDismiss={() => this.resetMessage()}
                                negative={errorMessage}
                                positive={!errorMessage}
                            >
                                {messageText}
                            </Message>
                        }
                        {!detailsOpen && usersTable}
                        {detailsOpen && <UserDetails data={detailsData} />}
                    </Grid.Column>
                    <Grid.Column width={4} className={'mt-10'}>
                        <div className={'dashboard_menu_right'}>
                            <LanguagePicker changeLanguage={this.props.changeLanguage}/>
                            <Button primary onClick={this.logOut}>
                                <Icon name='log out'/>
                                <Translate string={'dashboard.logout_btn'} />
                            </Button>
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Dashboard;
