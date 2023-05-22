import os
import boto3
import json
import http.client
import ast


def lambda_handler(event, context):
    """
    Lambda that starts a download by invoking an Airflow DAG
    :param event:
    :param context:
    :return: JSON payload which includes a request ID which can be used to retrieve download status
    """

    supplied_conf = json.loads(event["body"])
    supplied_conf["requestID"] = context.aws_request_id

    conf = json.dumps(supplied_conf)

    mwaa_env_name = os.environ['MWAA_ENVIRONMENT']
    dag_name = os.environ['DAG_ID']
    client = boto3.client('mwaa')

    mwaa_cli_token = client.create_cli_token(Name=mwaa_env_name)
    headers = {
        'Authorization': 'Bearer ' + mwaa_cli_token['CliToken'],
        'Content-Type': 'text/plain'
    }
    raw_data = "dags trigger {0} -c '{1}'".format(dag_name, conf)

    conn = http.client.HTTPSConnection(mwaa_cli_token['WebServerHostname'], timeout=30)
    conn.request("POST", "/aws_mwaa/cli", raw_data, headers)
    res = conn.getresponse()

    data = res.read()
    dict_str = data.decode("UTF-8")
    mydata = ast.literal_eval(dict_str)

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": "{\"requestID\": \"" + context.aws_request_id + "\"}"
    }
