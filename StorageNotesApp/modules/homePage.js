import {html, render} from '../node_modules/lit-html/lit-html.js';

let body = document.getElementById('container');

const templateHomePage = () => html``;

export function homePageRender(){
    render(templateHomePage(), body)
}


