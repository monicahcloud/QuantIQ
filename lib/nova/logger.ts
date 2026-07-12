type NovaLogData = Record<string, unknown> | unknown;

export const novaLogger = {
  info(message: string, data?: NovaLogData) {
    console.info(`[Nova] ${message}`, data ?? "");
  },

  warn(message: string, data?: NovaLogData) {
    console.warn(`[Nova] ${message}`, data ?? "");
  },

  error(message: string, data?: NovaLogData) {
    console.error(`[Nova] ${message}`, data ?? "");
  },
};
