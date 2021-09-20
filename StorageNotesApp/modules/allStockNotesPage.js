import {html, render} from '../node_modules/lit-html/lit-html.js';
import {singleNotePage} from "./singleNotePage.js";
import {getDate} from "./common/commonFunctions.js";
import {getAllNotes, getNote, deleteAllNotes} from "../api/dataNotes.js";
import {loaderTemplate} from "./loader.js";

let body = document.getElementById('container');

let templateAllStockNotes = (count, totalSum, allStockNotes) => html`<h1>Програма за стокови разписки</h1>
<h3>Дата: ${getDate()}</h3>
<h3>Брой стокови разписки за деня: ${count}</h3>
<section class="all-stock-notes">
    <hr>
    ${allStockNotes.length > 0 ?
            html`
                <table>
                    <thead>
                    <tr>
                        <td>Стокова разписка номер:</td>
                        <td>Име на клиент:</td>
                        <td>Сума:</td>
                        <td class="hour">Час на издаване:</td>
                    </tr>
                    </thead>
                    <tbody>
                    ${allStockNotes.map(trTemplateStock)}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td></td>
                        <td>Общо всичко:</td>
                        <td>${totalSum.toFixed(2)} лв.</td>
                        <td class="hour"></td>
                    </tr>
                    </tfoot>
                </table>`
            : html`<h4></h4>`}
</section>
<button @click="${printDailyReport}" class="printBtn-daily">Разпечатай дневен отчет</button>`;

const trTemplateStock = (note) => html`
    <tr id="${note.id}" @click="${showNote}">
        <td>${note.id}</td>
        <td>${note.receiver.name}</td>
        <td>${note[`table`].totalSum.toFixed(2)} лв.</td>
        <td class="hour">${note.hour}</td>
    </tr>`;

export async function notesRender() {
    render(loaderTemplate(), body);

    const allStockNotes = await getAllNotes();
    const count = allStockNotes.length;
    const totalSum = allStockNotes.reduce(function (acc, obj) {
        return acc + obj[`table`].totalSum;
    }, 0);

    render(templateAllStockNotes(count, totalSum, allStockNotes), body);
}

async function printDailyReport() {
    let result = window.confirm("Сигурни ли сте че  искате да продължите? Това ще изтрие всички текущи стокови разписки?");

    if (result) {
        let nav = document.querySelector("nav");
        nav.style.display = "none";

        let btn = document.querySelectorAll("button");
        btn.forEach(b => b.style.display = "none");
        let table = document.querySelector('.all-stock-notes');
        table.style.paddingLeft = "0px";
        print();
        table.style.paddingLeft = "150px";
        btn.forEach(b => b.style.display = "block");
        nav.style.display = "flex";

        await deleteAllNotes();
        await notesRender()
    }
}

async function showNote(e) {
    let id = e.target.parentNode.id;
    setTimeout(async function () {
        let note = await getNote(id);
        await singleNotePage(note);
    }, 1);
    render(loaderTemplate(), body);
}




