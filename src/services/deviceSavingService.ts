import { DateTime } from "luxon";
import { Database } from "sqlite3";

export interface DeviceSavingService {
    findTotalDeviceSavings(deviceId: number, criteria?: { fromDate?: DateTime, toDate?: DateTime }): Promise<{
        periodCarbonSavings: number;
        periodFueldSavings: number;
    }>;
}

export class Sqlite3DeviceSavingService implements DeviceSavingService {
    constructor(private readonly db: Database) { }

    async findTotalDeviceSavings(deviceId: number, criteria?: { fromDate?: DateTime, toDate?: DateTime }) {
        return new Promise<{
            periodCarbonSavings: number;
            periodFueldSavings: number;
        }>((resolve, reject) => {
            const fromDate = criteria?.fromDate ?? DateTime.fromMillis(0);
            const toDate = criteria?.toDate ?? DateTime.now();
            this.db.serialize(() => {
                this.db.prepare(
                    `SELECT SUM(carbon_saved) periodCarbonSavings,
                        SUM(fueld_saved) periodFueldSavings
                    FROM device_saving
                    WHERE device_id = ? AND device_timestamp > ? AND device_timestamp <= ?`)
                    .run(deviceId, fromDate.toSQL(), toDate.toSQL())
                    .each<{
                        periodCarbonSavings: number;
                        periodFueldSavings: number;
                    }>((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({
                                periodCarbonSavings: res.periodCarbonSavings ?? 0,
                                periodFueldSavings: res.periodFueldSavings ?? 0,
                            });
                        }
                    });
            })
        })
    }
}