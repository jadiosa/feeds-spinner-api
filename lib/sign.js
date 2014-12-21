var crypto = require('crypto');
/*
 * Load the S3 information from the environment variables.
 */

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

exports.sign_s3 = function(req, res) {
    var fileName = req.body.fileName;
    var expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
    var policy =
	{ 
		"expiration": expiration,
    	"conditions": 
    		[
            	{"bucket": S3_BUCKET},
            	{"key": fileName},
            	{"acl": 'public-read'},
            	["starts-with", "$Content-Type", ""],
            	["content-length-range", 0, 524288000]
    		]
	};
 
    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
    signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(policyBase64).digest('base64');
    res.json({
			bucket: S3_BUCKET, 
			awsKey: AWS_ACCESS_KEY, 
			policy: policyBase64, 
			signature: signature,
			url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+fileName
	});
};
