export function isAuthenticated() {
    return !!window.localStorage.getItem('authToken');
}

export function setAuthToken(token) {
    window.localStorage.setItem('authToken', token);
}

export function createAuthorizationHeader() {
    document.cookie = "lang=" + window.localStorage.getItem('language');
    return {
        headers: {
            'Authorization': "bearer " + window.localStorage.getItem('authToken')
        }
    }
}

export function setLanguageCookie() {
    document.cookie = "lang=" + window.localStorage.getItem('language');
}

export function jsDateToReadable(date) {
    return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getUTCFullYear()}
            ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
}