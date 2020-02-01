import React, { Component } from 'react'
import Navbar from './navbar'
import { ToastContainer } from 'react-toastify'
import Login from '../pages/login'
import tree from '../tree'

class Layout extends Component {
state = {
    user: tree.get('user')
}

    stateLoggedChange = (data=null) => {
        this.setState ({
            user:data
        })
    }

  render() {
      let {
          user
      } = this.state

      let {
          children
      } = this.props

    return (
      <div>
        <ToastContainer />
        <Navbar 
                userLogged={!!user}
                userStateChanged={this.stateLoggedChange}/>
        <div className="container">
          <div className="section">
            {
              user ? children : <Login userStateChanged={this.stateLoggedChange}/>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
