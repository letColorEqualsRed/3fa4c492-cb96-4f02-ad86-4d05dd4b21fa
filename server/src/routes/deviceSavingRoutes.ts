import express from "express";
import { DateTime } from "luxon";
import { GetDeviceSavingSummaryResponseDto } from "../models/dto/GetDeviceSavingSummaryResponseDto";
import { GetDeviceSavingByPeriodResponseDto } from "../models/dto/GetDeviceSavingByPeriodResponseDto";
import { z } from "zod";
import { validators } from "../utils/validationUtils";
import { getErrorMessage } from "../utils/errorUtils";

export const deviceSavingRoutes = express.Router()
    .get("/:deviceId/history", async (req, res) => {
        try {
            const deviceId = parseInt(req.params.deviceId);

            const device = await req.app.locals.deviceService.getDeviceById(deviceId);

            if (!device) {
                throw new Error("Cannot find device with id " + deviceId);
            }

            const vQuery = z.object({
                timezone: validators.timezone.default(device.timezone),
                fromDate: validators.yyyyMMdd.optional(),
                toDate: validators.yyyyMMdd.optional(),
            }).parse(req.query)

            // Convert fromDate and toDate to specified timezone
            let fromDate, toDate: DateTime | undefined;
            if (vQuery.fromDate) {
                fromDate = DateTime.fromFormat(vQuery.fromDate, "yyyy-MM-dd", { zone: vQuery.timezone });
            }
            if (vQuery.toDate) {
                toDate = DateTime.fromFormat(vQuery.toDate, "yyyy-MM-dd", { zone: vQuery.timezone });
            }

            if (!!fromDate && !!toDate && fromDate >= toDate) {
                throw new Error("fromDate must be earlier than toDate");
            }

            const savings = await req.app.locals.deviceSavingService.findTotalDeviceSavings(
                deviceId,
                { fromDate, toDate },
            );

            const data: GetDeviceSavingByPeriodResponseDto = {
                periodCarbonSavings: savings.periodCarbonSavings,
                periodFueldSavings: savings.periodFueldSavings,
            };

            res.json({
                success: true,
                data: data
            });
        } catch (e) {
            console.error(e);
            res.json({
                success: false,
                reason: getErrorMessage(e),
            });
        }
    })
    .get("/:deviceId/summary", async (req, res) => {
        try {
            const deviceId = parseInt(req.params.deviceId);

            const device = await req.app.locals.deviceService.getDeviceById(deviceId);

            if (!device) {
                throw new Error("Cannot find device with id " + deviceId);
            }

            const vQuery = z.object({
                timezone: validators.timezone.default(device.timezone),
            }).parse(req.query);

            // Get start of current month in device's timezone
            const fromDate = DateTime.now().setZone(vQuery.timezone).startOf("month");

            const currentMonthSavings = await req.app.locals.deviceSavingService.findTotalDeviceSavings(
                deviceId,
                { fromDate },
            );

            const lifetimeSavings = await req.app.locals.deviceSavingService.findTotalDeviceSavings(deviceId);

            const data: GetDeviceSavingSummaryResponseDto = {
                currentMonthCarbonSavings: currentMonthSavings.periodCarbonSavings,
                currentMonthFueldSavings: currentMonthSavings.periodFueldSavings,
                lifetimeCarbonSavings: lifetimeSavings.periodCarbonSavings,
                lifetimeFueldSavings: lifetimeSavings.periodFueldSavings,
            };

            res.json({
                success: true,
                data: data
            });
        } catch (e) {
            console.error(e);
            res.json({
                success: false,
                reason: getErrorMessage(e),
            });
        }
    });

