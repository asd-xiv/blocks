const debug = require("debug")("Blocks:PrometheusPlugin")
const Prometheus = require("prom-client")

module.exports = {
  depend: ["Config"],

  create: () => Config => {
    if (Config.get("METRICS_WITH_DEFAULT") === true) {
      Prometheus.collectDefaultMetrics()
    }

    const RequestCounter = new Prometheus.Counter({
      name: `${Config.get("METRICS_NAMESPACE")}__requests_count`,
      help: "Number of requests",
      labelNames: ["method", "route", "status"],
    })

    const DurationHistogram = new Prometheus.Histogram({
      name: `${Config.get("METRICS_NAMESPACE")}__requests_duration`,
      help: "Duration histogram of http responses (ms)",
      buckets: [20, 40, 60, 100, 160, 260, 420],
    })

    return {
      measure: ({ method, route, status, duration }) => {
        RequestCounter.inc({
          method,
          route,
          status,
        })
        DurationHistogram.observe(duration)
      },

      getMetrics: () => Prometheus.register.metrics(),
    }
  },
}
