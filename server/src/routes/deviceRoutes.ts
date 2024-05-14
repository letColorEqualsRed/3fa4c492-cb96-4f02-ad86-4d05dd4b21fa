import express from "express";
import { GetDeviceResponseDto } from "models/dto/GetDeviceResponseDto";

export const deviceRoutes = express.Router()
    .get("/:deviceId", async (req, res) => {
        try {
            const deviceId = parseInt(req.params.deviceId);

            const device = await req.app.locals.deviceService.getDeviceById(deviceId);

            if (!device) {
                throw new Error("Cannot find device with id " + deviceId);
            }

            const data: GetDeviceResponseDto = {
                id: device.id,
                name: device.name,
                timezone: device.timezone,
            };

            res.json({
                success: true,
                data: data
            });
        } catch (e) {
            if (e instanceof Error) {
                res.json({
                    success: false,
                    reason: e.message
                });
            } else {
                res.json({
                    success: false,
                    reason: "An unknown error has occurred."
                });
            }
        }
    });

