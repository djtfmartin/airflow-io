# Airflow IO

This project is a very thin layer on top of Airflow for exposing a REST API that calls through to Airflow (MWAA).

## Lambda environment variables
Two environment variables are in use by these lambdas

| Variable | Description                 | Example value  |
|----------|-----------------------------|----------------|
| MWAA_ENVIRONMENT         | The MWAA environment to use | DevEnvironment |
| S3_BUCKET         | The S3 Bucket to use        | ala-emr-dev    |
