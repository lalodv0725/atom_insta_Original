import React, { Component } from 'react'
import Modal from './modal'
import firebase from 'firebase'
import LoadingBar from 'react-top-loading-bar'
import { toast } from 'react-toastify'
import uuid from 'uuid/v1'

class NewPost extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classNameModal: '',
      progressUpload: 0,
      loading: false,
      formData: {
        content: '',
        image: {}
      }
    }
  }

  showModal = () => {
    this.setState({
      classNameModal: 'is-active'
    })
  }

  handleChange = (e) => {
    let { formData } = this.state
    let { target } = e

    if (target.type === "text") {
      formData[target.name] = target.value
    } else if (target.type === "file") {
      formData[target.name] = target.files[0]
    }

    this.setState({
      formData
    })
  }

  handleClose = () => {
    this.setState({
      classNameModal: ''
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let { formData } = this.state
    this.setState({
      loading: true
    }, this.uploadImage)

  }

  uploadImage = () => {
    let { formData: { image } } = this.state


    let name = `${uuid()}-${image.name}`

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
        this.submitPost(url)
      })
    })
  }


  submitPost = (url) => {
    let {
      formData: { content }
    } = this.state

    let posts = firebase.database().ref('posts')
    let newPost = posts.push()

    newPost.set({
      content,
      photoUrl: url,
      createdAt: new Date().toJSON(),
      authorId: '3qODBBirJeXb0FZaM6auSPSWJgo2'
    })
    this.setState({
      classNameModal: '',
      loading: false,
      formData: {
        content: '',
        image: {}
      }
    })

    toast.success("¡Carga completada!", {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  render() {
    let {
      classNameModal,
      formData,
      progressUpload,
      loading
    } = this.state

    return (
      <div>
        <LoadingBar
          progress={progressUpload}
          color="orange"
          onLoaderFinished={this.restartProgressBar}
        />
        <Modal
          title="Nuevo post"
          onClose={this.handleClose}
          className={classNameModal}
        >
          <form onSubmit={this.handleSubmit}>
            <div
              className="field"
            >
              <label className="label">
                Título
              </label>
              <div
                className="control">
                <input
                  onChange={this.handleChange}
                  value={formData.content}
                  name="content"
                  className="input is-info"
                  type="text"
                  placeholder="Título"
                />
              </div>
            </div>
            <label className="file-label">
              <input
                onChange={this.handleChange}
                className="file-input"
                type="file"
                name="image"
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
                formData.image ? (<span className="file-name">
                  {formData.image.name}
                </span>) : null
              }

            </label>
            {
              loading ? (<p className="cursive-font has-text-centered">Loading...</p>) : (<div className="columns">
                <div className="column">
                  <button
                    className="button is-success"
                  >
                    Enviar
            </button>
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({
                        classNameModal: ''
                      })
                    }}
                    className="button is-danger"
                  >
                    Cancelar
            </button>
                </div>
              </div>)
            }


          </form>
        </Modal>
        <button
          onClick={this.showModal}
          className="button is-danger"
        >
          Nuevo post
        </button>
      </div>
    )
  }
}

export default NewPost;
