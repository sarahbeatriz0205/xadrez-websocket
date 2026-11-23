import { tabuleiro, renderizarTabuleiro } from './index.js'

var socket = new WebSocket("ws://localhost:5555/");

socket.onmessage = mensagemConfirmacao;

export function enviarMovimentoWebSocket(origem, destino, peca, nomeJogador) {
    const jogada = {
        'acao' : 'movimentar',
        'origem' : origem,
        'destino' : destino,
        'peca' : peca,
        'nomeJogador' : nomeJogador
    }

    socket.send(JSON.stringify(jogada));
}

function mensagemConfirmacao(e){
    var alteracoes = document.getElementById("alteracoes");
    var jogada = JSON.parse(e.data);

    tabuleiro[jogada.destino] = tabuleiro[jogada.origem];
    tabuleiro[jogada.origem] = null;
    renderizarTabuleiro();

    var mostrarJogada = document.createElement("li");
    mostrarJogada.innerHTML = jogada.nomeJogador + " moveu peça " + jogada.peca + " para posição " + jogada.destino;
    alteracoes.appendChild(mostrarJogada);
}