import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import tree from '../tree'
import {withRouter} from 'react-router-dom'



class Navbar extends Component {
  state = {
    collapsed: false
  }

  handleMenu = () => {
    this.setState((prevState) => {
      return {
        collapsed: !prevState.collapsed
      }
    })
  }

  handleLogout = () => {
      firebase.auth().signOut().then(
          () => {
            tree.set('user',null)
            tree.commit()
            window.localStorage.clear()
            this.props.userStateChanged()
            this.props.history.push('/')
          }
      ).catch(
          (error) => {
            console.log("Error",error)
          }
      )
  }

  render() {

    let {
      collapsed
    } = this.state

    let {
        userLogged
    }=this.props

    return (<nav className="navbar is-dark is-fixed-top" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link
          className="navbar-item"
          to="/"
        >
          <p className="cursive-font">
            Insta Atom
          </p>
        </Link>

        <a role="button"
          onClick={this.handleMenu}
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample"
        className={`navbar-menu ${collapsed ? 'is-active' : ''}`}>
        <div className="navbar-start"/>

        <div className="navbar-end">
            {
            userLogged && (<div className="navbar-item">
            <a onClick={this.handleLogout} className="button is-danger">
                Salir
            </a>
          </div>)
            }          
        </div>
      </div>
    </nav>)
  }
}

export default withRouter(Navbar)