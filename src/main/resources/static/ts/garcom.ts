// Interfaces
interface Prato {
    id: number;
    nome: string;
    preco: number;
}

interface ItemPedidoInput {
    quantidade: number;
    observacao: string;
    prato: { id: number };
    nomePrato?: string;
    precoUnitario?: number;
}

interface PedidoDTO {
    itens: ItemPedidoInput[];
}

// --- ESTADO ---
let carrinho: ItemPedidoInput[] = [];
let cardapioDisponivel: Prato[] = []; // Lista completa para referência

// 1. CARREGAR E CONFIGURAR
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/Prato');
        cardapioDisponivel = await response.json();

        // Renderiza lista inicial
        renderizarOpcoes(cardapioDisponivel);

        // Configura o Filtro
        const filtroInput = document.getElementById("filtro-prato") as HTMLInputElement;
        filtroInput.addEventListener("input", () => {
            const termo = filtroInput.value.toLowerCase();
            const pratosFiltrados = cardapioDisponivel.filter(prato =>
                prato.nome.toLowerCase().includes(termo)
            );
            renderizarOpcoes(pratosFiltrados);
        });

    } catch (error) {
        console.error("Erro ao carregar cardápio", error);
        alert("Erro ao conectar com a cozinha.");
    }
});

// FUNÇÃO AUXILIAR: Desenha as opções do <select>
function renderizarOpcoes(listaPratos: Prato[]) {
    const select = document.getElementById("select-prato") as HTMLSelectElement;
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
export function adicionarItem(event: Event) {
    event.preventDefault();

    const select = document.getElementById("select-prato") as HTMLSelectElement;
    const qtdInput = document.getElementById("quantidade") as HTMLInputElement;
    const obsInput = document.getElementById("observacao") as HTMLInputElement;
    const filtroInput = document.getElementById("filtro-prato") as HTMLInputElement;

    const pratoId = parseInt(select.value);

    // Busca na lista completa pelo ID
    const pratoSelecionado = cardapioDisponivel.find(p => p.id === pratoId);

    if (!pratoSelecionado) {
        alert("Selecione um prato válido!");
        return;
    }

    const novoItem: ItemPedidoInput = {
        quantidade: parseInt(qtdInput.value),
        observacao: obsInput.value,
        prato: { id: pratoId },
        nomePrato: pratoSelecionado.nome,
        precoUnitario: pratoSelecionado.preco
    };

    carrinho.push(novoItem);
    atualizarVisualCarrinho();

    // Resetar campos e filtro
    qtdInput.value = "1";
    obsInput.value = "";
    filtroInput.value = "";
    renderizarOpcoes(cardapioDisponivel); // Mostra todos os pratos de novo
    select.value = "";
}

// 3. ATUALIZAR VISUAL DO CARRINHO
function atualizarVisualCarrinho() {
    const listaDiv = document.getElementById("lista-pedido") as HTMLDivElement;
    const totalSpan = document.getElementById("valor-total") as HTMLSpanElement;
    const contadorSpan = document.getElementById("contador-itens") as HTMLSpanElement;
    const btnEnviar = document.getElementById("btn-enviar") as HTMLButtonElement;

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

    // Lógica do botão de enviar
    if (carrinho.length > 0) {
        btnEnviar.disabled = false;
        btnEnviar.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
        listaDiv.innerHTML = `<div class="text-center text-slate-400 mt-10"><p class="text-4xl mb-2">🍽️</p><p>Nenhum item adicionado.</p></div>`;
        btnEnviar.disabled = true;
    }
}

// 4. REMOVER ITEM
export function removerItem(index: number) {
    carrinho.splice(index, 1);
    atualizarVisualCarrinho();
}

// 5. ENVIAR PARA A COZINHA
export async function enviarPedidoParaCozinha() {
    if (carrinho.length === 0) return;

    const btn = document.getElementById("btn-enviar") as HTMLButtonElement;
    const textoOriginal = btn.innerHTML;

    btn.innerHTML = "🚀 Enviando...";
    btn.disabled = true;

    const pedidoFinal: PedidoDTO = {
        itens: carrinho.map(item => ({
            quantidade: item.quantidade,
            observacao: item.observacao,
            prato: { id: item.prato.id }
        }))
    };

    try {
        const response = await fetch('/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoFinal)
        });

        if (response.ok) {
            alert("✅ Pedido enviado para a cozinha com sucesso!");
            carrinho = [];
            atualizarVisualCarrinho();
        } else {
            alert("❌ Erro ao enviar pedido.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
}

// Exportar funções para o HTML
(window as any).adicionarItem = adicionarItem;
(window as any).removerItem = removerItem;
(window as any).enviarPedidoParaCozinha = enviarPedidoParaCozinha;