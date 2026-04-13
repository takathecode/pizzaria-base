// Inicialização do AOS
AOS.init({ duration: 800, once: true });

// Dados do cardápio
const pizzas = {
    tradicionais: [
        { nome: "Margherita", desc: "Molho, mussarela, manjericão e azeite", preco: "R$ 70,00", img: "img/marguerita.jpg" },
        { nome: "Calabresa", desc: "Calabresa, cebola, mussarela e orégano", preco: "R$ 54,90", img: "img/calabresa.jpg" },
        { nome: "Portuguesa", desc: "Presunto, ovo, cebola, ervilha, mussarela", preco: "R$ 59,90", img: "img/portuguesa.jpg" }
    ],
    especiais: [
        { nome: "Pizza Donatella", desc: "Mussarela de búfala, tomates confit, rúcula e parma", preco: "R$ 79,90", img: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { nome: "Quatro Queijos", desc: "Mussarela, provolone, gorgonzola, parmesão", preco: "R$ 67,90", img: "img/Quatro-Queijos.jpg" },
        { nome: "Aliche", desc: "Combinação de filés de anchova salgados sobre molho de tomate e massa tradicional", preco: "R$ 64,90", img: "img/aliche.jpg" }
    ],
    doces: [
        { nome: "Chocolate com Morango", desc: "Chocolate ao leite, morangos frescos", preco: "R$ 59,90", img: "img/chocolate-morango.jpg" },
        { nome: "Banana com Canela", desc: "Banana caramelizada, canela e açúcar", preco: "R$ 54,90", img: "img/banana-canela.jpg" }
    ]
};

function renderCardapio() {
    const tradDiv = document.getElementById('tradicionais');
    const espDiv = document.getElementById('especiais');
    const docesDiv = document.getElementById('doces');
    
    tradDiv.innerHTML = '';
    espDiv.innerHTML = '';
    docesDiv.innerHTML = '';
    
    pizzas.tradicionais.forEach(p => {
        tradDiv.innerHTML += `
            <div class="pizza-card">
                <div class="pizza-img"><img src="${p.img}" alt="${p.nome}" loading="lazy"></div>
                <div class="pizza-info">
                    <h4>${p.nome}</h4>
                    <p>${p.desc}</p>
                    <div class="price">${p.preco}</div>
                </div>
            </div>
        `;
    });
    
    pizzas.especiais.forEach(p => {
        espDiv.innerHTML += `
            <div class="pizza-card">
                <div class="pizza-img"><img src="${p.img}" alt="${p.nome}" loading="lazy"></div>
                <div class="pizza-info">
                    <h4>${p.nome}</h4>
                    <p>${p.desc}</p>
                    <div class="price">${p.preco}</div>
                </div>
            </div>
        `;
    });
    
    pizzas.doces.forEach(p => {
        docesDiv.innerHTML += `
            <div class="pizza-card">
                <div class="pizza-img"><img src="${p.img}" alt="${p.nome}" loading="lazy"></div>
                <div class="pizza-info">
                    <h4>${p.nome}</h4>
                    <p>${p.desc}</p>
                    <div class="price">${p.preco}</div>
                </div>
            </div>
        `;
    });
}

// Sanitização
function sanitizeString(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).trim();
}

// Toast message
function showMessage(msg, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = msg;
    toast.style.backgroundColor = isError ? '#b2221c' : '#2e241f';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// Formulário de Reserva
const formReserva = document.getElementById('formReserva');
const reservaError = document.getElementById('reservaError');

if (formReserva) {
    formReserva.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const unidade = document.getElementById('unidade').value;
        const data = document.getElementById('dataReserva').value;
        const hora = document.getElementById('horaReserva').value;
        let nome = document.getElementById('nomeReserva').value;
        let email = document.getElementById('emailReserva').value;
        let telefone = document.getElementById('telefoneReserva').value;
        const pessoas = document.getElementById('pessoas').value;
        
        if (!unidade || !data || !hora || !nome || !email || !telefone || !pessoas) {
            reservaError.innerText = 'Todos os campos são obrigatórios.';
            return;
        }
        
        if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            reservaError.innerText = 'Email inválido.';
            return;
        }
        
        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) {
            reservaError.innerText = 'Telefone deve ter pelo menos 10 dígitos.';
            return;
        }
        
        reservaError.innerText = '';
        
        nome = sanitizeString(nome);
        email = sanitizeString(email);
        telefone = sanitizeString(telefone);
        
        showMessage(`✅ Mesa reservada para ${nome} em ${data} às ${hora}!`);
        formReserva.reset();
    });
}

// Formulário de Contato
const formContato = document.getElementById('formContato');
const contatoError = document.getElementById('contatoError');

if (formContato) {
    formContato.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let nome = document.getElementById('nomeContato').value;
        let email = document.getElementById('emailContato').value;
        let telefone = document.getElementById('telefoneContato').value;
        let mensagem = document.getElementById('mensagemContato').value;
        
        if (!nome || !email || !telefone || !mensagem) {
            contatoError.innerText = 'Preencha todos os campos.';
            return;
        }
        
        if (email.indexOf('@') === -1) {
            contatoError.innerText = 'Email inválido.';
            return;
        }
        
        const telefoneLimpo = telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) {
            contatoError.innerText = 'Telefone inválido.';
            return;
        }
        
        contatoError.innerText = '';
        
        nome = sanitizeString(nome);
        email = sanitizeString(email);
        telefone = sanitizeString(telefone);
        mensagem = sanitizeString(mensagem);
        
        showMessage(`📨 Mensagem enviada! Em breve retornaremos.`);
        formContato.reset();
    });
}

// Menu Mobile
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    const mobileLinks = document.querySelectorAll('.mobile-menu ul li a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Scroll suave e highlight do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Renderiza o cardápio
renderCardapio();