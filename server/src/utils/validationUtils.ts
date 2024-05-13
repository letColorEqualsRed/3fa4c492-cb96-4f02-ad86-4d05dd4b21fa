import { z } from "zod";
import { timezones } from "./dateTimeUtils";
import { DateTime } from "luxon";

export const validators = {
    timezone: z.string().refine((str) => !!timezones[str], { message: "must be valid IANA timezone identifier" }),
    yyyyMMdd: z.string().refine((str) => DateTime.fromFormat(str, "yyyy-MM-dd").isValid, { message: "must be a date in yyyy-MM-dd format" }),
}