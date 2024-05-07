import express from "express";
import { GetDeviceSavingByPeriodResponseDto } from "models/dto/deviceSaving";

export const deviceSavingRoutes = express.Router()
    .get("/:deviceId/history", async (req, res) => {
        const deviceId = parseInt(req.params.deviceId);
        const fromDate = req.query.fromDate as string;
        const toDate = req.query.toDate as string;

        const savings = await req.app.locals.deviceSavingService.findTotalDeviceSavings(
            deviceId,
            { fromDate: new Date(fromDate), toDate: new Date(toDate) },
        );

        const response: GetDeviceSavingByPeriodResponseDto = {
            periodCarbonSavings: savings.periodCarbonSavings,
            periodFueldSavings: savings.periodFueldSavings,
        };

        res.json(response);
    })
    .get("/:deviceId/summary", async (req, res) => {
        const deviceId = parseInt(req.params.deviceId);
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;

        res.json({

        });
    });

