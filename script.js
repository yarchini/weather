let forecastDetails = []; // Store forecast data for table and chart

async function fetchWeatherData() {
  const location = document.getElementById("locationInput").value.trim();
  if (!location) {
    alert("Please enter a location!");
    return;
  }

  const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=30e52533ca372f94ab93eaba6b98bbc4`;

  try {
    const response = await fetch(weatherApiUrl);
    const weatherData = await response.json();

    if (weatherData.cod !== "200") {
      throw new Error(weatherData.message || "City not found");
    }

    // Extract forecast data for the next 24 hours (8 intervals)
    forecastDetails = weatherData.list.slice(0, 8).map(entry => ({
      dateTime: entry.dt_txt,
      tempCelsius: (entry.main.temp - 273.15).toFixed(2), // Kelvin to Celsius
      weatherDesc: entry.weather[0].description,
    }));

    // Populate the table
    const tableContent = forecastDetails.map(detail => `
      <tr>
        <td>${detail.dateTime}</td>
        <td>${detail.tempCelsius} °C</td>
        <td>${detail.weatherDesc}</td>
      </tr>
    `).join("");

    document.getElementById("forecastOutput").innerHTML = `
      <table>
        <tr>
          <th>Date-Time</th>
          <th>Temperature (°C)</th>
          <th>Weather Description</th>
        </tr>
        ${tableContent}
      </table>
    `;
  } catch (error) {
    document.getElementById("forecastOutput").innerHTML = `
      <div class="error">Error: ${error.message}</div>
    `;
  }
}

function generateWeatherChart() {
  if (!forecastDetails.length) {
    alert("Please fetch weather data first!");
    return;
  }

  const chartContext = document.getElementById("forecastChart").getContext("2d");
  const dateTimeLabels = forecastDetails.map(detail => detail.dateTime);
  const tempData = forecastDetails.map(detail => detail.tempCelsius);

  new Chart(chartContext, {
    type: "line",
    data: {
      labels: dateTimeLabels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: tempData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date-Time",
          },
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
          },
        },
      },
    },
  });
}
