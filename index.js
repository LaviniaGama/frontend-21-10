//criar classe modelo
class Veiculo{
    constructor(id, placa, modelo, categoria, emServico){
        this.placa=placa.toUpperCase();
        this.modelo=modelo;
        this.categoria=categoria;
        this.emServico=emServico;
         this.id= Date.now() + math.random();
    }

    //Função interna: Retornar o UI em HTML do objeto
    renderizarHTML(){
        const badgeCor = this.emServico ? 'bg-success' : 'bg-danger';
        const statusTexto = this.emServico ? 'Em Operação' : 'Em Manutenção';
        const btnTexto = this.emServico ? 'Enviar p/ Manutenção' : 'Reativar Veículo';
        return `
            <div classe="col-12">
                <div class="card border-start border-4 ${this.emServico ? 'border-success':'border-danger'} shadow-sm">
                    <div>
                        <h5 class="card-title mb-1">${this.modelo} <small class="text-muted">(${this.placa})</small></h5>
                        <p class="card-text mb-0 small text-secondary">Categoria:${this.categoria}</p>
                        <span class="badge ${badgeCor} mt-1">${statusTexto}</span>
                    </div>
                    <div>
                        <button onclick="gerenciador.mudarStatusVeiculo(${this.id})" class="btn btn-outline-dark btn-sm min-w-44">
                            ${btnTexto}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

//2 classe: Classe gerenciadora: aplica regras de negocio, manipula o DOM
class gerenciadorFrota{
    constructor(){
        this.frota=[];
        this.conteinerDOM=document.getElementById('conteiner-veiculos');
        this.contadorDOM=document.getElementById('contador-veiculos');
        this.formularioDOM=document.getElementById('formulario-veiculo');
    }

    //função inicilizar e recuperar localStorage
    iniciar() {
        this.carregarStorage();
        this.configurarStory();
        this.atualizarTeLa();
    }

    //função configure eventos
    configurarEventos() {
        this.formularioDOM.addEventListener('submit', (event) => {
            event.preventDefault();
            this.adicionarVeiculo();
        });
    }

    cadastrarVeiculo() {
        const placa = document.getElementById('placa').value;
        const modelo = document.getElementById('modelo').value;
        const categoria = document.getElementById('categoria').value;

        this.frota.push(novoVeiculo);
        this.salvarStorage();
        this.atualizarTela();
    }

    mudarStatusVeiculo(id) {
        const veiculoEcontrado = this.frota.find((veiculo) => veiculo.id === id);
        if (veiculoEcontrado) {
            veiculoEcontrado.alternarStatus();
            this.statusStorage();
            this.atualizarTela();   
        }
    }

    atualizatTela() {
        this.containerDOM.innerHTML = '';

        if(this.frota.length === 0){
            this.containerDOM.innerHTML = `
            <div class="alert alert-info text-center"">Nenhum veículo cadastrado</div>
        `;
        }else{
            this.frota.forEach((vazio) => {
                this.contadorDOM.innerHTML += vazio.renderizarHTML();
            });
            this.contadorDOM.innerHTML = `${this.frota.length}: Veículos`;
        }
    } // <- Chave adicionada para fechar o método atualizatTela

    salvarStorage() {
        localStorage.setItem('TachFleet', JSON.stringify(this.frota));
    }

    carregarStorage() {
        const dados = localStorage.getItem('tachfleet_dados');
        if (dados) {
            const obejtosPuros = JSON.parse(dados);
            this.frota= objetosPuros.map(item=>new Veiculo(item.id, item.placa, item.modelo, item.categoria, item.emServico));
        }
    }
}