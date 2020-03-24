<!--
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
-->

# API Management of Web Actions

Let's now show how these web actions can be turned into an API using the [API Gateway](https://cloud.ibm.com/docs/openwhisk?topic=cloud-functions-apigateway). First we will choose `/myapi` as the base path. This is the part of the path before the actual endpoint. For example: `example.com/basepath/endpoint`. This is useful for grouping endpoints together in a logical way and is how IBM Cloud Functions organizes your endpoints into a single API.

## Creating an API

### Hello Endpoint

First we will create the `hello` endpoint. Note that all actions used in an API must be web actions, so we mustn't forget to run `ic fn action update hello --web true` prior to following commands below.

1. Run the following command to create a simple GET endpoint for the hello action

    ```bash
    ic fn api create myapi /foo get hello
    ```

2. Check to see the API was created

    ```bash
    ic fn api list
    ```

    ```bash
    ok: APIs
    Action                                     Verb  API Name  URL
    /NAMESPACE/hello        get    myapi  https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/d9903f40439f1a268b7dcbac42a389cdde605f3f3bef57f69789be6df438361e/myapi/hello
    ```

3. Now lets invoke that API via curl

    ```bash
    curl https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/aac6bc4a6f94f19dd008e64513b62bf155af5703a95a142f0c9a6ea83af81300/myapi/foo
    ```

    ```json
    {
    "greeting": "Hello, undefined from Rivendell"
    }
    ```

5. Create the endpoint for the atom svg action

    ```bash
    ic fn api create myapi /atom get atom --response-type http
    ```

    ```bash
    ok: created API /myapi/atom GET for action /_/atom
    https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/NAMESPACE_ID/myapi/atom
    ```

6. Test out the action by copy/pasting the endpoint into your browser of choice.

    _What do you see?_

{% hint style="info" %}
All HTTP Methods are supported... `GET`, `POST`, `PUT`, or `DELETE`. For details see: [Serverless HTTP handlers with OpenWhisk](https://medium.com/openwhisk/serverless-http-handlers-with-openwhisk-90a986cc7cdd)
{% endhint %}

## Using OpenAPI Specification ("Swagger")

As we can begin to tell, as the number of API endpoints increases, documenting and managing them becomes increasingly difficult. One solution to this to use the [OpenAPI Specification](https://swagger.io/specification/). This has a plethora of tools around for documenting, creating stub projects, etc in a variety of languages. And it is supported by IBM Cloud Functions!

{% hint style="info" %}
You may create all your APIs with a single OpenAPI JSON documents on the `create` command...
{% endhint %}
