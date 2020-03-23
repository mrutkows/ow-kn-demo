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

### Nested parameters

Parameter values can be any valid JSON value, including nested objects. Let's update our action to use child properties of the event parameters.

1. Create the `hello-person` action with the following source code.

    ```javascript
    function main(params) {
        return {payload:  'Hello, ' + params.person.name + ' from ' + params.person.place};
    }
    ```

    ```bash
    ic fn action create hello-person hello-person.js
    ```

    Now the action expects a single `person` parameter to have fields `name` and `place`.

2. Invoke the action with a single `person` parameter that is valid JSON.

   ```bash
   ic fn action invoke --result hello-person -p person '{"name": "Elrond", "place": "Rivendell"}'
   ```

   The result is the same because the CLI automatically parses the `person` parameter value into the structured object that the action now expects:

   ```json
   {
       "payload": "Hello, Elrond from Rivendell"
   }
   ```
