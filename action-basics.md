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

1. Create a JavaScript file named 'hello.js' with these contents:

   ```javascript
   function main(params) {
       return {payload:  'Hello, ' + params.name + ' from ' + params.place};
   }
   ```

     _The JavaScript file might contain additional functions. However, by convention, a function called `main` is the default entry point for the action._

2. Create an action from the following JavaScript function. For this example, the action is called `hello`.

   ```bash
   ibmcloud fn action create hello hello.js
   ```

3. List the actions that you have created:

   ```bash
   ibmcloud fn action list
   ```

   ```text
   actions
   <NAMESPACE>/hello       private    nodejs10
   ```

   You can see the `hello` action you just created under your default NAMESPACE with implied access control provided by the platform.

### Takeaways

- **No special code** needed, developer just the codes their favorite language
  - **Convention**: "Main" entrypoint _assumed (can alias "main" to any function)_
- **No build step**: Runtimes for all supported languages already resident in "invoker" clusters for immediate function "injection".
- **NodeJS inferred** (latest runtime version); can explicitly set with `--kind` flag
- **Namespaced**: (default) installed into; allows underlying platform to apply **IAM access control** to any entity (Package, Action, Trigger, etc.)
- **Note**: _"update" action subcommand will update internal version of source code (allowing existing actions to complete with source code version in-flight)_

---

## Invoking Actions

You may `invoke` your action in one of two modes:

- **blocking** - which will _**wait**_ for the result \(i.e., request/response style\) by specifying the `blocking` flag on the command-line.
- **non-blocking** - which will invoke the action immediately, but _**not wait**_ for a response.

Regardless, invocations always provide an **Activation ID** which can be used later to lookup the action's response.

### Blocking Invocations

A blocking invocation request will _wait_ for the activation result to be available.

1. Invoke the `hello` action using the command-line as a blocking activation.

  ```bash
  ibmcloud fn action invoke --blocking hello
  ```

  ```bash
  ok: invoked /_/hello with id 4479...
  ```

  ```json
  ...
  "response": {
        "result": {
            "payload": "Hello, undefined from undefined"
        },
        "size": 45,
        "status": "success",
        "success": true
    },
    ...
  ```

  ### Notes

  - The wait period is the lesser of 60 seconds or the action's configured [time limit](https://github.com/apache/incubator-openwhisk/blob/master/docs/reference.md#per-action-timeout-ms-default-60s).

  - The **Activation ID** can always be used later to lookup the response.

## Non-blocking invocations (Async)

A non-blocking invocation will invoke the action immediately, but _not wait_ for a response.

If you don't need the action result right away, you can omit the `--blocking` flag to make a non-blocking invocation. You can get the result later by using the **Activation ID**.

1. Invoke the `hello` Action using the command-line as a non-blocking activation.

   ```bash
   ibmcloud fn action invoke hello
   ```

   ```bash
   ok: invoked /_/hello with id 6bf1f670ee614a7eb5af3c9fde813043
   ```

2. Retrieve the activation result

   ```bash
   ibmcloud fn activation result 6bf1...
   ```

   ```json
   {
       "payload": "Hello, undefined from undefined"
   }
   ```

3. Alternatively, retrieve the `--last` or `-l` activation result

  ```bash
  ibmcloud fn activation result --last
  ```

  ```json
  {
      "payload": "Hello, undefined from undefined"
  }
  ```

4. Retrieve the full activation record

  ```bash
  ibmcloud fn activation get 6bf1..
  ```

  ```json
  ok: got activation 6bf1..
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

5. Retrieve activation list

```bash
ibmcloud fn activation list -l 2
```

```bash
Datetime   Activation ID  Kind      Start Duration Status  Entity
y:m:d:hm:s 44794bd6...    nodejs:10 cold  34s      success <NAMESPACE>/hello:0.0.1
y:m:d:hm:s 6bf1f670...    nodejs:10 warm  2ms      success <NAMESPACE>/hello:0.0.1
```

### Takeaways

- Actions can be invoked directly using CLI
  - asynchronously: by default
  - synchronously: `--block` flag
- System tracks each action invocation with as an "Activation" (record)
  - _Lots of information about execution time/params, etc._

---

## Passing Action Parameters

Event parameters can be passed to the action when it is invoked. Let's look at a sample action which uses the parameters to calculate the return values.

### From command line using the `--param` flag

1. Invoke the `hello` action using explicit command-line parameters using the `--param` flag.

    ```bash
    ibmcloud fn action invoke --result hello --param name Elrond --param place Rivendell
    ```

    or using the `-p` short form:

    ```bash
    ibmcloud fn action invoke --result hello -p name Elrond -p place Rivendell
    ```

    ```json
    {
        "payload": "Hello, Elrond from Rivendell"
    }
    ```

{% hint style="info" %}
**Note** We used the `--result` option above. It implies a `blocking` invocation where the CLI waits for the activation to complete and then displays only the function's output as the `payload` value.
{% endhint %}

### From parameter file using the `--param-file` flag

2. Create a file named `parameters.json` containing the following JSON.

    ```json
    {
        "name": "Frodo",
        "place": "the Shire"
    }
    ```

3. Invoke the `hello` action using parameters from a JSON file.

    ```bash
    ibmcloud fn action invoke --result hello --param-file parameters.json -p name Bilbo
    ```

    ```json
    {
        "payload": "Hello, Bilbo from the Shire"
    }
    ```

---

## "Binding" parameter defaults to Action

Rather than pass all the parameters to an action every time, you can bind default parameters. Default parameters are stored in the platform and automatically passed in during each invocation.

Let's use the `hello` action from our previous example and bind a default value for the `place` parameter.

### From command line using `--param`

Update the action by using the `--param` option to bind default parameter values.

```bash
ibmcloud fn action update hello --param place Rivendell
```

### From parameter file using `--param-file`

Passing parameters from a file requires the creation of a file containing the desired content in JSON format. The filename must then be passed to the `--param-file` flag:

### Example: parameter file `parameters2.json`:

```json
{
    "place": "Rivendell"
}
```

```bash
ibmcloud fn action update hello --param-file parameters2.json
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

- _Notice that you did not need to specify the place parameter when you invoked the action._

{% hint style="info" %}
Bound parameters can still be overwritten by specifying the parameter value at invocation time.
{% endhint %}

### Command Line overrides defaults (binding values)

Invoke the action, passing both `name` and `place` values. The latter overwrites the value that is bound to the action.

```bash
ibmcloud fn action invoke --result hello --param name Elrond --param place "the Lonely Mountain"
```

```json
{
    "payload": "Hello, Elrond from the Lonely Mountain"
}
```

---

## Actions calling other Actions

### Proxy example

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

2. Invoke the proxy with an incorrect password.

    ```bash
    ibmcloud fn action invoke proxy -p password wrong -r
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
    ibmcloud fn action invoke proxy -p password secret -p name Bernie -p place Vermont -r
    ```

    ```json
    {
        "greeting": "Hello Bernie from Vermont"
    }
    ```

4. Review the activations list to show both actions were invoked.

   ```bash
   ibmcloud fn activation list -l 2
   ```

    ```text
    Activation ID                    Kind      Start Duration   Status  Entity
    8387302c81dc4d2d87302c81dc4d2dc6 nodejs:10 cold  35ms       success hello:0.0.4
    e0c603c242c646978603c242c6c6977f nodejs:10 cold  438ms      success proxy:0.0.1
    ```

{% hint style="tip" %}
**Tip** On the invoke call above, we used the short form for the `-l` with a parameter to only `list` the `last 2` activations.
{% endhint %}

{% hint style="info" %}
**Note** The `Start` values for each indicate if each Action was "cold" (slower, function reloaded) or "warm" (already loaded) started.
{% endhint %}

{% hint style="info" %}
### Takeaways

- Platform functions simplified:
  - Simple import of NPM package (NodeJS developer familiar)
    - [NPM Apache OpenWhisk](https://www.npmjs.com/package/openwhisk) JavaScript library
  - Actions call other actions
{% endhint %}
