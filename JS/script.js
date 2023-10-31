/*********************** loading DOM document  and making sure DOM is loaded***************** */
document.addEventListener("DOMContentLoaded", main);
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
/*******************this function is for listening for what data name was used and output planet info*************** */
async function fetchPlanetData(planetName, apiKey) {
  const planetElement = document.querySelector(`[data-name="${planetName}"]`);
  let infoElement = planetElement.querySelector(".planet-info");

  if (!infoElement) {
    infoElement = document.createElement("div");
    infoElement.classList.add("planet-info");
    planetElement.appendChild(infoElement);
  } else {
    infoElement.remove();
    return;
  }

  try {
    const bodies = await getBodies(apiKey);
    const planetData = bodies.find((planet) => planet.name === planetName);
    if (planetData) {
      infoElement.textContent = `Details for ${planetName}: ${JSON.stringify(
        planetData
      )}`;
    } else {
      infoElement.textContent = `No data found for ${planetName}`;
    }
  } catch (error) {
    console.error(`Error fetching planet data:`, error);
    infoElement.textContent = `Error fetching planet data for ${planetName}`;
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
