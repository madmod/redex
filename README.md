# Redex
### Lambdas without limits

With Redex you can leverage the simplicity of AWS Lambda without resource and rate limits and on your own servers.

Redex provides an endpoint you can call with a Lambda ARN in a header. Redex will download the version of the Lambda function you specify and execute it. The function code is then cached and ready for the next execution.


## Installation

### TODO: Explain how to make Amazon Linux Docker image


## Configuration


## API Gateway

You can use existing API Gateway endpoints with Redex by setting the integration request to HTTP Proxy to the Redex endpoint and adding a static header with the ARN of the Lambda function to execute.

Additional headers will be added to specify IAM execution roles and resource limits.


## Roadmap

- Execute Lambda functions in ECS containers with provided roles.
- Forward Lambda logs to CloudWatch.
- Support runtimes other than NodeJS.
- Improve runtime security to allow execution of untrusted code in Lambdas. (like user provided macros.)
- Automate creation of a Lambda compatible AWS Linux Docker image.
- Include Lambda environment resources like Imagemagik.
- Support other event types through a proxying Lambda function.
- Enforce resource limits specified in a config file or by API Gateway.
- Add a load based pass-through to AWS Lambda so that Redex can be used as a fallback in high load.


