export function generateRandomNumber(loopNumber) {
    let num = 0;
    for (let i = 0; i < loopNumber; i++) {
        num += Math.floor(Math.random() * 10) + "";
    }
    return Number(num);
}

export function generateId() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let day = dd + mm + yyyy;

    let hours = today.getHours();
    let minutes = today.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + minutes;

    const id = Number(generateRandomNumber(4) + day + time + getSeconds());
    return id;
}

export function getDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy;
    return today;
}

export function getHour() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + ":" + minutes;

    return time
}

function getSeconds() {
    let today = new Date();
    let seconds = Number(today.getSeconds());
    if (seconds < 9) {
        seconds = 0 + "" + seconds;
    }
    return seconds
}

export function generateStockNoteNumber() {
    let num = "10";
    let generatedNumber = generateRandomNumber(2)
    num = num + getSeconds() + generatedNumber;

    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + "" + minutes;

    num = num + time;
    return num;
}

export function fixAndPrint() {
    let nav = document.querySelector("nav");
    nav.style.display = "none";

    let btn = document.querySelectorAll("button");
    btn.forEach(b => b.style.display = "none");
    document.getElementsByClassName("stock")[0].style.margin = "0%";
    let section = document.querySelector("section");
    section.style.margin = "10px";
    section.style.width = `1070px`;
    Array.from(document.getElementsByClassName("text")).forEach(e => {
        if (e.name !== "iAddress") {
            e.style.fontSize = "20px"
        } else {
            e.style.fontSize = "17px";
        }
    })
    print();
    section.style.width = `1200px`;
    Array.from(document.getElementsByClassName("text")).forEach(e => e.style.fontSize = "16px")
    document.getElementsByClassName("stock")[0].style.margin = "20%";
    btn.forEach(b => b.style.display = "block");
    nav.style.margin = "10px 10px 5px 5px";
    let header = document.querySelector("header");
    header.style.margin = "-5px -5px -5px -5px";
    nav.style.display = "flex";
}


