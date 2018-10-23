import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import {css} from 'styled-components';
import styled from 'styled-components/macro';
import { Layout, Menu } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const Item = {Menu}

// import Header from './Header'
// import LeftNav from './LeftNavContainer'

// TODO we should probably split the auth layout from 

const AppRoute = ({ component: Component, auth, firebase, ...rest }) => {
	return (
		<Layout>
		  	<Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }} >
		  		<Header style={{color: 'rgba(255, 255, 255, 0.65)'}}> Overlogger </Header>
		  		<Menu theme='dark'>
		  		
		  			<Menu.Item>
		  				<Link to='/addmatch'>Add Match</Link>
		  			</Menu.Item>
		  			<Menu.Item>
		  				<Link to='/matches'>Match History</Link>
		  			</Menu.Item>
		  			<Menu.Item>
		  				<Link to='/dashboard'>Dashboard</Link>
		  			</Menu.Item>
		  			<Menu.Item onClick={() => firebase.logout()}>
		  				Logout
		  			</Menu.Item>
		  		</Menu>
		  	</Sider>
		  	<Layout style={{ marginLeft: 200 }}>
			  	<Header style={{ background: '#fff' }}>
			  		Overlogger
			  	</Header>
	 			<ContentContainer>
				  <Route {...rest} render={(props) => (
				        !isLoaded(auth)
				        ? <span>Loading...</span>
				        : isEmpty(auth)
				          ? <span>Please <Link to="/login">login</Link> to continue</span>
				          : <WrappedGlobalLoader>
				          		<Component {...props} />
				          	</WrappedGlobalLoader>
				  )}/>

			  	</ContentContainer> 
		  	</Layout>
		</Layout>
	)
}

class GlobalLoader extends Component {
  render() {
    return (<div>{this.props.children}</div>)
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { firestore } = this.context.store;
    const userId = this.props.auth.uid;

    firestore.get('heroes');
    firestore.get('maps');
    firestore.get('globals');

    // TODO it's probably a bit costly to load all games when not all pages need them
    // TODO only load this season
    firestore.get({collection: 'matches', where: ['userId', '==', userId], orderBy: ['firebaseTime', 'desc']})
        .then(()=>{
          this.setState({currentSR: this.props.lastSR})
        });


    firestore.setListener({ collection: 'matches', where: ['userId', '==', userId], orderBy: ['firebaseTime', 'desc'] })
  }
}

const WrappedGlobalLoader = compose(
  firebaseConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(GlobalLoader)

// const WrappedGlobalLoader = firebaseConnect()(GlobalLoader)

const ContentContainer = styled(Content) `
	padding: 32px;
`

export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(AppRoute)
