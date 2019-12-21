import React, { Component } from 'react'
import firebase from 'firebase'
import LoadingBar  from 'react-top-loading-bar'
import { toast } from 'react-toastify'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null,
      progressUpload: 0
    }
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

  render() {
    let {
      image,
      progressUpload
    } = this.state

    return (
      <div>
        Welcome

        <LoadingBar
          progress={progressUpload}
          color="orange"
          onLoaderFinished={this.restartProgressBar}
        />

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

  
      </div>
    );
  }
}

export default Home;
