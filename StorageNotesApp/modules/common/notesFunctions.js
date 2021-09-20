import {getAllClients} from "../../api/dataClients.js";
import {getAllProducts} from "../../api/dataProducts.js";

export function sumRow(e) {
    let currentRow = e.target;

    if (currentRow.type === "number") {
        currentRow = currentRow.parentNode.parentNode;
    } else if (currentRow.classList.contains("textArea")) {
        currentRow = currentRow.parentNode.parentNode;
    } else {
        currentRow = currentRow.parentNode;
    }

    try {
        let inputs = currentRow.querySelectorAll('input');
        let pieces = Number(inputs[1].value);
        let price = Number(inputs[2].value);
        let sum = currentRow.querySelector(".sum");
        sum.textContent = (pieces * price).toFixed(2) + "";
        totalToPay();
    } catch (e) {
        // it is not an error - it is just a case that currentRow.value is undefined
    }
}

export async function newRow(e) {
    let currentRow = Number(e.target.parentNode.parentNode.querySelector('td').textContent);
    let tBody = document.querySelector('tbody');
    let trs = Array.from(tBody.querySelectorAll("tr"));
    if (e.keyCode === 9 && trs.length === currentRow) {
        addNewRow();
    }

}

export function delRow(e) {
    let currentRow = e.target.parentNode.parentNode.parentNode;
    fixRowNum();
    currentRow.remove();

    fixRowNum();
    totalToPay();
}

export function createNewRow() {
    let tr = document.createElement('tr');

    let tdRowNum = document.createElement('td');
    tdRowNum.classList.add("num");
    tdRowNum.classList.add("text");
    tr.appendChild(tdRowNum);

   /* let tdTextArea = document.createElement('td');
    let textArea = document.createElement('textarea');
    textArea.classList.add("textArea");
    textArea.classList.add("text");
    textArea.setAttribute("rows", "1");
    textArea.setAttribute("cols", "27");
    tdTextArea.appendChild(textArea);
    tr.appendChild(tdTextArea);*/

    let tdInputArea = document.createElement('td');
    let inputDescription = document.createElement('input');
    inputDescription.classList.add("textArea");
    inputDescription.classList.add("text");
    inputDescription.setAttribute("list", "suggestions2");
    inputDescription.setAttribute("autocomplete", "on");
    inputDescription.setAttribute("type", "text");
    tdInputArea.appendChild(inputDescription);
    tr.appendChild(tdInputArea);



    let tdPieces = document.createElement('td');
    let inputPieces = document.createElement('input');
    inputPieces.classList.add("text");
    inputPieces.setAttribute("value", "");
    inputPieces.setAttribute("type", "number");
    inputPieces.addEventListener("change", sumRow)
    tdPieces.appendChild(inputPieces);
    tr.appendChild(tdPieces);

    let tdPrice = document.createElement('td');
    let inputPrice = document.createElement('input');
    inputPrice.classList.add("text");
    inputPrice.setAttribute("value", "");
    inputPrice.setAttribute("type", "number");
    inputPrice.addEventListener("change", sumRow);
    tdPrice.appendChild(inputPrice);
    tr.appendChild(tdPrice);

    let tdSum = document.createElement('td');
    tdSum.classList.add("sum");
    tdSum.classList.add("text");
    tr.appendChild(tdSum);

    let tdButton = document.createElement('td');
    let btn = document.createElement('button');
    btn.addEventListener("keydown", newRow);
    btn.classList.add("delBtn");
    let i = document.createElement("i");
    i.classList.add("fas");
    i.classList.add("la");
    i.classList.add("fa-backspace");
    i.addEventListener("click", delRow);
    btn.appendChild(i);
    tdButton.appendChild(btn);
    tr.appendChild(tdButton);

    return tr;
}

export function totalToPay() {
    let tBody = document.querySelector('tbody');
    let p = document.querySelector(".totalToPay");

    let sums = tBody.querySelectorAll('.sum');
    let total = 0;
    for (let i = 0; i < sums.length; i++) {
        let current = sums[i];
        total += Number(current.textContent);
    }
    p.textContent = total.toFixed(2) + "";
}

export function fixRowNum() {
    let tBody = document.querySelector('tbody');
    let trs = tBody.querySelectorAll('tr');
    for (let i = 0; i < trs.length; i++) {
        let current = trs[i];
        current.querySelector('.num').textContent = (i + 1) + ""
    }
}

export async function checkClientDataAndFill(e) {
    try {
        const clientName = e.target.value;
        const clients = await getAllClients();
        const client = clients.filter(c => c.name === clientName)[0];

        const inputs = Array.from(document.querySelectorAll(".receiver>article>input"));
        if (client.address !== undefined) {
            inputs[1].value = client.address // Address
        }
        if (client.city !== undefined) {
            inputs[2].value = client.city // City
        }
        if (client.vatNumber !== undefined) {
            inputs[3].value = client.vatNumber // VAT
        }
        if (client.mol !== undefined) {
            inputs[4].value = client.mol // mol
        }
    } catch (e) {
        // not a error
    }
}

export function addNewRow() {
    let tBody = document.querySelector('tbody');
    let tr = createNewRow();
    tBody.appendChild(tr);

    fixRowNum();
}
/*НЕ АКТИВНА ФУНЦИЯ ЗА ПОПЪЛВАНЕ НА ПОЛЕТАТА С ЦЕНА*/
export async function checkProductDataAndFill(e) {
    try {
        const productName = e.target.value;
        const products = await getAllProducts();
        const product = products.filter(p => p.name === productName)[0];

        let price = e.target.parentNode.parentNode.querySelectorAll(".pr-prices")[0];
        price.value = product.price
    } catch (e) {

    }
}
