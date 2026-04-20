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

    // Admin
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
    let loginUUID = "";
    test("POST /api/admin/login = OK", async () => {
        const response = await request(app)
            .post("/api/admin/login")
            .send({
                "cpf": "000.000.000-00",
                "senha": "123456"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");
        loginUUID = response.body.uuid;
    });
    test("POST /api/admin/logout = OK", async () => {
        const response = await request(app)
            .post("/api/admin/logout")
            .set({
                "X-Authentication-Token": loginUUID
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
        loginUUID = response.body.uuid;
    });
    test("DELETE /api/admin = OK", async () => {
        const response = await request(app)
            .delete("/api/admin")
            .set({
                "X-Authentication-Token": loginUUID
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
