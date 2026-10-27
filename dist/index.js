"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requesCount_1 = require("./monitoring/requesCount");
const prom_client_1 = __importDefault(require("prom-client"));
const app = (0, express_1.default)();
app.use(requesCount_1.requestCount);
app.get("/user", (req, res) => {
    res.json({
        name: "user1",
        some: "update code"
    });
});
app.get("/metrics", async (req, res) => {
    const metrics = await prom_client_1.default.register.metrics(); // this will export all metrics 
    res.set('Content-Type', prom_client_1.default.register.contentType);
    res.end(metrics); // this is to end the request and give client no data. u can give it optionally like here we doing 
    // but before that we need to define the type of content using res.set() that we doing above
});
app.listen(3000);
//# sourceMappingURL=index.js.map