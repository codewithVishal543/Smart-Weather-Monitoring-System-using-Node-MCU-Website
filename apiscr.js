async function updateLocation() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const city = data.city;
        const region = data.region;
        const country = data.country_name;

        const locationText = `${city}, ${region}, ${country}`;
        document.getElementById("location").textContent = locationText;
    } catch (error) {
        console.error("Could not get location:", error);
        document.getElementById("location").textContent = "Location Unavailable";
    }
}

updateLocation();

let temperature = 37;
let humidity = 48;
let air_quality = 187;
let aqi = 187;

async function fetchSensorData() {
    try {
        const response = await fetch("http://192.168.216.99"); //yaha change krna h ip address --------------->>>
        const data = await response.json();
        //[0] bcoz the data is from array....
        temperature = data[0].temperature;
        humidity = data[0].humidity;
        air_quality = data[0].air_quality;
        aqi = air_quality;

        document.getElementById("temperature").textContent = `${temperature} °C`;
        document.getElementById("humidity").textContent = `${humidity}`;
        document.getElementById("air_quality").textContent = air_quality;

        const a = 17.62,
            b = 243.12;
        const gamma =
            Math.log(humidity / 100) + (a * temperature) / (b + temperature);
        const dewPoint = (b * gamma) / (a - gamma);

        let comfortIndex = +(
            100 -
            Math.abs(22 - temperature) * 2 -
            Math.abs(50 - humidity) * 0.5
        ).toFixed(0);
        comfortIndex = Math.max(0, Math.min(comfortIndex, 100));

        let comfort = "Uncomfortable";
        if (
            temperature >= 20 &&
            temperature <= 26 &&
            humidity >= 30 &&
            humidity <= 60
        ) {
            comfort = "Comfortable";
        } else if (temperature > 26 && humidity > 60) {
            comfort = "Hot & Humid";
        } else if (temperature < 20 && humidity < 30) {
            comfort = "Cold & Dry";
        }

        const T = temperature;
        const RH = humidity;
        const heatIndex = -8.784695 +
            1.61139411 * T +
            2.338549 * RH -
            0.14611605 * T * RH -
            0.012308094 * T * T -
            0.016424828 * RH * RH +
            0.002211732 * T * T * RH +
            0.00072546 * T * RH * RH -
            0.000003582 * T * T * RH * RH;

        let fireRisk = "LW";
        if (temperature > 35 && humidity < 30) {
            fireRisk = "HG";
        } else if (temperature > 30 && humidity < 40) {
            fireRisk = "MD";
        }

        const svp = +(6.11 * Math.pow(10, (7.5 * T) / (237.7 + T))).toFixed(2);
        const avp = +((RH / 100) * svp).toFixed(0);

        const absHumidity = +(
            (6.112 * Math.exp((17.67 * T) / (T + 243.5)) * RH * 2.1674) /
            (273.15 + T)
        ).toFixed(0);

        document.getElementById("dew_point").textContent = `${dewPoint.toFixed(0)}`;
        document.getElementById("comfort").textContent = `${comfortIndex}`;
        document.getElementById("heat_index").textContent = `${heatIndex.toFixed(
        0
      )}`;
        document.getElementById("fire_risk").textContent = `${fireRisk}`;
        document.getElementById("avp").textContent = `${avp}`;
        document.getElementById("absh").textContent = `${absHumidity}`;
        document.getElementById("comfy-next-to-temp").textContent = `${comfort}`;

        const aqiBar = document.getElementById("aqiBar");
        const aqiPointer = document.getElementById("aqiPointer");
        const aqicard = document.getElementById("airq-card");
        const mainCard = document.getElementById("mainCard");
        const AQIText = document.getElementById("air_quality");
        const airQualityText = document.getElementById("airq-card");

        const maxAQI = 400;

        function getAQIPointerPosition(aqi, barWidth) {
            let segmentWidth = barWidth / 6;
            let position = 0;

            if (aqi <= 50) {
                position = (aqi / 50) * segmentWidth * 1;
            } else if (aqi <= 100) {
                position = segmentWidth * 1 + ((aqi - 50) / 50) * segmentWidth;
            } else if (aqi <= 150) {
                position = segmentWidth * 2 + ((aqi - 100) / 50) * segmentWidth;
            } else if (aqi <= 200) {
                position = segmentWidth * 3 + ((aqi - 150) / 50) * segmentWidth;
            } else if (aqi <= 300) {
                position = segmentWidth * 4 + ((aqi - 200) / 100) * segmentWidth;
            } else {
                position =
                    segmentWidth * 5 + ((Math.min(aqi, 400) - 300) / 100) * segmentWidth;
            }

            return position;
        }

        const bar = document.querySelector(".aqi-bar");
        const pointer = document.querySelector(".aqi-pointer");
        const barWidth = bar.offsetWidth;
        const pixelPos = getAQIPointerPosition(aqi, barWidth);
        pointer.style.left = `${pixelPos}px`;
        pointer.style.left = `${pixelPos - pointer.offsetWidth / 2}px`;

        let outerColor = " #58b51fff";
        let fadedColor = "rgba(88, 181, 31, 0.2)";
        let aqitext = "Good";

        if (aqi > 50) {
            outerColor = " #edc832ff";
            fadedColor = "rgba(237, 200, 50, 0.2)";
            aqitext = "Moderate";
        }
        if (aqi > 100) {
            outerColor = "orange";
            fadedColor = "rgba(255, 165, 0, 0.2)";
            aqitext = "Poor";
        }
        if (aqi > 150) {
            outerColor = "#e85476ff";
            fadedColor = "rgba(232, 84, 118, 0.2)";
            aqitext = "Unhealthy";
        }
        if (aqi > 200) {
            outerColor = "purple";
            fadedColor = "rgba(128, 0, 128, 0.2)";
            aqitext = "Very Unhealthy";
        }
        if (aqi > 300) {
            outerColor = "red";
            fadedColor = "rgba(255, 0, 0, 0.2)";
            aqitext = "Hazardous";
        }

        aqiPointer.style.backgroundColor = outerColor;
        aqicard.style.backgroundColor = fadedColor;
        aqicard.style.color = outerColor;
        mainCard.style.backgroundImage = `linear-gradient(to top, ${outerColor}, #1b1d1fff)`;
        AQIText.style.color = outerColor;
        airQualityText.textContent = aqitext;
    } catch (error) {
        console.error("Error fetching sensor data:", error);
    }
}

setInterval(fetchSensorData, 5000);
fetchSensorData();
