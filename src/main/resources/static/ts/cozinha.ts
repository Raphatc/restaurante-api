interface Prato {
    nome: string;
    preco: number;
}

interface ItemPedido {
    id: number;
    quantidade: number;
    observacao?: string;
    prato: Prato;
}

interface Pedido {
    id: number;
    mesa: number; // Campo novo recebido do Java
    itens: ItemPedido[];
}

const REFRESH_RATE = 5000;
const API_URL = '/pedidos';

document.addEventListener("DOMContentLoaded", () => {
    carregarPedidos();
    setInterval(() => {
        carregarPedidos();
        atualizarRelogio();
    }, REFRESH_RATE);
});

async function carregarPedidos() {
    try {
        const response = await fetch(API_URL);
        const pedidos: Pedido[] = await response.json();
        renderizarMural(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
    }
}

function renderizarMural(pedidos: Pedido[]) {
    const mural = document.getElementById("mural-pedidos") as HTMLDivElement;

    if (pedidos.length === 0) {
        mural.innerHTML = `
            <div class="col-span-full text-center text-slate-600 mt-20 animate-pulse">
                <p class="text-6xl mb-4">👨‍🍳</p>
                <p class="text-xl">Cozinha livre! Tudo entregue.</p>
            </div>`;
        return;
    }

    mural.innerHTML = pedidos.map(pedido => `
        <div class="bg-yellow-100 text-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col transform transition hover:scale-105 duration-300 border-l-8 border-yellow-500">

            <div class="bg-yellow-200 p-3 flex justify-between items-center border-b border-yellow-300">
                <div>
                    <span class="font-bold text-xs text-slate-500 block">PEDIDO #${pedido.id}</span>
                    <span class="font-black text-2xl text-slate-800">MESA ${pedido.mesa || '?'}</span>
                </div>
                <span class="text-xs font-mono bg-yellow-500 text-white px-2 py-1 rounded">PENDENTE</span>
            </div>

            <div class="p-4 flex-grow space-y-3">
                ${pedido.itens.map(item => `
                    <div class="border-b border-yellow-200 pb-2 last:border-0">
                        <div class="flex justify-between items-start">
                            <span class="font-bold text-lg">${item.quantidade}x ${item.prato.nome}</span>
                        </div>
                        ${item.observacao ? `
                            <p class="text-red-600 font-bold text-sm mt-1 bg-red-100 p-1 rounded inline-block">
                                ⚠️ ${item.observacao}
                            </p>
                        ` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="p-4 bg-yellow-50 border-t border-yellow-200">
                <button onclick="concluirPedido(${pedido.id})"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow transition flex justify-center items-center gap-2">
                    <span>✅ Pronto / Entregar</span>
                </button>
            </div>
        </div>
    `).join('');
}

export async function concluirPedido(id: number) {
    if (!confirm(`O Pedido #${id} está pronto para sair?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            carregarPedidos();
        } else {
            alert("Erro ao finalizar pedido.");
        }
    } catch (error) {
        console.error(error);
    }
}

function atualizarRelogio() {
    const relogio = document.getElementById("relogio");
    if (relogio) relogio.innerText = new Date().toLocaleTimeString('pt-BR');
}

(window as any).concluirPedido = concluirPedido;