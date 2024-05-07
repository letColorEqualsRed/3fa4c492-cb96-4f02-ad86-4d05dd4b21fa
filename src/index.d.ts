import { DeviceSavingService } from "services/deviceSavingService";

declare global {
    namespace Express {
        interface Locals {
            deviceSavingService: DeviceSavingService;
        }
    }
}