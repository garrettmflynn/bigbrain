import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';

const port = "80"

// import liveserver from 'liveserver-backend'
import {HTTPService, WebsocketService} from "./libs/backend/dist/index.mjs"

import WebRTCService from 'liveserver-webrtc'
// import liveserverRouter from 'liveserver-router'
import { Router } from './libs/router/dist/index.mjs'

// ---------------------------------------
// 1. Create Express App
// ---------------------------------------

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('./'))

// ---------------------------------------
// 2. Start HTTP Server
// ---------------------------------------

const server = http.createServer(app)

server.listen(parseInt(port), () => {
    console.log(`Server created on http://localhost:${port}`);
});


// ---------------------------------------
// 2. Load Backend Services (liveserver)
// ---------------------------------------

// // Instantiate Router Instance
const router = new Router()


// Enable HTTP Networking
let httpService = new HTTPService(router)
router.load(httpService, 'http')
app.post('**', httpService.controller)
app.get('**', httpService.controller)
app.delete('**', httpService.controller)

// Enable WebSocket Networking
let websocketService = new WebsocketService(router, server)
router.load(websocketService, 'websocket')

// Enable WebRTC Negotiation
let webrtc = new WebRTCService(router);
router.load(webrtc, 'webrtc')