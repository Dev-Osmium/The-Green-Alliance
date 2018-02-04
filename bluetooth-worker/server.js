#!/usr/bin/env node

const app = require('express')(),
	bodyParser = require('body-parser'),
	{
		spawn
	} = require('child_process');

input_server({
	config: config
});

function input_server(options) {
	// Silently Ignore Incorrect JSON Input
	app.use(bodyParser.json()).use(function(error, req, res, next) {
		res.end();
	});

	// Handle JSON POST Req, Sent By Py. as Data Flows In
	app.post('/new_msg ', function(req, res) {
		const msg_data = req.body.msg_data;

		res.end();
	});

	app.listen(options.config.webhook_port);
	console.log(`Webhook: Listening at http://localhost:4909`)

	const btworker = spawn('sudo', ['python3', 'bt_worker.py']);

	btworker.stdout.on('data', (data) => {
		console.log(`BT Worker: ${data}`);
	});

	btworker.stderr.on('data', (data) => {
		console.error(`BT Worker: Error ${data}`);
	});

	btworker.on('close', (code) => {
		console.log(`BT Worker: Exited with code ${code}`);
	});
}
