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
    db.serialize(() => {
        db.run(`CREATE TABLE device_saving (
            device_id INTEGER,
            timestamp DATETIME,
            device_timestamp DATETIME,
            carbon_saved DECIMAL(20, 16),
            fueld_saved DECIMAL(20, 16)
        );`);
        // Seed with sample data
        db.run(`INSERT INTO device_saving VALUES
        (1,"2023-01-01 00:00:00","2023-01-01 02:00:00",6.209702491760254,6.275497050955892),
        (1,"2023-01-01 00:30:00","2023-01-01 02:30:00",6.030688537284732,5.93199931550771)
        ;`);
    });

    // Instantiate services and make available throughout application
    app.locals.deviceSavingService = new Sqlite3DeviceSavingService(db);

    // Set up routes
    app.use("/v1/device-saving", deviceSavingRoutes);
    app.use("/v1/policy", downloadRoutes);

    // Accept API requests
    app.listen(PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`);

        console.table([
            {url: "http://localhost:8080/v1/device-saving/1/history", description: "Get savings data for device with id 1"},
            {url: "http://localhost:8080/v1/device-saving/1/history?fromDate=2024-03-31T00%3A00%3A00.000Z", description: "Get savings data since 31/3/2024 for device with id 1"},
        ]);
    });
}

startApplication();