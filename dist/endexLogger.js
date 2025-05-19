"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endexLogger = void 0;
const uuid_1 = require("uuid");
const winston_1 = __importDefault(require("winston"));
const winstonLogger = winston_1.default.createLogger({
    level: "debug",
    format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
    ],
});
class EndexLogger {
    constructor() {
        this.annotationMap = new Map();
        this.info = async (...args) => {
            // console.log(...args);
            winstonLogger.info(this.formatLogMessage(args));
        };
        this.error = async (...args) => {
            // console.error(...args);
            winstonLogger.error(this.formatLogMessage(args));
        };
        this.warn = async (...args) => {
            // console.warn(...args);
            winstonLogger.warn(this.formatLogMessage(args));
        };
        this.warnWithoutConsole = async (...args) => {
            winstonLogger.warn(this.formatLogMessage(args));
        };
        this.debug = async (...args) => {
            // console.debug(...args);
            winstonLogger.debug(this.formatLogMessage(args));
        };
    }
    formatLogMessage(args) {
        return {
            message: args,
            metadata: this.getAnnotations(),
            id: (0, uuid_1.v4)(),
        };
    }
    attachAnnotation(key, value) {
        this.annotationMap.set(key, value);
    }
    removeAnnotation(key) {
        this.annotationMap.delete(key);
    }
    getAnnotations() {
        return Object.fromEntries(this.annotationMap);
    }
}
exports.endexLogger = new EndexLogger();
