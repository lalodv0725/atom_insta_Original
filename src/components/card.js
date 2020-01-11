import React, { Component } from 'react';
import firebase from 'firebase'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee, faAngleDown, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')
library.add(faCheckSquare, faCoffee, faAngleDown, faEllipsisV)

export default class Card extends Component {
  state = {
    author: {},
    formData: {}
  }

  componentDidMount = () => {
    this.loadDetail()
  }

  handleChangeComment = (e) => {
    // e.preventDefault()
    let {
      target
    } = e
    let {
      formData
    } = this.state

    formData[target.name] = target.value

    this.setState({
      formData
    })
  }

  loadDetail = () => {
    let {
      post
    } = this.props

    firebase.database().ref(`users/${post.authorId}`).once('value').then((snapshotUser) => {
      this.setState({
        author: snapshotUser.val()
      })
    })
  }

  handleSubmitComment = (e) => {
    e.preventDefault()

    let {
      post
    } = this.props

    let {
      formData
    } = this.state

    var postsRef = firebase.database().ref(`postsComments/${post.id}`)

    var commentRef = postsRef.push();
    commentRef.set({
      content: formData.content,
      createdAt: new Date().toJSON(),
      authorId: '3qODBBirJeXb0FZaM6auSPSWJgo2'
    })

    this.setState({
      formData: {
        content: ''
      }
    })

  }

  render() {
    let {
      post
    } = this.props

    let {
      author,
      formData
    } = this.state

    return (
      <div class="card" key={post.id}>
        <div className="card-header">
          <div className="card-header-title">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img
                    src={author.photoURL}
                    alt="Placeholder image"
                    className="is-rounded"
                  />
                </figure>
              </div>

              <div class="media-content">
                <p class="title is-4">{author.displayName}</p>
                <p class="subtitle is-6">@johnsmith</p>
              </div>
            </div>
          </div>
          <a href="#" class="card-header-icon" aria-label="more options">
            <span class="icon">
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </span>
            <FontAwesomeIcon icon="ellipsis-v" />
          </a>
        </div>
        <div class="card-image">
          <figure class="image is-4by3">
            <LazyLoadImage
              delayTime={100}
              alt={post.content}
              effect="opacity"
              src={post.photoUrl}
              placeholderSrc={post.photoUrl}
            />
          </figure>
        </div>
        <div class="card-content">
          <div class="content">
            <p>
              {
                post.content
              }
            </p>
            <p>
              {
                moment(post.createdAt).fromNow().toString().toUpperCase()
              }
            </p>
          </div>
        </div>
        <footer class="card-footer">
          <form class="card-footer-item"
            onSubmit={this.handleSubmitComment}>
            <input
              name="content"
              type="text"
              value={formData.content}
              onChange={this.handleChangeComment}
              placeholder="Escribe un comentario"
              className="input"
            />
          </form>
          <div class="card-footer-item">
            <Link to={`/post/${post.id}`}>
              Ver detalle
            </Link>
          </div>
        </footer>
      </div>
    );
  }
}

