"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const hostName = '127.0.0.1';
const port = 5000;
const server = http_1.default.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-type', 'text/html'),
        response.end(`<h3>Wellcome To Node Server</h3>`);
});
server.listen(port, hostName, () => {
    console.log(`Node server is up and running at - http://${hostName}:${port}`);
});
