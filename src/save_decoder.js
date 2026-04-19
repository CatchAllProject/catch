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

    console.log(`Nome do Treinador: ${playerName}`);
    console.log(`Nome do Rival: ${rivalName}`);
    console.log(`Total de Insígnias: ${badgesNum}`);
    console.log(`Dinheiro: ${playerMoney}`);
    console.log(`Tempo: ${gameTime}`);

    for(let i = 0; i < badgesNum; i++){
        console.log(`${i + 1}º Insíginia: ${badgesNames[i]}`);
    }

    const trainerName = document.getElementById("trainer_name");
    const trainerMoney = document.getElementById("trainer_money");
    const trainerTime = document.getElementById("trainer_time");

    trainerName.innerHTML = `${playerName}`;
    trainerMoney.innerHTML = `${playerMoney}`;
    trainerTime.innerHTML = `${gameTime}`;

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

    if (hours <= 9){
        let time = `0${hours}:${minutes}:${seconds}`;
        return time;
    } else{
        let time = `${hours}:${minutes}:${seconds}`;
        return time;
    }
    
}