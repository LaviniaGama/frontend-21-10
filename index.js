class Veiculo {
    constructor(id, placa, modelo, categoria, emServico = true) {
        this.id = id ?? Date.now() + Math.random();
        this.placa = placa.toUpperCase();
        this.modelo = modelo;
        this.categoria = categoria;
        this.emServico = emServico;
    }

    alternarStatus() {
        this.emServico = !this.emServico;
    }

    renderizarHTML() {
        const badgeCor = this.emServico ? 'bg-success' : 'bg-danger';
        const statusTexto = this.emServico ? 'Em Operação' : 'Em Manutenção';
        const btnTexto = this.emServico ? 'Enviar p/ Manutenção' : 'Reativar Veículo';

        return `
            <div class="col-12">
                <div class="card border-start border-4 ${this.emServico ? 'border-success' : 'border-danger'} shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center gap-3">
                        <div>
                            <h5 class="card-title mb-1">${this.modelo} <small class="text-muted">(${this.placa})</small></h5>
                            <p class="card-text mb-0 small text-secondary">Categoria: ${this.categoria}</p>
                            <span class="badge ${badgeCor} mt-2">${statusTexto}</span>
                        </div>
                        <div>
                            <button onclick="gerenciador.mudarStatusVeiculo(${this.id})" class="btn btn-outline-dark btn-sm min-w-44">
                                ${btnTexto}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

class GerenciadorFrota {
    constructor() {
        this.frota = [];
        this.conteinerDOM = document.getElementById('container-veiculos');
        this.contadorDOM = document.getElementById('contato-frota');
        this.formularioDOM = document.getElementById('form-veiculos');
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
            this.adicionarVeiculo();
        });
    }

    adicionarVeiculo() {
        const placa = document.getElementById('placa')?.value.trim();
        const modelo = document.getElementById('modelo')?.value.trim();
        const categoria = document.getElementById('categoria')?.value;

        if (!placa || !modelo || !categoria) return;

        const novoVeiculo = new Veiculo(
            Date.now() + Math.random(),
            placa,
            modelo,
            categoria,
            true
        );

        this.frota.push(novoVeiculo);
        this.salvarStorage();
        this.atualizarTela();
        this.formularioDOM.reset();
    }

    mudarStatusVeiculo(id) {
        const veiculoEncontrado = this.frota.find((veiculo) => Number(veiculo.id) === Number(id));

        if (!veiculoEncontrado) return;

        veiculoEncontrado.alternarStatus();
        this.salvarStorage();
        this.atualizarTela();
    }

    atualizarTela() {
        if (!this.conteinerDOM) return;

        this.conteinerDOM.innerHTML = '';

        if (this.frota.length === 0) {
            this.conteinerDOM.innerHTML = `
                <div class="alert alert-info text-center w-100">Nenhum veículo cadastrado.</div>
            `;
        } else {
            this.frota.forEach((veiculo) => {
                this.conteinerDOM.insertAdjacentHTML('beforeend', veiculo.renderizarHTML());
            });
        }

        if (this.contadorDOM) {
            this.contadorDOM.textContent = `${this.frota.length} veículos`;
        }
    }

    salvarStorage() {
        localStorage.setItem('TachFleet', JSON.stringify(this.frota));
    }

    carregarStorage() {
        const dados = localStorage.getItem('TachFleet');

        if (!dados) return;

        try {
            const objetosPuros = JSON.parse(dados);
            this.frota = objetosPuros.map((item) => new Veiculo(
                item.id,
                item.placa,
                item.modelo,
                item.categoria,
                item.emServico
            ));
        } catch (erro) {
            console.warn('Dados inválidos no localStorage:', erro);
            localStorage.removeItem('TachFleet');
        }
    }
}

const gerenciador = new GerenciadorFrota();
window.gerenciador = gerenciador;

document.addEventListener('DOMContentLoaded', () => {
    gerenciador.iniciar();
});