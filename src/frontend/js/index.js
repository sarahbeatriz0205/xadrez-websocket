import { enviarMovimentoWebSocket } from "./websocket.js";

var nomeJogador = "Anônimo"; 

const formNome = document.getElementById("formsNomeJogador");
formNome.addEventListener("submit", function(event) {
    event.preventDefault(); 
    nomeJogador = formNome.elements["nome-jog"].value;
    console.log("Nome salvo:", nomeJogador);
});

const casas = document.querySelectorAll("td");
const pecas = {
    torre_branca: "♖",
    cavalo_branco: "♘",
    bispo_branco: "♗",
    rainha_branca: "♕",
    rei_branco: "♔",
    peao_branco: "♙",

    torre_preta: "♜",
    cavalo_preto: "♞",
    bispo_preto: "♝",
    rainha_preta: "♛",
    rei_preto: "♚",
    peao_preto: "♟"
};

export const tabuleiro = {
    a8: "torre_preta",
    b8: "cavalo_preto",
    c8: "bispo_preto",
    d8: "rainha_preta",
    e8: "rei_preto",
    f8: "bispo_preto",
    g8: "cavalo_preto",
    h8: "torre_preta",

    a7: "peao_preto",
    b7: "peao_preto",
    c7: "peao_preto",
    d7: "peao_preto",
    e7: "peao_preto",
    f7: "peao_preto",
    g7: "peao_preto",
    h7: "peao_preto",

    a1: "torre_branca",
    b1: "cavalo_branco",
    c1: "bispo_branco",
    d1: "rainha_branca",
    e1: "rei_branco",
    f1: "bispo_branco",
    g1: "cavalo_branco",
    h1: "torre_branca",

    a2: "peao_branco",
    b2: "peao_branco",
    c2: "peao_branco",
    d2: "peao_branco",
    e2: "peao_branco",
    f2: "peao_preto",
    g2: "peao_branco",
    h2: "peao_branco"
};

casas.forEach(casa => {
    casa.addEventListener("click", function() {
        const posicao = this.id;
        const peca = tabuleiro[posicao];
        processarJogada(posicao, peca);
    });
});

let origem = null;

function processarJogada(posicao, peca) {
    if (origem === null) {
        origem = posicao;

        console.log("Peça selecionada:", peca);
        console.log("Origem:", origem);

        return;
    }
    const destino = posicao;
    let p = pecas[tabuleiro[origem]]
    console.log("Peça movida de", origem, "para", destino);

    renderizarTabuleiro();
    enviarMovimentoWebSocket(origem, destino, p, nomeJogador);

    origem = null;
}

function renderizarPeca(posicao, peca) {
    const casa = document.getElementById(posicao);
    casa.innerHTML = "";

    if (peca) {
        const cor = casa.getAttribute("bgcolor");
        if (cor === "black") {
            casa.innerHTML = pecas[peca];
            casa.style.color = "white";
            casa.style.fontSize = "40px";
            casa.style.textAlign = "center";
            casa.style.verticalAlign = "middle";
        }
        else {
            casa.innerHTML = pecas[peca];
            casa.style.fontSize = "40px";
            casa.style.textAlign = "center";
            casa.style.verticalAlign = "middle";
        }
        
    }
}

export function renderizarTabuleiro() {
    for (const posicao in tabuleiro) {
        renderizarPeca(posicao, tabuleiro[posicao]);
    }
}

renderizarTabuleiro();