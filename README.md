# OpenWhisk - Knative Functions WG demo


## Last week's demo (Lionel)

- Lionel did a great job showing some of the basic concepts using Kube/Knative providing basic OW features and runtime proxy approach
   - Invisible proxy (Docker layer) in runtime to simplify/normalize functonality to functions
      - Mostly **platform agnostic** no added code needed" approach
      - **paramater passing**
      - **parameter binding**
    - **CRD** that acts as a _basic "controller"_ to simplify Kube/knative interactions from CLI)
      - _Config mgmt., binding configs to params for function_
      - _Launch knative services "ksvc"_
    - **Compositions** (supported by backend state) were important
      - Fundamentally, agreed to Dr. Max's "tree/branching" use case, but more

---

## OpenWhisk Approach

### Developer-centric

- Everything we do is for **Developer simplicity**

  - Developer only codes functions in their chosen language
     - _No directives | pragmas | annotations_
     - Utilize normal language module/package imports
        - May provide platform callbacks/intrinsic functionality (as functions)
  - Developer has NO knowledge of
     - OS
     - Platform (implementation)
        - _Kube | knative | Pfirecracker, etc._
     - (Micro)Service Framework


### Reactive / Event driven (it's all about an eventing framework that scales as fast as possible)

   - Observer pattern reflected
   - Reactive (as expected by microservices assumed to migrate over)
      - moving "up the stack" for the developer... no more Pflask... etc.
      - Cold start reduction is paramount!
   - Event format agnostic
      - Cannot force everyone to single event format; either impractical to change
        - cannot suffer performance (transforms)...
        - functions are often coupled with specific data (e.g., from IoT sensor events or data sets), e.g.,
        NASA PIXL, raw NoSQL data, analytics models, genetic model data)
            - [NASA Rover PIXL](https://mars.nasa.gov/mars2020/spacecraft/instruments/pixl/)
      - Simplified HTTP / Web accessible without APIs
        - _functions creating/modifying/serving web content-type data_
   - Edge accessible
      - IoT events (network response time sensitve)

## Driven by Serverless Use Cases

   - Informed by experience of OW and production usage for ~4 years

### Key Use Cases and Takeaways

   - Alarm | bartch
   - ETL
   - API
        - OpenAPI, Security, Rate limiting pushed to edge,
        - easily interfaced with host IAM systems
   - Massively parallel (time/cost of additive cold start compute times considerations)

## Other features not covered:

- Using Functions (and Alarms) to create Event providers / Feeds
- Compositions
- Binding packages (aliasing) so you can bind params
- OpenAPI
- YAML - deploy
- Binding your own "secure key" token without OpenAPI spec.



