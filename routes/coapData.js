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
            
            let validData = validateData(dataRaw);

            // if valid, this VVV else error+warn
            if (validData) {
                let dataOut = {
                    latlng: dataRaw[0].split(","),
                    acc: Number(dataRaw[1].split(" ")[0]),
                    time: dataRaw[2],
                };
                httpRes.status(200).json(dataOut);
            } else {
                httpRes.status(400);
                console.warn('Invalid target URL');
            }
        });
	})

	req.end();
});




function validateData(data) {
    // valid data should look like this:
    // [ '59.923513,10.668951', '29.5 m', '2022-10-11 17:06:332' ]    

    let latlngRegex = /([0-9]*[.])?[0-9]+,([0-9]*[.])?[0-9]+/ig;
    let accuracyRegex = /([0-9]*[.])?[0-9]+ m/
    let date = new Date(data[2]);

    if (data.length === 3 &&
        latlngRegex.test(data[0]) &&
        accuracyRegex.test(data[1]) &&
        date.toString() !== 'Invalid Date') {
        return true;
    }

    return false;
}

module.exports = router;