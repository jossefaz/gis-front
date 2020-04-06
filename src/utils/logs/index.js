import { LoggerBuilder, LogLevel, ConsoleMessageHandler,  } from "simplr-logger";

const _logger = new LoggerBuilder({
  DefaultLogLevel: {
    LogLevel: LogLevel.Trace,
    LogLevelIsBitMask: false,
  },
  WriteMessageHandlers: [
    {
      Handler: new ConsoleMessageHandler(),
      LogLevel: LogLevel.Critical,
    },
  ],
});

export const logLevel = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERR: "ERR",
};

export const LogIt = (level, msg) => {
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
