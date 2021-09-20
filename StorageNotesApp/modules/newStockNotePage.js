import {html, render} from '../node_modules/lit-html/lit-html.js';
import {loaderTemplate} from "./loader.js";
import {notesRender} from "./allStockNotesPage.js";
import {getAllClients} from "../api/dataClients.js";
import {saveStockNoteInDB} from "../api/dataNotes.js";
import {getHour, getDate, generateStockNoteNumber, fixAndPrint} from "./common/commonFunctions.js";
import {
    sumRow,
    newRow,
    delRow,
    checkClientDataAndFill, addNewRow
} from "./common/notesFunctions.js";
import {getAllProducts} from "../api/dataProducts.js";

let body = document.getElementById('container');
/*let products = await getAllProducts();*/

let templateNotePage = (clients, note, products) => {
    return html`
        <section id="pdf" class="stock">
            <div class="common">
                <div class="issuer">
                    <p>ИЗПЪЛНИТЕЛ</p>
                    <hr>
                    <article>
                        <label for="iName" class="text">Име на фирма:</label>
                        <input type="text" value="${note.issuer.name}" name="iName" class="text">
                        <label for="iAddress" class="text">Адрес:</label>
                        <input type="text" value="${note.issuer.address}" name="iAddress" class="text">
                        <label for="iCity" class="text">Град:</label>
                        <input type="text" value="${note.issuer.city}" name="iCity" class="text">
                        <label for="iVat" class="text">БУЛСТАТ:</label>
                        <input type="text" value="${note.issuer.vatNumber}" name="iVat" class="text">
                        <label for="iMol" class="text">МОЛ:</label>
                        <input type="text" value="${note.issuer.mol}" name="iMol" class="text">
                    </article>
                </div>
                <div class="middle">
                    <h1>СТОКОВА РАЗПИСКА</h1>
                    <hr>
                    <p id="middle-number">№ ${note.middle.number}</p>
                    <p id="middle-date">Дата: ${note.middle.date}</p>
                    <hr>
                    <p id="middle-hour">Час на издаване: ${note.hour}</p>
                </div>
                <div class="receiver">
                    <p>ПОЛУЧАТЕЛ</p>
                    <hr>
                    <article>
                        <datalist id="suggestions">
                            ${clients.length > 0 ? clients.map(optionTemplate) : "<option></option>"}
                        </datalist>
                        <label for="rName" class="text">Име на фирма:</label>
                        <input @change="${checkClientDataAndFill}" class="text" type="text"
                               value="${note.receiver.name}" name="rName"
                               autocomplete="on"
                               list="suggestions"/>
                        <label for="rAddress" class="text">Адрес:</label>
                        <input type="text" value="${note.receiver.address}" name="rAddress" class="text">
                        <label for="rCity" class="text">Град:</label>
                        <input type="text" value="${note.receiver.city}" name="rCity" class="text">
                        <label for="rVat" class="text">БУЛСТАТ:</label>
                        <input type="text" value="${note.receiver.vatNumber}" name="rVat" class="text">
                        <label for="rMol" class="text">МОЛ:</label>
                        <input type="text" value="${note.receiver.mol}" name="rMol" class="text">
                    </article>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th class="text">Позиция</th>
                    <th class="text">Описание на продукт</th>
                    <th class="text">Брой</th>
                    <th class="text">Цена</th>
                    <th class="text">Сума</th>
                </tr>
                </thead>
                <tbody>
                <datalist id="suggestions2" style="display: none">
                    ${products.length > 0 ? products.map(optionTemplate) : "<option></option>"}
                </datalist>
                ${note.table.rows.length > 0 ? note.table.rows.map(trTemplateNewNote) : ""}
                </tbody>
                <tfoot>
                <tr>
                    <td>
                        <button @click="${printPDF2}" class="printBtn" type="button"><i class="fas fa-print"></i>
                        </button>
                    </td>
                    <td>
                        <button @click="${saveNewStockNote}" class="btns">Запази</button>
                    </td>
                    <td>
                        <button @click="${addNewRow}">Нов ред</button>
                    </td>
                    <td class="sumToPay text">Сума за плащане:</td>
                    <td><p class="totalToPay text">${note.table.totalSum.toFixed(2)}</p>
                        <p class="totalToPay text">&nbsp;лв.</p></td>
                    <td></td>
                </tr>
                </tfoot>
            </table>

            <div class="total">
                <hr>
                <label class="endInfo text" for="issuedBy">Издадена от:</label>
                <input id="issuedBy" class="endInfo text" type="text" name="issuedBy" value="Kатерина Димитрова">
                <label id="labelReceiver" class="endInfo text" for="receivedBy">Приета от:</label>
                <input id="receivedBy" class="endInfo text" type="text" name="receivedBy" value="${note.receivedBy}">
                <container>
                    <p class="signature text">Подпис:</p>
                    <p id="secondSignature" class="signature text rec">Подпис:</p>
                </container>
                <hr>
                <div>
                    <p class="text">Коментар:</p>
                    <textarea cols="156" rows="1" class="text"></textarea>
                </div>
                <hr>
            </div>

        </section>
        <div class="loader-spinner">
            <img src="././pictures/loading-spinner.gif" alt="Loading..."/>
        </div>`;
};

let optionTemplate = (client) => html`
    <option>${client.name}</option>`;

let trTemplateNewNote = (row) => html`
    <tr>
        <td class="num text">${row.rowNum}</td>
       <!-- <td><textarea class="textArea text" rows="1" cols="27" value="" ></textarea></td>-->
        <td><input @change=" class="text textArea complete" type="text" value="" autocomplete="on" list="suggestions2"/></td>
        <td><input @change="${sumRow}" class="inp text pr-pieces" type="number" value=""></td>
        <td><input @change="${sumRow}" class="inp text pr-prices" type="number" value=""></td>
        <td class="sum text">${row.sum.toFixed(2)}</td>
        <td>
            <button @keyup="${newRow}" class="delBtn"><i @click="${delRow}" class="fas delBtn fa-backspace"></i>
            </button>
        </td>
    </tr>
`;

export async function newNoteRender() {
    render(loaderTemplate(), body);
    let products = await getAllProducts();
    let note = generateNewObjNote()
    let clients = await getAllClients();
    await render(templateNotePage(clients, note, products), body);
    document.getElementsByClassName("loader-spinner")[0].style.display = "none";
}

async function printPDF2() {
    let note = createNote();
    await saveStockNoteInDB(note);

    let nav = document.querySelector("nav");
    nav.style.display = "none";

    fixAndPrint();
    await notesRender();

    document.getElementsByTagName("a")[1].style.color = "white";
    document.getElementsByTagName("a")[2].style.color = "black";
}

export function createNote() {
    let obj = {
        id: 0,
        issuer: {
            name: "",
            address: "",
            city: "",
            vatNumber: "",
            mol: ""
        },
        middle: {
            number: "",
            date: ""
        },
        receiver: {
            name: "",
            address: "",
            city: "",
            vatNumber: "",
            mol: ""
        },
        table: {
            rows: [],
            totalSum: 0.00
        },
        issuedBy: "",
        receivedBy: "",
        hour: "",
        comment: "",
    };

    const middle = document.getElementsByClassName('middle')[0].querySelectorAll('p');
    obj.id = middle[0].textContent.slice(2);
    obj.middle.number = middle[0].textContent.slice(2);
    obj.middle.date = middle[1].textContent.slice(6);
    obj.hour = middle[2].textContent.slice(17);

    const total = document.getElementsByClassName('total')[0].querySelectorAll('textarea');
    obj.comment = total[0].value;

    const issuer = document.getElementsByClassName("issuer")[0].querySelectorAll('input');
    obj.issuer.name = issuer[0].value;
    obj.issuer.address = issuer[1].value;
    obj.issuer.city = issuer[2].value;
    obj.issuer.vatNumber = issuer[3].value;
    obj.issuer.mol = issuer[4].value;

    const receiver = document.getElementsByClassName("receiver")[0].querySelectorAll("input");
    obj.receiver.name = receiver[0].value;
    obj.receiver.address = receiver[1].value;
    obj.receiver.city = receiver[2].value;
    obj.receiver.vatNumber = receiver[3].value;
    obj.receiver.mol = receiver[4].value;

    const sum = Number(document.getElementsByClassName("totalToPay")[0].textContent);
    obj.table.totalSum = sum;

    const trs = document.querySelectorAll('tbody>tr');
    trs.forEach(tr => {
        let td = tr.querySelectorAll('td');
        obj.table.rows.push({
            rowNum: td[0].textContent,
            /*description: td[1].getElementsByTagName('textarea')[0].value,*/
            description: td[1].querySelector("input").value,
            pieces: td[2].querySelector("input").value,
            price: td[3].querySelector("input").value,
            sum: td[4].textContent
        });
    });

    obj.issuedBy = document.getElementById("issuedBy").value;
    obj.receivedBy = document.getElementById("receivedBy").value;

    return obj;
}

function generateNewObjNote() {

    let noteNumber = generateStockNoteNumber();
    let date = getDate();
    let hour = getHour();
    return {
        id: noteNumber,
        issuer: {
            name: "Фитони 1 ЕООД",
            address: "бул. Брезовско шосе № 147, склад 29",
            city: "Пловдив",
            vatNumber: "BG200170481",
            mol: "Николинка Дашева"
        },
        middle: {number: noteNumber, date: date},
        receiver: {name: "", address: "", city: "", vatNumber: "", mol: ""},
        table: {
            rows: [{rowNum: 1, description: "", pieces: "", price: "", sum: 0.00}],
            totalSum: 0
        },
        issuedBy: "Kатерина Димитрова",
        receivedBy: "",
        hour: hour,
        comment: ""
    }
}

async function saveNewStockNote() {
    let note = createNote();
    await saveStockNoteInDB(note);
    await notesRender();
}






