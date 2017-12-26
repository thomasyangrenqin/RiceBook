import {resource, url} from './testResource'

function getAccountName(){
	return (dispatch) => {
		return resource('GET','accountName', '')
		.then((response)=>{
			dispatch({type: "Profile", accountName: response.accountName});
		})
	}
}

function getDisplayName(){
	return (dispatch) => {
		return resource('GET','displayName', '')
		.then((response)=>{
			dispatch({type: "Profile", displayName: response.displayName});
		})
	}
}

function getEmail(){
	return (dispatch) => {
		return resource('GET','email', '')
		.then((response)=>{
			dispatch({type: "Profile" , email: response.email});
		})
	}
}

function getZipcode(){
	return (dispatch) => {
		return resource('GET','zipcode', '')
		.then((response)=>{
			dispatch({type: "Profile", zipcode: response.zipcode});
		})
	}
}

function getPhoneNumber(){
	return (dispatch) => {
		return resource('GET','phoneNumber', '')
		.then((response)=>{
			dispatch({type: "Profile", phoneNumber: response.phoneNumber});
		})
	}
}

function getPassword(){
	return (dispatch) => {
		return resource('GET','password', '')
		.then((response)=>{
			dispatch({type: "Profile", password: response.password});
		})
	}
}

export function updateHeadline(value){
	return (dispatch) => {
		if(value) {
			resource('PUT','headline', {'headline':value})
			.then((response)=>{
				dispatch({type:"Update", headline: response.headline});
			})
		}
	}
}

export function getProfile(){
	return (dispatch) => {
		return Promise.all([
			getAccountName()(dispatch),
			getDisplayName()(dispatch),
			getEmail()(dispatch),
			getZipcode()(dispatch),
			getPhoneNumber()(dispatch),
			getPassword()(dispatch)
		])
	}
}