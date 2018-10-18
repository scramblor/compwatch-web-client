import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import styled from 'styled-components/macro';
import {css, ThemeProvider} from 'styled-components'

import AppRoute from './common/AppRoute'
// import './App.css';
import MatchEntry from './MatchEntry/MatchEntryContainer'


class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    return (
      <ThemeProvider theme={monochromaticTheme}>
        <MasterDiv>
          {process.env.NODE_ENV === 'development' && !process.env.REACT_APP_HIDE_DEV_WARNING && <DevWarningDiv position="top"/>}
          
          <Router>
            <Switch>
              <Route path="/login" component={WrappedLoginPage}/>
              <AppRoute path="/addmatch" component={MatchEntry} />
              <Route exact path="/" component={WelcomePage}/>
            </Switch>
          </Router>

          {process.env.NODE_ENV === 'development' && !process.env.REACT_APP_HIDE_DEV_WARNING && <DevWarningDiv position="bottom"/>}
        </MasterDiv>
      </ThemeProvider>
    );

  }

}

const WelcomePage = () => {
  return (
      <div>
        Welcome to Overlogger!
        <Link to="/login"> Login </Link>
      </div>
    )
}

// TODO Login page will always redirect if you are already logged in. Should we only redirect after successful login?
const LoginPage = ({firebase,auth}) => (
        !isLoaded(auth)
        ? <span>Loading...</span>
        : isEmpty(auth)
          ? <div>
              <button onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>
                Login With Google
              </button>
            </div>
          : <Redirect to="/addmatch"/>
  )

const WrappedLoginPage = compose(firebaseConnect(), connect(({ firebase: { auth } }) => ({ auth })))(LoginPage);

const DevWarningDiv = ({position}) => {
  var style = {color: 'white', backgroundColor: 'red', position: 'fixed', width:'100%', zIndex:100}
  switch (position) {
    case 'top':
      style.top = '0px'
      break;
    case 'bottom':
      style.bottom = '0px'
      break;
    default:
      console.log('warning dev div with no position')
  }
  return <div style={style}>DEVELOPMENT BUILD</div>
}

const MasterDiv = styled.div `
  text-align: center;
  background-color: ${props => props.theme.mid};
`

const monochromaticTheme = {
  primary: '#333333',
  secondary: '#666666',
  light: '#ffffff',
  mid: '#999999',
  dark: '#000000'
}

// http://paletton.com/#uid=23P0u0kmlhN53nGdZkFwaeqS1cp
const blueOrangeTheme = {
  primary: '#09254E',
  secondary: '#CE8C17',
  light: '#ffffff',
  mid: '#999999',
  dark: '#000000'
}

App.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}

export default App