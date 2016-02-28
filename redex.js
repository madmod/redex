'use strict';

var os = require('os');

var port = process.env.PORT || 8080;

var downloadPath = os.tmpdir();
var sandboxPath = os.tmpdir();


var fs = require('fs');
var aws = require('aws');
var http = require('http');
var async = require('async');
var AdmZip = require('adm-zip');

var lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });


/**
 * Run AWS Lambda functions in response to a HTTP requests and return the result.
 */
function handleRequest (request, response) {
  console.log('Path Hit: ' + request.url);

  async.waterfall([
    function (callback) {
      callback(parseOptions(request));
    },
    function (options, callback) {
      downloadLambda(options.arn, function (err, sandbox) {
        callback(err, sandbox, options);
      });
    },
    function (sandbox, options, callback) {
      runLambda(sandbox, options, callback);
    }
  ], function (err, result) {
    response.end('It Works!! Path Hit: ' + request.url);

    // TODO: Cleanup temporary Lambda sandboxes.
  });
}


/**
 * Parse request headers to get the Lambda ARN and execution role.
 * @param {Object} request - HTTP request.
 * @param {Function} callback - Callback function.
 */
function parseOptions (request, callback) {
  var headers = request.headers;

  // TODO: Support Lambda function name.
  // TODO: Support Lambda function versions.
  var options = {
    arn: headers['redux-lambda-arn']
  };

  if (!options.arn) callback(new Error('Missing required header "redux-lambda-arn"'));

  callback(null, options);
}


/**
 * Get a Lambda zip URL from an ARN.
 * More info: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getFunction-property
 * @param {String} arn - AWS Lambda function ARN.
 * @param {String} options - Redex function options.
 * @return {String} AWS Lambda function zip signed download URL.
 */
function getLambdaUrl (arn, options, callback) {
  // TODO: Support running specific function versions.
  lambda.getFunction(
    {
      FunctionName: arn
    },
    function (err, data) {
      // TODO: Format values for functions using it.
      // TODO: Catch unsupoorted runtimes and throw an error.
      // TODO: Warn about unsupported features like VPCs.
      var result = {
        url: data.Code.Location,
        lambdaFunction: data
      };

      callback(err, result);
    }
  );
}


/**
 * Downloads an AWS Lambda function zip and extracts it to a temporary folder for execution.
 * @param {String} arn - AWS Lambda function ARN.
 * @param {Function} callback - AWS Lambda function ARN.
 * @return {String} AWS Lambda function temporary folder path.
 */
function downloadLambda (arn, callback) {
  var zipName = 'lambda-'+ arn +'.zip';
  var zipPath = downloadPath + '/' + zipName;
  var zipFile = fs.createWriteStream(zipPath);
  getLamdaUrl()
  var request = http.get(lambdaUrl, function (response) {
    response.pipe(zipFile);
    zipFile.on('finish', function () {
      // TODO: Check zip integrity with `CodeSha256` provided by the Lambda API.
      var zip = new AdmZip(zipPath);
      zip.extractAllTo(sandboxPath + '/lambda-' + arn);
      // TODO: Remove temporary Lambda zip.
    });
  });
}


/**
 * Execute a Lambda function in a sandbox and return the result.
 * @param {String} sandbox - Lambda temporary sandbox path.
 * @param {Object} options - Execution options.
 * @param {Function} .
 */
function executeLambda (sandbox, options) {
  // TODO: Actually sandbox the function in a temporary environment.
  // TODO: Cleanup any temp files after the lambda function runs.
  // TODO: Do this.
}


// Run the HTTP server.
var server = http.createServer(handleRequest);

server.listen(port, function(){
  console.log("Server listening on: http://localhost:%s", port);
});


