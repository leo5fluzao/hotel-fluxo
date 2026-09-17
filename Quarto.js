class Quarto {

    // Gera IDs únicos para os quartos
    static proximoId = 1;

    constructor(nome, descricao, camas, preco) {

        // Gera automaticamente o ID do quarto
        this.id = Quarto.proximoId++;

        this.nome = nome;
        this.descricao = descricao;
        this.camas = camas;
        this.preco = preco;

        // Todo quarto começa disponível
        this.disponivel = true;
    }

    mostrarDados() {

        console.log(`\nID: ${this.id}`);
        console.log(`Nome: ${this.nome}`);
        console.log(`Descrição: ${this.descricao}`);
        console.log(`Camas: ${this.camas}`);

        console.log(`Preço por noite: R$ ${this.preco.toFixed(2)}`);

        // se disponivel for true -> "Sim"
        // se disponivel for false -> "Não"
        console.log(
            `Disponível: ${this.disponivel ? "Sim" : "Não"}`
        );
    }
}

module.exports = Quarto;