import React, { Component } from 'react'
import Navbar from './navbar'
import { ToastContainer } from 'react-toastify'

class Layout extends Component {
  render() {

      let {
          children
      } = this.props

    return (
      <div>
        <ToastContainer />
        <Navbar />
        <div className="container">
          <div className="section">
            {
              children
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
