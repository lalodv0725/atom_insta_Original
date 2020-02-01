import React, { Component } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom'
import tree from '../tree'

class PostCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      author: null,
      user: tree.get("user"),
      loading: true,
      comment: '',
      placeholder: 'Escribe un comentario',
      disabled: false
    }
  }

  componentDidMount = () => {
    this.loadAuthor()
  }

  loadAuthor = () => {
    let {
      post
    } = this.props

    let authorRef = firebase.database().ref(`users/${post.authorId}`)

    authorRef.on('value', (snapshot) => {
      this.setState({
        author: snapshot.val(),
        loading: false
      })
    })
  }

  handleChange = (e) => {
    let {
      target
    } = e
    this.setState({
      comment: target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const {
      comment,
      user
    } = this.state

    const {
      post
    } = this.props

    if (comment) {

      this.setState({
        disabled: true
      })

      let comments = firebase.database().ref(`postsComments/${post.id}`)

      let refComment = comments.push()

      refComment.set({
        content: comment,
        userId: user.id,
        createdAt: new Date().toJSON()
      })

      this.setState({
        comment: '',
        placeholder: 'Comentario enviado',
      }, () => {
        setTimeout(() => {
          this.setState({
            placeholder: 'Escribe un comentario',
            disabled: false
          })
        }, 2000)
      })
    }
  }

  render() {
    let {
      post,
      readOnly
    } = this.props

    let {
      loading,
      author,
      comment,
      placeholder,
      disabled
    } = this.state

    if (loading) {
      return <div>
        Cargando...
      </div>
    }

    return (<div className="card">

      <div className="card-header">
        <div className="card-header-title">
          <div className="media">

            <div className="media-left">
              <figure className="image is-48x48">
                <img
                  className="is-rounded"
                  src={author.photoURL}
                  alt=""
                />
              </figure>
            </div>

            <div className="media-content">
              <p className="title is-4">{author.displayName}</p>
              <p className="subtitle is-6">{author.email}</p>
            </div>

          </div>
        </div>

        {
          !readOnly && (<div className="card-header-icon">
            <Link to={`/posts/${post.id}`}>
              Ver post
          </Link>
          </div>)
        }
      </div>

      <div className="card-image">
        <figure className="image is-4by3">
          <img src={post.photoURL}  alt=""/>
        </figure>
        <div className="footer-image is-vertical-center">
            <p>
            {
                post.content
            }
            </p>
        </div>
      </div>

      <div className="card-footer">
        <form
          onSubmit={this.handleSubmit}
          className="card-footer-item"
        >
          <div className="field is-grouped fields-comments">
            <p className="control is-expanded">
              <input
                value={comment}
                className="input"
                onChange={this.handleChange}
                disabled={disabled}
                placeholder={placeholder}
              />
            </p>
            <p className="control">
              <button
                disabled={disabled}
                className="button is-info">
                Enviar
                </button>
            </p>
          </div>

        </form>
      </div>
    </div>)
  }
}

export default PostCard