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
        const response = await request(app).get("/");
        expect(response.status).toBe(404);
    });
    test("GET /api = OK", async () => {
        const response = await request(app).get("/api");
        expect(response.status).toBe(200);
    });
    test("GET /api/info = OK", async () => {
        const response = await request(app).get("/api/info");
        expect(response.status).toBe(200);
    });

    // Close server
    afterAll(async () => {
        await new Promise((resolve) => setTimeout(() => resolve(), 1500)); // avoid jest open handle error
        endpoints.closeServer();
    });

}

// Run
startTests();
