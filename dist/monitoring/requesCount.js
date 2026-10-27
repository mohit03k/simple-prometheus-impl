"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCount = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// define count. the count for the requests
const requestCounter = new prom_client_1.default.Counter({
    name: "request_count",
    help: "Total request count",
    labelNames: ["method", "route", "status_code"] // so this will count total number of request with this method and on this router and with this 
    // particular status_code
});
// GAUGE CAN GO UP AND DOWN metric
// lets sayt the ws connection of users to the server.
// since this can go down and up this is a gauge metric
const activeGaugeUser = new prom_client_1.default.Gauge({
    name: "Active_user",
    help: "Total number of users who request hasn't resolved",
    labelNames: ["method", "route", "status_code"] // so this will count total number of request with this method and on this router and with this 
    // particular status_code
});
// HISTORGRAM
// histogram is data like how much time it took to complete some requests
// this stores data in cumulative format. so lets say the 10 request took less then 0.1ms< and 50 rqeuest took less then 5ms<
// then request that took between 0.1 ms and 5ms< are 50-10=40. and total requests that took less than 5ms are 50
const httpRequestDurationMs = new prom_client_1.default.Histogram({
    name: "Http_request_duration",
    help: "time took in ms to complete number of requests",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
});
const requestCount = (req, res, next) => {
    // since this function is middleware we increase it when the request comes 
    // activeGaugeUser.inc ({
    //   method: req.method,
    //   route: req.route ? req.route.path : req.path,
    // }) 
    // when the next function is called and the request is completed and the response has been sent
    // we decrease the gauge value since it go down and up
    // HISTORGRAM
    const startTime = Date.now();
    res.on('finish', () => {
        // when resopnse is sent 
        const endTime = Date.now();
        const duration = endTime - startTime;
        // we need to inrease the counter when hte request comes
        /**
       * we should use the res.on('finish') so when the response is sent for the request only then we can get the status_code and set it
       * */
        requestCounter.inc({
            method: req.method, // GET, POST
            // more verbose incase u using some diff version of express
            route: req.route ? req.route.path : req.path, // route / path
            // this code we get only after the request has succeded
        });
        httpRequestDurationMs.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        }, endTime - startTime);
    });
    next();
};
exports.requestCount = requestCount;
//# sourceMappingURL=requesCount.js.map