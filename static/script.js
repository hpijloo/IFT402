// document.addEventListener('DOMContentLoaded', function() {
//   getWeatherReport("weather-report");
//   fetchHikesData();
// });

function loadingAsset(elementID){
  const loadingDiv = document.getElementById(elementID)
  loadingDiv.innerHTML = `<div class="loaderContainer"><div class="loader"></div></div>`;
}
function doneloadingAsset(elementID){
  const doneloadingAsset = document.getElementById(elementID)
  doneloadingAsset.innerHTML -= `<div class="loaderContainer"><div class="loader"></div></div>`;
}

function getWeatherReport(elementID){
  loadingAsset(elementID)
  fetch('https://api.open-meteo.com/v1/forecast?latitude=33.42198811053214&longitude=-111.94080723649193&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FDenver&forecast_days=1')
  .then(response => response.json())
  .then(data => {
    const current = data.current;
    const output = `
    Temperature: ${current.temperature_2m}°F
    Relative Humidity: ${current.relative_humidity_2m}%
    Precipitation: ${current.precipitation} inch(es)
    Rain: ${current.rain} inch(es)
    Wind Speed: ${current.wind_speed_10m} mph
    Wind Direction: ${current.wind_direction_10m}°
    Wind Gusts: ${current.wind_gusts_10m} mph`;
    document.getElementById(elementID).innerText += output;

    // To display this on a webpage, you can set the innerHTML or textContent of an element with the output
    // document.getElementById('weatherInfo').textContent = output;
  })
  .catch(error => console.error('Error fetching weather data:', error));
  
}


// function fetchWeatherData() {
//   loadingAsset("weather");
//   const weatherDiv = document.getElementById('weather');
//   const apiUrl = 'https://sgbzwmdf00.execute-api.us-east-1.amazonaws.com/prod/forecast';

//   fetch(apiUrl)
//     .then(response => response.json())
//     .then(data => displayWeatherData(data))
//     .catch(error => console.error('Error fetching weather data:', error));
// }

// function displayWeatherData(data) {
//   const weatherDiv = document.getElementById('weather');
//   const warningElement = document.getElementById('warning');
//   // Clear any previous content
//   weatherDiv.innerHTML = '';
//   const warningStart = `<h1>Warning:</h1>`;
//   let warningMessage = "";
//   // Check if the current weather data is available
//   if(data.current) {
//     const currentWeather = data.current;
//     // let currentWeather = data.current;
//     // currentWeather.rain = 3;
//     // currentWeather.temperature_2m = 30;
//     let content = '<h2>Current Weather</h2>';
//     content += `<p>Time of report: ${currentWeather.time}</p>`;
//     content += `<p>Temperature: ${currentWeather.temperature_2m}°F</p>`;
//     content += `<p>Rain: ${currentWeather.rain} inches</p>`;
//     if(currentWeather.temperature_2m <= 40 || currentWeather.temperature_2m >= 100){ 
//       // console.log("Temperature warning!!!",currentWeather.temperature_2m);  
//       warningMessage += `<p>Temperature is ${currentWeather.temperature_2m}</p>`;
//     };
//     if(currentWeather.rain > 0){
//       // console.log("Rain occurring!!",currentWeather.rain);
//       warningMessage += `<p>Rain occurring at ${currentWeather.rain} inches!</p>`;
//     };
//     if(warningMessage != ''){
//       const warnMessage = warningStart + warningMessage;
//       warningElement.innerHTML = warnMessage;
//     };
//     doneloadingAsset("weather")
//     weatherDiv.innerHTML = content;
//   } else {
//     // If no data is available, display a message
//     weatherDiv.innerHTML = '<p>Weather data is not available at the moment.</p>';
//   };
// }


let hikes = [];

function fetchHikesData() {
  const apiUrl = 'http://localhost:8000/hikes';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      hikes = data; // Store fetched hikes data
      console.log('Hikes data loaded successfully');
    })
    .catch(error => console.error('Error fetching hikes data:', error));
}



function getTrails() {
  const selectedArgument = document.getElementById("optionsSelect").value;
  let filteredTrails = hikes.filter(trail => {
    switch (selectedArgument) {
      case 'less2':
        return trail.Total_Miles < 2;
      case '2to4':
        return trail.Total_Miles >= 2 && trail.Total_Miles <= 4;
      case 'greater4':
        return trail.Total_Miles > 4;
      case 'easy':
        return trail.difficulty == "Easy";
      case 'moderate':
        return trail.difficulty == "Moderate";
      case 'hard':
        return trail.difficulty == "Hard";
      
      default:
        return trail.Total_Miles;
    }
  });

  displayTrails(filteredTrails);
}

function displayTrails(filteredTrails) {
  const hikesDiv = document.getElementById("hikes");
  hikesDiv.innerHTML = ''; // Clear previous results
  filteredTrails.forEach(trail => {
      hikesDiv.innerHTML += `
          <div class="hike">
              <h2>${trail.Hike_name}</h2>
              <p>Location: ${trail.location}</p>
              <p>Duration: ${trail.Hike_duration}</p>
              <p>Elevation: ${trail.Elevation}</p>
              <p>Loop: ${trail.Hike_loop ? 'Yes' : 'No'}</p>
              <p>Total Miles: ${trail.Total_Miles}</p>
              <p>Parking Lot: ${trail.parking_lot ? 'Yes' : 'No'}</p>
              <p>Pet Friendly: ${trail.pet_friendly ? 'Yes' : 'No'}</p>
              <p>Open: ${trail.isClosed ? 'Yes' : 'No'}</p>
              <p>Difficulty: ${trail.difficulty}</p>
          </div>
      `;
  });

}







function showTrails() {
  // loadingAsset("hikes");
  const checkboxCondition = document.getElementById('hideClosed').checked;
  const checkboxPetCondition = document.getElementById('hidePet').checked;
  const checkboxWheelchairCondition = document.getElementById('hideNonWheelchair').checked;
  const selectedArgument = document.getElementById("prefferedDifficulty").value;

  let filteredTrails = hikes.filter(trail => {
    // Check for closed trails, pet-friendly, and wheelchair-friendly conditions upfront
    if (checkboxCondition && trail.isClosed) return false;
    if (checkboxPetCondition && !trail.pet_friendly) return false;
    if (checkboxWheelchairCondition && !trail.wheelChairAccessible) return false;

    // Now, filter based on selected difficulty
    switch (selectedArgument) {
      case 'less2':
        return trail.Total_Miles < 2;
      case '2to4':
        return trail.Total_Miles >= 2 && trail.Total_Miles <= 4;
      case 'greater4':
        return trail.Total_Miles > 4;
      case 'Easy':
      case 'Moderate':
      case 'Hard':
        return trail.difficulty === selectedArgument;
      default:
        // If no specific difficulty is selected, allow all trails through
        return true;
    }
  });

  displayTrails(filteredTrails);
}



function displayTrails(filteredTrails) {
    const hikesDiv = document.getElementById("hikes");
    const feedback = document.getElementById("feedback");
    feedback.innerHTML = '';
    hikesDiv.innerHTML = ''; // Clear previous results
    if(filteredTrails == ''){
      feedback.innerHTML += 'No Matches!'
    };
    filteredTrails.forEach(trail => {
        let color;
        switch (trail.difficulty) {
            case 'Easy':
                color = 'green';
                break;
            case 'Moderate':
                color = '#C0E800';
                break;
            case 'Hard':
                color = 'red';
                break;
            default:
                color = 'black'; // Default color if difficulty is not recognized
        }
        // hikesDiv.innerHTML = "";
        hikesDiv.innerHTML += `

                <div class="hike">
                <div class="hikeinfo">
                <h2>${trail.Hike_name}</h2>
                <p>Location: ${trail.location}</p>
                <p>Duration: ${trail.Hike_duration} minutes</p>
                <p>Elevation: ${trail.Elevation} feet</p>
                <p>Loop: ${trail.Hike_loop ? 'Yes' : 'No'}</p>
                <p>Total Miles: ${trail.Total_Miles} miles</p>
                <p>Parking Lot: ${trail.parking_lot ? 'Yes' : 'No'}</p>
                <p>Pet Friendly: ${trail.pet_friendly ? 'Yes' : 'No'}</p>
                <p>Wheel Chair Accessible: ${trail.wheelChairAccessible ? 'Yes' : 'No'}</p>
                <p>Closed: ${trail.isClosed ? 'Yes' : 'No'}</p>
                <p class="difficultyColor">Difficulty: ${trail.difficulty} <span style="color: ${color};">&#8226</span></p>
                </div>
                <div class="hikeTrailMap">
                <img src="../static/trail_imgs/${trail.trailMap}">
                </div>
            </div>
        `;
    });
}

function validateInput() {
  loadingAsset("hikes");
  const inputElement = document.getElementById('numberInput');
  const value = inputElement.value;
  const feedbackElement = document.getElementById('feedback');

  // Check if the value is an integer and non-negative
  if (!Number.isInteger(parseFloat(value)) || parseFloat(value) < 0 || value.includes('.')) {
      feedbackElement.textContent = 'Please enter a non-negative integer.';
  } else {
    document.getElementById('myForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const selectedValue = document.querySelector('input[name="minmax"]:checked').value;
      durationTrails(selectedValue);
    });
      
  };
}

function durationTrails(boundary) {
  let checkboxcondition = document.getElementById('hideClosed').checked;
  const selectedArgument = document.getElementById("numberInput").value;
  let filteredTrails = hikes.filter(trail => {
  if (boundary == "Maximum"){
    if(checkboxcondition){
      if(!trail.isClosed){
      return trail.Hike_duration <= selectedArgument;
      };
    }else{
        return trail.Hike_duration <= selectedArgument;
    }
  }
  else{
    if(checkboxcondition){
      if(!trail.isClosed){
      return trail.Hike_duration >= selectedArgument;
      };
    }else{
        return trail.Hike_duration >= selectedArgument;
    }
  }
  
  });
  displayTrails(filteredTrails);
}


// First, get the element by its ID
var ccButton = document.getElementById('ccIcon');

// Then, add an event listener for the 'click' event
ccButton.addEventListener('click', function() {
  showCCPopup();
});



function showCCPopup(){
  disableScrolling();
  document.getElementById('CCpopup').style.display = 'block'; 
}

function closeCCPopup() {
  document.getElementById('CCpopup').style.display = 'none';
  enableScrolling();
}


function disableScrolling(){
  var x=window.scrollX;
  var y=window.scrollY;
  window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
  window.onscroll=function(){};
}