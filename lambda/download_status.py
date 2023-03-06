import json
import os
import boto3


def lambda_handler(event, context):
    """
    Lambda that retrieves the details of a download in progress
    :param event:
    :param context:
    :return: JSON payload which includes a download status and a URL for the download if status is 'COMPLETE'
    """

    s3_bucket = os.environ['S3_BUCKET']
    request_id = event['pathParameters']['requestID']
    status_file_s3 = "exports/" + request_id + "/status.json"

    s3 = boto3.client('s3')
    data = s3.get_object(Bucket=s3_bucket, Key=status_file_s3)
    contents = data['Body'].read()
    status_json = json.loads(contents)

    if status_json["status"] == "COMPLETE":

        export_file_s3 = "exports/" + request_id + ".zip"
        # create pre-signed URL and add to JSON
        url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': s3_bucket, 'Key': export_file_s3},
            ExpiresIn=36000)
        status_json["url"] = url

    return status_json
