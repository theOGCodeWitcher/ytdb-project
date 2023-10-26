const { createLogger, transports, format, config } = require("winston");

const { COLORS } = require("../constants/colors");

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format((info) => {
          info.level = ` ${info.level.toUpperCase()} `;
          return info;
        })(),
        format.prettyPrint(),
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        ),
        format.colorize({
          all: true,
          colors: COLORS,
        })
      ),
    }),
    new transports.File({ filename: "server.log" }),
  ],
});

logger.setLevels(config.syslog.levels);

module.exports = { logger };
