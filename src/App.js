import React, { Component } from 'react'
import firebase from 'firebase'
import {
  BrowserRouter as Router, // Enrutador
  Switch, // navegación entre rutas
  Route, // ruta
} from 'react-router-dom'

// css
import 'bulma/css/bulma.css'
import './App.css'

// Components

import Layout from './components/layout'

// Pages
import Login from './pages/login'
import Home from './pages/home'

// Setup firebase
let firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "atom-insta10.firebaseapp.com",
  databaseURL: "https://atom-insta10.firebaseio.com",
  projectId: "atom-insta10",
  storageBucket: "atom-insta10.appspot.com",
  messagingSenderId: "207336179354",
  appId: "1:207336179354:web:90259c37b5755e88ab8123",
  measurementId: "G-844694ZWG8"
}
firebase.initializeApp(firebaseConfig)

class App extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
        <Router>
          <Layout>
            <Switch>
              <Route
                path='/'
                exact
                component={Login}
              />
              <Route
                path='/home'
                exact
                component={Home}
              />
            </Switch>
          </Layout>

        </Router>
    )
  }
}

export default App;
