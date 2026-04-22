import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";

import { Endpoints } from "./endpoints.js";
import { Utilities } from "./utilities.js";
import { Database } from "./database.js";

function startTests() {
    const database = new Database();
    const utilities = new Utilities(database);
    const endpoints = new Endpoints(utilities, database);
    const app = endpoints.getServer();

    // Vars
    let adminLoginUUID = "";
    let userLoginUUID = "";
    let folgaUUID = "";

    // Start server
    beforeAll(async () => {
        database.connectBD();
        endpoints.startServer();
    });

    // Info
    test("GET / = 404", async () => {
        const response = await request(app)
            .get("/");
        expect(response.status).toBe(404);
    });
    test("GET /api = Info", async () => {
        const response = await request(app)
            .get("/api");
        expect(response.status).toBe(200);
    });
    test("GET /api/info = Info", async () => {
        const response = await request(app)
            .get("/api/info");
        expect(response.status).toBe(200);
    });

    // AddAdmin
    test("POST /api/admin = AddAdmin", async () => {
        const response = await request(app)
            .post("/api/admin")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // LoginAdmin
    test("POST /api/admin/login = LoginAdmin", async () => {
        const response = await request(app)
            .post("/api/admin/login")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");
        adminLoginUUID = response.body.uuid;
    });

    // LogoutAdmin
    test("POST /api/admin/logout = LogoutAdmin", async () => {
        const response = await request(app)
            .post("/api/admin/logout")
            .set({
                "X-Authentication-Token": adminLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // DeleteAdmin
    test("POST /api/admin/login = LoginAdmin", async () => {
        const response = await request(app)
            .post("/api/admin/login")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");
        adminLoginUUID = response.body.uuid;
    });
    test("DELETE /api/admin = DeleteAdmin", async () => {
        const response = await request(app)
            .delete("/api/admin")
            .set({
                "X-Authentication-Token": adminLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // AddUser
    test("POST /api/admin = AddAdmin", async () => {
        const response = await request(app)
            .post("/api/admin")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });
    test("POST /api/admin/login = LoginAdmin", async () => {
        const response = await request(app)
            .post("/api/admin/login")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");
        adminLoginUUID = response.body.uuid;
    });
    test("POST /api/user = AddUser", async () => {
        const response = await request(app)
            .post("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // LoginUser
    test("POST /api/user/login = LoginUser", async () => {
        const response = await request(app)
            .post("/api/user/login")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");
        userLoginUUID = response.body.uuid;
    });

    // LogoutUser
    test("POST /api/user/logout = LogoutUser", async () => {
        const response = await request(app)
            .post("/api/user/logout")
            .set({
                "X-Authentication-Token": userLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // ListUsers
    test("GET /api/user = ListUsers", async () => {
        const response = await request(app)
            .get("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("list");
    });

    // EditUser
    test("PATCH /api/user = EditUser", async () => {
        const response = await request(app)
            .patch("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "cpf": "000.000.000-00",
                "dadosJSON": "{'dados':'up'}"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // DeleteUser
    test("DELETE /api/user = DeleteUser", async () => {
        const response = await request(app)
            .delete("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "cpf": "000.000.000-00"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // AddFolga
    test("POST /api/user = AddUser", async () => {
        const response = await request(app)
            .post("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });
    test("POST /api/folga = AddFolga", async () => {
        const response = await request(app)
            .post("/api/folga")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "cpf": "000.000.000-00"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");
    });

    // ListFolga
    test("GET /api/folga = ListFolga", async () => {
        const response = await request(app)
            .get("/api/folga")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "mes": "2026-04-20"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("list");
        folgaUUID = response.body.list[0].uuid;
    });

    // GetFolga
    test("GET /api/folga = GetFolga", async () => {
        const response = await request(app)
            .get("/api/folga")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "uuid": folgaUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid", folgaUUID);
    });

    // ListFolgaVagas
    test("GET /api/folga/vagas = ListFolgaVagas", async () => {
        const response = await request(app)
            .get("/api/folga/vagas")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "uuid": folgaUUID,
                "mes": "2026-04-20"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("list");
    });

    // EditFolga
    test("PATCH /api/folga = EditFolga", async () => {
        const response = await request(app)
            .patch("/api/folga")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "uuid": folgaUUID,
                "dadosJSON": "{'dados':'up'}"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // EditFolgaDia
    test("PATCH /api/folga = EditFolgaDia", async () => {
        const response = await request(app)
            .patch("/api/folga")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "uuid": folgaUUID,
                "dia": "2026-04-20"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // DeleteFolga
    test("DELETE /api/folga = DeleteFolga", async () => {
        const response = await request(app)
            .delete("/api/folga")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "uuid": folgaUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // Clear all
    test("DELETE /api/user = DeleteUser", async () => {
        const response = await request(app)
            .delete("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "cpf": "000.000.000-00"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });
    test("DELETE /api/admin = DeleteAdmin", async () => {
        const response = await request(app)
            .delete("/api/admin")
            .set({
                "X-Authentication-Token": adminLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // Close server
    afterAll(async () => {
        endpoints.closeServer();
    });

}

// Run
startTests();
