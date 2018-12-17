import React, { Component } from 'react';
import LoginForm from "./LoginForm";
import {Grid} from 'semantic-ui-react';
import {isAuthenticated} from "../../utilities";
import {Redirect} from "react-router-dom";
import LanguagePicker from "../Translate/LanguagePicker";

class Homepage extends Component {

  render() {
      if (isAuthenticated()) {
          return <Redirect to='/dashboard' />
      }

      return (
          <div className="homepage">
              <Grid>
                  <Grid.Column width={5} />
                  <Grid.Column className={'mt-100'} width={6}>
                      {<LoginForm />}
                  </Grid.Column>
                  <Grid.Column width={5} >
                      <LanguagePicker changeLanguage={this.props.changeLanguage}/>
                  </Grid.Column>
              </Grid>
          </div>
      );
  }
}

export default Homepage;
