import React, { Component } from 'react'
import Navbar from './navbar'
import { ToastContainer } from 'react-toastify'

class Layout extends Component {
  render() {
    return (
      <div>
        <ToastContainer />
        <Navbar />
        <div className="container">
          <div className="section">
            {
              this.props.children
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Layout
