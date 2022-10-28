const SERVICE_URL = "https://api.andromia.science/monsters/atlas/";
const CREATE_URL = "https://api.andromia.science/monsters/";
const urlParams = {};
(window.onpopstate = function () {
    let match;
    const pl = /\+/g; // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g;
    const decode = function (s) {
        return decodeURIComponent(s.replace(pl, ' '));
    };
    const query = window.location.search.substring(1);

    while ((match = search.exec(query))) urlParams[decode(match[1])] = decode(match[2]);
})();

$(document).ready(() => {
    retrieveMonsters(SERVICE_URL + urlParams.monster);

    $('#Generate').click(() => {
        addSpecimen(CREATE_URL + urlParams.monster);
    })
    $('#Location').click(() => {
        locationSpecimens(SERVICE_URL + urlParams.monster);

    });
    $('#add').click(() => {
        addLocation(SERVICE_URL + urlParams.monster);
    });
});

async function addSpecimen(urlSpecimen) {
    const newspecimenUrl = `${urlSpecimen}/actions?type=generate`;
    const response = await axios.post(newspecimenUrl);
    if (response.status === 201) {
        const specimen = response.data;
        displaySpecimen(specimen);
    }

}

async function addLocation(urlLocation) {
    const body = {
        position: $('#txtPosition').val(),
        time: $('#time').val(),
        season: $('#season').val(),
        rates: $('#rate').val()
    };
    const URL = `${urlLocation}/locations`;
    try {
        const responses = await axios.post(URL, body);
        console.log(responses);
        if (responses.status === 201) {
            const infoLocation = displayLocation(responses.data);
            $('#location tbody').append(infoLocation);
        }
    } catch (err) {
        console.log(err);
    }

}
async function locationSpecimens(urlLocation) {
    const URL = `${urlLocation}`;
    try {
        const responses = await axios.get(URL);
        console.log(responses);
        if (responses.status === 200) {
            const infoLocation = displayLocations(responses);
            $('#location tbody').prepend(infoLocation);
        }
    } catch (err) {
        console.log(err);
    }

}

async function retrieveMonsters(urlMonstre) {
    try {
        const response = await axios.get(urlMonstre);
        if (response.status === 200) {
            const monster = response.data;
            console.log(monster);
            $('#nbMonstre').html(monster.atlasNumber);
            $('#imgIcon').attr('src', monster.assets);
            $('#lblName').html(monster.name);
            $('#lblHealth').html(`[${monster.health.min} - ${monster.health.max}]`);
            $('#lblDamage').html(`[${monster.damage.min} - ${monster.damage.max}]`);
            $('#lblSpeed').html(`[${monster.speed.min} - ${monster.speed.max}]`);
            $('#lblCritical').html(`[${(monster.critical.min * 100).toFixed(2)} - ${(monster.critical.max * 100).toFixed(2)}]%`);
            monster.specimens.forEach(s => {
                $('#specimens tbody').prepend(displaySpecimens(s));
            });
        }
    } catch (err) {
        console.log(err);
    }

}

function displaySpecimen(specimen) {
    const infoSpecimen = displaySpecimens(specimen);
    $('#specimens tbody').prepend(infoSpecimen);
}

function displaySpecimens(s) {
    let infoSpecimen = '<tr>';
    infoSpecimen += `<td class="align-middle"><img class="specimenImg" src="../images/affinities/${s.affinity}.png"/></td>`;
    infoSpecimen += `<td class="align-middle">${s.health}</td>`;
    infoSpecimen += `<td class="align-middle">${s.damage}</td>`;
    infoSpecimen += `<td class="align-middle">${s.speed}</td>`;
    infoSpecimen += `<td class="align-middle">${s.critical}</td>`;
    infoSpecimen += `<td class="align-middle">`;
    s.talents.forEach(t => {
        infoSpecimen += `<img class="specimenImg" src="images/affinities/${t}.png"/>`
    });
    infoSpecimen += `</td>`;
    infoSpecimen += `<td class="align-middle">`;
    s.kernel.forEach(k => {
        infoSpecimen += `<img class="specimenImg" src="images/elements/${k}.png"/>`
    });
    infoSpecimen += `</td>`;
    infoSpecimen += `<td class="align-middle">`;
    infoSpecimen += getHashCode(s.hash);
    infoSpecimen += `</td>`;
    infoSpecimen += '</tr>';
    return infoSpecimen;
}
function displayLocation(l) {
    let infoLocation = '<tr>';
    infoLocation += `<td class="align-middle">${l.position}</td>`;
    infoLocation += `<td class="align-middle">${l.time}</td>`;
    infoLocation += `<td class="align-middle"><img class="locationImg" src="../images/seasons/${l.season}.png"/></td>`;
    infoLocation += `<td class="align-middle"><img class="locationImg" src="../images/rarities/${l.rates}.png"/></td>`;
    infoLocation += '<tr>';
    return infoLocation;
}
function displayLocations(response) {
    let infoLocation = '<tr>';
    response.data.locations.forEach(l => {
        infoLocation += `<td class="align-middle">${l.position}</td>`;
        infoLocation += `<td class="align-middle">${l.time}</td>`;
        infoLocation += `<td class="align-middle"><img class="locationImg" src="../images/seasons/${l.season}.png"/></td>`;
        infoLocation += `<td class="align-middle"><img class="locationImg" src="../images/rarities/${l.rates}.png"/></td>`;
        infoLocation += '<tr>';
    });
    return infoLocation;
}

function getHashCode(hash) {
    let infohash = `<div class="colored-hash">`;
    let separerinfohash = hash.substring(2, hash.length - 2);
    infohash += hash.substring(0, 2);
    for (let i = 0; i < separerinfohash.length; i++) {
        if (i % 6 == 0 && i != 0) {
            infohash += `<span class="block" style="color:#${hash.substring(i - 6, i)}; background-color:#${hash.substring(i - 6, i)}">${hash.substring(i - 6, i)}</span>`
        }
    }
    infohash += hash.substring(hash.length - 2, hash.length);
    infohash += `</div>`;
    return infohash;
}


