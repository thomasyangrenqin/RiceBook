export function displayError(msg) {
    return { type: "ERROR MESSAGE", errorMsg: msg };
}

export function displaySuccess(msg) {
    return { type: "SUCCESS MESSAGE", successMsg: msg };
}

export function nav2Main() {
    return { type: "Main" };
}

export function nav2Profile() {
    return { type: "Profile" };
}

export function nav2Landing() {
	return { type: "Landing" };
}