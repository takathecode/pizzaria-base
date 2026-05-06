// Inicialização do AOS
AOS.init({ duration: 800, once: true });

// ==================== DADOS DO CARDÁPIO (com preços separados para inteira/meia) ====================
const pizzas = {
    tradicionais: [
        { id: 1, nome: "Margherita", desc: "Molho, mussarela, manjericão e azeite", precoInteira: 70.00, precoMeia: 40.00, img: "img/marguerita.jpg" },
        { id: 2, nome: "Calabresa", desc: "Calabresa, cebola, mussarela e orégano", precoInteira: 54.90, precoMeia: 32.90, img: "img/calabresa.jpg" },
        { id: 3, nome: "Portuguesa", desc: "Presunto, ovo, cebola, ervilha, mussarela", precoInteira: 59.90, precoMeia: 34.90, img: "img/portuguesa.jpg" }
    ],
    especiais: [
        { id: 4, nome: "Pizza Donatella", desc: "Mussarela de búfala, tomates confit, rúcula e parma", precoInteira: 79.90, precoMeia: 44.90, img: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400" },
        { id: 5, nome: "Quatro Queijos", desc: "Mussarela, provolone, gorgonzola, parmesão", precoInteira: 67.90, precoMeia: 39.90, img: "img/Quatro-Queijos.jpg" },
        { id: 6, nome: "Aliche", desc: "Combinação de filés de anchova salgados sobre molho de tomate e massa tradicional", precoInteira: 64.90, precoMeia: 37.90, img: "img/aliche.jpg" }
    ],
    doces: [
        { id: 7, nome: "Chocolate com Morango", desc: "Chocolate ao leite, morangos frescos", precoInteira: 59.90, precoMeia: 34.90, img: "img/chocolate-morango.jpg" },
        { id: 8, nome: "Banana com Canela", desc: "Banana caramelizada, canela e açúcar", precoInteira: 54.90, precoMeia: 32.90, img: "img/banana-canela.jpg" }
    ]
};

// ==================== CARRINHO (localStorage) ====================
let carrinho = [];

// Carregar carrinho do localStorage
function carregarCarrinho() {
    const salvo = localStorage.getItem('carrinhoDonatella');
    if (salvo) {
        carrinho = JSON.parse(salvo);
    }
    atualizarContadores();
}

// Salvar carrinho
function salvarCarrinho() {
    localStorage.setItem('carrinhoDonatella', JSON.stringify(carrinho));
    atualizarContadores();
}

// Atualizar contadores
function atualizarContadores() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const cartCount = document.getElementById('cartCount');
    const cartCount2 = document.getElementById('cartCount2');
    if (cartCount) cartCount.textContent = totalItens;
    if (cartCount2) cartCount2.textContent = totalItens;
}

// Adicionar ao carrinho
function adicionarAoCarrinho(pizza, tipo, preco) {
    const itemExistente = carrinho.find(item => item.id === pizza.id && item.tipo === tipo);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: pizza.id,
            nome: pizza.nome,
            tipo: tipo,
            preco: preco,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    showMessage(`${pizza.nome} (${tipo}) adicionada ao carrinho!`);
}

// Remover item
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
}

// Calcular total
function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// Formatar preço
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ==================== RENDERIZAR CARDÁPIO ====================
function renderCardapio() {
    const tradDiv = document.getElementById('tradicionais');
    const espDiv = document.getElementById('especiais');
    const docesDiv = document.getElementById('doces');
    
    tradDiv.innerHTML = '';
    espDiv.innerHTML = '';
    docesDiv.innerHTML = '';
    
    pizzas.tradicionais.forEach(pizza => {
        tradDiv.innerHTML += criarCardPizza(pizza);
    });
    
    pizzas.especiais.forEach(pizza => {
        espDiv.innerHTML += criarCardPizza(pizza);
    });
    
    pizzas.doces.forEach(pizza => {
        docesDiv.innerHTML += criarCardPizza(pizza);
    });
    
    adicionarEventosBotoes();
}

// Criar card da pizza COM opções de Inteira/Meia
function criarCardPizza(pizza) {
    return `
        <div class="pizza-card" data-id="${pizza.id}">
            <div class="pizza-img"><img src="${pizza.img}" alt="${pizza.nome}" loading="lazy"></div>
            <div class="pizza-info">
                <h4>${pizza.nome}</h4>
                <p>${pizza.desc}</p>
                <div class="price-row">
                    <span class="price">Inteira: ${formatarPreco(pizza.precoInteira)}</span>
                    <span class="price">Meia: ${formatarPreco(pizza.precoMeia)}</span>
                </div>
                
                <div class="pizza-options">
                    <label>
                        <input type="radio" name="tipo_${pizza.id}" value="inteira" checked> Inteira
                    </label>
                    <label>
                        <input type="radio" name="tipo_${pizza.id}" value="meia"> Meia
                    </label>
                </div>
                
                <button class="btn-add" data-id="${pizza.id}" data-nome="${pizza.nome}" data-preco-inteira="${pizza.precoInteira}" data-preco-meia="${pizza.precoMeia}">
                    <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
}

// Adicionar eventos aos botões
function adicionarEventosBotoes() {
    const botoes = document.querySelectorAll('.btn-add');
    botoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const pizzaId = parseInt(this.dataset.id);
            const pizzaNome = this.dataset.nome;
            const precoInteira = parseFloat(this.dataset.precoInteira);
            const precoMeia = parseFloat(this.dataset.precoMeia);
            
            const todasPizzas = [...pizzas.tradicionais, ...pizzas.especiais, ...pizzas.doces];
            const pizza = todasPizzas.find(p => p.id === pizzaId);
            
            const radioSelecionado = document.querySelector(`input[name="tipo_${pizzaId}"]:checked`);
            const tipo = radioSelecionado ? radioSelecionado.value : 'inteira';
            const preco = tipo === 'inteira' ? precoInteira : precoMeia;
            const tipoLabel = tipo === 'inteira' ? 'Inteira' : 'Meia';
            
            adicionarAoCarrinho(pizza, tipoLabel, preco);
        });
    });
}

// ==================== RENDERIZAR CARRINHO (MODAL) ====================
function renderizarCarrinho() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (!cartItemsDiv) return;
    
    if (carrinho.length === 0) {
        cartItemsDiv.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>';
        if (cartTotalSpan) cartTotalSpan.textContent = formatarPreco(0);
        return;
    }
    
    let html = '';
    carrinho.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nome}</div>
                    <div class="cart-item-type">${item.tipo} x${item.quantidade}</div>
                </div>
                <div class="cart-item-price">${formatarPreco(item.preco * item.quantidade)}</div>
                <button class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    if (cartTotalSpan) cartTotalSpan.textContent = formatarPreco(calcularTotal());
    
    const botoesRemover = document.querySelectorAll('.cart-item-remove');
    botoesRemover.forEach(botao => {
        botao.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removerDoCarrinho(index);
        });
    });
}

// ==================== WHATSAPP ====================
function gerarMensagemWhatsApp() {
    if (carrinho.length === 0) {
        showMessage('Seu carrinho está vazio!', true);
        return null;
    }
    
    let mensagem = "🍕 *PEDIDO PIZZARIA DONATELLA* 🍕\n\n";
    mensagem += "Olá! Gostaria de fazer um pedido:\n\n";
    
    carrinho.forEach(item => {
        mensagem += `- Pizza ${item.nome} (${item.tipo}) x${item.quantidade} = ${formatarPreco(item.preco * item.quantidade)}\n`;
    });
    
    mensagem += `\n*TOTAL: ${formatarPreco(calcularTotal())}*\n\n`;
    mensagem += "📍 Endereço para entrega: \n";
    mensagem += "💬 Aguardo confirmação!\n\n";
    mensagem += "Obrigado!";
    
    return encodeURIComponent(mensagem);
}

function finalizarPedido() {
    const mensagem = gerarMensagemWhatsApp();
    if (!mensagem) return;
    
    const numeroTelefone = "5511987654321";
    const urlWhatsApp = `https://wa.me/${numeroTelefone}?text=${mensagem}`;
    
    window.open(urlWhatsApp, '_blank');
    fecharModal();
}

// ==================== MODAL ====================
function abrirModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        renderizarCarrinho();
        modal.classList.add('active');
    }
}

function fecharModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==================== TOAST MESSAGE ====================
function showMessage(msg, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = msg;
    toast.style.backgroundColor = isError ? '#b2221c' : '#2e241f';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== FORMULÁRIO DE CONTATO ====================
function sanitizeString(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).trim();
}

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
        
        contatoError.innerText = '';
        
        nome = sanitizeString(nome);
        email = sanitizeString(email);
        telefone = sanitizeString(telefone);
        mensagem = sanitizeString(mensagem);
        
        showMessage(`📨 Mensagem enviada! Em breve retornaremos.`);
        formContato.reset();
    });
}

// ==================== MENU MOBILE ====================
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

// ==================== SCROLL SUAVE ====================
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

// ==================== EVENTOS GLOBAIS ====================
document.getElementById('cartToggle')?.addEventListener('click', abrirModal);
document.getElementById('cartToggle2')?.addEventListener('click', abrirModal);
document.getElementById('cartClose')?.addEventListener('click', fecharModal);
document.getElementById('finalizarPedido')?.addEventListener('click', finalizarPedido);

window.addEventListener('click', function(e) {
    const modal = document.getElementById('cartModal');
    if (e.target === modal) {
        fecharModal();
    }
});

// ==================== INICIALIZAR ====================
carregarCarrinho();
renderCardapio();
