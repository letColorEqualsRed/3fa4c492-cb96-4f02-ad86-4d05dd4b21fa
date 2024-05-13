import { ZodError } from "zod";

export function getErrorMessage(e: unknown): string {
    if (e instanceof ZodError) {
        let issue = e.issues[0];
        let message = issue.message;
        if (issue.code == "custom") {
            message = `${issue.path.join(".")} ${message}`
        }

        return message;
    }

    if (e instanceof Error) {
        return e.message;
    }

    return "An unknown error has occurred";
}