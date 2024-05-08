import express from "express";
import { DateTime } from "luxon";
import { GetDeviceSavingByPeriodResponseDto, GetDeviceSavingSummaryResponseDto } from "models/dto/deviceSaving";

export const deviceSavingRoutes = express.Router()
    .get("/:deviceId/history", async (req, res) => {
        try {
            const deviceId = parseInt(req.params.deviceId);
            const fromDate = req.query.fromDate ? DateTime.fromFormat(req.query.fromDate as string, "yyyy-MM-dd", { zone: "UTC" }) : undefined;
            const toDate = req.query.toDate ? DateTime.fromFormat(req.query.toDate as string, "yyyy-MM-dd", { zone: "UTC" }) : undefined;

            if (!!fromDate && !!toDate && fromDate >= toDate) {
                throw new Error("fromDate must be earlier than toDate");
            }

            const savings = await req.app.locals.deviceSavingService.findTotalDeviceSavings(
                deviceId,
                { fromDate, toDate },
            );

            const response: GetDeviceSavingByPeriodResponseDto = {
                periodCarbonSavings: savings.periodCarbonSavings,
                periodFueldSavings: savings.periodFueldSavings,
            };

            res.json(response);
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
    })
    .get("/:deviceId/summary", async (req, res) => {
        try {
            const deviceId = parseInt(req.params.deviceId);

            const currentMonthSavings = await req.app.locals.deviceSavingService.findTotalDeviceSavings(
                deviceId,
                { fromDate: DateTime.fromJSDate(new Date()).startOf("month") },
            );

            const lifetimeSavings = await req.app.locals.deviceSavingService.findTotalDeviceSavings(deviceId);

            const response: GetDeviceSavingSummaryResponseDto = {
                currentMonthCarbonSavings: currentMonthSavings.periodCarbonSavings,
                currentMonthFueldSavings: currentMonthSavings.periodFueldSavings,
                lifetimeCarbonSavings: lifetimeSavings.periodCarbonSavings,
                lifetimeFueldSavings: lifetimeSavings.periodFueldSavings,
            };

            res.json(response);
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

