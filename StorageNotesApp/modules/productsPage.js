import {html, render} from '../node_modules/lit-html/lit-html.js';
import {loaderTemplate} from "./loader.js";
import {getAllProducts} from "../api/dataProducts.js";
import {closeModalProduct2, editProduct, delProduct, closeModalProduct, createNewProduct, showProduct}
    from "./singleProductPage.js";

let body = document.getElementById('container');
let products;

let templateProducts = (products, showModal) => html`
    <h1>Всички продукти</h1>
    <div>
        <h3>Брой продукти ${products.length}</h3>
        <label class="cl">Име на продукт: </label>
        <input type="search" class="cl" id="productSearch">
        <button @click=${search} type="submit" class="cl" id="myBtn">Потърси</button>
        <button @click="${showModal}" class="addProduct" style="margin-left: 500px">Добави продукт</button>
    </div>

   <!-- <hr>-->
    <article>

        <div id="modalEditProduct" style="display: none;">
            <div class="modal-content edit-modal-product">
                <span @click="${closeModalProduct2}" class="close">&times;</span>
                <form @submit=${editProduct} class="productInfo" action="">
                    <label for="pName">Име на продукта:</label>
                    <input type="text" id="pName" name="name" value="" class="test"><br><br>
                    <label for="pPrice">Цена:</label>
                    <input type="number" id="pPrice" min="0" step=".01" name="price" value=""><br><br>
                    <label for="info">Информация:</label>
                    <textarea id="info" name="info" class="comment" rows="8"></textarea>
                    <input style="display: none" type="text" id="id-product" name="id" value="">
                    <input class="sub" type="submit" value="Редактирай">
                </form>
                <hr>
                <button class="del" @click="${delProduct}">Изтрий</button>
            </div>
        </div>

        <div id="modalAddProduct" style="display: none;">
            <div class="modal-content2">
                <span @click="${closeModalProduct}" class="close">&times;</span>
                <form @submit=${createNewProduct} class="productInfo" action="">
                    <label for="pName">Име на продукта:</label>
                    <input type="text" id="pName" name="name" value=""><br><br>
                    <label for="pPrice">Цена:</label>
                    <input type="number" id="pPrice" name="price" value=""><br><br>
                    <label for="info">Информация:</label>
                    <textarea id="info" name="info" value="" class="comment" rows="8"></textarea>
                    <input class="sub" type="submit" value="Добави">
                </form>
            </div>
        </div>
    </article>

    <section class="all-stock-notes">
        <hr>
        ${products.length > 0 ?
                html`
                    <table>
                        <thead>
                        <tr>
                            <td>Име на продукт:</td>
                            <td>Описание:</td>
                            <td>Цена на продукт:</td>
                        </tr>
                        </thead>
                        <tbody>
                        ${products.map(templateSingleProduct)}
                        </tbody>
                    </table>`
                : html`<h3 style="text-align: center">Няма намерени продукти</h3>`}
    </section>

`;

let templateSingleProduct = (product) => html`
    <tr id="${product.id}" @click="${showProduct}">
        <td style="max-width: 350px; overflow: hidden">${product.name}</td>
        <td>${product.info}</td>
        <td>${product[`price`].toFixed(2)} лв.</td>
    </tr>`

export async function productsRender(productsInput) {
    if (productsInput) {
        render(templateProducts(await productsInput, showModal), body)
    } else {
        render(loaderTemplate(), body);
        render(templateProducts(await getAllProducts(), showModal), body)
    }
}

async function search() {
    let inputValue = document.getElementById("productSearch").value;
    if (products && products.length === 0) {
        products = await getAllProducts()
    }

    if (!products) {
        products = await getAllProducts();
    }

    products = products.filter(p => p.name.toLowerCase().includes(inputValue.toLowerCase().trim()));

    if (inputValue === "") {
        products = await getAllProducts();
    }

    render(templateProducts(products, showModal), body);
}

function showModal() {
    document.getElementById('modalAddProduct').style.display = "block";
}









