import express from "express";
import cors from "cors";

import { CurrentStatus } from './status.js';

const PORT = 3000;
const HEADER_TOKEN = "X-Authentication-Token";

export class Endpoints {
    app = express(); // Express
    utilities = null; // Logic functions
    database = null; // Database functions
    instance = null;

    constructor(utilities, database) {
        this.app.use(cors()); // Allow different domains
        this.app.use(express.json()); // Allow JSON parsing

        // Load helpers
        this.utilities = utilities;
        this.database = database;
    }

    // Server
    getServer() {
        return this.app;
    }
    loadServer() {
        // Load endpoints
        this.loadPaths();
    }
    startServer() {
        this.loadServer();
        // Start server
        this.instance = this.app.listen(PORT, () => {
            console.log(`Escutando na porta ${PORT}`);
        });
    }
    closeServer() {
        this.instance.close();
        this.database.unconnectBD();
    }

    // Paths
    loadPaths() {
        // Info
        this.app.get("/api", this.getInfo.bind(this));
        this.app.get("/api/info", this.getInfo.bind(this));
        // Admin
        this.app.post("/api/admin", this.addAdmin.bind(this));
        this.app.post("/api/admin/login", this.loginAdmin.bind(this));
        this.app.post("/api/admin/logout", this.logoutAdmin.bind(this));
        this.app.delete("/api/admin", this.deleteAdmin.bind(this));
        // User
        // Folga
        // Nota: O uso do ".bind(this)" permite que "this" se refira a esta classe, dentro das funções
    }

    // Info
    async getInfo(requisito, resposta) {
        try {
            // Resposta
            console.log("Info: OK");
            resposta.json({
                version: `${CurrentStatus.CURRENT_VERSION}`,
                name: `${CurrentStatus.PROJECT_NAME}`,
                group: `${CurrentStatus.GROUP_NAME}`
            });
        } catch(error) {
            console.error("Info: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: { message: "ERROR", details: error.message } });
        }
    }

    // Admin
    async addAdmin(requisito, resposta) {
        try {
            // Body
            const cpf = requisito.body.cpf;
            const senha = requisito.body.senha;
            // Database call
            const data = await this.database.registerAdmin(cpf, senha);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("AddAdmin: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`AddAdmin: ${response}`);
                switch(response) {
                    case "already_exists":
                        resposta.status(500).json({ error: "ALREADY_EXISTS" });
                        break;
                    default:
                        resposta.status(500).json({ error: "ERROR" });
                        break;
                }
            }
        } catch(error) {
            console.error("AddAdmin: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async loginAdmin(requisito, resposta) {
        try {
            // Body
            const cpf = requisito.body.cpf;
            const senha = requisito.body.senha;
            // Database call
            const data = await this.database.registerAdminLogin(cpf, senha);
            const uuid = data.uuid;
            const response = data.response;
            // Resposta
            if(uuid && !response) {
                console.log("LoginAdmin: OK");
                resposta.json({
                    uuid: uuid
                });
            } else {
                console.error(`LoginAdmin: ${response}`);
                switch(response) {
                    case "not_found":
                        resposta.status(500).json({ error: "NOT_FOUND" });
                        break;
                    default:
                        resposta.status(500).json({ error: "ERROR" });
                        break;
                }
            }
        } catch(error) {
            console.error("LoginAdmin: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async logoutAdmin(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            // Database call
            const data = await this.database.registerAdminLogout(loginUUID);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("LogoutAdmin: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`LogoutAdmin: ${response}`);
                switch(response) {
                    case "not_found":
                        resposta.status(500).json({ error: "NOT_FOUND" });
                        break;
                    default:
                        resposta.status(500).json({ error: "ERROR" });
                        break;
                }
            }
        } catch(error) {
            console.error("LogoutAdmin: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async deleteAdmin(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            // Database call
            const data = await this.database.deleteAdmin(loginUUID);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("DeleteAdmin: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`DeleteAdmin: ${response}`);
                switch(response) {
                    case "not_found":
                        resposta.status(500).json({ error: "NOT_FOUND" });
                        break;
                    default:
                        resposta.status(500).json({ error: "ERROR" });
                        break;
                }
            }
        } catch(error) {
            console.error("DeleteAdmin: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }

    // User
    

    //Folga
}
