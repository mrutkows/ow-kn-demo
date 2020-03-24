# Using Existing Packages

## Browsing public packages

IBM Cloud Functions comes pre-installed with a number of public packages, which include trigger feeds used to register triggers with event sources.

Actions in public packages can be used by anyone, the caller pays the invocation cost.

Using `ibmcloud fn` CLI you can get a list of packages in a namespace, list the entities in a package and get a description of the entities within a package.

1. Get a list of packages in the `/whisk.system` namespace.

   ```bash
   ibmcloud fn package list /whisk.system
   ```

   ```text
   packages
   /whisk.system/alarms                      shared
   /whisk.system/cloudant                    shared
   /whisk.system/combinators                 shared
   /whisk.system/cos                         shared
   /whisk.system/github                      shared
   /whisk.system/messaging                   shared
   /whisk.system/pushnotifications           shared
   /whisk.system/samples                     shared
   /whisk.system/slack                       shared
   /whisk.system/utils                       shared
   /whisk.system/watson-speechToText         shared
   /whisk.system/watson-textToSpeech         shared
   /whisk.system/watson-translator           shared
   /whisk.system/weather                     shared
   /whisk.system/websocket                   shared
   ```
 {% hint style="info" %}
 **Some _Packages_ have _Actions_ that are also _Feeds_**, that is they implement the Feed interface and know how to manage (connect) to external services that are event sources.
 {% endhint %}

2. Get a list of entities in the `/whisk.system/cloudant` package.

   ```bash
   ibmcloud fn package get --summary /whisk.system/cloudant
   ```

   ```bash
   package /whisk.system/cloudant: Cloudant database service
      (parameters: *apihost, *bluemixServiceName, *dbname, *host, overwrite, *password, *username)
   action /whisk.system/cloudant/read: Read document from database
      (parameters: dbname, id, params)
   action /whisk.system/cloudant/write: Write document in database
      (parameters: dbname, doc)
      ...
   feed /whisk.system/cloudant/changes: Database change feed
      (parameters: dbname, filter, query_params)
   ```

   This output shows that the Cloudant package provides many actions including `read` and `write`, and a trigger feed called `changes`. The `changes` feed causes triggers to be fired when documents are added to the specified Cloudant database.

   The Cloudant package also defines the parameters `username`, `password`, `host`, and `dbname`. These parameters must be specified for the actions and feeds to be meaningful. The parameters allow the actions to operate on a specific Cloudant account.

{% hint style="info" %}
**Note:**
* Parameters listed under the package with a prefix `'*'` are **predefined, bound parameters**.
* Parameters without a `'*'` are those listed under the annotations for each entity.
* Furthermore, any parameters with the prefix `'**'` are **finalized bound parameters**. This means that they are immutable, and cannot be changed by the user.
{% endhint %}

## Invoking actions in a package

You can invoke actions in a package, just as with other actions. The next few steps show how to invoke the `greeting` action in the `/whisk.system/samples` package with different parameters.

1. Invoke the greeting action without any parameters.

   ```bash
   ibmcloud fn action invoke --result /whisk.system/samples/greeting
   ```

   ```text
   {
       "payload": "Hello, stranger from somewhere!"
   }
   ```

3. Invoke the action with parameters.

   ```bash
   ibmcloud fn action invoke --result /whisk.system/samples/greeting --param name Arya --param place Winterfell
   ```

   ```text
   {
       "payload": "Hello, Arya from Winterfell!"
   }
   ```

   Notice that the output uses the `name` and `place` parameters that were passed to the action.

## Creating and using package bindings

Although you can use the entities in a package directly, you might find yourself passing the same parameters to the action every time. You can avoid this by binding to a package and specifying default parameters. These parameters are inherited by the actions in the package.

1. Bind to the `/whisk.system/samples` package and set a default `payload` parameter value.

   ```text
   ibmcloud fn package bind /whisk.system/samples mySamples --param payload "The quick brown fox"
   ```

   ```text
   ok: created binding mySamples
   ```

2. Get a description of the package binding.

   ```text
   ibmcloud fn package get --summary mySamples
   ```

   ```text
   package /namespace/mySamples: Returns a result based on parameter place
      (parameters: *place)
    action /namespace/mySamples/helloWorld: Demonstrates logging facilities
       (parameters: payload)
    action /namespace/mySamples/greeting: Returns a friendly greeting
       (parameters: name, place)
    action /namespace/mySamples/curl: Curl a host url
       (parameters: payload)
    action /namespace/mySamples/wordCount: Count words in a string
       (parameters: payload)
   ```

   Notice that all the actions in the `/whisk.system/samples` package are available in the `mySamples` package binding.

3. Invoke an action in the package binding

   ```text
   ibmcloud fn action invoke --result mySamples/wordCount
   ```

   ```text
   {
       "count": 4
   }
   ```

4. Invoke an action and overwrite the default parameter value.

   ```text
   ibmcloud fn action invoke --result mySamples/wordCount --param payload "Picks up the rice in the church where a wedding has been"
   ```

   ```text
   {
      "count": 12
   }
   ```

## Sharing packages

Make the package public...

1. Share the package with all users:

   ```bash
   ibmcloud fn package update custom --shared yes
   ```

{% hint style="info" %}
Others can now use your `custom` package, including binding to the package or directly invoking an action in it. Other users must know the fully qualified names of the package to bind it or invoke actions in it. Actions and feeds within a shared package are _public_. If the package is private, then all of its contents are also private.
{% endhint %}
