import express from "express";

import { Sqlite3DeviceService } from "./services/deviceService";
import { Sqlite3DeviceSavingService } from "./services/deviceSavingService";
import { deviceSavingRoutes } from "./routes/deviceSavingRoutes";
import { downloadRoutes } from "./routes/downloadRoutes";
import { createSqliteDb } from "./db";

async function startApplication() {
    const PORT = 8080;
    const app = express();

    const db = await createSqliteDb();

    // Instantiate services and make available throughout application
    app.locals.deviceService = new Sqlite3DeviceService(db);
    app.locals.deviceSavingService = new Sqlite3DeviceSavingService(db);

    // Set up routes
    app.use("/v1/device-saving", deviceSavingRoutes);
    app.use("/v1/download", downloadRoutes);

    // Accept API requests
    app.listen(PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`);

        console.table([
            {
                url: `http://localhost:${PORT}/v1/device-saving/1/summary`,
                description: "Get savings data summary for device with id 1"
            },
            {
                url: `http://localhost:${PORT}/v1/device-saving/1/history?fromDate=2023-02-01&toDate=2023-03-01`,
                description: "Get savings data in Feb 2023 for device with id 1"
            },
            {
                url: `http://localhost:${PORT}/v1/device-saving/1/history?fromDate=2023-02-01&toDate=2023-02-02`,
                description: "Get savings data on Feb 01 2023 for device with id 1"
            },
            {
                url: `http://localhost:${PORT}/v1/download/savings-calculations-guidelines.md`,
                description: "Download carbon and diesel savings calculation guidelines"
            }
        ]);
    });
}

startApplication();