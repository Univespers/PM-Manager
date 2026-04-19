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
            console.log(`CALL: "CALL ${procedureCall}"`);
            const [query] = await this.bdConnection.execute(`CALL ${procedureCall}`);
            return query[0];
        } catch(error) {
            console.error("CALL: ERROR");
            console.error(error);
        }
    }
}
