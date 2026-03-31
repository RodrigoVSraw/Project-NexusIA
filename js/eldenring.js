const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function processMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Mostra a pergunta do usuário
    appendBubble('user', text, 'Maculado');
    userInput.value = '';
    
    // Animação de "Digitando..."
    const thinkingId = 'msg-' + Date.now();
    appendThinkingBubble(thinkingId);

    try {
        // Envia para o servidor a tag "elden" para carregar o perfil da Melina
        const response = await fetch('http://localhost:3000/perguntar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                pergunta: text, 
                jogo_solicitado: 'elden' 
            })
        });

        if (!response.ok) throw new Error("Erro no servidor");

        const data = await response.json();
        
        // Mostra a resposta da Melina
        removeElement(thinkingId);
        appendBubble('bot', data.resposta, 'Melina');

    } catch (error) {
        console.error("Erro:", error);
        removeElement(thinkingId);
        appendBubble('bot', "A Graça desapareceu momentaneamente. Não consigo escutar as tuas palavras. Tente novamente.", 'Melina');
    }
}

function appendBubble(sender, text, name) {
    const wrapper = document.createElement('div');
    wrapper.className = `bubble-wrapper ${sender}`;

    const senderName = document.createElement('span');
    senderName.className = 'bubble-sender';
    senderName.innerText = name;

    const div = document.createElement('div');
    div.className = `bubble`;
    div.innerText = text;

    wrapper.appendChild(senderName);
    wrapper.appendChild(div);

    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        let somElden = new Audio();
        if (sender === 'user') {
            somElden.src = 'Audio/elden_send.mp3'; 
        } else if (sender === 'bot') {
            somElden.src = 'Audio/elden_receive.mp3'; 
        }
        somElden.volume = 0.4;
        somElden.play().catch(e => console.log("Som bloqueado pelo navegador."));
    } catch (error) {
        console.log("Erro ao carregar o áudio.");
    }
}

function appendThinkingBubble(id) {
    const wrapper = document.createElement('div');
    wrapper.className = `bubble-wrapper bot typing-indicator`;
    wrapper.id = id;

    const div = document.createElement('div');
    div.className = `bubble`;
    div.innerText = 'Consultando as chamas da graça...';

    wrapper.appendChild(div);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeElement(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

sendBtn.addEventListener('click', processMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processMessage(); });