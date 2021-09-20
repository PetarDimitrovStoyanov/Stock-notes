const fs = require("fs");
const path = require("path");

const fullMainPath = path.resolve("main.html");
let directory = fullMainPath.charAt(0)

/*const file = directory + "://database/clients.json"*/
const file ="F://Programming/Projects/Stock notes app - versions/database/clients.json";

export async function saveNewClient(client) {
    let clientList = JSON.parse(await fs.readFileSync(file));
    clientList.push(client);
    await fs.writeFileSync(file, JSON.stringify(clientList));
}

export async function deleteClient() {
    let id = Number(document.getElementsByClassName('clientInfo')[0].id);

    let clients = JSON.parse(await fs.readFileSync(file));
    let updatedClients = clients.filter(c => c.id !== id);

    await fs.writeFileSync(file, JSON.stringify(updatedClients));
}

export async function editClient(newObj, event) {
    console.log(file);
    let clients = JSON.parse(await fs.readFileSync(file));
    let client = clients.find(c => c.id === Number(event.target.id));

    client.name = newObj.name;
    client.address = newObj.address;
    client.city = newObj.city;
    client.vatNumber = newObj.vatNumber;
    client.mol = newObj.mol;
    client.phoneNumber = newObj.phoneNumber;
    client.comment = newObj.comment;

    await fs.writeFileSync(file, JSON.stringify(clients));
}

export async function findClientById(event) {
    let clientId = Number(event.target.id)

    let rawDataClients = await fs.readFileSync(file);
    let clients = JSON.parse(rawDataClients);

    return clients.find(c => c.id === clientId);
}

export async function getAllClients() {
    let rawDataClients = await fs.readFileSync(file);
    return JSON.parse(rawDataClients);
}
