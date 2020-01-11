import React, { Component } from 'react'
import firebase from 'firebase'
import LoadingBar  from 'react-top-loading-bar'
import { toast } from 'react-toastify'
import Card from '../components/card'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null,
      progressUpload: 0,
      posts: []
    }
  }

  componentDidMount = () => {
    let postsRef = firebase.database().ref('posts').orderByChild("authorId").equalTo("si")

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

  getUserById = (post) => {
    // console.log("2")

    // let userRef = firebase.database().ref(`users/${post.authorId}`)
    // userRef.on('value', (snapshot) => {
    //   console.log("3")
    //   post.author = snapshot.val()
    // })

    firebase.database().ref(`users/${post.authorId}`).once('value').then(function (snapshotUser) {
      console.log(snapshotUser.val())
      post.author = snapshotUser.val();

      // allTicketEmailsFromUsers = allTicketEmailsFromUsers + ", " + name;

      // console.log(allTicketEmailsFromUsers);
    });

  }

  handleChange = (e) => {
    let [image] = e.target.files

    this.setState({
      image
    })

    let name = `${new Date().toDateString()}-${image.name}`

    let refStorage = firebase.storage().ref(`/photos/${name}`)

    let task = refStorage.put(image)

    task.on('state_changed', (snapshot) => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      
      this.setState({
        progressUpload: percentage <= 20 ? 20 : percentage
      })

    }, (error) => {
      this.restartProgressBar()
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT
      })

    }, () => {

      task.snapshot.ref.getDownloadURL().then((url) => {
        console.log(url)
        toast.success("¡Carga completada!", {
          position: toast.POSITION.TOP_RIGHT
        })

        console.log(url)
      })
    })
  }

  restartProgressBar = () => {
    this.setState({
      progressUpload: 0
    })
  }


  addPost = () => {
    let posts = firebase.database().ref('posts')
    let newPost = posts.push()

    newPost.set({
      content: `Hola ${new Date().toDateString()}`,
      photoUrl: 'https://firebasestorage.googleapis.com/v0/b/atom-insta10.appspot.com/o/photos%2FSat%20Dec%2021%202019-Captura%20de%20pantalla%20de%202019-11-26%2017-15-27.png?alt=media&token=6ea7f86a-2701-46d4-9326-e2be0e4ab179',
      createdAt: new Date().toJSON()
    })
  }

  render() {
    let {
      image,
      progressUpload,
      posts
    } = this.state

    return (
      <div>
        Welcome
        <LoadingBar
          progress={progressUpload}
          color="orange"
          onLoaderFinished={this.restartProgressBar}
        />


        {
          posts.map(l => {
            return (


                <Card post={l} />

            )
          })
        }

        
      </div>
    );
  }
}

export default Home;
