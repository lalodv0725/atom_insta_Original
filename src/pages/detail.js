import React, { Component } from 'react';
import firebase from 'firebase'
import Card from '../components/card'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')

class Detail extends Component {
  state = {
    post: {},
    loading: true,
    comments: []
  }
  componentDidMount() {
    this.loadPost()
    this.loadComments()
  }

  loadPost = () => {
    let {
      match: {
        params: { id }
      }
    } = this.props
    firebase.database().ref(`posts/${id}`).once('value').then((snapshot) => {
      console.log(snapshot.val())
      this.setState({
        post: snapshot.val(),
        comments: [],
        loading: false
      })
    })
  }

  loadComments = () => {
    let {
      match: {
        params: { id }
      }
    } = this.props
    firebase.database().ref(`postsComments/${id}`).on('value', (snapshot) => {


      let comments = snapshot.val()
      let newComments = []

      for (let comment in comments) {
        newComments.push({
          id: comment,
          authorId: comments[comment].authorId,
          content: comments[comment].content,
          createdAt: comments[comment].createdAt,
        })
      }

      this.setState({
        comments: newComments
      })
    })
  }
  render() {
    let {
      post,
      loading,
      comments
    } = this.state

    let {
      match: {
        params: { id }
      }
    } = this.props


    if (loading) {
      return <div>
        Cargando...
      </div>
    }

    return (
      <div className="columns">
        <div className="column is-8">
          <Card post={post} />
        </div>
        <div className="column">
          {
            comments.map(c => {
              return (<div>
                <p>
                  {
                    c.content
                  }
                </p>
                <p>
                  {
                    moment(c.createdAt).fromNow().toString().toUpperCase()
                  }
                </p>
                </div>)
            })
          }
        </div>
      </div>
    );
  }
}

export default Detail;
