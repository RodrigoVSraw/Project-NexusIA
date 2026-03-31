const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function processMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  
  appendMessage('user', text);
  userInput.value = '';
  
  const thinkingId = 'msg-' + Date.now();
  appendThinkingIndicator(thinkingId);

  // Envia a pergunta para o servidor, incluindo a tag "zelda" para carregar o perfil da Navi
  try {
    const response = await fetch('http://localhost:3000/perguntar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({ 
        pergunta: text,
        jogo_solicitado: 'zelda' 
      })
    });

    if (!response.ok) throw new Error("Erro no servidor");

    const data = await response.json();
    
    removeThinkingIndicator(thinkingId);
    appendMessage('bot', data.resposta);

  } catch (error) {
    console.error("Erro na comunicação com a API:", error);
    removeThinkingIndicator(thinkingId);
    appendMessage('bot', "Desculpe Link, a conexão com as Deusas de Hyrule falhou, tente novamente mais tarde!.");
  }
}

function appendMessage(sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message-wrapper ${sender}`;

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  
  if (sender === 'bot') {
    avatar.src = 'Imgs/OoT3D_Navi_Render.png';
    avatar.alt = 'Navi';
    
    try {
      let naviSound = new Audio('Audio/Navi-listen.mp3');
      naviSound.volume = 0.6;
      naviSound.play().catch(e => console.log("Som bloqueado."));
    } catch (error) {}
    
  } else {
    avatar.src = 'Imgs/Link_OoT_Himekawa.jpg';
    avatar.alt = 'Link';
  }

  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.innerText = text;

  wrapper.appendChild(avatar);
  wrapper.appendChild(div);

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Funções auxiliares para o efeito "A pensar..."
function appendThinkingIndicator(id) {
  const wrapper = document.createElement('div');
  wrapper.className = `message-wrapper bot`;
  wrapper.id = id;

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.src = 'Imgs/OoT3D_Navi_Render.png';

  const div = document.createElement('div');
  div.className = `message bot typing`;
  div.innerText = 'A consultar os registos Sheikah';

  wrapper.appendChild(avatar);
  wrapper.appendChild(div);

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeThinkingIndicator(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

sendBtn.addEventListener('click', processMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processMessage(); });