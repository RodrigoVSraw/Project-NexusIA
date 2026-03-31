# 🌌 Nexus IA

> Um catálogo interativo de jogos guiado por Inteligência Artificial.

O **Nexus IA** é um projeto web inovador que combina uma vitrine de jogos (como *Elden Ring*, *The Legend of Zelda* e *GTA*) com um assistente virtual integrado. O objetivo é proporcionar aos usuários uma experiência imersiva, onde eles podem explorar detalhes dos jogos e interagir em tempo real com uma IA para tirar dúvidas, pedir dicas ou debater sobre o universo dos games.

## 🚀 Funcionalidades

- **Catálogo Temático:** Páginas dedicadas e estilizadas para diferentes jogos, com design responsivo.
- **Assistente Virtual Integrado:** Chat dinâmico em cada página de jogo, conectado a uma API de Inteligência Artificial para respostas contextuais.
- **Arquitetura Modular:** Código estruturado com separação clara de responsabilidades (HTML, CSS e Vanilla JavaScript).

### 📸 Demonstração Visual

- **Interface Principal:**

https://github.com/user-attachments/assets/07b1cd3b-5559-4b95-a930-0d1077d03b6f

- **Funcionamento do Chatbot:**
  
https://github.com/user-attachments/assets/0d5570de-7fc9-4057-adc3-65bd5cbf8a77

## 🛠️ Tecnologias Utiliz



adas

**Front-end:**
- HTML5
- CSS3 (Estilização global e modular por página)
- JavaScript (Vanilla)

**Back-end:**
- Node.js (Servidor local `server.js`)
- Integração com API de Inteligência Artificial Generativa

## ⚙️ Como rodar o projeto localmente

Para executar o Nexus IA na sua máquina, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/RodrigoVSraw/Project-NexusIA.git](https://github.com/RodrigoVSraw/Project-NexusIA.git)
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd Project-NexusIA
   ```

3. **Instale as dependências do Node.js:**
   ```bash
   npm install
   ```

4. **Configure a chave API do Google:**
   - Acesse `aistudio.google.com`, selecione a opção *Get API Key*, depois *Criar chave de API*
   - Adicione a sua chave de API com a seguinte estrutura:
     ```env
     API_KEY=sua_chave_de_api_aqui
     ```
   *(Nota: A chave API deve ser colocada dentro do arquivo `server.js`, na área mencionada acima).*

5. **Inicie o servidor local:**
   ```bash
   node server.js
   ```

6. **Acesse no navegador:**
   Abra o seu navegador e acesse a porta configurada (ex: `http://localhost:3000`).

---

## 👨‍💻 Desenvolvedor

**Rodrigo Raw**
- Desenvolvimento Full-stack (Front-end, Back-end e Integração com IA)
- GitHub: [@RodrigoVSraw](https://github.com/RodrigoVSraw)

---
*Projeto desenvolvido de forma independente para aprimoramento de habilidades em desenvolvimento web e construção de chatbots.*
