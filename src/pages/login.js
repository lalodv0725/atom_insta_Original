import React, { Component } from 'react'
import firebase from 'firebase'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state =  {
      loading: true
    }
  }

  componentDidMount = async () => {
    try {
      let data = await firebase.auth().getRedirectResult()

      if (data.credential) {
        
        let user = firebase.database().ref(`users/${data.user.uid}`)

        user.set({
          displayName: data.user.displayName,
          photoURL: data.user.photoURL,
        })

        let {
          history
        } = this.props
        history.push('/home')

      } else {
        this.setState({
          loading: false
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  handleLoginWithSocialNetwork = async (service) => {
    let provider
    let stringService

    if (service === 'facebook') {
      stringService = 'FacebookAuthProvider'
    } else if (service === 'google') {
      stringService = 'GoogleAuthProvider'
    }

    provider = new firebase.auth[stringService]()
    firebase.auth().signInWithRedirect(provider)
  }

  render() {

    let {
      loading
    } = this.state

    let content = <p className="cursive-font has-text-centered">Loading...</p>

    if (!loading) {
      content = (
        <div className="buttons">
          <button
            onClick={() => this.handleLoginWithSocialNetwork('facebook')}
            className="button is-fullwidth is-info"
          >
            Iniciar sesion con facebook
          </button>

          <button
            onClick={() => this.handleLoginWithSocialNetwork('google')}
            className="button is-fullwidth is-success"
          >
            Iniciar sesion con Google
          </button>
        </div>
      )
    }

    return (<div className="columns">
      <div className="column is-two-thirds">
        <img src="/assets/preview.jpg" />
      </div>
      <div className="column">
        <h1 className="title is-1 has-text-centered cursive-font main-title">
          Insta Atom
        </h1>
        {
          content
        }
      </div>
    </div>)
  }
}

export default Login;