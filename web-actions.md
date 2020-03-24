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

# Web Actions

Web actions are actions which can be called externally using the HTTP protocol from clients like `curl` or web browsers.  IBM Cloud Functions provides a simple flag, `--web`, which will cause it to automatically create an HTTP accessible URL (endpoint) for any action.

Let's turn the `hello` action into a `"web action"`!

1. Update the action to set the `--web` flag to `true`.

      ```bash
      ic fn action update hello --web true
      ```

      The `hello` action has now been assigned an HTTP endpoint.

2. Retrieve the web action's URL exposed by the platform for the `hello` action.

      ```bash
      ic fn action get hello --url
      ```

      ```bash
      ok: got action hello
      https://us-south.functions.cloud.ibm.com/api/v1/web/2ca6a304-a717-4486-ae33-1ba6be11a393/default/hello

      ```

3. Invoke the web action URL returned using the `curl` command.

      ```bash
      curl "https://us-south.functions.cloud.ibm.com/api/v1/web/2ca6a304-a717-4486-ae33-1ba6be11a393/default/hello"
      ```

      {% hint style="info" %}
      **It looks like nothing happened!**  In fact, an HTTP response code of `204 No Content` was returned. This is because we need to tell IBM Cloud Functions what `content type` we expect the function to return.
      {% endhint %}
      {% endhint %}

4. Invoke the web action URL with a JSON extension using the `curl` command.

      To do this we need to add `.json` after the action name, at the end of the URL, to tell ICF we want a JSON object returned. Try it invoking it now:

      ```bash
      curl "https://us-south.functions.cloud.ibm.com/api/v1/web/2ca6a304-a717-4486-ae33-1ba6be11a393/default/hello.json"
      ```

      We now get a successful HTTP response in JSON format which matches the `.json` extension we added:

      ```json
      {
         "message": "Hello undefined from Rivendell!"
      }
      ```

      Additionally, we can invoke it with query parameters for `name`:

      ```bash
      curl "https://us-south.functions.cloud.ibm.com/api/v1/web/2ca6a304-a717-4486-ae33-1ba6be11a393/default/hello.json?name=Arwen"
      ```

      ```json
      {
         "message": "Hello Arwen from Rivendell!"
      }
      ```

## Content extensions

Web actions invoked through the platform API need a content extension to tell the platform how to interpret the content returned from the action. In the example above, we were using the `.json` extension. This tells the platform to serialize the return value out to a JSON response.

{% hint style="info" %}
The platform supports the following content-types: `.json`, `.html`, `.http`, `.svg` or `.text`. If no content extension is provided, it defaults to `.http` which gives the action full control of the HTTP response.
{% endhint %}

### Example: SVG Response

1. Create a new function that has the SVG base64 encoded as the body

      ```javascript
      // The "svg" that is base64 encoded in the "body" param below:
      // <svg xmlns="http://www.w3.org/2000/svg" viewBox="-52 -53 100 100" stroke-width="2">
      //  <g fill="none">
      //   <ellipse stroke="#66899a" rx="6" ry="44"/>
      //   <ellipse stroke="#e1d85d" rx="6" ry="44" transform="rotate(-66)"/>
      //   <ellipse stroke="#80a3cf" rx="6" ry="44" transform="rotate(66)"/>
      //   <circle  stroke="#4b541f" r="44"/>
      //  </g>
      //  <g fill="#66899a" stroke="white">
      //   <circle fill="#80a3cf" r="13"/>
      //   <circle cy="-44" r="9"/>
      //   <circle cx="-40" cy="18" r="9"/>
      //   <circle cx="40" cy="18" r="9"/>
      //  </g>
      // </svg>
      function main() {
         return { headers: { 'Content-Type': 'image/svg+xml' },
            statusCode: 200,
            body: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii01MiAtNTMgMTAwIDEwMCIgc3Ryb2tlLXdpZHRoPSIyIj4NCiA8ZyBmaWxsPSJub25lIj4NCiAgPGVsbGlwc2Ugc3Ryb2tlPSIjNjY4OTlhIiByeD0iNiIgcnk9IjQ0Ii8+DQogIDxlbGxpcHNlIHN0cm9rZT0iI2UxZDg1ZCIgcng9IjYiIHJ5PSI0NCIgdHJhbnNmb3JtPSJyb3RhdGUoLTY2KSIvPg0KICA8ZWxsaXBzZSBzdHJva2U9IiM4MGEzY2YiIHJ4PSI2IiByeT0iNDQiIHRyYW5zZm9ybT0icm90YXRlKDY2KSIvPg0KICA8Y2lyY2xlICBzdHJva2U9IiM0YjU0MWYiIHI9IjQ0Ii8+DQogPC9nPg0KIDxnIGZpbGw9IiM2Njg5OWEiIHN0cm9rZT0id2hpdGUiPg0KICA8Y2lyY2xlIGZpbGw9IiM4MGEzY2YiIHI9IjEzIi8+DQogIDxjaXJjbGUgY3k9Ii00NCIgcj0iOSIvPg0KICA8Y2lyY2xlIGN4PSItNDAiIGN5PSIxOCIgcj0iOSIvPg0KICA8Y2lyY2xlIGN4PSI0MCIgY3k9IjE4IiByPSI5Ii8+DQogPC9nPg0KPC9zdmc+`
         };
      }
      ```

      ```bash
      ic fn action create atom atom.js --web true
      ```

      ```bash
      ok: updated action atom
      ```

2. Get the URL for the new atom web action

      ```bash
      ic fn action get atom --url
      ```

      ```bash
      ok: got action atom
      https://us-south.functions.cloud.ibm.com/api/v1/web/josephine.watson%40us.ibm.com_ns/default/atom
      ```

3. Copy and paste that URL into your browser to see the image!

      <!--
      #######################################################
      TODO: Figure out how to add width="20%" to SVG images.
      #######################################################
      -->
      ![atom.svg](atom.svg)
