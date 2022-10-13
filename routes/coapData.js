// importing packages
const express = require('express');
const coap = require('coap');
const server = coap.createServer();

const router = express.Router();

router.post(`/`, (httpReq, httpRes) => {
	const req = coap.request(httpReq.body.targetURL)

	req.on('response', (res) => {
		res.on('data', (chunk)=> {
			let dataRaw = chunk.toString().split("\n");

			let dataOut = {
				latlng: dataRaw[0].split(","),
				acc: Number(dataRaw[1].split(" ")[0]),
				time: dataRaw[2],
			};

			httpRes.status(200).json(dataOut);
		  });
	})

	req.end();
});

module.exports = router;