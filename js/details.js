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

async function retrieveMonsters(atlasNumber) {
    try {
        const response = await axios.get(atlasNumber);
        if (response.status === 200) {
            const monster = response.data;
            console.log(monster);
            $('#imgIcon').attr('src', monster.assets);
            $('#lblName').html(monster.name);
            $('#lblHealth').html(`[${m.health.min} - ${m.health.max}]`);
            $('#lblDamage').html(`[${m.damage.min} - ${m.damage.max}]`);
            $('#lblSpeed').html(`[${m.speed.min} - ${m.speed.max}]`);
            $('#lblCritical').html(`[${(m.critical.min * 100).toFixed(2)} - ${(m.critical.max * 100).toFixed(2)}]%`);
            if (planet.satellites.length > 0) {
                planet.satellites.forEach(s => {
                    $('#satellites').append(`<li>${s}</li>`);
                });
            } else {
                $('#satellites').append('Aucun satellite');
            }
            //Afficher les portals
            displayPortals(planet.portals);
        }
    } catch (err) {
        console.log(err);
    }

}

function displayPortals(portals) {
    portals.forEach(p => {
        //Créer le html (tr)
        const infoPortal = displayPortal(p);
        //Injecter le html
        $('#portals tbody').append(infoPortal);
    })
}

function displayPortal(p) {
    //Créer le html (tr)
    let infoPortal = '<tr>';
    infoPortal += `<td>${p.position}</td>`;
    infoPortal += `<td><img class="affinity" src="img/${p.affinity}.svg"</td>`;
    infoPortal += '</tr>';
    return infoPortal;
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