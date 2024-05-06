import express from "express";

export const deviceSavingRoutes = express.Router()
    .get("/:deviceId/history", async (req, res) => {
        const deviceId = req.params.deviceId;
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;

        res.json({

        });
    })
    .get("/:deviceId/month", async (req, res) => {
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;

        res.json({

        });
    });

