// Define the function you want to run
function handleMenuClick() {
    document.getElementById("hammenu").style.display = "none";
    document.getElementById("navmenu").style.display = "block";
}
function closeMenu() {
    document.getElementById("navmenu").style.display = "none";
    document.getElementById("hammenu").style.display = "inline";
    
}

// Attach the click event listener to the element
document.getElementById("hammenu").addEventListener("click", handleMenuClick);
document.getElementById("closeMenu").addEventListener("click", closeMenu);
