# Bid Euchre HTTP Game Engine

This is part of a larger project to make a Bid Euchre game during Quarantine.

I'm mostly writing this as short guide to host this yourself on AWS Elastic Beanstalk assuming you clone/copy this project as a template.

1. Upload your project to http://hub.docker.com
2. Change the Dockerrun.aws.json image to refer to your repo that you pushed to Docker Hub
3. Upload the Dockerrun.aws.json to Elastic Beanstalk ([Guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/single-container-docker-configuration.html))
