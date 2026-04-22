import mysql from "mysql2/promise";

// Banco de dados
const dbConnection = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "pm_manager"
};

export class Database {
    bdConnection = null;

    constructor() {}

    async connectBD() {
        try {
            this.bdConnection = await mysql.createConnection(dbConnection);
        } catch (error) {
            console.error("Erro de conexão com database: ", error);
        }
        return null;
    }
    async unconnectBD() {
        if(this.bdConnection) await this.bdConnection.end();
    }
    async callProcedure(procedureCall) {
        try {
            console.log(`DatabaseCall: "CALL ${procedureCall}"`);
            const [query] = await this.bdConnection.execute(`CALL ${procedureCall}`);
            return query[0];
        } catch(error) {
            console.error("DatabaseCall: ERROR");
            console.error(error);
        }
    }

    // Calls
    async registerAdmin(cpf, senha) {
        const call = `CREATE_ADMIN("${cpf}", "${senha}")`;
        try {
            console.log(`RegisterAdmin: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`RegisterAdmin: ${error.message}`);
        }
    }
    async registerAdminLogin(cpf, senha) {
        const call = `LOGIN_ADMIN("${cpf}", "${senha}")`;
        try {
            console.log(`RegisterAdminLogin: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`RegisterAdminLogin: ${error.message}`);
        }
    }
    async registerAdminLogout(loginUUID) {
        const call = `LOGOUT_ADMIN("${loginUUID}")`;
        try {
            console.log(`RegisterAdminLogout: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`RegisterAdminLogout: ${error.message}`);
        }
    }
    async deleteAdmin(loginUUID) {
        const call = `DELETE_ADMIN("${loginUUID}")`;
        try {
            console.log(`DeleteAdmin: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`DeleteAdmin: ${error.message}`);
        }
    }
    async registerUser(cpf, senha, loginUUID) {
        const call = `CREATE_USER("${cpf}", "${senha}", "${loginUUID}")`;
        try {
            console.log(`RegisterUser: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`RegisterUser: ${error.message}`);
        }
    }
    async updateUser(cpf, dadosJSON, loginUUID) {
        const call = `UPDATE_USER("${cpf}", "${dadosJSON}", "${loginUUID}")`;
        try {
            console.log(`UpdateUser: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`UpdateUser: ${error.message}`);
        }
    }
    async registerUserLogin(cpf, senha) {
        const call = `LOGIN_USER("${cpf}", "${senha}")`;
        try {
            console.log(`RegisterUserLogin: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`RegisterUserLogin: ${error.message}`);
        }
    }
    async registerUserLogout(loginUUID) {
        const call = `LOGOUT_USER("${loginUUID}")`;
        try {
            console.log(`RegisterUserLogout: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`RegisterUserLogout: ${error.message}`);
        }
    }
    async listUsers(loginUUID) {
        const call = `LIST_USERS("${loginUUID}")`;
        try {
            console.log(`ListUsers: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data; // Lista de respostas
        } catch(error) {
            console.error(`ListUsers: ${error.message}`);
        }
    }
    async deleteUser(cpf, loginUUID) {
        const call = `DELETE_USER("${cpf}", "${loginUUID}")`;
        try {
            console.log(`DeleteUser: "CALL ${call}"`);
            const data = await this.callProcedure(call);
            return data[0]; // Resposta única
        } catch(error) {
            console.error(`DeleteUser: ${error.message}`);
        }
    }
}
