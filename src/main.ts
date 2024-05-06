import express from "express";
import { Database } from "sqlite3";

import { Sqlite3DeviceSavingService } from "./services/deviceSavingService";
import { deviceSavingRoutes } from "./routes/deviceSavingRoutes";
import { downloadRoutes } from "./routes/downloadRoutes";

async function startApplication() {
    const PORT = 8080;
    const app = express();

    // Create sqlite3 database
    const db = new Database(":memory:");

    // Instantiate services and make available throughout application
    app.locals.deviceSavingService = new Sqlite3DeviceSavingService(db);

    // Set up routes
    app.use("/v1/device-saving", deviceSavingRoutes);
    app.use("/v1/policy", downloadRoutes);

    // Accept API requests
    app.listen(PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`)
    });
}

startApplication();