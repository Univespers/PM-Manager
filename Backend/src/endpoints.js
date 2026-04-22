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
        this.app.post("/api/user", this.addUser.bind(this));
        this.app.post("/api/user/login", this.loginUser.bind(this));
        this.app.post("/api/user/logout", this.logoutUser.bind(this));
        this.app.get("/api/user", this.listUsers.bind(this));
        this.app.patch("/api/user", this.editUser.bind(this));
        this.app.delete("/api/user", this.deleteUser.bind(this));
        // Folga
        this.app.post("/api/folga", this.addFolga.bind(this));
        this.app.get("/api/folga", this.listFolgas.bind(this));
        this.app.get("/api/folga/vagas", this.listFolgaVagas.bind(this));
        this.app.patch("/api/folga", this.editFolga.bind(this));
        this.app.delete("/api/folga", this.deleteFolga.bind(this));
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
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
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
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
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
    async addUser(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const cpf = requisito.body.cpf;
            const senha = requisito.body.senha;
            // Database call
            const data = await this.database.registerUser(cpf, senha, loginUUID);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("AddUser: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`AddUser: ${response}`);
                switch(response) {
                    case "not_found":
                        resposta.status(500).json({ error: "NOT_FOUND" });
                        break;
                    case "already_exists":
                        resposta.status(500).json({ error: "ALREADY_EXISTS" });
                        break;
                    default:
                        resposta.status(500).json({ error: "ERROR" });
                        break;
                }
            }
        } catch(error) {
            console.error("AddUser: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async loginUser(requisito, resposta) {
        try {
            // Body
            const cpf = requisito.body.cpf;
            const senha = requisito.body.senha;
            // Database call
            const data = await this.database.registerUserLogin(cpf, senha);
            const uuid = data.uuid;
            const response = data.response;
            // Resposta
            if(uuid && !response) {
                console.log("LoginUser: OK");
                resposta.json({
                    uuid: uuid
                });
            } else {
                console.error(`LoginUser: ${response}`);
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
            console.error("LoginUser: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async logoutUser(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Database call
            const data = await this.database.registerUserLogout(loginUUID);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("LogoutUser: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`LogoutUser: ${response}`);
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
            console.error("LogoutUser: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async listUsers(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Database call
            const data = await this.database.listUsers(loginUUID);
            const list = data;
            const response = data.response;
            // Resposta
            if(list && !response) {
                console.log("ListUsers: OK");
                resposta.json({
                    list: list
                });
            } else {
                console.error(`ListUsers: ${response}`);
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
            console.error("ListUsers: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async editUser(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const cpf = requisito.body.cpf;
            const dadosJSON = requisito.body.dadosJSON;
            // Database call
            const data = await this.database.updateUser(cpf, dadosJSON, loginUUID);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("EditUser: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`EditUser: ${response}`);
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
            console.error("EditUser: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async deleteUser(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const cpf = requisito.body.cpf;
            // Database call
            const data = await this.database.deleteUser(cpf, loginUUID);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("DeleteUser: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`DeleteUser: ${response}`);
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
            console.error("DeleteUser: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }

    //Folga
    async addFolga(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const cpf = requisito.body.cpf;
            // Database call
            const data = await this.database.registerFolga(cpf, loginUUID);
            const uuid = data.uuid;
            const response = data.response;
            // Resposta
            if(uuid && !response) {
                console.log("AddFolga: OK");
                resposta.json({
                    uuid: uuid
                });
            } else {
                console.error(`AddFolga: ${response}`);
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
            console.error("AddFolga: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async listFolgas(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const mes = requisito.body.mes;
            const uuid = requisito.body.uuid;
            // Database call
            let data = null;
            if(uuid) {
                data = await this.database.getFolga(uuid, loginUUID);
            } else if(mes) {
                data = await this.database.listFolgas(mes, loginUUID);
            }
            const folga = data;
            const list = data;
            const response = data.response;
            // Resposta
            if(folga && !Array.isArray(folga) && !response) {
                console.log("ListFolgas: OK");
                resposta.json(folga);
            } else if(Array.isArray(list) && !response) {
                console.log("ListFolgas: OK");
                resposta.json({
                    list: list
                });
            } else {
                console.error(`ListFolgas: ${response}`);
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
            console.error("ListFolgas: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async listFolgaVagas(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const uuid = requisito.body.uuid;
            const mes = requisito.body.mes;
            // Database call
            const list = this.utilities.getFolgaVagas(uuid, mes, loginUUID);
            const response = list.response;
            // Resposta
            if(list && !response) {
                console.log("ListFolgaVagas: OK");
                resposta.json({
                    list: list
                });
            } else {
                console.error(`ListFolgaVagas: ${response}`);
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
            console.error("ListFolgaVagas: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async editFolga(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const uuid = requisito.body.uuid;
            const dia = requisito.body.dia;
            const dadosJSON = requisito.body.dadosJSON;
            // Database call
            let data = null;
            if(dadosJSON) {
                data = await this.database.updateFolga(uuid, dadosJSON, loginUUID);
            } else if(dia) {
                data = await this.database.updateFolgaData(uuid, dia, loginUUID);
            }
            console.log(data);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("EditFolga: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`EditFolga: ${response}`);
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
            console.error("EditFolga: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
    async deleteFolga(requisito, resposta) {
        try {
            // Header
            const loginUUID = requisito.get(HEADER_TOKEN);
            if(!loginUUID){
                resposta.status(401).json({ error: "NOT_AUTHORIZED" });
                return;
            }
            // Body
            const uuid = requisito.body.uuid;
            // Database call
            const data = await this.database.deleteFolga(uuid, loginUUID);
            const response = data.response;
            // Resposta
            if(response === "ok") {
                console.log("DeleteFolga: OK");
                resposta.json({
                    response: "OK"
                });
            } else {
                console.error(`DeleteFolga: ${response}`);
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
            console.error("DeleteFolga: ERROR");
            console.error(error.message);
            resposta.status(500).json({ error: "ERROR", details: error.message });
        }
    }
}
