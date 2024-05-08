import { Device } from "models/device";
import { Database } from "sqlite3";

export interface DeviceService {
    getDeviceById(id: number): Promise<Device | null>
}

export class Sqlite3DeviceService implements DeviceService {
    constructor(private readonly db: Database) { }

    getDeviceById(id: number): Promise<Device | null> {
        return new Promise<Device>((resolve, reject) => {
            this.db.prepare("SELECT * FROM device WHERE id = ?")
                .run(id)
                .each<Device>((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }
}