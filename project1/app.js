// Core modules
const http = require("http"); // HTTP server
const fs = require("fs");     // File system module

// Third-party module
const axios = require("axios"); // For API requests

// Weather API URL
const url = "https://api.open-meteo.com/v1/forecast?latitude=31.52&longitude=74.35&current_weather=true";

// Function to fetch weather data
function getWeather() {

    // Axios sends async request (non-blocking)
    axios.get(url)
        .then((response) => {

            // API response received
            const weather = response.data.current_weather;

            const text = `Temperature: ${weather.temperature}°C
Wind Speed: ${weather.windspeed}
Time: ${weather.time}\n`;

            // fs.writeFile is async (non-blocking)
            fs.writeFile("weather_log.txt", text, (err) => {
                if (err) {
                    console.log("Error writing file");
                } else {
                    console.log("Weather data saved in weather_log.txt");
                }
            });

        })
        .catch((error) => {
            console.log("Error fetching weather:", error);
        });
}

// Call function to fetch weather
getWeather();

// HTTP server to show weather data
const server = http.createServer((req, res) => {

    // fs.readFile is async
    fs.readFile("weather_log.txt", "utf8", (err, data) => {

        if (err) {
            res.write("Weather file not found. Run the script first.");
        } else {
            res.write("<h1>Weather Data</h1>");
            res.write(`<pre>${data}</pre>`);
        }

        res.end();
    });

});

// Server running at localhost:3000
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});