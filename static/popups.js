document.getElementById('help').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'block';
  });
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  

  document.getElementById('help').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'block';
  });
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  
  function closeWeatherReport() {
    document.getElementById('weatherPopup').style.display = 'none';
    enableScrolling();
  }
  
  function showWeatherReport(){
    disableScrolling();
    loadingAsset("weatherPopupData");
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
      document.getElementById('weatherPopupData').innerText += output;

      // To display this on a webpage, you can set the innerHTML or textContent of an element with the output
      // document.getElementById('weatherInfo').textContent = output;
    })
    .catch(error => console.error('Error fetching weather data:', error));
    document.getElementById('weatherPopup').style.display = 'block';
    
  }
