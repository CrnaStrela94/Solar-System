document.addEventListener("DOMContentLoaded", main);

async function main() {
  const apiKey = await getApiKey();
  const bodies = await getBodies(apiKey);
  console.log(bodies);

  document.querySelectorAll(".planet").forEach((planet) => {
    planet.addEventListener("click", function () {
      const planetName = this.getAttribute("data-name");
      fetchPlanetData(planetName, apiKey);
    });
  });
}
// let resp = await fetch(
//   "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
//   {
//     method: "GET",
//     headers: { "x-zocom": "${apiKey}" },
//   }
// );
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

async function getApiKey() {
  try {
    const response = await fetch(
      `https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys`,
      {
        method: "POST",
      }
    );

    const { body, ok, ...rest } = response;

    console.log(JSON.stringify(body), ok);
    return body.key;
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}

async function getBodies(apiKey) {
  console.log("API key;", apiKey);
  try {
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        mode: "no-cors",
        headers: { "x-zocom": apiKey },
      }
    );

    console.log(response);

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
