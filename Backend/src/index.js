import { Endpoints } from './endpoints.js';
import { Utilities } from './utilities.js';
import { Database } from './database.js';

function loadServer() {
    const database = new Database();
    const utilities = new Utilities(database);
    const endpoints = new Endpoints(utilities, database);
    endpoints.startServer();
}

// Run
loadServer();
