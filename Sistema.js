const Quarto = require("./Quarto");

class Sistema {
    constructor() {

        // armazena todos os clientes
        this.clientes = [];

        // armazena todos os funcionários
        this.funcionarios = [];

        // armazena todos os quartos
        this.quartos = [];

        // armazena todas as reservas
        this.reservas = [];

        // Guarda quem está atualmente logado.
        // null significa que ninguém está logado.
        this.usuarioLogado = null;


        // Guarda o tipo do usuário logado.
        // Pode ser:
        // "cliente"
        // "funcionario"
        // Quando ninguém está logado: null
        this.tipoUsuario = null;

        let quarto1 = new Quarto(
            "Vista SensaCCEonal",
            "Quarto confortável com uma vista especial.",
            2,
            400
        );

        // adiciona o quarto ao sistema.
        this.adicionarQuarto(quarto1);

        let quarto2 = new Quarto(
            "Descanso de Rei",
            "Quarto espaçoso e confortável para uma estadia tranquila.",
            2,
            500
        );

        // adiciona o segundo quarto ao sistema
        this.adicionarQuarto(quarto2);
    }

    cadastrarCliente(cliente) {

        // verifica se já existe alguém utilizando esse email
        let emailExiste = this.clientes.some(
            c => c.email === cliente.email
        );

        // se o email já existir, não permite o cadastro
        if (emailExiste) {
            return false;
        }

        // adiciona o cliente ao array
        this.clientes.push(cliente);

        // Informa que o cadastro deu certo
        return true;
    }

    cadastrarFuncionario(funcionario) {

        let emailExiste = this.funcionarios.some(
            f => f.email === funcionario.email
        );

        if (emailExiste) {
            return false;
        }

        this.funcionarios.push(funcionario);

        return true;
    }

    adicionarQuarto(quarto) {

        // coloca o quarto dentro do array de quartos
        this.quartos.push(quarto);
    }

    // LOGIN
    fazerLogin(email, senha) {

        // find() retorna o primeiro cliente que tiver email e senha iguais aos informados.
        let cliente = this.clientes.find(
            c => c.email === email && c.senha === senha
        );

        // se encontra um cliente
        if (cliente) {

            // guarda o cliente como usuário logado
            this.usuarioLogado = cliente;

            // guarda o tipo do usuário
            this.tipoUsuario = "cliente";

            return true;
        }


        // se não encontrar cliente, procura entre os funcionários
        let funcionario = this.funcionarios.find(
            f => f.email === email && f.senha === senha
        );

        // se encontra um funcionário
        if (funcionario) {

            this.usuarioLogado = funcionario;
            this.tipoUsuario = "funcionario";

            return true;
        }

        // Se chegou aqui, email ou senha estão errados.
        return false;
    }

    logout() {

        // retira o usuário da sessão
        this.usuarioLogado = null;

        // retira também o tipo de usuário
        this.tipoUsuario = null;
    }

    listarQuartos() {

        // se não houver quartos
        if (this.quartos.length === 0) {

            console.log("\nNenhum quarto cadastrado.");

            return;
        }


        console.log("\n===== QUARTOS =====");


        // percorre todos os quartos
        this.quartos.forEach(quarto => {

            // cada objeto Quarto possui seu próprio método mostrarDados
            quarto.mostrarDados();

            console.log("------------------------");
        });
    }

    listarClientes() {

        if (this.clientes.length === 0) {

            console.log("\nNenhum cliente cadastrado.");

            return;
        }


        console.log("\n===== CLIENTES =====");


        // percorre todos os clientes
        this.clientes.forEach(cliente => {

            cliente.verDados();

            console.log("------------------------");
        });
    }

    listarReservas() {

        if (this.reservas.length === 0) {

            console.log("\nNenhuma reserva cadastrada.");

            return;
        }


        console.log("\n===== RESERVAS =====");


        // percorre todas as reservas
        this.reservas.forEach(reserva => {

            reserva.mostrarDados();

            console.log("------------------------");
        });
    }

    fazerReserva(reserva) {

        // procura o quarto que possui o ID informado na reserva
        let quarto = this.quartos.find(
            q => q.id === reserva.quartoId
        );

        // se o quarto não existir
        if (!quarto) {

            return {
                sucesso: false,
                mensagem: "Quarto não encontrado."
            };
        }


        // verifica se o quarto está disponível para as datas escolhidas.
        if (
            !this.quartoDisponivel(
                reserva.quartoId,
                reserva.entrada,
                reserva.saida
            )
        ) {

            return {
                sucesso: false,
                mensagem:
                    "Quarto não está disponível para essas datas."
            };
        }

        // adiciona a reserva ao sistema
        this.reservas.push(reserva);

        // como o quarto foi reservado, marca inicialmente como indisponível
        quarto.disponivel = false;

        return {
            sucesso: true,
            mensagem: "Reserva realizada com sucesso."
        };
    }

    // VERIFICAR DISPONIBILIDADE
    quartoDisponivel(quartoId, entrada, saida) {

        // transforma as datas recebidas em objetos Date
        let novaEntrada = new Date(entrada);
        let novaSaida = new Date(saida);


        // pega somente as reservas daquele quarto
        // reservas canceladas não são consideradas
        let reservasQuarto = this.reservas.filter(
            reserva =>
                reserva.quartoId === quartoId &&
                reserva.status !== "cancelada"
        );


        // verifica cada reserva existente
        for (let reserva of reservasQuarto) {

            let entradaExistente =
                new Date(reserva.entrada);

            let saidaExistente =
                new Date(reserva.saida);


            // verificamos se as datas se sobrepõem
            // se houver sobreposição, o quarto não está disponível
            let existeConflito =
                novaEntrada < saidaExistente &&
                novaSaida > entradaExistente;

            if (existeConflito) {
                return false;
            }
        }

        // Se nenhuma reserva entrou em conflito, o quarto está disponível.
        return true;
    }

    cancelarReserva(idReserva) {

        // procura a reserva pelo ID
        // também verifica se ela pertence ao cliente que está logado.
        let reserva = this.reservas.find(
            r =>
                r.id === idReserva &&
                r.clienteId === this.usuarioLogado.id
        );


        // se não encontra
        if (!reserva) {

            return {
                sucesso: false,
                mensagem: "Reserva não encontrada."
            };
        }

        // se já estiver cancelada
        if (reserva.status === "cancelada") {

            return {
                sucesso: false,
                mensagem: "Essa reserva já foi cancelada."
            };
        }

        // Altera o status
        reserva.mudarStatus("cancelada");


        // Verifica se existe outra reserva ativa para o mesmo quarto
        let existeOutraReserva = this.reservas.some(
            r =>
                r.quartoId === reserva.quartoId &&
                r.id !== reserva.id &&
                r.status !== "cancelada"
        );


        // Se não existir outra reserva
        if (!existeOutraReserva) {

            // Procura o quarto.
            let quarto = this.quartos.find(
                q => q.id === reserva.quartoId
            );

            // Se encontra o quarto, torna ele disponível novamente.
            if (quarto) {
                quarto.disponivel = true;
            }
        }

        return {
            sucesso: true,
            mensagem: "Reserva cancelada."
        };
    }

    minhasReservas() {

        // Retorna somente as reservas pertencentes ao cliente logado.
        return this.reservas.filter(
            reserva =>
                reserva.clienteId === this.usuarioLogado.id
        );
    }

    mudarStatusReserva(idReserva, novoStatus) {

        // Procura a reserva pelo ID
        let reserva = this.reservas.find(
            r => r.id === idReserva
        );

        // Se não encontrou
        if (!reserva) {
            return false;
        }

        // Lista dos status permitidos
        let statusValidos = [
            "pendente",
            "adiada",
            "realizada",
            "cancelada"
        ];


        // Verifica se o novo status é válido.
        if (!statusValidos.includes(novoStatus)) {
            return false;
        }

        // Altera o status.
        reserva.mudarStatus(novoStatus);

        return true;
    }
}

module.exports = Sistema;