import React, { Component } from 'react'
import firebase from 'firebase'
import store from '../tree'
import { toast } from 'react-toastify'

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

        let userFormat = {
          id: data.user.uid,
          displayName: data.user.displayName,
          photoURL: data.user.photoURL,
        }

        user.set(userFormat)
        window.localStorage.setItem('user', JSON.stringify(userFormat))

        store.set("user", userFormat)
        store.commit()
        this.props.userStateChanged(userFormat)

      } else {
        this.setState({
          loading: false
        })
      }
    } catch (error) {
      this.setState({
        loading: false
      })

      toast.error(
        `Error: ${error.message}`,
        {
          position: toast.POSITION.TOP_RIGHT
        }
      )
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

    return (<div className="columns columns-main-login">
      <div className="column is-two-thirds">
        <img src="/assets/preview.jpg"  alt=""/>
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