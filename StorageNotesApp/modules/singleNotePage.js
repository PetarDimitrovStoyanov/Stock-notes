import {html, render} from '../node_modules/lit-html/lit-html.js';
import {fixAndPrint} from "./common/commonFunctions.js";
import {notesRender} from "./allStockNotesPage.js";
import {getAllClients} from "../api/dataClients.js";
import {saveChangesOnSpecificNote} from "../api/dataNotes.js";
import {
    sumRow,
    newRow,
    delRow,
    checkClientDataAndFill, addNewRow,
} from "./common/notesFunctions.js";
import {getAllProducts} from "../api/dataProducts.js";
import {createNote} from "./newStockNotePage.js";

let body = document.getElementById('container');

let noteTemplate = (clients, note, products) => {
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
                        <button @click="${printToPDF}" class="printBtn btns" type="button"><i class="fas fa-print"></i>
                        </button>
                    </td>
                    <td>
                        <button @click="${save}" class="btns">Запази</button>
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

        </section>`;
};

let optionTemplate = (client) => html`
    <option>${client.name}</option>`;

let trTemplateNewNote = (row) => html`
    <tr>
        <td class="num text">${row.rowNum}</td>
        <!--<td><textarea class="textArea text" rows="1" cols="27">$/*{row.description}*/</textarea></td>-->
        <td><input @change=" class=" text textArea complete" type="text" value="${row.description}" autocomplete="on"
            list="suggestions2"/>
        </td>
        <td><input @change="${sumRow}" class="inp text" type="number" value="${row.pieces}"></td>
        <td><input @change="${sumRow}" class="inp text" type="number" value="${row.price}"></td>
        <td class="sum text">${Number(row.sum).toFixed(2)}</td>
        <td>
            <button @keyup="${newRow}" class="delBtn"><i @click="${delRow}" class="fas delBtn fa-backspace"></i>
            </button>
        </td>
    </tr>
`;

let currentNote = {};

export async function singleNotePage(note) {
    let products = await getAllProducts();
    document.getElementsByTagName("a")[2].style.color = "white";
    let clients = await getAllClients();
    render(noteTemplate(clients, note, products), body);
    currentNote = note;
}

async function printToPDF() {
    let navigation = document.querySelector("nav");
    navigation.style.display = "none";

    fixAndPrint();
    await save()
    await notesRender();
}

async function save() {
    let updatedNote = createNote()

    await saveChangesOnSpecificNote(updatedNote);
    await notesRender();
}



