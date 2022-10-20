const ELEMENT_IMG_URL = "https://api.andromia.science/monsters/atlas/";
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
    retrieveMonsters(ELEMENT_IMG_URL + urlParams.monster);

    $('#btnAddPortal').click(() => {
        addPortal();
    })
    $('#btnMiner').click(() => {
        minePlanet(urlParams.planet);
    });
});

async function minePlanet(urlPlanet) {
    const miningUrl = `${urlPlanet}/actions?type=mine`;
    const response = await axios.get(miningUrl);
    if (response.status === 200) {
        const extraction = response.data;
        $('#extraction tbody').empty();
        extraction.forEach(e => {
            let extractionTr = '<tr>';
            extractionTr += `<td><img class="element" src="${ELEMENT_IMG_URL}/${e.element}.png"/></td><td>${e.quantity}</td>`
            extractionTr += '</tr>';
            $('#extraction tbody').append(extractionTr);
        });
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
            displaySpecimens(monster.specimens);
        }
    } catch (err) {
        console.log(err);
    }

}

function retreiveSpecimens(specimens) {
    specimens.forEach(s => {
        //Créer le html (tr)
        const infoSpecimen = displaySpecimens(s);
        //Injecter le html
        $('#portals tbody').append(infoSpecimen);
    })
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
        infoSpecimen += `<img class="specimenImg" src="../images/affinities/${t}.png"/>`;
    });
    infoSpecimen += `</td>`;
    infoSpecimen += `<td class="align-middle">`;
    s.kernel.forEach(k => {
        infoSpecimen += `<img class="specimenImg" src="../images/elements/${k}.png"/>`;
    });
    infoSpecimen += `</td>`;
    infoSpecimen += getHashCode(s.hash);
    infoSpecimen += '</tr>';
    return infoSpecimen;
}

function getHashCode(hash)
{
    // to do
    return hash;
}


async function addPortal() {
    const body = {
        position: $('#txtPortalPosition').val(),
        affinity: $('#cboAffinity').val()
    };

    const URL = `${urlParams.planet}/portals`;
    try {
        const responses = await axios.post(URL, body);
        if (responses.status === 201) {
            const infoPortal = displayPortal(responses.data);
            $('#portals tbody').prepend(infoPortal);
        }
    } catch (err) {
        console.log(err);
    }

}