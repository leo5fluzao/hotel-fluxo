class Reserva {

    // Usado para gerar IDs únicos para as reservas
    static proximoId = 1;

    // clienteId -> quem fez a reserva
    // quartoId  -> qual quarto foi reservado
    // entrada   -> data de entrada
    // saida     -> data de saída
    constructor(clienteId, quartoId, entrada, saida) {

        // ID da própria reserva
        // É diferente do clienteId e do quartoId
        this.id = Reserva.proximoId++;
        this.clienteId = clienteId;
        this.quartoId = quartoId;
        // Toda reserva começa como "pendente".
        this.status = "pendente";
        // Datas da reserva.
        this.entrada = entrada;
        this.saida = saida;
    }

    mudarStatus(novoStatus) {

        this.status = novoStatus;
    }

    mostrarDados() {

        console.log(`\nID da reserva: ${this.id}`);
        console.log(`ID do cliente: ${this.clienteId}`);
        console.log(`ID do quarto: ${this.quartoId}`);
        console.log(`Status: ${this.status}`);
        console.log(`Check-in: ${this.entrada}`);
        console.log(`Check-out: ${this.saida}`);
    }
}

module.exports = Reserva;