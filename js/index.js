const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const icon = menuToggle.querySelector('i');

// Lógica de Abrir/Fechar a barra lateral
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('shifted');
    
    // Troca o ícone "Barras" para o "X" quando está aberto
    if (sidebar.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Lógica do Tema Claro/Escuro
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

const temaGuardado = localStorage.getItem('temaNexus');
if (temaGuardado === 'claro') {
    body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        
        localStorage.setItem('temaNexus', 'claro');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        
        localStorage.removeItem('temaNexus');
    }
});