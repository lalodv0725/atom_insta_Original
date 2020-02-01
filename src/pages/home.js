import React, { Component } from 'react'
import firebase from 'firebase'
// import Card from '../components/card'
import Post from '../components/post'
import PostCard from '../components/post-card'
import {validateUser} from '../validate-user'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  componentDidMount = () => {
    validateUser()
    let postsRef = firebase.database().ref('posts')

    //.orderByChild("authorId").equalTo("vjdsnd")
    

    postsRef.on('value', (snapshot) => {

      let posts = snapshot.val()
      let newPosts = []

      for (let post in posts) {
        newPosts.push({
          id: post,
          content: posts[post].content,
          photoURL: posts[post].photoURL,
          authorId: posts[post].authorId,
          createdAt: posts[post].createdAt,
        })
      }

      this.setState({
        posts: newPosts.reverse()
      })

    })
  }

  render() {
    let {
      posts
    } = this.state

    return (
      <div>
        <div
          className="container-new-post"
        >
          <Post />
        </div>
        <div className="columns">

          <div
            className="column is-half is-offset-one-quarter">
            {
              posts.map((p, i) => {
                return (<PostCard
                  post={p}
                  key={i}
                />)
              })
            }
          </div>

        </div>

      </div>
    );
  }
}

export default Home;
