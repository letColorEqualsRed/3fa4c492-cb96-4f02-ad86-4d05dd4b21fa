import { Database } from "sqlite3";

export interface DeviceSavingService {
    findTotalDeviceSavings(deviceId: number, criteria: { fromDate?: Date, toDate?: Date }): Promise<any>;
}

export class Sqlite3DeviceSavingService implements DeviceSavingService {
    constructor(private readonly db: Database) { }

    async findTotalDeviceSavings(deviceId: number, criteria: { fromDate?: Date, toDate?: Date }) {
        const rows = await this.db.exec(``);


    }
}