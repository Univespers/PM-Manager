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

    constructor() {
        // Run
        this.connectBD();
    }

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
            console.log(`Call: "CALL ${procedureCall}"`);
            const [query] = await this.bdConnection.execute(`CALL ${procedureCall}`);
            return query[0];
        } catch(error) {
            console.error("Call: ERROR");
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
}
