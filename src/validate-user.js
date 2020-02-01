import tree from './tree'

function validateUser(){
    let user = tree.get('user')
    if (!user){
        window.location.href = '/'
    }
}

export {
    validateUser
}