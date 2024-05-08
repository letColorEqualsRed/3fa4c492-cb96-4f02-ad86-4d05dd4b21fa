import fs from "fs";
import { Database } from "sqlite3";
import { parse } from "papaparse";
import { DateTime } from "luxon";

export async function createSqliteDb(): Promise<Database> {
    return new Promise(async (resolve, reject) => {
        // Create sqlite3 database
        const db = new Database(":memory:");
        const csv = await fs.promises.readFile("./data/device-saving.csv", "utf-8");
        db.serialize(() => {
            db.run(`CREATE TABLE device_saving (
                device_id INTEGER,
                timestamp DATETIME,
                device_timestamp DATETIME,
                carbon_saved DECIMAL(20, 16),
                fueld_saved DECIMAL(20, 16)
            );`);
            console.log("Sqlite database created");

            // Seed with sample data
            const results = parse<any>(csv, { header: true });
            const statement = db.prepare(`INSERT INTO device_saving VALUES (?, ?, ?, ?, ?);`)
            for (const row of results.data) {
                statement.run(
                    parseInt(row["device_id"]),
                    DateTime.fromJSDate(new Date(row["timestamp"])).toSQL(),
                    DateTime.fromJSDate(new Date(row["device_timestamp"])).toSQL(),
                    parseFloat(row["carbon_saved"]),
                    parseFloat(row["fueld_saved"]),
                )
            }
            statement.finalize(() => {
                console.log("Sqlite database seeded with sample data");
                resolve(db);
            });
        });
    })
}