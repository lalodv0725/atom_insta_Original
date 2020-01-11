import React, { Component } from 'react'
import firebase from 'firebase'
// import Card from '../components/card'
import Post from '../components/post'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  componentDidMount = () => {
    let postsRef = firebase.database().ref('posts')
    //.orderByChild("authorId").equalTo("si")

    postsRef.on('value', (snapshot) => {

      let posts = snapshot.val()
      let newPosts = []

      for (let post in posts) {
        newPosts.push({
          id: post,
          content: posts[post].content,
          photoUrl: posts[post].photoUrl,
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
        Welcome
        <Post />

        {
          posts.map((p, i) => {
            return <div>
              {
                p.content
              }
              </div>
          })
        }

{/* 
        {
          posts.map(l => {
            return (


              <Card post={l} />

            )
          })
        } */}


      </div>
    );
  }
}

export default Home;
