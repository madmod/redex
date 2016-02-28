# Redex
### Lambdas without limits

With Redex you can leverage the simplicity of AWS Lambda without resource and rate limits and on your own servers.

Redex provides an endpoint you can call with a Lambda ARN in a header. Redex will download the version of the Lambda function you specify and execute it. The function code is then cached and ready for the next execution.


## Building the Amazon Liunx Docker image

Unfortunately at this time Amazon does not provide a Docker image of Amazon Linux. To build one start an Amazon Linux EC2 instance. You may want to add a role to the instance that allows access to ECS if you plan to use it. Once the instance is ready install docker and git with the following commands.

```bash
sudo yum install -y docker git && sudo service docker start
sudo usermod -aG docker ec2-user
```

At this point you will need to logout of the instance and log back in so that you have the proper permissions to use Docker.

Copy the Dockerfile from this repo to the instance and then build the image.

```bash
mkdir redex && git clone https://github.com/madmod/redex redex && cd redex
docker build -t redex .
```

Once that is complete you have a Docker image ready to run Lambda functions. You can now publish this image to a private Docker registry such as Amazon ECR.

See [Getting Started with Amazon ECR](http://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_GetStarted.html) for instructions on pusing the image to your private repository.


### TODO: Explain how to use ECS.


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


