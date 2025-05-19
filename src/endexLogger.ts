import { v4 as uuidv4 } from "uuid";
import winston from "winston";

const winstonLogger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), 
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

class EndexLogger {
  private annotationMap: Map<string, any> = new Map();

  public info = async (...args: any[]): Promise<void> => {
    // console.log(...args);
    winstonLogger.info(this.formatLogMessage(args));
  };

  public error = async (...args: any[]): Promise<void> => {
    // console.error(...args);
    winstonLogger.error(this.formatLogMessage(args));
  };

  public warn = async (...args: any[]): Promise<void> => {
    // console.warn(...args);
    winstonLogger.warn(this.formatLogMessage(args));
  };

  public warnWithoutConsole = async (...args: any[]): Promise<void> => {
    winstonLogger.warn(this.formatLogMessage(args));
  };

  public debug = async (...args: any[]): Promise<void> => {
    // console.debug(...args);
    winstonLogger.debug(this.formatLogMessage(args));
  };

  private formatLogMessage(args: any[]) {
    return {
      message: args,
      metadata: this.getAnnotations(),
      id: uuidv4(),
    };
  }

  public attachAnnotation(key: string, value: any) {
    this.annotationMap.set(key, value);
  }

  public removeAnnotation(key: string) {
    this.annotationMap.delete(key);
  }

  public getAnnotations() {
    return Object.fromEntries(this.annotationMap);
  }
}

export const endexLogger = new EndexLogger();