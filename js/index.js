const SERVICE_URL = "https://api.andromia.science/monsters/atlas";

$(document).ready(() => {
    retrieveMonsters();

});

async function retrieveMonsters() {
    try {
        const response = await axios.get(SERVICE_URL);
        if (response.status === 200) {
            const monsters = response.data;
            monsters.forEach(m => {
                $('#monsters tbody').append(displayMonster(m));
            });
        }
    } catch (err) {
        
    }
}

function displayMonster(m) {
    let infoMonstre = '<tr>';
    infoMonstre += `<td class="align-middle">${m.atlasNumber}<img class="monstreImg" src="${m.assets}"/></td>`;
    infoMonstre += `<td class="align-middle"><a href="details.html?monster=${m.atlasNumber}">${m.name}</a></td>`;
    infoMonstre += `<td class="align-middle">[${m.health.min} - ${m.health.max}]</td>`;
    infoMonstre += `<td class="align-middle">[${m.damage.min} - ${m.damage.max}]</td>`;
    infoMonstre += `<td class="align-middle">[${m.speed.min} - ${m.speed.max}]</td>`;
    infoMonstre += `<td class="align-middle">[${(m.critical.min * 100).toFixed(2)} - ${(m.critical.max * 100).toFixed(2)}]%</td>`;
    infoMonstre += '</tr>';
    return infoMonstre;
}