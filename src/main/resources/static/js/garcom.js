var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let carrinho = [];
let cardapioDisponivel = [];
// 1. INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('/Prato');
        cardapioDisponivel = yield response.json();
        renderizarOpcoes(cardapioDisponivel);
        // Filtro de pesquisa
        const filtroInput = document.getElementById("filtro-prato");
        filtroInput.addEventListener("input", () => {
            const termo = filtroInput.value.toLowerCase();
            const pratosFiltrados = cardapioDisponivel.filter(prato => prato.nome.toLowerCase().includes(termo));
            renderizarOpcoes(pratosFiltrados);
        });
    }
    catch (error) {
        console.error("Erro ao carregar cardápio", error);
    }
}));
// AUXILIAR: Renderiza o <select>
function renderizarOpcoes(listaPratos) {
    const select = document.getElementById("select-prato");
    select.innerHTML = "";
    if (listaPratos.length === 0) {
        const option = document.createElement("option");
        option.text = "Nenhum prato encontrado";
        option.disabled = true;
        option.selected = true;
        select.appendChild(option);
        return;
    }
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecione um prato...";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    listaPratos.forEach(prato => {
        const option = document.createElement("option");
        option.value = prato.id.toString();
        option.text = `${prato.nome} - R$ ${prato.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}
// 2. ADICIONAR ITEM AO CARRINHO
export function adicionarItem(event) {
    event.preventDefault();
    const select = document.getElementById("select-prato");
    const qtdInput = document.getElementById("quantidade");
    const obsInput = document.getElementById("observacao");
    const filtroInput = document.getElementById("filtro-prato");
    const pratoId = parseInt(select.value);
    const pratoSelecionado = cardapioDisponivel.find(p => p.id === pratoId);
    if (!pratoSelecionado) {
        alert("Selecione um prato válido!");
        return;
    }
    const novoItem = {
        quantidade: parseInt(qtdInput.value),
        observacao: obsInput.value,
        prato: { id: pratoId },
        nomePrato: pratoSelecionado.nome,
        precoUnitario: pratoSelecionado.preco
    };
    carrinho.push(novoItem);
    atualizarVisualCarrinho();
    qtdInput.value = "1";
    obsInput.value = "";
    filtroInput.value = "";
    renderizarOpcoes(cardapioDisponivel);
    select.value = "";
}
// 3. ATUALIZAR VISUAL DO CARRINHO
function atualizarVisualCarrinho() {
    const listaDiv = document.getElementById("lista-pedido");
    const totalSpan = document.getElementById("valor-total");
    const contadorSpan = document.getElementById("contador-itens");
    const btnEnviar = document.getElementById("btn-enviar");
    listaDiv.innerHTML = "";
    let total = 0;
    carrinho.forEach((item, index) => {
        const subtotal = (item.precoUnitario || 0) * item.quantidade;
        total += subtotal;
        const itemHtml = document.createElement("div");
        itemHtml.className = "flex justify-between items-start bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-in";
        itemHtml.innerHTML = `
            <div>
                <p class="font-bold text-slate-700">${item.quantidade}x ${item.nomePrato}</p>
                ${item.observacao ? `<p class="text-xs text-orange-600 italic">Obs: ${item.observacao}</p>` : ''}
            </div>
            <div class="text-right">
                <p class="text-sm font-bold text-slate-600">R$ ${subtotal.toFixed(2)}</p>
                <button onclick="removerItem(${index})" class="text-xs text-red-400 hover:text-red-600 underline mt-1">remover</button>
            </div>
        `;
        listaDiv.appendChild(itemHtml);
    });
    totalSpan.innerText = `R$ ${total.toFixed(2)}`;
    contadorSpan.innerText = `${carrinho.length} itens`;
    if (carrinho.length > 0) {
        btnEnviar.disabled = false;
        btnEnviar.classList.remove("opacity-50", "cursor-not-allowed");
    }
    else {
        listaDiv.innerHTML = `<div class="text-center text-slate-400 mt-10"><p class="text-4xl mb-2">🍽️</p><p>Nenhum item adicionado.</p></div>`;
        btnEnviar.disabled = true;
    }
}
// 4. REMOVER ITEM
export function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarVisualCarrinho();
}
// 5. ENVIAR PARA A COZINHA (COM MESA)
export function enviarPedidoParaCozinha() {
    return __awaiter(this, void 0, void 0, function* () {
        if (carrinho.length === 0)
            return;
        // CAPTURA A MESA AQUI
        const mesaInput = document.getElementById("numero-mesa");
        const mesaNumero = parseInt(mesaInput.value);
        if (!mesaNumero || mesaNumero <= 0) {
            alert("⚠️ Por favor, informe o número da MESA antes de enviar!");
            mesaInput.focus();
            mesaInput.classList.add("ring-4", "ring-red-400"); // Destaque visual de erro
            setTimeout(() => mesaInput.classList.remove("ring-4", "ring-red-400"), 2000);
            return;
        }
        const btn = document.getElementById("btn-enviar");
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = "🚀 Enviando...";
        btn.disabled = true;
        const pedidoFinal = {
            mesa: mesaNumero, // Envia a mesa
            itens: carrinho.map(item => ({
                quantidade: item.quantidade,
                observacao: item.observacao,
                prato: { id: item.prato.id }
            }))
        };
        try {
            const response = yield fetch('/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoFinal)
            });
            if (response.ok) {
                alert(`✅ Pedido da Mesa ${mesaNumero} enviado com sucesso!`);
                carrinho = [];
                atualizarVisualCarrinho();
                mesaInput.value = ""; // Limpa a mesa
            }
            else {
                alert("❌ Erro ao enviar pedido.");
            }
        }
        catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        }
        finally {
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }
    });
}
window.adicionarItem = adicionarItem;
window.removerItem = removerItem;
window.enviarPedidoParaCozinha = enviarPedidoParaCozinha;
