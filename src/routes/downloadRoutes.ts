import express from "express";

export const downloadRoutes = express.Router()
    .use("/", express.static("./assets"));

