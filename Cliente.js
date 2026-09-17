class Cliente {
    // a variável será usada para gerar IDs automaticamente.
    static proximoId = 1;

    constructor(nome, dataNascimento, cpf, email, senha) {

        this.id = Cliente.proximoId++;

        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }

    verDados() {

        console.log("\n===== MEUS DADOS =====");

        console.log(`ID: ${this.id}`);
        console.log(`Nome: ${this.nome}`);
        console.log(`Data de nascimento: ${this.dataNascimento}`);
        console.log(`CPF: ${this.cpf}`);
        console.log(`Email: ${this.email}`);
    }
}

module.exports = Cliente;