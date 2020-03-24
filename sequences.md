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

# Action Sequences

IBM Cloud Functions supports a kind of action called a "sequence". Sequence actions are created using a list of existing actions. When the sequence action is invoked, each action in executed in order of the action parameter list. Input parameters are passed to the first action in the sequence. Output from each function in the sequence is passed as the input to the next function and so on. The output from the last action in the sequence is returned as the response result.

Let's look at an example of using sequences.

1. Create the file \(`funcs.js`\) with the following contents:

    ```javascript
    function split(params) {
      var text = params.text || ""
      var words = text.split(' ')
      return { words: words }
    }

    function reverse(params) {
      var words = params.words || []
      var reversed = words.map(word => word.split("").reverse().join(""))
      return { words: reversed }
    }

    function join(params) {
      var words = params.words || []
      var text = words.join(' ')
      return { text: text }
    }
    ```

2. Create the following three actions:

    ```bash
    ibmcloud fn action create split funcs.js --main split
    ```

    ```bash
    ibmcloud fn action create reverse funcs.js --main reverse
    ```

    ```bash
    ibmcloud fn action create join funcs.js --main join
    ```

## Creating sequence actions

### Now, let's see them all work together as an action sequence...

1. Create the following action sequence.

  ```bash
  ibmcloud fn action create reverse_words --sequence split,reverse,join
  ```

2. Test out the action sequence.

  ```bash
  ibmcloud fn action invoke reverse_words --result --param text "hello world"
  ```

  ```json
  {
      "text": "olleh dlrow"
  }
  ```

3. List the last few activations

  ```bash
  ibmcloud fn activation list -l 4
  ```
