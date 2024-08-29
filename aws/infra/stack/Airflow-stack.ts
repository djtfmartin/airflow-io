import * as cdk from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as mwaa from 'aws-cdk-lib/aws-mwaa';

import { AppContext, BaseStack, StackConfig } from '@ala/ala-cdk-libs';

export class AirflowLambdaStack extends BaseStack {

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        new mwaa.CfnEnvironment(this, 'MyMWAAEnvironment', {
            name: 'production-2023',
            
        })

    }
}