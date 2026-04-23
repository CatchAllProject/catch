//Pega o save
const save = document.querySelector('#saveInput');
//Cria um map dos caracteres
const charMap = createCharMap();
//Cria uma
const badgesNames = [
    "boulder",
    "cascade",
    "thunder",
    "rainbow",
    "soul",
    "marsh",
    "volcano",
    "earth",
    numBadges = 0
]
//----------------------------------------------------------------------

//Funcao que dispara quando o save é trocado
save.addEventListener("change", async(e) =>{
    console.clear();
    loadSave(e)
});

//Funcao que carrega o save
async function loadSave(event){
    localStorage.clear();
    const saveFile = event.target.files[0];

    if(!saveFile){
        return;
    }

    const buffer = await saveFile.arrayBuffer();
    const data = new Uint8Array(buffer);

    const reader = createReader(data);

    const playerName = decodeName(reader, 0x2598, 11);
    const rivalName = decodeName(reader, 0x25F6, 11);
    const playerMoney = decodeBCD(reader, 0x25F3, 3);
    const gameTime = readSaveTime(reader, 0x2CED);
    howManyBadges(reader, 0x2602, 8);
    const badgesNum = badgesNames[9];
    const seenPoke = countBit(reader, 0x25B6, 151);
    const caughtPoke = countBit(reader, 0x25A3, 151);

    console.log(`Nome do Treinador: ${playerName}`);
    console.log(`Nome do Rival: ${rivalName}`);
    console.log(`Total de Insígnias: ${badgesNum}`);
    console.log(`Dinheiro: ${playerMoney}`);
    console.log(`Tempo: ${gameTime}`);
    console.log(`Pokemons Vistos: ${seenPoke}`);
    console.log(`Pokemons Capturados: ${caughtPoke}`);

    for(let i = 0; i < badgesNum; i++){
        console.log(`${i + 1}º Insíginia: ${badgesNames[i]}`);
    }

    for(let i = 0; i < 8; i++){
        let block = document.getElementById(`block_${i + 1}`);
        block.style.setProperty('--hover','#B71C1C')
        removeAnimations();
    }

    for(let i = 0; i < badgesNum; i++){
        if(badgesNum == 8){
            completeBadgesAnimation();
        }
        let block = document.getElementById(`block_${i + 1}`);
        block.style.setProperty('--hover','#ffc60a');
    }

    const trainerName = document.getElementById("trainer_name");
    const trainerMoney = document.getElementById("trainer_money");
    const trainerTime = document.getElementById("trainer_time");
    const trainerSeenPoke = document.getElementById("seen");
    const trainerOwnPoke = document.getElementById("own");
    
    /*trainerSeenPoke.toString();
    trainerOwnPoke.toString();*/

    trainerName.innerHTML = `${playerName}`;
    trainerMoney.innerHTML = `${playerMoney}`;
    trainerTime.innerHTML = `${gameTime}`;
    trainerSeenPoke.innerHTML = `${seenPoke}`;
    trainerOwnPoke.innerHTML = `${caughtPoke}`;

    //block.style.opacity = "0%";

}

//

function completeBadgesAnimation() {
        let card = document.getElementById("trainerCard");
        let button = document.getElementById("saveImportLabel");
        let dex_template = document.querySelector(".pokedex_template");

        button.style.setProperty('--hover', '#ffc60a');
        card.classList.add("show-shadow");
        dex_template.classList.add("show-shadow");
}

function removeAnimations(){
        let card = document.getElementById("trainerCard");
        let button = document.getElementById("saveImportLabel");
        let dex_template = document.querySelector(".pokedex_template");

        button.style.setProperty('--hover', '#B71C1C');
        card.classList.remove("show-shadow");
        dex_template.classList.remove("show-shadow");
}

//Funcao que mapeia os caracteres dentro do save
function createCharMap() {
    const map = new Array(256).fill(' ');

    // Terminador
    map[0x50] = '';

    // Espaço
    map[0x4A] = ' ';

    // A-Z
    for (let i = 0; i < 26; i++) {
        map[0x80 + i] = String.fromCharCode('A'.charCodeAt(0) + i);
    }

    // a-z
    for (let i = 0; i < 26; i++) {
        map[0xA0 + i] = String.fromCharCode('a'.charCodeAt(0) + i);
    }

    // 0-9
    for (let i = 0; i <= 9; i++) {
        map[0xF6 + i] = String.fromCharCode('0'.charCodeAt(0) + i);
    }

    // especiais
    map[0xAB] = '!';
    map[0xAC] = '?';
    map[0xAD] = '.';
    map[0xAE] = '-';
    map[0xB8] = ',';

    return map;
}

//Funcao que cria um reader para ler offsets
function createReader(data){
    return{
        readByte(offset){
            return data[offset];
        }
    };
}

//Funcao que transforma binarios em caracteres
function decodeName(reader, offset, maxLength){
    let result = "";

    for(let i = 0; i < maxLength; i++){
        const byte = reader.readByte(offset + i);

        if(byte === 0x50) break;

        result += charMap[byte] || '?';
    }

    return result;
}

//Funcao que retorna a quantidade de insignias do treinador
function howManyBadges(reader, offset, maxLength){
    const badges = {};
    const byte = reader.readByte(offset);
    let badgesCount = 0;
    let verifier;
    badgesNames[9] = badgesCount;

    for(let i = 0; i < maxLength; i++){
        verifier = badges[badgesNames[i]] = (byte & (1 << i)) !== 0;
        if(verifier == true){
            badgesNames[9] = badgesCount += 1;
        }
    }

    return badges;
    
}

//Funcao que retorna o dinheiro do player
function decodeBCD(reader, offset, maxLength){
    let result = '';

    for(let i = 0; i < maxLength; i++){
        const byte = reader.readByte(offset + i);

        const high = byte >> 4;
        const low = byte & 0x0F;

        result += high.toString();
        result += low.toString();
    }

    return parseInt(result, 10);
}

function readSaveTime(reader, offset){
    const hoursLow = reader.readByte(offset);
    const hoursHigh = reader.readByte(offset + 1);

    const minutes = reader.readByte(offset + 2);
    const seconds = reader.readByte(offset + 3);

    const hours = (hoursHigh << 8) | hoursLow;

    const hour = String(hours).padStart(2, '0');
    const minute = String(minutes).padStart(2, '0');
    const second = String(seconds).padStart(2, '0');

    let time = `${hour}:${minute}:${second}`;
    return time;
}


function countBit(reader, offset, length){
    let count = 0;
    
    for(let i = 0; i < length; i++){
        const byte = reader.readByte(offset + Math.floor(i / 8));
        const bit =  i % 8;

        if((byte & (1 << bit)) !== 0){
            count++
        }
    }

    return count;
}