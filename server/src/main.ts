import express from "express";
import cors from "cors";

import { Sqlite3DeviceService } from "./services/deviceService";
import { Sqlite3DeviceSavingService } from "./services/deviceSavingService";
import { deviceRoutes } from "./routes/deviceRoutes";
import { deviceSavingRoutes } from "./routes/deviceSavingRoutes";
import { createSqliteDb } from "./db";

async function startApplication() {
    const PORT = 8080;
    const app = express();

    const db = await createSqliteDb();

    // Instantiate services and make available throughout application
    app.locals.deviceService = new Sqlite3DeviceService(db);
    app.locals.deviceSavingService = new Sqlite3DeviceSavingService(db);

    app.use(cors());

    // Set up routes
    app.use("/api/v1/device", deviceRoutes);
    app.use("/api/v1/device-saving", deviceSavingRoutes);

    // Accept API requests
    app.listen(PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`);

        console.table([
            {
                url: `http://localhost:${PORT}/api/v1/device-saving/1/summary`,
                description: "Get savings data summary for device with id 1"
            },
            {
                url: `http://localhost:${PORT}/api/v1/device-saving/1/history?fromDate=2023-02-01&toDate=2023-02-02`,
                description: "Get savings data on Feb 01 2023 for device with id 1"
            },
            {
                url: `http://localhost:${PORT}/api/v1/device-saving/1/history?fromDate=2023-02-01&toDate=2023-02-02&timezone=UTC`,
                description: "Query by UTC instead of device timezone"
            },
            {
                url: `http://localhost:${PORT}/api/v1/device-saving/1/history?fromDate=2023-02-01&toDate=2023-02-30`,
                description: "Invalid date format"
            },
            {
                url: `http://localhost:${PORT}/api/v1/device-saving/100/history?fromDate=2023-02-01&toDate=2023-02-02`,
                description: "Non-existent device"
            }
        ]);
    });
}

startApplication();