import fs from "fs";
import { Database } from "sqlite3";
import { parse } from "papaparse";
import { DateTime } from "luxon";

export async function createSqliteDb(): Promise<Database> {
    return new Promise((resolve, reject) => {
        // Create sqlite3 database
        const db = new Database(":memory:");
        const savingsCsv = fs.readFileSync("./data/device-saving.csv", "utf-8");
        const deviceCsv = fs.readFileSync("./data/devices.csv", "utf-8");
        db.serialize(() => {
            db.run(`CREATE TABLE device (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255),
                timezone VARCHAR(255)
            );`);

            db.run(`CREATE TABLE device_saving (
                id INTEGER PRIMARY KEY,
                device_id INTEGER,
                timestamp INTEGER,
                carbon_saved DECIMAL(20, 16),
                fueld_saved DECIMAL(20, 16)
            );`);
            console.log("Sqlite database created");

            // Seed with sample data
            const deviceResults = parse<any>(deviceCsv, { header: true });
            const savingResults = parse<any>(savingsCsv, { header: true });

            const insertDevice = db.prepare(`INSERT INTO device VALUES (?, ?, ?);`)
            const deviceTimezones: Record<number, string> = {};
            let deviceId = 1;
            for (const row of deviceResults.data) {
                insertDevice.run(
                    deviceId,
                    row["name"],
                    row["timezone"],
                );
                deviceTimezones[deviceId] = row["timezone"];
                deviceId++;
            }

            const insertSaving = db.prepare(`INSERT INTO device_saving VALUES (?, ?, ?, ?, ?);`)
            let deviceSavingId = 1;
            for (const row of savingResults.data) {
                const rowDeviceId = row["device_id"]
                insertSaving.run(
                    deviceSavingId,
                    parseInt(rowDeviceId),
                    DateTime.fromISO(row["device_timestamp"].replace("Z", ""), { zone: deviceTimezones[rowDeviceId] }).toUnixInteger(),
                    parseFloat(row["carbon_saved"]),
                    parseFloat(row["fueld_saved"]),
                )
                deviceSavingId++;
            }
            insertSaving.finalize(() => {
                console.log("Sqlite database seeded with sample data");
                resolve(db);
            });
        });
    })
}