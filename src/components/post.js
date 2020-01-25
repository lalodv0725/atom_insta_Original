import React, { Component } from 'react'
import Modal from './modal'
import firebase from 'firebase'
import { toast } from 'react-toastify'
import uuid from 'uuid/v1'
import LoadingBar from 'react-top-loading-bar'
import tree from '../tree'

class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classNameModal: '',
      errorForm: false,
      progressUpload: 0,
      loading: false,
      user: tree.get("user"),
      formData: {
        content: '',
        image: ''
      }
    }
  }

  handleModal = (classNameModal) => {
    this.setState({
      classNameModal
    })
  }

  handleChange = (e) => {
    let {
      formData
    } = this.state

    let {
      target
    } = e

    if (target.type === "file") {
      formData[target.name] = target.files[0]
    } else {
      formData[target.name] = target.value
    }

    this.setState({
      formData,
      errorForm: false
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    let {
      formData
    } = this.state

    if (formData.content && formData.image) {
      // llamar subida de archivo
      this.setState({
        loading: true
      }, this.handleUploadImage)

    } else {
      this.setState({
        errorForm: true
      })
    }
  }

  handleUploadImage = () => {
    let {
      formData: { image }
    } = this.state

    let name = `${uuid()}-${image.name}`

    let refStorage = firebase.storage().ref(`/photos/${name}`)

    let task = refStorage.put(image)

    task.on('state_changed', (snapshot) => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

      this.setState({
        progressUpload: percentage <= 20 ? 20 : percentage
      })

    }, (error) => {
      // this.restartProgressBar()
      this.setState({
        loading: false
      })
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }, () => {
      task.snapshot.ref.getDownloadURL().then((url) => {
        this.handleCreatePost(url)
      })
    })
  }

  handleCreatePost = (url) => {
    let {
      formData: { content },
      user
    } = this.state

    let posts = firebase.database().ref('posts')
    let newPost = posts.push()

    newPost.set({
      content,
      photoURL: url,
      authorId: user.id,
      createdAt: new Date().toJSON()
    })
    this.setState({
      classNameModal: '',
      loading: false,
      formData: {
        content: '',
        image: ''
      }
    })

    toast.success("¡Se creo el post!", {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  render() {
    let {
      classNameModal,
      formData,
      errorForm,
      progressUpload,
      loading
    } = this.state

    return (<div>
      <LoadingBar
        progress={progressUpload}
        color="orange"
        onLoaderFinished={this.restartProgressBar}
      />
      <button
        onClick={
          () => this.handleModal('is-active')
        }
        className="button is-success">
        Nuevo post
      </button>

      <Modal
        className={classNameModal}
        onClose={() => this.handleModal('')}
        title="Nuevo post"

      >
        {
          errorForm && (<div className="notification is-danger">
            Completa los campos del formulario.
          </div>)
        }

      

        <form
          id="contact"
          onSubmit={this.handleSubmit}
        >
          <div className="field">
            <label className="label">
              Título
            </label>
            <div className="control">
              <input
                type="text"
                value={
                  formData.content
                }
                onChange={this.handleChange}
                name="content"
                className="input is-info"
              />
            </div>
          </div>

          <div className="field">
            <div class="file">
              <label class="file-label">
                <input
                  className="file-input"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  name="image"
                  onChange={this.handleChange}
                  />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fa fa-upload"></i>
                  </span>
                  {
                    formData.image ? (<span>
                      {
                        formData.image.name
                      }
                    </span>) : (<span className="file-label">
                      Seleccciona una foto ...
                </span>)
                  }
                  
                </span>
              </label>
            </div>
          </div>

          {
            loading ? (<div>
              Cargando ...
            </div>) : (<div className="columns">
                <div className="column">
                  <div className="buttons">
                    <button
                      type="button"
                      onClick={
                        () => this.handleModal('')
                      }
                      className="button is-danger"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="button is-success"
                    >
                      Publicar
                </button>
                  </div>
                </div>
              </div>)
          }

        </form>

      </Modal>
    </div>)
  }
}

export default Post