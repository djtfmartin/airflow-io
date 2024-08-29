import * as cdk from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

import { AppContext, BaseStack, StackConfig } from '@ala/ala-cdk-libs';

export class AirflowLambdaStack extends BaseStack {

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        // Define the Lambda function
        const downloadDatasetFn = new lambda.Function(this, 'DownloadDataSetFunction', {
            runtime: lambda.Runtime.PYTHON_3_8, // execution environment
            code: lambda.Code.fromAsset('../lambda', {
                exclude: [ 
                    'dataset_details.py', 
                    'download_status.py' 
                ]
            }), // code loaded from "lambda" directory
            handler: 'download_dataset.lambda_handler', // file is "download_dataset", function is "lambda_handler"
            environment: {
                MWAA_ENVIRONMENT: 'production-2023',
                DAG_ID: 'Export_event_core'
            }
        });

        // Define the Lambda function
        const downloadStatusFn = new lambda.Function(this, 'DownloadStatusFunction', {
            runtime: lambda.Runtime.PYTHON_3_8, // execution environment
            code: lambda.Code.fromAsset('../lambda', {
                exclude: [ 
                    'dataset_details.py', 
                    'download_dataset.py'
                ]
            }), // code loaded from "lambda" directory
            handler: 'download_status.lambda_handler', // file is "download_dataset", function is "lambda_handler"
            environment: {
                S3_BUCKET: ''
            }
        });

        // Define the Lambda function
        const datasetDetailsFn = new lambda.Function(this, 'datasetSetailsFunction', {
            runtime: lambda.Runtime.PYTHON_3_8, // execution environment
            code: lambda.Code.fromAsset('../lambda', {
                exclude: [ 
                    'download_dataset.py', 
                    'download_status.py'
                ]
            }), // code loaded from "lambda" directory
            handler: 'dataset_details.lambda_handler', // file is "download_dataset", function is "lambda_handler"
            environment: {
                S3_BUCKET: ''
            }
        });

        // Create a policy statement for MWAA CreateCliToken
        const mwaaPolicyStatement = new iam.PolicyStatement({
            actions: ['mwaa:CreateCliToken'],
            resources: [cdk.Arn.format({ service: 'airflow', resource: 'environment', resourceName: 'production-2023' }, this)],
        });

        const s3PolictStatement = new iam.PolicyStatement({
            actions: [ 's3:GetObject', 's3:PutObject' ],
            resources: [cdk.Arn.format({ service: 's3', resource: '*' }, this)]
        });

        // Attach the policy to the Lambda function's role
        downloadDatasetFn.addToRolePolicy(mwaaPolicyStatement);
        downloadStatusFn.addToRolePolicy(s3PolictStatement);
        datasetDetailsFn.addToRolePolicy(s3PolictStatement);
    }
}