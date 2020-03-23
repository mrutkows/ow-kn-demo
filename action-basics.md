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

# Creating and Invoking Actions

## Creating Actions - Helloworld

1. Create a JavaScript file with named 'hello.js' with these contents:

   ```javascript
   function main(params) {
       return {payload:  'Hello, ' + params.name + ' from ' + params.place};
   }
   ```

   - _The JavaScript file might contain additional functions. However, by convention, a function called `main` is the default entry point for the action._

2. Create an action from the following JavaScript function. For this example, the action is called `hello`.

   ```bash
   ic fn action create hello ~/hello.js
   ```

3. List the actions that you have created:

   ```bash
   ic fn action list
   ```

   ```text
   actions
   <NAMESPACE>/hello       private    nodejs10
   ```

   You can see the `hello` action you just created under your default NAMESPACE with implied access control provided by the platform.

### Takeaways

- No special code needed, just the language
  - **Convention**: "Main" entrypoint assumed_
- No build step
- NodeJS (latest) runtime inferred
- Namespaced: (default) installed into; allows underlying platform to apply IAM access control to

## Invoking Actions

After you create your action, you can run it on IBM Cloud Functions with the `invoke` command using one of two modes:

- **blocking** - which will _**wait**_ for the result \(i.e., request/response style\) by specifying the `blocking` flag on the command-line.
- **non-blocking** - which will invoke the action immediately, but _**not wait**_ for a response.

Regardless, invocations always provide an **Activation ID** which can be used later to lookup the action's response.

### Blocking Invocations

A blocking invocation request will _wait_ for the activation result to be available.

The wait period is the lesser of 60 seconds or the action's configured [time limit](https://github.com/apache/incubator-openwhisk/blob/master/docs/reference.md#per-action-timeout-ms-default-60s).

1. Invoke the `hello` action using the command-line as a blocking activation.

  ```bash
  ic fn action invoke --blocking hello
  ```

  ```bash
  ok: invoked /_/hello with id 44794bd6aab74415b4e42a308d880e5b
  ```

  ```json
  ...
  "response": {
        "result": {
            "payload": "Hello, undefined from undefined"
        },
        "size": 25,
        "status": "success",
        "success": true
    },
    ...
  ```
  The **Activation ID** (`44794bd6aab74415b4e42a308d880e5b`) which can always be used later to lookup the response:

### Non-blocking invocations

A non-blocking invocation will invoke the action immediately, but _not wait_ for a response.

If you don't need the action result right away, you can omit the `--blocking` flag to make a non-blocking invocation. You can get the result later by using the **Activation ID**.

1. Invoke the `hello` Action using the command-line as a non-blocking activation.

   ```bash
   ic fn action invoke hello
   ```

   ```bash
   ok: invoked /_/hello with id 6bf1f670ee614a7eb5af3c9fde813043
   ```

2. Retrieve the activation result

   ```bash
   ic fn activation result 6bf1f670ee614a7eb5af3c9fde81304
   ```

   ```json
   {
       "payload": "Hello, undefined from undefined"
   }
   ```

3. Alternatively, retrieve the `--last` or `-l` activation result

  ```bash
  ic fn activation result --last
  ```

  ```json
  {
      "payload": "Hello, undefined from undefined"
  }
  ```

## Retrieve the full activation record

  1. To get the complete activation record use the `activation get` command:

  ```bash
  ic fn activation get 6bf1f670ee614a7eb5af3c9fde813043
  ```

  ```json
  ok: got activation 6bf1f670ee614a7eb5af3c9fde813043
  {
    ...
    "response": {
        "result": {
            "payload": "Hello world"
        },
        "size": 25,
        "status": "success",
        "success": true
    },
    ...
  }
  ```

## Retrieve activation list

```bash
ic fn activation list
```

```bash
Datetime   Activation ID  Kind      Start Duration Status  Entity
y:m:d:hm:s 44794bd6...    nodejs:10 cold  34s      success <NAMESPACE>/hello:0.0.1
y:m:d:hm:s 6bf1f670...    nodejs:10 warm  2ms      success <NAMESPACE>/hello:0.0.1
```

## Takeaways

- System tracks each invokaction as an "Activation"

# Using Action Parameters

Event parameters can be passed to the action when it is invoked. Let's look at a sample action which uses the parameters to calculate the return values.

## Passing parameters to an action

1. Update the file `hello.js` with the following following content:

   ```javascript
   function main(params) {
       return {payload:  'Hello, ' + params.name + ' from ' + params.place};
   }
   ```

   The input parameters are passed as a JSON object parameter to the `main` function. Notice how the `name` and `place` parameters are retrieved from the `params` object in this example.

2. Update the `hello` action with the new source code.

   ```bash
   ic fn action update hello hello.js
   ```

## Invoking action with parameters

When invoking actions through the command-line, parameter values can be passed as through explicit command-line parameters `—param` flag, the shorter `-p` flag or using an input file containing raw JSON.

1. Invoke the `hello` action using explicit command-line parameters using the `--param` flag.

    ```bash
    ic fn action invoke --result hello --param name Elrond --param place Rivendell
    ```

    or using the `-p` short form:

    ```bash
    ic fn action invoke --result hello -p name Elrond -p place Rivendell
    ```

    ```json
    {
        "payload": "Hello, Elrond from Rivendell"
    }
    ```

{% hint style="info" %}
**Note** We used the `--result` option above. It implies a `blocking` invocation where the CLI waits for the activation to complete and then displays only the function's output as the `payload` value.
{% endhint %}

2. Create a file named `parameters.json` containing the following JSON.

    ```json
    {
        "name": "Frodo",
        "place": "the Shire"
    }
    ```

3. Invoke the `hello` action using parameters from a JSON file.

    ```bash
    ibmcloud fn action invoke --result hello --param-file parameters.json
    ```

    ```json
    {
        "payload": "Hello, Frodo from the Shire"
    }
    ```

### Nested parameters

Parameter values can be any valid JSON value, including nested objects. Let's update our action to use child properties of the event parameters.

1. Create the `hello-person` action with the following source code.

    ```javascript
    function main(params) {
        return {payload:  'Hello, ' + params.person.name + ' from ' + params.person.place};
    }
    ```

    ```bash
    ibmcloud fn action create hello-person hello-person.js
    ```

    Now the action expects a single `person` parameter to have fields `name` and `place`.

2. Invoke the action with a single `person` parameter that is valid JSON.

   ```bash
   ibmcloud fn action invoke --result hello-person -p person '{"name": "Elrond", "place": "Rivendell"}'
   ```

   The result is the same because the CLI automatically parses the `person` parameter value into the structured object that the action now expects:

   ```json
   {
       "payload": "Hello, Elrond from Rivendell"
   }
   ```

## Setting default parameters

Actions can be invoked with multiple named parameters. Recall that the `hello` action from the previous example expects two parameters: the _name_ of a person, and the _place_ where they're from.

Rather than pass all the parameters to an action every time, you can bind default parameters. Default parameters are stored in the platform and automatically passed in during each invocation. If the invocation includes the same event parameter, this will overwrite the default parameter value.

Let's use the `hello` action from our previous example and bind a default value for the `place` parameter.

### From command line

Update the action by using the `--param` option to bind default parameter values.

```bash
ic fn action update hello --param place Rivendell
```

Passing parameters from a file requires the creation of a file containing the desired content in JSON format. The filename must then be passed to the `--param-file` flag:

Example parameter file called parameters.json:

```json
{
    "place": "Rivendell"
}
```

### From parameter file

```bash
ibmcloud fn action update hello --param-file parameters.json
```

Invoke the action, passing only the `name` parameter this time.

```bash
ibmcloud fn action invoke --result hello --param name Elrond
```

```json
{
    "payload": "Hello, Elrond from Rivendell"
}
```

Notice that you did not need to specify the place parameter when you invoked the action. Bound parameters can still be overwritten by specifying the parameter value at invocation time.

Invoke the action, passing both `name` and `place` values. The latter overwrites the value that is bound to the action.

```bash
ibmcloud fn action invoke --result hello --param name Elrond --param place "the Lonely Mountain"
```

```json
{
    "payload": "Hello, Elrond from the Lonely Mountain"
}
```

## Proxy example

Let's look an example of creating a "proxy" action which invokes another action _(i.e, our `hello` action)_ if a "password" is present in the input parameters.

1. Create the following new action named `proxy` from the following source files.

    ```javascript
    var openwhisk = require('openwhisk');

    function main(params) {
        if (params.password !== 'secret') {
        throw new Error("Password incorrect!")
        }

        var ow = openwhisk();
        return ow.actions.invoke({name: "hello", blocking: true, result: true, params: params})
    }
    ```

    ```bash
    ibmcloud fn action create proxy proxy.js
    ```

{% hint style="info" %}
**Note** The function uses the [NPM Apache OpenWhisk](https://www.npmjs.com/package/openwhisk) JavaScript library which is pre-installed in the IBM Cloud Functions runtime (so you do not need to package it). _Its source code can be found here:_ [https://github.com/apache/openwhisk-client-js/](https://github.com/apache/openwhisk-client-js/).
{% endhint %}

2. Invoke the proxy with an incorrect password.

    ```bash
    ic fn action invoke proxy -p password wrong -r
    ```

    ```json
    {
        "error": "An error has occurred: Error: Password incorrect!"
    }
    ```

{% hint style="tip" %}
**Note** On the invoke call above, we used the short form for the `--result` flag which is `-r`.
{% endhint %}

3. Invoke the proxy with the correct password.

    ```bash
    ic fn action invoke proxy -p password secret -p name Bernie -p place Vermont -r
    ```

    ```json
    {
        "greeting": "Hello Bernie from Vermont"
    }
    ```

4. Review the activations list to show both actions were invoked.

   ```bash
   ic fn activation list -l 2
   ```

    ```text
    Activation ID                    Kind      Start Duration   Status  Entity
    8387302c81dc4d2d87302c81dc4d2dc6 nodejs:10 cold  35ms       success hello:0.0.4
    e0c603c242c646978603c242c6c6977f nodejs:10 cold  438ms      success proxy:0.0.1
    ```

### Takeaways

- Platform functions simplified:
  - Simple import of NPM package (NodeJS developer familiar)

{% hint style="tip" %}
**Note** On the invoke call above, we used the short form for the `--last` flag which is `-l` with a parameter to only `list` the last `2` activations.
{% endhint %}

