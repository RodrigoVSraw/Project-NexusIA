const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function processMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Mostra a pergunta 
    appendBubble('user', text);
    userInput.value = '';
    
    // Animação de digitando
    const thinkingId = 'msg-' + Date.now();
    appendThinkingBubble(thinkingId);

    try {
        // Envia para o servidor com a tag do jogo para o Lester responder
        const response = await fetch('http://localhost:3000/perguntar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                pergunta: text, 
                jogo_solicitado: 'gta'
            })
        });

        if (!response.ok) throw new Error("Erro no servidor");

        const data = await response.json();
        
        // Mostra a resposta do Lester
        removeElement(thinkingId);
        appendBubble('bot', data.resposta);

    } catch (error) {
        console.error("Erro:", error);
        removeElement(thinkingId);
        appendBubble('bot', "A conexão caiu. Os federais devem estar rastreando o sinal. Tente novamente mais tarde.");
    }
}

function appendBubble(sender, text) {
    const div = document.createElement('div');
    div.className = `bubble ${sender}`;
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  // Toca o som de envio ou recebimento de mensagem
  try {
        let somCelular = new Audio();
        if (sender === 'user') {
            somCelular.src = 'Audio/gta_send.mp3'; 
        } else if (sender === 'bot') {
            somCelular.src = 'Audio/gta_receive.mp3'; 
        }
        somCelular.volume = 0.6;
        somCelular.play().catch(e => console.log("Som bloqueado pelo navegador."));
    } catch (error) {
        console.log("Erro ao carregar o áudio.");
    }
}

function appendThinkingBubble(id) {
    const div = document.createElement('div');
    div.className = `bubble bot typing-indicator`;
    div.id = id;
    div.innerText = 'Lester está digitando...';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeElement(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

sendBtn.addEventListener('click', processMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processMessage(); });