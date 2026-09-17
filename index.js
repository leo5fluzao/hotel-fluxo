// Importa o readline.
// Ele permite que o programa receba informações digitadas pelo usuário no terminal
const readline = require("readline");

// Importa as classes.
const Cliente = require("./Cliente");
const Funcionario = require("./Funcionario");
const Quarto = require("./Quarto");
const Reserva = require("./Reserva");
const Sistema = require("./Sistema");

// Cria a interface que conecta o programa ao teclado e ao terminal.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Criamos apenas UM objeto Sistema.
// Ele será responsável por guardar todos os dados enquanto o programa estiver executando.
const sistema = new Sistema();

// readline normalmente funciona usando callbacks.
// Criei essa função para poder utilizar "await" e deixar o código mais organizado.

function perguntar(pergunta) {

    return new Promise(resolve => {

        rl.question(pergunta, resposta => {
            // trim() remove espaços desnecessários no começo e no final da resposta.
            resolve(resposta.trim());
        });
    });
}

// ========================================
// CADASTRO
// ========================================

async function cadastro() {

    console.log("\n===== CADASTRO =====");

    console.log("1 - Cliente");
    console.log("2 - Funcionário");

    // Perguntamos qual tipo de usuário será cadastrado.
    let tipo = await perguntar("Escolha: ");

    // ========================================
    // CADASTRO DE CLIENTE
    // ========================================

    if (tipo === "1") {

        let nome =
            await perguntar("Nome: ");

        let dataNascimento =
            await perguntar("Data de nascimento: ");

        let cpf =
            await perguntar("CPF: ");

        let email =
            await perguntar("Email: ");

        let senha =
            await perguntar("Senha: ");

        // Criamos um objeto Cliente.
        let cliente = new Cliente(
            nome,
            dataNascimento,
            cpf,
            email,
            senha
        );

        // Tentamos cadastrar o cliente no sistema.
        if (sistema.cadastrarCliente(cliente)) {

            console.log(
                "\nCliente cadastrado com sucesso!"
            );

            console.log(
                `Seu ID é: ${cliente.id}`
            );

        } else {

            console.log(
                "\nEsse email já está cadastrado."
            );
        }

    // ========================================
    // CADASTRO DE FUNCIONÁRIO
    // ========================================

    } else if (tipo === "2") {

        let usuario =
            await perguntar("Nome de usuário: ");

        let cpf =
            await perguntar("CPF: ");

        let email =
            await perguntar("Email: ");

        let senha =
            await perguntar("Senha: ");

        // Criamos o funcionário.
        let funcionario = new Funcionario(
            usuario,
            cpf,
            email,
            senha
        );

        // Tentamos cadastrá-lo.
        if (sistema.cadastrarFuncionario(funcionario)) {

            console.log(
                "\nFuncionário cadastrado com sucesso!"
            );

            console.log(
                `Seu ID é: ${funcionario.id}`
            );

        } else {

            console.log(
                "\nEsse email já está cadastrado."
            );
        }


    } else {

        console.log("\nOpção inválida.");
    }
}

// ========================================
// LOGIN
// ========================================

async function login() {

    console.log("\n===== LOGIN =====");

    // Pedimos email e senha.
    let email =
        await perguntar("Email: ");

    let senha =
        await perguntar("Senha: ");


    // Mandamos os dados para o Sistema.
    let sucesso =
        sistema.fazerLogin(email, senha);

    // Se não encontrou ninguém
    if (!sucesso) {

        console.log(
            "\nEmail ou senha incorretos."
        );

        return;
    }

    console.log(
        "\nLogin realizado com sucesso!"
    );

    // Verificamos o tipo do usuário.
    // Cliente vai para o menu de cliente.
    // Funcionário vai para o menu de funcionário.
    if (sistema.tipoUsuario === "cliente") {

        await menuCliente();

    } else {

        await menuFuncionario();
    }
}

// ========================================
// MENU DO CLIENTE
// ========================================

async function menuCliente() {

    // O menu continua aparecendo enquanto houver um usuário logado.
    while (sistema.usuarioLogado !== null) {

        console.log("\n==========================");
        console.log("      MENU CLIENTE");
        console.log("==========================");

        console.log("1 - Ver meus dados");
        console.log("2 - Ver lista de quartos");
        console.log("3 - Fazer reserva");
        console.log("4 - Cancelar reserva");
        console.log("5 - Ver minhas reservas");
        console.log("6 - Sair da conta");

        let opcao =
            await perguntar("Escolha: ");

        // switch verifica qual opção foi escolhida.
        switch (opcao) {

            case "1":

                // Mostra os dados do cliente logado.
                sistema.usuarioLogado.verDados();

                break;

            case "2":

                // Mostra todos os quartos.
                sistema.listarQuartos();

                break;

            case "3":

                // Abre o processo de reserva.
                await fazerReserva();

                break;

            case "4":

                // Abre o processo de cancelamento.
                await cancelarReserva();

                break;

            case "5":

                // Mostra somente as reservas
                // do cliente logado.
                verMinhasReservas();

                break;

            case "6":

                // Faz logout.
                sistema.logout();

                console.log(
                    "\nLogout realizado."
                );

                break;

            default:

                console.log(
                    "\nOpção inválida."
                );
        }
    }
}

// ========================================
// FAZER RESERVA
// ========================================

async function fazerReserva() {

    // Primeiro mostramos os quartos disponíveis.
    sistema.listarQuartos();

    // Se não houver quartos,
    // encerramos a função.
    if (sistema.quartos.length === 0) {
        return;
    }

    // Perguntamos qual quarto o cliente quer.
    let quartoId = Number(
        await perguntar(
            "\nDigite o ID do quarto: "
        )
    );

    // Procuramos o quarto.
    let quarto = sistema.quartos.find(
        q => q.id === quartoId
    );

    // Se não encontrou
    if (!quarto) {

        console.log(
            "\nQuarto não encontrado."
        );

        return;
    }

    // Pedimos as datas.
    let entrada = await perguntar(
        "Data de entrada (MM-DD-AAAA): "
    );

    let saida = await perguntar(
        "Data de saída (MM-DD-AAAA): "
    );

    // Transformamos as strings em datas.
    let dataEntrada = new Date(entrada);
    let dataSaida = new Date(saida);

    // Verificamos se as datas são válidas.
    if (
        isNaN(dataEntrada.getTime()) ||
        isNaN(dataSaida.getTime())
    ) {

        console.log(
            "\nData inválida."
        );

        return;
    }

    // A saída precisa ser depois da entrada.
    if (dataSaida <= dataEntrada) {

        console.log(
            "\nA data de saída deve ser depois da entrada."
        );

        return;
    }

    // Criamos a reserva.
    // O clienteId vem do usuário atualmente logado.
    let reserva = new Reserva(
        sistema.usuarioLogado.id,
        quartoId,
        entrada,
        saida
    );

    // Mandamos a reserva para o Sistema.
    let resultado =
        sistema.fazerReserva(reserva);

    console.log(
        `\n${resultado.mensagem}`
    );

    // Se deu certo, mostramos o ID.
    if (resultado.sucesso) {

        console.log(
            `ID da sua reserva: ${reserva.id}`
        );
    }
}

// ========================================
// VER MINHAS RESERVAS
// ========================================

function verMinhasReservas() {

    // Pegamos as reservas do cliente logado.
    let reservas =
        sistema.minhasReservas();


    console.log(
        "\n===== MINHAS RESERVAS ====="
    );

    // Se não houver nenhuma
    if (reservas.length === 0) {

        console.log(
            "Você não possui reservas."
        );

        return;
    }

    // Mostra cada reserva.
    reservas.forEach(reserva => {

        reserva.mostrarDados();

        console.log(
            "------------------------"
        );
    });
}

// ========================================
// CANCELAR RESERVA
// ========================================

async function cancelarReserva() {

    // Primeiro mostramos as reservas
    // do cliente.
    verMinhasReservas();


    // Pegamos novamente as reservas.
    let reservas =
        sistema.minhasReservas();

    // Se não houver reservas, não há nada para cancelar.
    if (reservas.length === 0) {
        return;
    }

    // Perguntamos qual reserva cancelar.
    let id = Number(
        await perguntar(
            "\nDigite o ID da reserva: "
        )
    );

    // Mandamos o ID para o Sistema.
    let resultado =
        sistema.cancelarReserva(id);


    console.log(
        `\n${resultado.mensagem}`
    );
}

// ========================================
// MENU DO FUNCIONÁRIO
// ========================================

async function menuFuncionario() {

    // Continua enquanto o funcionário estiver logado.
    while (sistema.usuarioLogado !== null) {

        console.log("\n==========================");
        console.log("    MENU FUNCIONÁRIO");
        console.log("==========================");

        console.log("1 - Ver meus dados");
        console.log("2 - Ver lista de reservas");
        console.log("3 - Ver lista de quartos");
        console.log("4 - Ver lista de clientes");
        console.log("5 - Mudar status da reserva");
        console.log("6 - Adicionar quarto");
        console.log("7 - Sair da conta");


        let opcao =
            await perguntar("Escolha: ");


        switch (opcao) {

            case "1":

                sistema.usuarioLogado.verDados();

                break;

            case "2":

                sistema.listarReservas();

                break;

            case "3":

                sistema.listarQuartos();

                break;

            case "4":

                sistema.listarClientes();

                break;

            case "5":

                await mudarStatus();

                break;

            case "6":

                await adicionarQuarto();

                break;

            case "7":

                sistema.logout();

                console.log(
                    "\nLogout realizado."
                );

                break;

            default:

                console.log(
                    "\nOpção inválida."
                );
        }
    }
}

// ========================================
// MUDAR STATUS DA RESERVA
// ========================================

async function mudarStatus() {

    // Mostramos todas as reservas.
    sistema.listarReservas();

    // Se não houver reservas,
    // encerramos.
    if (sistema.reservas.length === 0) {
        return;
    }

    // Perguntamos qual reserva queremos alterar.
    let id = Number(
        await perguntar(
            "\nID da reserva: "
        )
    );

    console.log("\nEscolha o novo status:");

    console.log("1 - pendente");
    console.log("2 - adiada");
    console.log("3 - realizada");
    console.log("4 - cancelada");

    let opcao =
        await perguntar("Escolha: ");

    // Aqui vamos transformar a opção numérica no texto do status.
    let status;


    switch (opcao) {

        case "1":
            status = "pendente";

            break;

        case "2":
            status = "adiada";

            break;

        case "3":
            status = "realizada";

            break;

        case "4":
            status = "cancelada";

            break;

        default:
            console.log(
                "\nOpção inválida."
            );

            return;
    }

    // Mandamos o ID e o novo status para o Sistema.
    let sucesso =
        sistema.mudarStatusReserva(
            id,
            status
        );

    if (sucesso) {

        console.log(
            "\nStatus alterado com sucesso."
        );

    } else {

        console.log(
            "\nNão foi possível alterar o status."
        );
    }
}

// ========================================
// ADICIONAR QUARTO
// ========================================

async function adicionarQuarto() {

    console.log(
        "\n===== NOVO QUARTO ====="
    );

    // Perguntamos as informações.
    let nome =
        await perguntar(
            "Nome do quarto: "
        );

    let descricao =
        await perguntar(
            "Descrição: "
        );

    // Number() transforma o texto digitado
    // em número.
    let camas = Number(
        await perguntar(
            "Quantidade de camas: "
        )
    );

    let preco = Number(
        await perguntar(
            "Preço por noite: "
        )
    );

    // Verificamos se os números são válidos.
    if (
        isNaN(camas) ||
        isNaN(preco) ||
        camas <= 0 ||
        preco < 0
    ) {

        console.log(
            "\nValores inválidos."
        );

        return;
    }

    // Criamos um novo objeto Quarto.
    let quarto = new Quarto(
        nome,
        descricao,
        camas,
        preco
    );

    // Adicionamos o quarto ao Sistema.
    sistema.adicionarQuarto(quarto);

    console.log(
        "\nQuarto adicionado com sucesso!"
    );

    console.log(
        `ID do quarto: ${quarto.id}`
    );
}

// ========================================
// MENU PRINCIPAL
// ========================================

async function menuPrincipal() {

    // O menu fica sendo repetido até o usuário escolher sair.
    while (true) {

        console.log("\n==========================");
        console.log("       HOTEL F-LUXO");
        console.log("==========================");

        console.log("1 - Fazer login");
        console.log("2 - Fazer cadastro");
        console.log("3 - Sair");

        let opcao =
            await perguntar("Escolha: ");

        switch (opcao) {

            case "1":

                // Chama a função de login.
                await login();

                break;

            case "2":

                // Chama a função de cadastro.
                await cadastro();

                break;

            case "3":

                // Fecha a interface do readline.
                console.log(
                    "\nPrograma encerrado."
                );

                rl.close();

                // Encerra a função.
                return;

            default:

                console.log(
                    "\nOpção inválida."
                );
        }
    }
}

// ========================================
// INICIAR O PROGRAMA
// ========================================

// Chamamos o menu principal.
// É aqui que o programa efetivamente começa.
menuPrincipal();