import express from "express";
import cors from "cors";

import { CurrentStatus } from './status.js';

const PORT = 3000;
const HEADER_TOKEN = "X-Authentication-Token";

export class Endpoints {

    app = express();

    constructor(datapoints) {
        this.app.use(cors()); // Allow different domains
        this.app.use(express.json()); // Allow JSON parsing
        
        // Load endpoints
        this.load(datapoints);
        
        // Start server
        this.app.listen(PORT, () => {
            console.log(`Escutando na porta ${PORT}`);
        });
    }

    load(datapoints) {

        // Info
        this.app.get("/api", getInfo);
        this.app.get("/api/info", getInfo);
        async function getInfo(requisito, resposta) {
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

    }
}
