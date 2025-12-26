var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// URL base da API
const API_URL = '/Prato';
// --- FUNÇÃO 1: CADASTRAR (JÁ TINHAS, SÓ ADICIONEI O REFRESH DA TABELA) ---
export function cadastrarPrato(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const btn = document.querySelector("button[type='submit']");
        const msgDiv = document.getElementById("mensagem");
        const form = document.getElementById("formPrato");
        // Feedback visual
        const textoOriginal = btn.innerText;
        btn.innerText = "Salvando...";
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed");
        const nomeInput = document.getElementById("nome");
        const descricaoInput = document.getElementById("descricao");
        const precoInput = document.getElementById("preco");
        const novoPrato = {
            nome: nomeInput.value,
            descricao: descricaoInput.value,
            preco: parseFloat(precoInput.value)
        };
        try {
            const response = yield fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoPrato)
            });
            if (response.ok) {
                msgDiv.textContent = "✅ Prato cadastrado com sucesso!";
                msgDiv.className = "mt-4 text-center text-sm font-medium text-green-600 bg-green-100 p-2 rounded";
                msgDiv.classList.remove("hidden");
                form.reset();
                // ATUALIZA A TABELA IMEDIATAMENTE!
                carregarPratos();
            }
            else {
                throw new Error("Erro na API");
            }
        }
        catch (error) {
            console.error(error);
            msgDiv.textContent = "❌ Erro ao conectar com o servidor.";
            msgDiv.className = "mt-4 text-center text-sm font-medium text-red-600 bg-red-100 p-2 rounded";
            msgDiv.classList.remove("hidden");
        }
        finally {
            btn.innerText = textoOriginal;
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
            setTimeout(() => msgDiv.classList.add("hidden"), 3000);
        }
    });
}
// --- FUNÇÃO 2: LISTAR (NOVA!) ---
export function carregarPratos() {
    return __awaiter(this, void 0, void 0, function* () {
        const tabela = document.getElementById("tabela-pratos");
        try {
            const response = yield fetch(API_URL);
            if (!response.ok)
                throw new Error("Erro ao buscar dados");
            const pratos = yield response.json();
            // Limpar tabela
            tabela.innerHTML = "";
            if (pratos.length === 0) {
                tabela.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-500">Nenhum prato cadastrado ainda. 🍽️</td></tr>`;
                return;
            }
            // Criar linhas para cada prato
            pratos.forEach(prato => {
                const linha = document.createElement("tr");
                linha.className = "hover:bg-slate-50 transition";
                linha.innerHTML = `
                <td class="p-4 font-mono text-xs text-slate-500">#${prato.id}</td>
                <td class="p-4 font-medium text-slate-800">${prato.nome}</td>
                <td class="p-4 text-slate-600 truncate max-w-xs">${prato.descricao || '-'}</td>
                <td class="p-4 text-orange-600 font-bold">R$ ${prato.preco.toFixed(2)}</td>
                <td class="p-4 text-center">
                    <button onclick="excluirPrato(${prato.id})"
                        class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded transition"
                        title="Excluir">
                        🗑️
                    </button>
                </td>
            `;
                tabela.appendChild(linha);
            });
        }
        catch (error) {
            console.error(error);
            tabela.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-red-500">Erro ao carregar cardápio.</td></tr>`;
        }
    });
}
// --- FUNÇÃO 3: EXCLUIR (NOVA!) ---
export function excluirPrato(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!confirm("Tem certeza que deseja excluir este prato?"))
            return;
        try {
            const response = yield fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                carregarPratos(); // Recarrega a lista
            }
            else {
                alert("Erro ao excluir.");
            }
        }
        catch (error) {
            console.error(error);
            alert("Erro de conexão.");
        }
    });
}
// Exportar funções para o HTML global
window.cadastrarPrato = cadastrarPrato;
window.carregarPratos = carregarPratos;
window.excluirPrato = excluirPrato;
// Carregar lista ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
    carregarPratos();
});
