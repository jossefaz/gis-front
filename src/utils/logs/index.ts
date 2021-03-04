import { LoggerBuilder, LogLevel, ConsoleMessageHandler } from "simplr-logger";

export enum logLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERR = "ERR",
}
const _logger = new LoggerBuilder({
  DefaultLogLevel: {
    LogLevel: LogLevel.Trace,
    LogLevelIsBitMask: false,
  },
  WriteMessageHandlers: [
    {
      Handler: new ConsoleMessageHandler(),
      LogLevel: LogLevel.Debug,
      LogLevelIsBitMask: false,
    },
  ],
});

export const LogIt = (level: logLevel, msg: string) => {
  switch (level) {
    case logLevel.DEBUG:
      _logger.Debug(msg);
      break;
    case logLevel.INFO:
      _logger.Info(msg);
      break;
    case logLevel.WARN:
      _logger.Warn(msg);
      break;
    case logLevel.ERR:
      _logger.Error(msg);
      break;
    default:
      break;
  }
};
