import { ErrorCode } from "@ethersproject/logger";

type Messages = {
    [key in ErrorCode]: string
}

export const messages:Messages = {
    UNKNOWN_ERROR: "",
    NOT_IMPLEMENTED: "",
    UNSUPPORTED_OPERATION: "",
    NETWORK_ERROR: "",
    SERVER_ERROR: "",
    TIMEOUT: "",
    BUFFER_OVERRUN: "",
    NUMERIC_FAULT: "",
    MISSING_NEW: "",
    INVALID_ARGUMENT: "",
    MISSING_ARGUMENT: "",
    UNEXPECTED_ARGUMENT: "",
    CALL_EXCEPTION: "",
    INSUFFICIENT_FUNDS: "",
    NONCE_EXPIRED: "",
    REPLACEMENT_UNDERPRICED: "",
    UNPREDICTABLE_GAS_LIMIT: "UNPREDICTABLE_GAS_LIMIT: please input all required fields!",
    TRANSACTION_REPLACED: "",
    ACTION_REJECTED: "ACTION_REJECTED: you have just rejected request",
}