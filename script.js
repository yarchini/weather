let forecastData = []; // To store forecast data for the table and chart

function fetchWeatherForecast() {
  city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a location!");
    return;
  }

  apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=30e52533ca372f94ab93eaba6b98bbc4`;

  try {
    response = fetch(apiUrl);
    data = response.json();

    if (data.cod !== "200") {
      throw new Error(data.message || "City not found");
    }

    // Extract forecast data for the next 24 hours (8 intervals)
    forecastData = data.list.slice(0, 8).map(item => ({
      dateTime: item.dt_txt,
      temperature: (item.main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
      weatherDescription: item.weather[0].description,
    }));

    // Populate the table
    tableRows = forecastData.map(item => `
      <tr>
        <td>${item.dateTime}</td>
        <td>${item.temperature} °C</td>
        <td>${item.weatherDescription}</td>
      </tr>
    `).join("");

    document.getElementById("weatherOutput").innerHTML = `
      <table>
        <tr>
          <th>Date-Time</th>
          <th>Temperature (°C)</th>
          <th>Weather Description</th>
        </tr>
        ${tableRows}
      </table>
    `;
  } catch (error) {
    document.getElementById("weatherOutput").innerHTML = `
      <div class="error">Error: ${error.message}</div>
    `;
  }
}

function renderLineChart() {
  if (!forecastData.length) {
    alert("Please fetch weather data first!");
    return;
  }

  ctx = document.getElementById("weatherChart").getContext("2d");
  labels = forecastData.map(item => item.dateTime);
  temperatures = forecastData.map(item => item.temperature);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatures,
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