import {deleteProduct, findProductById, saveNewProduct, editProductToDB, getAllProducts} from "../api/dataProducts.js";
import {productsRender} from "./productsPage.js";
import {generateId} from "./common/commonFunctions.js";

export async function singleProductPage(product) {
    let div = document.getElementById('modalEditProduct');

    let form = div.getElementsByClassName("productInfo")[0];
    let inputs = form.querySelectorAll('input');
    let textarea = form.querySelector('textarea');
    form.id = product.id;
    inputs[0].value = product.name;
    inputs[1].value = product.price;
    inputs[2].value = product['id'];
    textarea.value = product.info;

    div.style.display = "block";
}

export async function editProduct(event) {
    event.preventDefault();

    let form = new FormData(event.target);
    let name = form.get("name").trim();
    let price = Number(form.get("price").trim());
    let info = form.get("info").trim();

    let obj = {name, price, info};

    await editProductToDB(obj, event);
    await productsRender();
}

export async function delProduct(e) {

    let form = document.getElementsByClassName("productInfo")[0];
    let inputs = form.querySelectorAll('input');
    let id = Number(inputs[2].value);

   /* let confirmation = window.confirm("Сигурни ли сте че искате да изтриете този продукт?");
    if (confirmation) {*/
        closeModalEditProduct();
        await deleteProduct(id);
        let products = await getAllProducts();
        await productsRender(products);
/*    }*/


}

export function closeModalProduct() {
    let div = document.getElementById('modalAddProduct');
    div.style.display = "none";
}

export function closeModalProduct2() {
    let div = document.getElementById('modalEditProduct');
    div.style.display = "none"
}

export async function createNewProduct(e) {
    e.preventDefault();

    let form = new FormData(e.target);
    let name = form.get("name").trim();
    let price = Number(form.get("price").trim());
    let info = form.get("info").trim();

    let obj = {id: generateId(), name, price, info};

    for (const key of form.keys()) {
        form.delete(key)
    }

    closeModalProduct();
    await saveNewProduct(obj)
    let products = await getAllProducts();
    await productsRender(products);

}

export async function showProduct(e) {
    let id = e.target.parentNode.id;

    let product = await findProductById(id);
    await singleProductPage(product);
}

export function closeModalEditProduct() {
    let div = document.getElementById('modalEditProduct');
    div.style.display = "none"
}
