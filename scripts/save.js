function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (const c of ca) {
        let cookiePart = c.trim();
        if (cookiePart.startsWith(name)) {
            return cookiePart.slice(name.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    const username = getCookie(cname);
    if (username) {
        alert("Welcome again " + username);
    } else {
        const newName = prompt("Please enter your name:", "");
        if (newName) {
            setCookie("username", newName, 365);
        }
    }
}