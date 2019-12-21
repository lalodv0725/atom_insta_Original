import React, { Component } from 'react'
import Navbar from './navbar'

class Layout extends Component {
  render() {
    return (
      <div>
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
