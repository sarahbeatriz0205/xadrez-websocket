using System.Collections.Concurrent;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json.Nodes;

var listener = new HttpListener();
listener.Prefixes.Add("http://localhost:5555/"); // escutando nessa porta
listener.Start();
Console.WriteLine("=== Servidor WebSocket rodando na porta 5555 ===");
Console.WriteLine("Lib que está sendo usada: System.Net.Websockets");

var websockets = new ConcurrentDictionary<string, WebSocket>();

while (true)
{
    var contexto = await listener.GetContextAsync();

    if (contexto.Request.IsWebSocketRequest)
    {
        var websocketContexto = await contexto.AcceptWebSocketAsync(null);
        var webSocket = websocketContexto.WebSocket;
        var clienteId = Guid.NewGuid().ToString();
        websockets[clienteId] = webSocket;
        _ = Task.Run(async () =>
        {
            var buffer = new byte[1024*4];
            // verifica se a conexao ainda ta aberta
            while (webSocket.State == WebSocketState.Open)
            {
                Console.WriteLine($"Cliente de número: {clienteId} entrou para jogar!");
                var envioCliente = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (envioCliente.MessageType == WebSocketMessageType.Text)
                {
                    var mensagem = Encoding.UTF8.GetString(buffer, 0, envioCliente.Count);
                    var respostasServer = Encoding.UTF8.GetBytes($"{mensagem}");
                    var json = JsonNode.Parse(mensagem);
                    Console.WriteLine($"Log de movimentos: {json?["nomeJogador"]} moveu {json?["peca"]} para {json?["destino"]}");
                    await ResponderParaTodos(respostasServer);
                }
                else if (envioCliente.MessageType == WebSocketMessageType.Close)
                {   
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Fechando conexão", CancellationToken.None);
                    websockets.TryRemove(clienteId, out _); // out _: descarta o valor removido
                }
            }
        });
    }
}

async Task ResponderParaTodos(byte[] resposta) {
    foreach (var item in websockets) {
        if (item.Value.State == WebSocketState.Open)
        {
            await item.Value.SendAsync(new ArraySegment<byte>(resposta), WebSocketMessageType.Text, true, CancellationToken.None);
                }
        }
}