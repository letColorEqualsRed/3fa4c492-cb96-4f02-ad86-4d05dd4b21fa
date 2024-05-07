import { DateTime } from "luxon";
import { Database } from "sqlite3";

export interface DeviceSavingService {
    findTotalDeviceSavings(deviceId: number, criteria: { fromDate?: Date, toDate?: Date }): Promise<{
        periodCarbonSavings: number;
        periodFueldSavings: number;
    }>;
}

export class Sqlite3DeviceSavingService implements DeviceSavingService {
    constructor(private readonly db: Database) { }

    async findTotalDeviceSavings(deviceId: number, criteria: { fromDate?: Date, toDate?: Date }) {
        return new Promise<{
            periodCarbonSavings: number;
            periodFueldSavings: number;
        }>((resolve, reject) => {
            this.db.serialize(() => {
                this.db.prepare(
                    `SELECT SUM(carbon_saved) currentPeriodCarbonSavings,
                        SUM(fueld_saved) currentPeriodFueldSavings
                    FROM device_saving
                    WHERE device_id = ? AND device_timestamp > ? AND device_timestamp <= ?`)
                    .run(
                        deviceId,
                        DateTime.fromJSDate(criteria.fromDate ?? new Date(0)).plus({ minutes: 30 }).toISO(),
                        DateTime.fromJSDate(criteria.toDate ?? new Date()).toISO())
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