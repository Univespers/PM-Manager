import { Endpoints } from './endpoints.js';
import { Database } from './database.js';

function loadServer() {
    const database = new Database();
    const endpoints = new Endpoints(database);
    endpoints.load();
}

// Run
loadServer();
