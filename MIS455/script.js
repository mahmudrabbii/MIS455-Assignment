function connect() {
    
    var searchTerm = document.getElementById("searchBox").value.trim();
    document.getElementById("searchBox").value = "";

    
    if (!searchTerm) {
        alert("Please enter a country name.");
        return;
    }

    
    var url = `https://restcountries.com/v3.1/name/${searchTerm}`;

    
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch country data.");
            }
            return res.json();
        })
        .then(data => process(data))
        .catch(err => {
            console.error(err);
            document.getElementById("displayArea").innerHTML = `<p class="text-danger">Country not found.</p>`;
        });
}

function process(data) {
    
    const countries = data;

    
    const displayArea = document.getElementById("displayArea");

    
    displayArea.innerHTML = "";

    
    countries.forEach(country => {
        
        const countryCard = document.createElement("div");
        countryCard.classList.add("col-md-4", "col-sm-6", "d-flex", "align-items-stretch");

        countryCard.innerHTML = `
            <div class="card h-100">
                <img src="${country.flags.png}" class="card-img-top" alt="Flag of ${country.name.common}">
                <div class="card-body">
                    <h5 class="card-title">${country.name.common}</h5>
                    <p class="card-text"><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                    <p class="card-text"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <button class="btn btn-primary" onclick="fetchWeatherData('${country.capital ? country.capital[0] : ''}')">More Details</button>
                </div>
            </div>
        `;

        
        displayArea.appendChild(countryCard);
    });
}

async function fetchWeatherData(capital) {
    
    if (!capital) {
        alert("Weather data unavailable for this country.");
        return;
    }

    try {
        const apiKey = 'a68e6d22a4224c5f378a8a3d7861d309'; 
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric`;

        console.log("Fetching weather data for:", capital); 
        const res = await fetch(weatherUrl);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to fetch weather data.");
        }

        const weatherData = await res.json();

        
        alert(`
            Weather in ${capital}:
            - Condition: ${weatherData.weather[0].description}
            - Temperature: ${weatherData.main.temp}°C
            - Feels Like: ${weatherData.main.feels_like}°C
            - Humidity: ${weatherData.main.humidity}%
            - Wind Speed: ${weatherData.wind.speed} m/s
        `);
    } catch (error) {
        console.error("Weather fetch error:", error);
        alert(`Unable to fetch weather data: ${error.message}`);
    }
}
