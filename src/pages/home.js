import React, { Component } from 'react'
import firebase from 'firebase'
import LoadingBar  from 'react-top-loading-bar'
import { toast } from 'react-toastify'

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
    let postsRef = firebase.database().ref('posts')

    postsRef.on('value', (snapshot) => {

      let posts = snapshot.val()
      let newPosts = []

      for (let post in posts) {
        newPosts.push({
          id: post,
          content: posts[post].content,
          photoUrl: posts[post].photoUrl,
        })
      }

      this.setState({
        posts: newPosts
      })

    })
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
        <button
          onClick={this.addPost}
        >
          New post
        </button>

        <div className="file has-name">
          <label className="file-label">
            <input
              onChange={this.handleChange}
              className="file-input"
              type="file" name="resume"
            />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fa fa-upload"></i>
                </span>
                <span className="file-label">
                  Selecciona una foto
              </span>
              </span>
              {
              image ? (<span className="file-name">
                {image.name}
              </span>) : null
              }

            </label>
          </div>
          <div className="columns is-multiline">
            {
              posts.map(l => {
                return (
                  <div key={l.id} className="column is-4">
                    <img src={l.photoUrl} />
                  </div>
                )
              })
            }
          </div>
      </div>
    );
  }
}

export default Home;
