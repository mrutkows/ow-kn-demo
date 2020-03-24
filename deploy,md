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

## Example: Packages with NodeJS and Python (with params, sequences)

```bash
ibmcloud fn deploy -m manifest-example1.yaml
```

```yaml
packages:
    packageNodeJS:
        actions:
            helloNodejs-1:
                function: actions/hello.js
                runtime: nodejs:8
                inputs:
                    name:
                        type: string
                        description: name of a person
                    place:
                        type: string
                        description: location of a person
                outputs:
                    payload:
                        type: string
                        description: a simple greeting message, Hello World!
            helloNodejs-2:
                function: actions/hello.js
                runtime: nodejs:10
            helloNodejs-3:
                function: actions/hello.js
                runtime: nodejs:10
                inputs:
                    name:
                        type: string
                        description: name of a person
                    place:
                        type: string
                        description: location of a person
        sequences:
            helloworldnodejs-series:
                actions: helloNodejs-1, helloNodejs-2, helloNodejs-3 #, hellowhisk/greeting, hellowhisk/httpGet, myhelloworlds/hello-js
        triggers:
            triggerNodeJS1:
        rules:
            ruleNodeJS1:
                trigger: triggerNodeJS1
                action: helloworldnodejs-series
    packagePython:
        actions:
            helloPython-1:
                function: actions/hello.py
                runtime: python
                inputs:
                    name:
                        type: string
                        description: name of a person
                outputs:
                    payload:
                        type: string
                        description: a simple greeting message, Hello Henry!
            helloPython-2:
                function: actions/hello.py
                runtime: python
                inputs:
                    name:
                        type: string
                        description: name of a person
                outputs:
                    payload:
                        type: string
                        description: a simple greeting message, Hello Alex!
            helloPython-3:
                function: actions/hello.py
                runtime: python
        sequences:
            helloworldpython-series:
                actions: helloPython-1, helloPython-2, helloPython-3 #, hellowhisk/greeting, hellowhisk/httpGet, helloworlds/hello-js
        triggers:
            triggerPython:
        rules:
            rulePython:
                trigger: triggerPython
                action: helloworldpython-series
```

## Example: "Book Club" APIs

```bash
ibmcloud fn deploy -m manifest-exanple2.yaml
```

where `manifest.yaml` has contents:

```yaml
packages:
    api-gateway-test-with-params:
        version: 1.0
        license: Apache-2.0
        actions:
            getBooksWithISBN:
                function: src/get-books.js
            putBooksWithParams:
                function: src/put-books.js
            deleteBooksWithDuplicateParams:
                function: src/delete-books.js
        # new top-level key for defining groups of named APIs
        apis:
            book-club-with-params:
                club-with-params:
                    booksWithISBN/{isbn}:
                        getBooksWithISBN:
                            method: GET
                            response: http
                    booksWithParams/path/{params}/more/{params1}/:
                        putBooksWithParams:
                            method: PUT
                    booksWithDuplicateParams/path/{params}/more/{params}/:
                        deleteBooksWithDuplicateParams:
                            method: DELETE

```