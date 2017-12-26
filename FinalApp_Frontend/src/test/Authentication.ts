import {resource, url} from './testResource'

import {nav2Main, nav2Landing, displayError} from './Actions'

export function Login(username, password) {
    return (dispatch) => {
        return resource('POST', 'login', {username, password})
        .then((response) => {
            dispatch({type: "Login", username: response.username})
            dispatch(nav2Main())
        }).catch((err) => {
            dispatch(displayError(`Invalid logging in as user: ${username}`))
        })
    }
}

export function Logout(){
    return (dispatch) => {
        return resource('PUT','logout', '')
        .then((response) => {
            dispatch({type:"Logout"})
            dispatch(nav2Main())
        }).catch((err) => {
            dispatch(displayError(`Invalid logging out: ${err}`))
        })
    }
}