//Captura dos elementos
const paletas = document.getElementsByClassName('color');
paletas[0].style.backgroundColor = 'rgb(0,0,0)';
const pixelBoard = document.getElementById('pixel-board');
const buttonRandomColor = document.getElementById('button-random-color');
const clearBoard = document.getElementById('clear-board');
const inputNumber = document.getElementById('board-size');
const btnBoard = document.getElementById('generate-board');
let n = Number(localStorage.getItem('boardSize')) || 5;
const mapaLocalStorage = JSON.parse(localStorage.getItem('pixelBoard'));

let mapaVerdadeiro = [] // Mapa de escopo global p/ armazenar a posição das cores
// Fazer com que o tamanho do mapaVerdairo fique do tamanho de n
for (let a = 0; a < n; a++) {
    let mapaLinha = [];
    for (let b = 0; b < n; b++) {
        mapaLinha.push('rgb(255, 255, 255)');
    }
    mapaVerdadeiro.push(mapaLinha);
}

//Event Listeners
buttonRandomColor.addEventListener('click', generateRandomColor);
clearBoard.addEventListener('click', clearAllBoard);
btnBoard.addEventListener('click', () => {
    const valorDigitado = inputNumber.value;
    if (valorDigitado == '') {
        window.alert('Board inválido!')
    } else {
        if (valorDigitado < 5) {
            n = 5;
        } else if (valorDigitado > 50) {
            n = 50
        } else {
            n = valorDigitado;
        }

        let linha = document.getElementsByClassName('linha');
        for (let i = linha.length - 1; i >= 0; i--) {
            pixelBoard.removeChild(linha[i]);
        }
        localStorage.removeItem('pixelBoard');
        generatePixelBoard(n);
        localStorage.setItem('boardSize', n);
        location.reload();
    }
})

let corFinal;
for (let i = 0; i < paletas.length; i++) {
    paletas[i].addEventListener('click', () => { selectColor(i); });
}

//Funções auxiliares 
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

//Funções Principais
//Gerar cores aleatórias em cada div
function gerarCor() {
    return 'rgb(' + getRandomIntInclusive(0, 255) + ',' + getRandomIntInclusive(0, 255) + ',' + getRandomIntInclusive(0, 255) + ')';
}

function generateRandomColor() {
    let coresList = [];

    for (let index = 0; index < paletas.length; index++) {
        if (index == 0) {
            paletas[index].style.backgroundColor = 'rgba(0,0,0)';
        } else {
            let corGerada = gerarCor();
            if (corGerada == 'rgb(255,255,255)' || corGerada === paletas[index - 1].style.backgroundColor) {
                corGerada = gerarCor();
            } else {
                paletas[index].style.backgroundColor = gerarCor();
            }
            coresList.push(paletas[index].style.backgroundColor)
        }
        localStorage.setItem('colorPalette', coresList);
    }
}

function selectColor(i) {
    for (let i = 0; i < paletas.length; i++) {
        paletas[i].className = 'color';
    }
    paletas[i].className += ' selected';
    corFinal = paletas[i].style.backgroundColor;
}

// Salvar a linha como um array
function generatePixelBoard(numero) {
    pixelBoard.style.height = (40 * numero) + 'px';
    pixelBoard.style.width = (40 * numero) + 'px';

    //gerar 1 div contendo n divs filhas
    for (let index = 0; index < numero; index++) {
        let linha = document.createElement('div');
        linha.className = 'linha';
        linha.style.height = (100 / numero) + '%';
        pixelBoard.appendChild(linha)

        for (let j = 0; j < numero; j++) {
            let pixelColuna = document.createElement('div');
            pixelColuna.className = 'pixel';
            pixelColuna.style.width = (100 / numero) + '%';
            pixelColuna.style.backgroundColor = (Object.keys(localStorage).includes('pixelBoard')) ? mapaLocalStorage[index][j] : 'rgb(255, 255, 255)';
            linha.appendChild(pixelColuna);
            pixelColuna.addEventListener('click', () => {
                pixelColuna.style.backgroundColor = corFinal;
                adicionarPixel(index, j, corFinal);
            });
        }
    }
}

function clearAllBoard() {
    const linhas = document.getElementsByClassName('linha');

    for (let index = 0; index < linhas.length; index++) {
        let pixels = document.getElementsByClassName('pixel');
        for (let j = 0; j < pixels.length; j++) {
            pixels[j].style.backgroundColor = 'white';
            adicionarPixel(index, j, 'rgb(255, 255, 255)');
        }
    }
}

// Recebe como parâmetro a posição da linha, coluna, corSelecionada, e quantos pixels no total (altura e largura);
//Essa função tem como utilidade gerar dentro do localStorage um array para ser transformado em string.
function adicionarPixel(i, j, corFinal) {
    mapaVerdadeiro[i][j] = corFinal;
    localStorage.setItem('pixelBoard', JSON.stringify(mapaVerdadeiro));
}

//Quando a página for carregada
window.onload = () => {

    const gerarCores = () => {
        let item = localStorage.getItem('colorPalette');
        selectColor(0);

        if (item != null) {
            const regex = /rgb\([^)]*\)/g;
            const array = item.match(regex)

            for (let i = 1; i < paletas.length; i++) {
                paletas[i].style.backgroundColor = array[i - 1];
            }
        } else if (item == null) {
            let listaCores = [];
            for (let i = 1; i < paletas.length; i++) {
                paletas[i].style.backgroundColor = gerarCor();
                listaCores.push(paletas[i].style.backgroundColor);
            }
            localStorage.setItem('colorPalette', listaCores);
        }
    }

    gerarCores();
    generatePixelBoard(n);
}   