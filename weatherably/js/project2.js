const DOMAIN = `http://api.geonames.org`;
const USERNAME = `qgiebel`;
const COUNTRY = `US`;
const COLD_BOUND = 34;
const HEAT_BOUND = 83;
const WIND_BOUND = 15;
const WIND_DIRECTIONS = [`N`, `NNE`, `NE`, `ENE`, `E`, `ESE`, `SE`, `SSE`, `S`,
    `SSW`, `SW`, `WSW`, `W`, `WNW`, `NW`, `NNW`, `N`];

const COMPASS_SECTOR_SIZE = 22.5;

/**
 * Runs a search for the location and weather data. 
 */
const runSearch = () => {
    clearPastResults();
    let input = document.querySelector(`#zip`).value;
    if (input) {
        getLocationData(input);
    }
}

/**
 * Removes previous results from the page. 
 */
const clearPastResults = () => {
    let results = document.querySelectorAll(`.results`);
    results.forEach(node => {
        node.remove();
    });
}

/**
 * Retrieves and prints the location data.
 * @param {String} zip The zip code to search for.
 */
const getLocationData = zip => {
    let xhr = new XMLHttpRequest();
    let zipURL = `${DOMAIN}/postalCodeSearchJSON` +
        `?username=${USERNAME}&` +
        `postalcode=${zip}&` +
        `country=${COUNTRY}`;

    xhr.open(`GET`, zipURL);
    xhr.responseType = `json`;
    xhr.send(null);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let locationData = xhr.response.postalCodes[0];
            outputToMain(formatLocationData(locationData));
            getWeatherData(locationData);
        }
    };
}

/**
 * Uses the location data to retrieve weather data and print it.
 * @param {Collection} locationData The location data as a collection.
 */
const getWeatherData = locationData => {
    let xhr = new XMLHttpRequest();
    let weatherURL = `${DOMAIN}/findNearByWeatherJSON` +
        `?lat=${locationData.lat}` +
        `&lng=${locationData.lng}` +
        `&username=${USERNAME}`;

    xhr.open(`GET`, weatherURL);
    xhr.responseType = `json`;
    xhr.send(null);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let weatherData = xhr.response.weatherObservation;
            outputToMain(formatWeatherData(weatherData));
        }
    };
}

/**
 * Formats the weather data to show temperature, and wind speed and direction.
 * @param {Collection} weatherData The weather data retrieved from geonames.
 * @returns The weather formatted data.
 */
const formatWeatherData = weatherData => {
    let output = document.createElement(`p`);

    output.innerHTML = `Temp: ` +
        `${displayTemp(weatherData.temperature)}` +
        `<br>Wind: ` +
        `${displayWind(weatherData.windSpeed, weatherData.windDirection)}`;

    return output;
}

/**
 * Converts the temperature to Farenheit and returns a formatted string to 
 * display.
 * @param {Integer} tempC The temperature in Celcius.
 * @returns The output string of the temperature in Farenheit.
 */
const displayTemp = tempC => {
    let tempF = Math.round(tempC * 9 / 5 + 32);

    if (tempF <= COLD_BOUND) {
        return `${tempF}&deg; &#10052;`;
    }

    if (tempF >= HEAT_BOUND) {
        return `${tempF}&deg; &#9832;`;
    }

    return `${tempF}&deg;`;
}

/**
 * Returns a formatted string to display the wind speed and direction.
 * @param {Integer} wind The wind speed.
 * @returns The output string of the wind speed.
 */
const displayWind = (wind, directionDeg) => {
    let direction = WIND_DIRECTIONS[
        Math.round(directionDeg / COMPASS_SECTOR_SIZE)
    ];

    if (wind > WIND_BOUND) {
        return `${wind} mph ${direction} &#128168;`;
    }

    return `${wind} mph ${direction}`;
}

/**
 * Formats the location data to output the City, latitude, and longitude of the 
 * place queried.
 * @param {Collection} locationData The location data retrieved from geonames.
 * @returns The formatted location data.
 */
const formatLocationData = locationData => {
    let output = document.createElement(`p`);

    output.innerHTML = `City: ${locationData.placeName}, 
        ${locationData.adminCode1}<br>Lat/Lng: ${locationData.lat}/
        ${locationData.lng}`;

    return output;
}

/**
 * Appends the output data to the main element of the document.
 * @param {Node} outputData The data to be displayed formatted as a node.
 */
const outputToMain = outputData => {
    document.getElementsByTagName(`main`)[0]
        .appendChild(wrapData(outputData));
}

/**
 * Wraps a node of data in two divs styled with bootstrap for formatting.
 * @param {Node} dataToWrap A node to be wrapped by two divs
 * @returns The wrapped output node.
 */
const wrapData = dataToWrap => {
    let innerDiv = createInnerDiv();
    let outerDiv = createOuterDiv();

    innerDiv.appendChild(dataToWrap);
    outerDiv.appendChild(innerDiv);

    return outerDiv;
}

/**
 * Creates an exterior div styled with bootstrap. 
 * @returns The exterior div styled with bootstrap
 */
const createOuterDiv = () => {
    let div = document.createElement(`div`);

    div.classList.add(`container`, `my-3`, `rounded-3`,
        `border`, `shadow`, `results`);

    return div;
}

/**
 * Creates an interior div styled with bootstrap.
 * @returns The interior bootstrap styled div
 */
const createInnerDiv = () => {
    let div = document.createElement(`div`);

    div.classList.add(`container`, `m-3`);

    return div;
}

/**
 * Creates an onclick event listener for the search button.
 */
const init = () => {
    document.querySelector(`#search`).addEventListener(`click`, runSearch);
}

// Runs init on page load.
window.onload = init;