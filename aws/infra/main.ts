#!/usr/bin/env node
import 'source-map-support/register';
import { AppContext, AppContextError, ProjectPrefixType } from '@ala/ala-cdk-libs';

import { AirflowLambdaStack } from './stack/Lambda-stack';

try {

  const appContext = new AppContext({
      appConfigFileKey: 'APP_CONFIG',
      projectPrefixType: ProjectPrefixType.NameHyphenStage,
  });

  new AirflowLambdaStack(appContext, appContext.appConfig.Stack.Downloads);

} catch (error) {
  if (error instanceof AppContextError) {
      console.error('[AppContextError]:', (error as AppContextError).message);
  } else {
      console.error('[Error]: not-handled-error', error);
  }
}