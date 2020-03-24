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

# Creating Packages

## Creating new custom packages

Custom packages can be used to group your own actions, manage default parameters and share entities with other users.

Let's demonstrate how to do this now using the `ic fn` CLI tool…

1. Create a package called "custom".

   ```bash
   ic fn package create custom
   ```

   ```text
   ok: created package custom
   ```

2. Get a summary of the package.

   ```bash
   ic fn package get --summary custom
   ```

   ```text
   package /myNamespace/custom
      (parameters: none defined)
   ```

   Notice that the package is empty.

3. Create a file called `identity.js` that contains the following action code. This action returns all input parameters.

   ```javascript
   function main(args) { return args; }
   ```

4. Create an `identity` action in the `custom` package.

   ```bash
   ic fn action create custom/identity identity.js
   ```

   ```text
   ok: created action custom/identity
   ```

   Creating an action in a package requires that you prefix the action name with a package name.

5. Get a summary of the package again.

   ```bash
   ic fn package get --summary custom
   ```

   ```text
   package /myNamespace/custom
      (parameters: none defined)
   action /myNamespace/custom/identity
      (parameters: none defined)
   ```

   You can see the `custom/identity` action in your namespace now.

6. Invoke the action in the package.

   ```bash
   ic fn action invoke --result custom/identity
   ```

   ```text
   {}
   ```

## Setting default package parameters

You can set default parameters for all the entities in a package. You do this by setting package-level parameters that are inherited by all actions in the package.

To see how this works, try the following example:

1. Update the `custom` package with two parameters: `city` and `country`.

   ```bash
   ic fn package update custom --param city Austin --param country USA
   ```

   ```text
   ok: updated package custom
   ```

2. Display the parameters in the package.


   ```bash
   ic fn package get custom
   ```

   ```json
   ok: got package custom
   ...
   "parameters": [
      {
          "key": "city",
          "value": "Austin"
      },
      {
          "key": "country",
          "value": "USA"
      }
   ]
   ...
   ```

3. Observe how the `identity` action in the package inherits these parameters from the package.

   ```bash
   ic fn action get custom/identity
   ```

   ```json
   ok: got action custom/identity
   ...
   "parameters": [
      {
          "key": "city",
          "value": "Austin"
      },
      {
          "key": "country",
          "value": "USA"
      }
   ]
   ...
   ```

3. Invoke the identity action without any parameters to verify that the action indeed inherits the parameters.

   ```bash
   ic fn action invoke --result custom/identity
   ```

   ```json
   {
      "city": "Austin",
      "country": "USA"
   }
   ```

4. Invoke the identity action with some parameters.

   ```bash
   ic fn action invoke --result custom/identity --param city Dallas --param state Texas
   ```

   ```json
   {
      "city": "Dallas",
      "country": "USA",
      "state": "Texas"
   }
   ```