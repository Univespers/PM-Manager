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
    test("GET /api = OK", async () => {
        const response = await request(app)
            .get("/api");
        expect(response.status).toBe(200);
    });
    test("GET /api/info = OK", async () => {
        const response = await request(app)
            .get("/api/info");
        expect(response.status).toBe(200);
    });

    // AddAdmin
    test("POST /api/admin = OK", async () => {
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
    test("POST /api/admin/login = OK", async () => {
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
    test("POST /api/admin/logout = OK", async () => {
        const response = await request(app)
            .post("/api/admin/logout")
            .set({
                "X-Authentication-Token": adminLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // DeleteAdmin
    test("POST /api/admin/login = OK", async () => {
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
    test("DELETE /api/admin = OK", async () => {
        const response = await request(app)
            .delete("/api/admin")
            .set({
                "X-Authentication-Token": adminLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // AddUser
    test("POST /api/admin = OK", async () => {
        const response = await request(app)
            .post("/api/admin")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });
    test("POST /api/admin/login = OK", async () => {
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
    test("POST /api/user = OK", async () => {
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

    // EditUser
    test("PATCH /api/user = OK", async () => {
        const response = await request(app)
            .patch("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            })
            .send({
                "cpf": "000.000.000-00",
                "dataJSON": "{\"dados\":\"up\"}"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // LoginUser
    test("POST /api/user/login = OK", async () => {
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
    test("POST /api/user/logout = OK", async () => {
        const response = await request(app)
            .post("/api/user/logout")
            .set({
                "X-Authentication-Token": userLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("response", "OK");
    });

    // ListUsers
    test("GET /api/user = OK", async () => {
        const response = await request(app)
            .get("/api/user")
            .set({
                "X-Authentication-Token": adminLoginUUID
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("list");
    });

    // DeleteUser
    test("DELETE /api/user = OK", async () => {
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

    // Close server
    afterAll(async () => {
        endpoints.closeServer();
    });

}

// Run
startTests();
