function getCookieValue(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkIfLoginUrl() {
    const regex = /\/login$/; // $ signifies the end of the string
    return regex.test(window.location.href);
}

const usernameCookie = getCookieValue("username");
const currURL = checkIfLoginUrl();

if (usernameCookie && currURL) {
    window.location.href = '/'
}

