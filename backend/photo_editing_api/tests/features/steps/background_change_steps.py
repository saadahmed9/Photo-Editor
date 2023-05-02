from behave import *
import requests
import json
from rest_framework.response import Response
@given(u'Background change API is up and running')
def set_impl(context):
    context.url = 'http://127.0.0.1:8000/background_change/'
    context.headers = {'content-type': 'application/json'}
    context.body = {
        "myfile": r"E:\Career\University at Buffalo\Semester 2\CSE_611\project\cse611-spring2023-team-photo-editing\backend\photo_editing_api\media\uploads\face-12.png",
        "function": "background_change",
        "background_change": "white",
    }

@when(u'User clicks on background change operation')
def step_impl(context):
    context.res = requests.post(context.url, data=json.dumps(context.body), headers=context.headers)


@then(u'verify that background change operation is working')
def step_impl(context):
    assert context.res.status_code == 200
