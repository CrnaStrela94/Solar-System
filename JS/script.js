/************************ calling on all classes in a DOM *******************************/
// const sun = document.querySelector(`sun`);
// const mercury = document.querySelector(`mercury`);
// const venus = document.querySelector(`venus`);
// const earth = document.querySelector(`earth`);
// const mars = document.querySelector(`mars`);
// const jupiter = document.querySelector(`jupiter`);
// const saturn = document.querySelector(`saturn`);
// const uranus = document.querySelector(`uranus`);
// const neptune = document.querySelector(`neptune`);
/****************************************************************************************/

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".planet").forEach((planet) => {
    planet.addEventListener("click", function () {
      const planetName = this.getAttribute("data-name");
      fetchPlanetData(planetName);
    });
  });
});

function fetchPlanetData(planetName) {
  const planetElement = document.querySelector(`[data-name="${planetName}"]`);
  let infoElement = planetElement.querySelector(".planet-info");

  if (infoElement) {
    infoElement.remove();
    return;
  }

  infoElement = document.createElement("div");
  infoElement.classList.add("planet-info");
  planetElement.appendChild(infoElement);

  $.ajax({
    method: "GET",
    url: "https://api.api-ninjas.com/v1/planets?name=" + planetName,
    headers: { "X-Api-Key": "mnQDUd+rGtrmVnUFL89gjQ==soE534Ga6GGpGzv3" },
    contentType: "application/json",
    success: function (result) {
      if (result.length > 0) {
        const planetData = result[0];
        displayPlanetInfo(planetData, infoElement);
      } else {
        infoElement.innerHTML = "No information available";
      }
    },
    error: function (jqXHR) {
      console.error("Error: ", jqXHR.responseText);
      infoElement.innerHTML = "Failed to load information";
    },
  });
}

function displayPlanetInfo(planetData, infoElement) {
  infoElement.innerHTML = `
    <p>Name: ${planetData.name}</p>
    <p>Mass: ${planetData.mass}</p>
    <p>Radius: ${planetData.radius}</p>
    <p>Period: ${planetData.period}</p>
    <p>Semi Major Axis: ${planetData.semi_major_axis}</p>
  `;
}
