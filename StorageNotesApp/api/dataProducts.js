const fs = require("fs");
const path = require('path');

const fullMainPath = path.resolve("main.html");
let directory = fullMainPath.charAt(0);

/*const file = directory + "://database/products.json";*/
const file = "F://Programming/Projects/Stock notes app - versions/database/products.json";

export async function getAllProducts() {
    return JSON.parse(await fs.readFileSync(file));
}

/*export async function findProductById(event) {
    let productId = Number(event.target.id)*/
export async function findProductById(productId) {
    let rawDataProducts = await fs.readFileSync(file);
    let products = JSON.parse(rawDataProducts);

    return products.find(c => c.id.toString() === productId.toString());
}

export async function editProductToDB(newObj, event) {
    let products = JSON.parse(await fs.readFileSync(file));
    let product = products.find(p => Number(p.id) === Number(event.target.id.value));

    product.name = newObj.name;
    product.price = newObj.price;
    product.info = newObj.info;

    await fs.writeFileSync(file, JSON.stringify(products));
}

export async function deleteProduct(id) {
    let products = JSON.parse(await fs.readFileSync(file));
    let product = products.filter(c => c.id !== id);

    await fs.writeFileSync(file, JSON.stringify(product));
}

export async function saveNewProduct(product) {
    let productList = JSON.parse(await fs.readFileSync(file));
    productList.push(product);
    await fs.writeFileSync(file, JSON.stringify(productList));
}
