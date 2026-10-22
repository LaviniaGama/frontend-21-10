class OrdemServico {
    constructor(id, cliente, equipamento, descricao, valorEstimado, concluida = false) {
        this.id = id ?? Date.now() + Math.random();
        this.cliente = cliente;
        this.equipamento = equipamento;
        this.descricao = descricao;
        this.valorEstimado = Number(valorEstimado) || 0;
        this.concluida = concluida;
    }

    concluirOS() {
        this.concluida = true;
    }

    gerarTemplate() {
        const statusTexto = this.concluida ? 'Concluída' : 'Em Aberto';
        const badgeCor = this.concluida ? 'bg-success' : 'bg-danger';
        const botaoTexto = this.concluida ? 'OS Finalizada' : 'Concluir OS';

        return `
            <div class="col-12">
                <div class="card border-start border-4 ${this.concluida ? 'border-success' : 'border-danger'} shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-start gap-3">
                        <div>
                            <h5 class="card-title mb-2">${this.cliente}</h5>
                            <p class="card-text mb-1"><strong>Equipamento:</strong> ${this.equipamento}</p>
                            <p class="card-text mb-1"><strong>Descrição:</strong> ${this.descricao}</p>
                            <p class="card-text mb-2"><strong>Valor estimado:</strong> R$ ${this.valorEstimado.toFixed(2)}</p>
                            <span class="badge ${badgeCor}">${statusTexto}</span>
                        </div>
                        <div>
                            <button
                                class="btn btn-outline-dark btn-sm min-44"
                                onclick="gerenciador.concluirOS(${this.id})"
                                ${this.concluida ? 'disabled' : ''}
                            >
                                ${botaoTexto}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

class GerenciadorOS {
    constructor() {
        this.ordens = [];
        this.formularioDOM = document.getElementById('form-os');
        this.containerDOM = document.getElementById('container-os');
        this.contadorDOM = document.getElementById('contador-os');
    }

    iniciar() {
        this.carregarStorage();
        this.configurarEventos();
        this.atualizarTela();
    }

    configurarEventos() {
        if (!this.formularioDOM) return;

        this.formularioDOM.addEventListener('submit', (event) => {
            event.preventDefault();
            this.adicionarOrdem();
        });
    }

    adicionarOrdem() {
        const cliente = document.getElementById('cliente')?.value.trim();
        const equipamento = document.getElementById('equipamento')?.value.trim();
        const descricao = document.getElementById('descricao')?.value.trim();
        const valorEstimado = document.getElementById('valor-estimado')?.value.trim();

        if (!cliente || !equipamento || !descricao || !valorEstimado) return;

        const novaOrdem = new OrdemServico(
            Date.now() + Math.random(),
            cliente,
            equipamento,
            descricao,
            valorEstimado,
            false
        );

        this.ordens.push(novaOrdem);
        this.salvarStorage();
        this.atualizarTela();
        this.formularioDOM.reset();
    }

    concluirOS(id) {
        const ordemEncontrada = this.ordens.find((ordem) => Number(ordem.id) === Number(id));

        if (!ordemEncontrada) return;

        ordemEncontrada.concluirOS();
        this.salvarStorage();
        this.atualizarTela();
    }

    atualizarTela() {
        if (!this.containerDOM) return;

        this.containerDOM.innerHTML = '';

        if (this.ordens.length === 0) {
            this.containerDOM.innerHTML = `
                <div class="alert alert-info text-center w-100">Nenhuma ordem de serviço cadastrada.</div>
            `;
        } else {
            this.ordens.forEach((ordem) => {
                this.containerDOM.insertAdjacentHTML('beforeend', ordem.gerarTemplate());
            });
        }

        if (this.contadorDOM) {
            this.contadorDOM.textContent = `${this.ordens.length} OS`;
        }
    }

    salvarStorage() {
        localStorage.setItem('techfix_ordens', JSON.stringify(this.ordens));
    }

    carregarStorage() {
        const dados = localStorage.getItem('techfix_ordens');

        if (!dados) return;

        try {
            const dadosBrutos = JSON.parse(dados);
            this.ordens = dadosBrutos.map((item) => new OrdemServico(
                item.id,
                item.cliente,
                item.equipamento,
                item.descricao,
                item.valorEstimado,
                item.concluida
            ));
        } catch (erro) {
            console.warn('Dados inválidos no localStorage:', erro);
            localStorage.removeItem('techfix_ordens');
        }
    }
}

const gerenciador = new GerenciadorOS();
window.gerenciador = gerenciador;

document.addEventListener('DOMContentLoaded', () => {
    gerenciador.iniciar();
});