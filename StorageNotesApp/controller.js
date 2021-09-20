import {homePageRender} from "./modules/homePage.js";
import {clientsRender} from "./modules/allClientsPage.js";
import {notesRender} from "./modules/allStockNotesPage.js";
import {newNoteRender} from "./modules/newStockNotePage.js";
import {productsRender} from "./modules/productsPage.js";

homePageRender();

document.getElementById("homePage").addEventListener("click", (e) => {
    changeColor(e);
    homePageRender();
});

document.getElementById("newNote").addEventListener("click", async (e) => {
    changeColor(e);
    await newNoteRender();
});

document.getElementById("clients").addEventListener("click", async (e) => {
    changeColor(e);
    await clientsRender();
});

document.getElementById("notes").addEventListener("click", async (e) => {
    changeColor(e);
    await notesRender();
});

document.getElementById('quit').addEventListener("click", () => {
    window.close();
});

document.getElementById('products').addEventListener("click", async (e) => {
    changeColor(e);
    await productsRender();
});

function changeColor(e) {
    Array.from(document.getElementsByTagName("a")).map(a => a.style.color = "white");
    e.target.style.color = "black";
}

