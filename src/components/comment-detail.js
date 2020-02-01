import React, { Component } from "react"
import firebase from 'firebase'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')

class CommentDetail extends Component {
  state = {
    author: null,
    loading: true
  }

  componentDidMount = () => {
    this.loadAuthor()
  }

  loadAuthor = () => {
    let {
      comment
    } = this.props

    let authorRef = firebase.database().ref(`users/${comment.userId}`)

    authorRef.once('value', (snapshot) => {
      this.setState({
        author: snapshot.val(),
        loading: false
      })
    })
  }

  render () {
    let {
      comment
    } = this.props

    let {
      loading,
      author
    } = this.state

    if (loading) {
      return <div />
    }

    return (
      <div className="media">
        <figure className="media-left">
          <p className="image is-48x48">
            <img
              className="is-rounded"
              src={author.photoURL}
              alt=""
             />
          </p>
        </figure>
        <div className="media-content">
          <p>
            <strong>{author.displayName}</strong>
            <br />
            {
              comment.content
            }
          </p>
          <small>
            {
              moment(comment.createdAt).fromNow().toString()
            }
          </small>
        </div>
      </div>
    )
  }
}

export default CommentDetail