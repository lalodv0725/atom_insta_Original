import React, { Component } from 'react'
import PostCard from '../components/post-card'
import firebase from 'firebase'

class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      post: null,
      loading: true
    }
  }

  componentDidMount = () => {
    this.loadDetail()
  }

  loadDetail = () => {
    const {
      match: {
        params: {
          id
        }
      }
    } = this.props

    let postRef = firebase.database().ref(`posts/${id}`)
    postRef.once('value', (snapshot) => {
      this.setState({
        post: snapshot.val(),
        loading: false
      })
    })
  }

  render () {
    let {
      loading,
      post
    } = this.state

    if (loading){
      return <div 
        className='is-vertical-center'
        style={{
        height: '90vh'
      }}>
        <p className="has-text-centered cursive-font">
          Cargando...
        </p>
      </div>
    }
    return (<div>
      <PostCard
        post={post}
        readOnly
        />
    </div>)
  }
}

export default PostDetail