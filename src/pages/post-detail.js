import React, { Component } from 'react'
import PostCard from '../components/post-card'
import firebase from 'firebase'
import CommentDetail from '../components/comment-detail'

class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      post: null,
      loading: true,
      comments: []
    }
  }

  componentDidMount = () => {
    this.loadDetail()
    this.loadComments()
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
        post: {
          ...snapshot.val(),
          id: id
        },
        loading: false
      })
    })
  }

  loadComments = () => {
    const {
      match: {
        params: {
          id
        }
      }
    } = this.props

    let commentsRef = firebase.database().ref(`postsComments/${id}`)

    commentsRef.on('value', (snapshot) => {
      const comments = snapshot.val()

      let newComments = []

      for (let comment in comments) {
        newComments.push({
          id: comment,
          content: comments[comment].content,
          createdAt: comments[comment].createdAt,
          userId: comments[comment].userId,
        })
      }

      this.setState({
        comments: newComments
      })
    })
  }

  render () {
    let {
      loading,
      post,
      comments
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

    return (<div className="columns">
      <div className="column">
        <PostCard
          post={post}
          readOnly
        />
      </div>
      <div className="column">
        <div className="card">
          <div className="card-header">
            <p className="card-header-title">
              Comentarios
            </p>
          </div>

          <div className="card-content">
            {
              comments.length > 0 ? (
                <React.Fragment>
                  {
                    comments.map(comment =>
                      <CommentDetail
                        key={comment.id}
                        comment={comment}
                      />
                    )
                  }
                </React.Fragment>
              ) : (<div>
                Escribe un comentario
              </div>)
            }
          </div>

        </div>
      </div>
    </div>)
  }
}

export default PostDetail