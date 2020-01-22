import Baobab from 'baobab'

let user = window.localStorage.getItem("user")

const tree = new Baobab({
  user: user ? JSON.parse(user) : null
})

export default tree
