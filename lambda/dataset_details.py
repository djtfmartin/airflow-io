import json
import os
import boto3


def lambda_handler(event, context):
    """
    Lambda that retrieves the details of a full dataset export which is available in S3
    :param event:
    :param context:
    :return: JSON payload which includes details of the export file including a URL
    """

    s3_bucket = os.environ['S3_BUCKET']
    dataset_id = event['pathParameters']['datasetID']

    s3 = boto3.client('s3')

    file_key = "dwca-exports/ " + dataset_id + ".zip"

    # create pre-signed URL and add to JSON
    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={'Bucket': s3_bucket, 'Key': file_key},
        ExpiresIn=(60 * 60 * 24 * 7))

    # file size
    response = s3.head_object(Bucket=s3_bucket, Key=file_key)
    size = response['ContentLength']
    last_modified = response['LastModified']
    file_size_mb = str(round((size / 1024) / 1024, 2))

    status_json = {"url": url, "fileSizeInMB": file_size_mb, "modified": str(last_modified)}

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=1800;",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(status_json)
    }
