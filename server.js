// Importação das bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Inicialização do servidor Express
const app = express();
app.use(cors()); 
app.use(express.json());

const apiKey = "COLOQUE_SUA_API_KEY_AQUI"; // Substitua pela sua chave de API do Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);

let modeloDetectado = null;

//  OBJETO QUE GUARDA CADA MEMÓRIA COMO ATRIBUTO
const sessoesDeChat = {
    zelda: null,
    gta: null,
    elden: null
};

// CARREGAMENTO DE BANCOS DE DADOS 
function carregarBancoDeDados(nomeDoFicheiro) {
    try {
        return fs.readFileSync(nomeDoFicheiro, 'utf8');
    } catch (erro) {
        console.log(`⚠️ Arquivo '${nomeDoFicheiro}' não encontrado. O agente usará apenas o seu conhecimento base.`);
        return ""; 
    }
}

// Carrega os bancos de dados para cada bot
const bdZelda = carregarBancoDeDados('./IA_brain/Banco_de_dados_navi.txt');
const bdGta = carregarBancoDeDados('./IA_brain/Banco_de_dados_lester.txt');
const bdElden = carregarBancoDeDados('./IA_brain/Banco_de_dados_melina.txt');

// PERFIS DE PERSONALIDADE (PROMPTS) PARA CADA BOT
const perfisIA = {
    // -- ZELDA: Navi --
    zelda: {
        instrucao: `Você é a Navi, a fada assistente do Link no jogo The Legend of Zelda: Ocarina of Time.
        
        Regras absolutas:
        1. Responda APENAS sobre o jogo Ocarina of Time.
        2. Seja direta, útil e amigável.
        3. SEMPRE comece a sua resposta com a frase clássica: "Hey! Listen!".
        4. Se o usuário perguntar sobre outros jogos, diga que as Deusas não possuem essa informação.
        5. Use o banco de dados fornecido para responder às perguntas do Link. Se a resposta não estiver lá, use o seu conhecimento geral sobre o jogo.
        6. Nunca invente informações. Se não souber, admita que as Deusas não têm essa resposta.
        7. Mantenha a personalidade da Navi: seja prestativa, mas também um pouco sarcástica e divertida, como no jogo.
        8. Fale como se o player fosse o Link, então não use as informações como se fosse um guia de jogo, mas sim como se estivesse a falar diretamente com o Link.
        9. Guarde o que você disse para o Link, se ele perguntar algo relacionado, que não faça sentido, verifique as suas respostas e as perguntas dele.
        
        --- REGISTROS SHEIKAH ---
        ${bdZelda}`
    },

    // -- GTA V: Lester --
    gta: {
        instrucao: `Você é o Lester Crest do jogo GTA V.
        Regras absolutas:
        1. Você está conversando por um aplicativo de celular criptografado com o jogador.
        2. Seja sarcástico, extremamente inteligente, paranoico com os federais e fale como um hacker/estrategista criminal, mas também seja direto.
        3. Responda APENAS sobre GTA V (dicas, cheats, assaltos, easter eggs, localização de carros).
        4. Chame o jogador de "cara", "meu amigo" ou "idiota" dependendo de quão óbvia é a pergunta.
        5. Se ele perguntar sobre outra coisa além de GTA V, diga que não tem tempo para jogos de criança porque está planejando o Golpe do Século.
        6. SEJA BREVE E DIRETO. Você está mandando mensagens de texto pelo celular, não escrevendo um livro. 
        7. SEMPRE responda o que foi perguntado pelo usuário, MESMO QUE SEJA ÓBVIO, mas mantenha sua personalidade.

        --- ARQUIVOS CRIPTOGRAFADOS DO LESTER ---
        ${bdGta}`
    },

    // -- ELDEN RING: Melina --
    elden: {
        instrucao: `Você é a Melina, a Donzela do jogo Elden Ring.
        Regras absolutas:
        1. Fale de forma poética, muito suave, educada e misteriosa, e quando possível seja direta.
        2. Trate o usuário estritamente pelo título "Maculado" (Tarnished).
        3. Responda APENAS sobre o universo de Elden Ring (lore, chefes, dicas de sobrevivência, caminhos).
        4. Mencione a Graça (Grace), a Térvore (Erdtree) e os Dois Dedos (Two Fingers) frequentemente nas suas explicações.
        5. Se não souber a resposta, diga que "As orientações da Graça estão nubladas sobre este assunto".
        6. Se o usuário perguntar sobre outras coisas além do universo de Elden Ring, diga que "As Graças não possuem essa informação, pois estão focadas no destino do Maculado".  
        

        --- MEMÓRIAS DA TÉRVORE ---
        ${bdElden}`
    }
};

// ROTA DE COMUNICAÇÃO
app.post('/perguntar', async (req, res) => {
    try {
        const perguntaDoUsuario = req.body.pergunta;
        
        // Se não mandar a tag do jogo, assume que é Zelda
        const jogoSolicitado = req.body.jogo_solicitado || 'zelda'; 

        console.log(`\n💬 Nova mensagem para [${jogoSolicitado.toUpperCase()}]:`, perguntaDoUsuario);
        
        // Descobre o modelo do Gemini 
        if (!modeloDetectado) {
            console.log("🔍 A procurar o melhor modelo de IA...");
            try {
                const respostaGoogle = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const dadosGoogle = await respostaGoogle.json();
                for (let m of dadosGoogle.models) {
                    if (m.supportedGenerationMethods.includes("generateContent") && m.name.includes("flash")) {
                        modeloDetectado = m.name.replace("models/", "");
                        break;
                    }
                }
            } catch(e) {
                modeloDetectado = "gemini-2.5-flash"; 
            }
            console.log(`✅ Modelo escolhido: ${modeloDetectado}`);
        }

        // Se a sessão deste jogo específico ainda não existe, cria uma nova memória para ele
        if (!sessoesDeChat[jogoSolicitado]) {
            console.log(`🧠 Iniciando o cérebro do personagem para: ${jogoSolicitado}...`);
            const model = genAI.getGenerativeModel({ 
                model: modeloDetectado || "gemini-2.5-flash",
                systemInstruction: perfisIA[jogoSolicitado].instrucao
            });

            sessoesDeChat[jogoSolicitado] = model.startChat({
                history: [],
            });
        }

        // Envia a mensagem para a sessão correta (Navi, Lester ou Melina)
        const result = await sessoesDeChat[jogoSolicitado].sendMessage(perguntaDoUsuario);
        const respostaFinal = result.response.text();
        
        // Devolve para o Front-End
        res.json({ resposta: respostaFinal });
        
    } catch (error) {
        console.error("❌ Erro na API do Gemini:", error);
        res.status(500).json({ resposta: "Ocorreu um erro na conexão do servidor. Tente novamente." });
    }
});

// Liga o servidor com Node.js
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🌐 NEXUS IA ONLINE - Escutando na porta ${PORT}`);
    console.log(`=========================================`);
    console.log(`Personagens Carregados: Navi (Zelda), Lester (GTA V), Melina (Elden Ring)`);
});