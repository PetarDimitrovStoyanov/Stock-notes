import {clientsRender} from "./allClientsPage.js";
import {saveNewClient} from "../api/dataClients.js";
import {generateId} from "./common/commonFunctions.js";

export function showModal() {
    document.getElementById('modalAdd').style.display = "block";
}

export async function createNewClient(e) {
    e.preventDefault();

    let form = new FormData(e.target);
    let name = form.get("name").trim();
    let address = form.get("address").trim();
    let city = form.get("city").trim();
    let vatNumber = form.get("vat").trim();
    let phoneNumber = form.get("phone").trim();
    let comment = form.get("comment").trim();
    let mol = form.get("mol").trim();

    let obj = {id: generateId(), name, address, city, vatNumber, mol, phoneNumber, comment};
    await saveNewClient(obj)
    await clientsRender();
    closeModal2();
}

export function closeModal2() {
    document.getElementById('modalAdd').style.display = "none";
}

