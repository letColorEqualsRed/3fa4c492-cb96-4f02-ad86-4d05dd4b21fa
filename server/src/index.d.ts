import { DeviceSavingService } from "services/deviceSavingService";
import { DeviceService } from "services/deviceService";

declare global {
    namespace Express {
        interface Locals {
            deviceService: DeviceService;
            deviceSavingService: DeviceSavingService;
        }
    }
}