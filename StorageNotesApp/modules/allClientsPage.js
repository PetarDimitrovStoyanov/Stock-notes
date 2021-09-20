import {html, render} from '../node_modules/lit-html/lit-html.js';
import {singleClientPage, close, edit, del} from "./singleClientPage.js";
import {showModal, createNewClient, closeModal2} from "./addClient.js";
import {getAllClients} from "../api/dataClients.js";
import {loaderTemplate} from "./loader.js";

let body = document.getElementById('container');

let templateClientsPage = (clients, clientTemplate, search) => html`<h1>Всички клиенти</h1>
<div>
    <h3>Брой клиенти ${clients.length}</h3>
    <label class="cl">Име на клиента: </label>
    <input type="search" class="cl" id="inp">
    <button @click=${search} type="submit" class="cl" id="myBtn">Потърси</button>
    <button @click="${showModal}" class="addProduct" style="margin-left: 500px">Добави клиент</button>
</div>
<hr>
<article>

    <div id="modalEdit">
        <div class="modal-content">
            <span @click="${close}" class="close">&times;</span>
            <form @submit=${edit} class="clientInfo" action="">
                <label for="cName">Име на фирмата:</label>
                <input type="text" id="cName" name="name" value=""><br><br>
                <label for="cAddress">Адрес:</label>
                <input type="text" id="cAddress" name="address" value=""><br><br>
                <label for="cCity">Град:</label>
                <input type="text" id="cCity" name="city" value=""><br><br>
                <label for="vat">БУЛСТАТ:</label>
                <input type="text" id="vat" name="vat" value=""><br><br>
                <label for="mol">МОЛ:</label>
                <input type="text" id="mol" name="mol" value=""><br><br>
                <label for="phone">Телефонен номер:</label>
                <input type="text" id="phone" name="phone" value=""><br><br>
                <label for="comment">Коментар:</label>
                <textarea id="comment" name="comment" value="" class="comment" rows="8"></textarea>
                <input class="sub" type="submit" value="Редактирай">
            </form>
            <hr>
            <button class="del" @click="${del}">Изтрий</button>
        </div>
    </div>

    <div id="modalAdd">
        <div class="modal-content2">
            <span @click="${closeModal2}" class="close">&times;</span>
            <form @submit=${createNewClient} class="clientInfo" action="">
                <label for="cName">Име на фирмата:</label>
                <input type="text" id="cName" name="name" value=""><br><br>
                <label for="cAddress">Адрес:</label>
                <input type="text" id="cAddress" name="address" value=""><br><br>
                <label for="cCity">Град:</label>
                <input type="text" id="cCity" name="city" value=""><br><br>
                <label for="vat">БУЛСТАТ:</label>
                <input type="text" id="vat" name="vat" value=""><br><br>
                <label for="mol">МОЛ:</label>
                <input type="text" id="mol" name="mol" value=""><br><br>
                <label for="phone">Телефонен номер:</label>
                <input type="text" id="phone" name="phone" value=""><br><br>
                <label for="comment">Коментар:</label>
                <textarea id="comment" name="comment" value="" class="comment" rows="8"></textarea>
                <input class="sub" type="submit" value="Добави">
            </form>
        </div>
    </div>

    ${clients.length !== 0 ? clients.map(clientTemplate) : html`<p class="msg">Няма намерени клиенти</p>`}
</article>`;

let clientTemplate = (client) => html`
    <div @click="${singleClientPage}" id="${client.id}" class="client">${client.name}</div>`;

export async function clientsRender() {
    render(loaderTemplate(), body);

    let clients = await getAllClients()
    render(templateClientsPage(clients, clientTemplate, search), body);

    function search() {
        let inputValue = document.getElementById("inp").value.trim();
        setTimeout(function () {
            let clientsFound = clients.filter(c => c.name.toLowerCase().includes(inputValue.toLowerCase()));
            render(templateClientsPage(clientsFound, clientTemplate, search), body);
        }, 1);
        render(loaderTemplate(), body);
    }

    // add EventListener for ENTER button on input field
    document.getElementById('inp').addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("myBtn").click();
        }
    });
}








