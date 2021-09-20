const fs = require("fs");
const path = require('path');

const fullMainPath = path.resolve("main.html");
let directory = fullMainPath.charAt(0)

/*const file = directory + "://database/notes.json";*/
const file = "F://Programming/Projects/Stock notes app - versions/database/notes.json";

export async function getAllNotes() {

    return JSON.parse(await fs.readFileSync(file));
}

export async function saveStockNoteInDB(note) {
    let notesList = JSON.parse(await fs.readFileSync(file));
    notesList.push(note);

    await fs.writeFileSync(file, JSON.stringify(notesList));
}

export async function getNote(id) {
    let notes = await getAllNotes();
    return notes.find(n => n.id === id);
}

export async function deleteAllNotes() {
    let notesList = [];

    await fs.writeFileSync(file, JSON.stringify(notesList));
}

export async function saveChangesOnSpecificNote(note) {
    let notesList = JSON.parse(await fs.readFileSync(file));
    let specificNote = notesList.find(n => n.id === note.id);

    copyObjDate(specificNote, note);

    await fs.writeFileSync(file, JSON.stringify(notesList));
}

function copyObjDate(specificNote, note) {
    specificNote.issuer.name = document.getElementsByName("iName")[0].value;
    specificNote.issuer.address = document.getElementsByName("iAddress")[0].value;
    specificNote.issuer.city = document.getElementsByName("iCity")[0].value;
    specificNote.issuer.vatNumber = document.getElementsByName("iVat")[0].value;
    specificNote.issuer.mol = document.getElementsByName("iMol")[0].value;

    specificNote.receiver.name = document.getElementsByName("rName")[0].value;
    specificNote.receiver.address = document.getElementsByName("rAddress")[0].value;
    specificNote.receiver.city = document.getElementsByName("rCity")[0].value;
    specificNote.receiver.vatNumber = document.getElementsByName("rVat")[0].value;
    specificNote.receiver.mol = document.getElementsByName("rMol")[0].value;

    specificNote.middle.number = document.getElementById("middle-number").textContent.slice(2);
    specificNote.middle.date = document.getElementById("middle-date").textContent.slice(6);
    specificNote.middle.hour = document.getElementById("middle-hour").textContent.slice(17);

    specificNote.table.rows = [];
    let trs = Array.from(document.querySelectorAll('tbody>tr'));
    for (let i = 0; i < trs.length; i++) {
        let objRow = specificNote.table.rows[i];
        if (objRow === undefined) {
            specificNote.table.rows.push({rowNum: 1, description: "", pieces: 0, price: 0, sum: 0})
            objRow = specificNote.table.rows[specificNote.table.rows.length - 1];
        }
        const tr = trs[i];
        objRow.rowNum = Number(tr.querySelector('td').textContent);
        /*objRow.description = tr.querySelector('textarea').value;
        objRow.pieces = Number(tr.querySelectorAll('input')[0].value);
        objRow.price = Number(tr.querySelectorAll('input')[1].value);*/
        objRow.description = tr.querySelectorAll('input')[0].value;
        objRow.pieces = Number(tr.querySelectorAll('input')[1].value);
        objRow.price = Number(tr.querySelectorAll('input')[2].value);
        let content = tr.querySelectorAll("td")[4].textContent;
        objRow.sum = Number(content);
    }

    specificNote.table.totalSum = Number(document.querySelectorAll(".totalToPay")[0].textContent);
    specificNote.issuedBy = document.getElementById("issuedBy").value;
    specificNote.receivedBy = document.getElementById("receivedBy").value;
    specificNote.hour = document.getElementById("middle-hour").textContent.slice(17);
    specificNote.comment = document.querySelector('.total>div>textarea').value;

}

