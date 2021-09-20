import {clientsRender} from "./allClientsPage.js";
import {deleteClient, editClient, findClientById} from "../api/dataClients.js";
import {render} from '../node_modules/lit-html/lit-html.js';
import {loaderTemplate} from "./loader.js";

let body = document.getElementById('container');

export async function singleClientPage(event) {
    let div = document.getElementById('modalEdit');

    let client = await findClientById(event)

    let form = document.getElementsByClassName("clientInfo")[0];
    let inputs = form.querySelectorAll('input');
    let textarea = form.querySelector('textarea');
    form.id = client.id
    inputs[0].value = client.name
    inputs[1].value = client.address;
    inputs[2].value = client.city;
    inputs[3].value = client["vatNumber"];
    inputs[4].value = client.mol
    inputs[5].value = client["phoneNumber"];
    textarea.value = client.comment;

    div.style.display = "block";
}

export function close() {
    let div = document.getElementById('modalEdit');
    div.style.display = "none"
}

export async function edit(event) {
    event.preventDefault();

    let form = new FormData(event.target);
    let name = form.get("name").trim();
    let address = form.get("address").trim();
    let city = form.get("city").trim();
    let vatNumber = form.get("vat").trim();
    let phoneNumber = form.get("phone").trim();
    let comment = form.get("comment").trim();
    let mol = form.get("mol").trim();

    let obj = {name, address, city, vatNumber, mol, phoneNumber, comment};


    setTimeout(async function () {
        await editClient(obj, event);
        await clientsRender();
        close();
    }, 1);
    render(loaderTemplate(), body);
}

export async function del() {
/*    let confirmation = window.confirm("Сигурни ли сте че искате да изтриете тази фирма?");
    if (confirmation) {*/
        await deleteClient()
        close();
        await clientsRender();
/*    }*/
}



