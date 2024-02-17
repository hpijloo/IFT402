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
  
  function capitalizeFirstLetter(string) {
    if (!string) return ""; // Return an empty string if input is falsy
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  
  
  
  const loggedInUser = getCookieValue("username");
  const capitalizedString = capitalizeFirstLetter(loggedInUser);
  // Select the element by its ID
  const userElement = document.getElementById("logged-in-user");
  
  
  userElement.textContent += capitalizedString;
  