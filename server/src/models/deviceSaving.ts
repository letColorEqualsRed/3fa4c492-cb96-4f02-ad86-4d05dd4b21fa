export interface DeviceSaving {
    id: number;
    deviceId: number;
    // Device timestamp stored as UNIX integer
    timestamp: number;
    // Carbon savings (in kg) during 30 minute period ending in timestamp
    carbonSaved: number;
    // Diesel fuel savings (in litres) during 30 minute period ending in timestamp
    fueldSaved: number;
}