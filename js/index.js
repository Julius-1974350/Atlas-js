const SERVICE_URL = "https://api.andromia.science/planets";

$(document).ready(() => {
    //Appeler lorsque la page a terminé de charger
    //console.log('Prêt');
    retrievePlanets();

});

async function retrievePlanets() {
    try {
        const response = await axios.get(SERVICE_URL);
        console.log(response);
        if (response.status === 200) {
            const planets = response.data;
            planets.forEach(p => {
                $('#planets').append(displayPlanet(p));
            });
        }
    } catch (err) {

    }
}

function displayPlanet(planet) {
    let tagPlanet = '<div class="card col-2 ms-4 mb-4">';
    tagPlanet += `<a href="detailsPlanet.html?planet=${planet.href}"><img class="card-img-top" src="${planet.icon}"/></a>`;
    tagPlanet += `<a href="detailsPlanet.html?planet=${planet.href}"><h5 class="card-title text-center">${planet.name}</h5></a>`;
    tagPlanet += '</div>';
    return tagPlanet;
}