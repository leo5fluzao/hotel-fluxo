class Funcionario {

    // Gera IDs únicos para os funcionários.
    static proximoId = 1;

    constructor(usuario, cpf, email, senha) {

        // Gera automaticamente o ID
        this.id = Funcionario.proximoId++;

        this.usuario = usuario;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }

    // Mostra os dados do funcionário logado
    verDados() {

        console.log("\n===== MEUS DADOS =====");

        console.log(`ID: ${this.id}`);
        console.log(`Usuário: ${this.usuario}`);
        console.log(`CPF: ${this.cpf}`);
        console.log(`Email: ${this.email}`);
    }
}

module.exports = Funcionario;