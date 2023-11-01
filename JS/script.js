/*********************** loading DOM document  and making sure DOM is loaded***************** */
document.addEventListener("DOMContentLoaded", main);

function showModularPopup(planetData) {
  const titleElement = document.querySelector("#planetTitle");
  const latinNameElement = document.querySelector("#planetLatinName");
  const infoElement = document.querySelector("#planetInfo");
  const circumferenceElement = document.querySelector("#planetCircumference");
  const distanceElement = document.querySelector("#planetDistance");
  const tempDayElement = document.querySelector("#planetTempDay");
  const tempNightElement = document.querySelector("#planetTempNight");
  const moonsElement = document.querySelector("#planetMoons");

  titleElement.innerText = planetData.name;
  latinNameElement.innerText = planetData.latinName;
  infoElement.innerText = planetData.desc;
  circumferenceElement.innerText = `${planetData.circumference} km`;
  distanceElement.innerText = `${planetData.distance} km`;
  tempDayElement.innerText = `${planetData.temp?.day} C`;
  tempNightElement.innerText = `${planetData.temp?.night} C`;
  moonsElement.innerText = planetData.moons?.join(", ") || "Ingen Måne";

  document.querySelector("#modularPopup").style.display = "block";
}

function closeModular() {
  document.querySelector("#modularPopup").style.display = "none";
}

/********************** this function is getting the api Key and bodies parts****************** */
async function main() {
  const apiKey = await getApiKey();
  console.log(`Api key from main: ${apiKey}`);
  const bodies = await getBodies(apiKey);
  console.log(bodies);
  /******************this part is listening for click in DOM and listening for specific data name****************** */
  document.querySelectorAll(".planet").forEach((planet) => {
    planet.addEventListener("click", function () {
      const planetName = this.getAttribute("data-name");
      fetchPlanetData(planetName, apiKey);
    });
  });
}
/*******************this function is for listening for what data name was used and sends planet info to showModularPopup*************** */
async function fetchPlanetData(planetName, apiKey) {
  const planetElement = document.querySelector(`[data-name="${planetName}"]`);
  let infoElement = planetElement.querySelector(".planet-info");

  try {
    const bodies = await getBodies(apiKey);
    const planetData = bodies.find((planet) => planet.name === planetName);
    if (planetData) {
      showModularPopup(planetData);
    } else {
      showModularPopup({ name: planetName, desc: "No data found" });
    }
  } catch (error) {
    console.error(`Error fetching planet data:`, error);
    showModularPopup({ name: planetName, desc: "Error fetching planet data" });
  }
}

const url = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com";
/****************************** Function to get API KEY and then send it to apiKey ******************************** */
async function getApiKey() {
  try {
    const response = await fetch(`${url}/keys`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`http error status ${response.status}`);
    }
    const data = await response.json();
    console.log("Api key:", data.key);
    return data.key;
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}
/****************************** this function is getting Bodies by using api key and url******************************* */
async function getBodies(apiKey) {
  console.log("API key;", apiKey);
  try {
    const response = await fetch(`${url}/bodies`, {
      method: "GET",
      headers: { "x-zocom": apiKey },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.bodies || [];
  } catch (error) {
    console.error("Error fetching bodies:", error);
    return [];
  }
}
