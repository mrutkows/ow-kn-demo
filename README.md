# OpenWhisk - Knative Functions WG demo

- Lionel did a great job showing some of the basic OW concepts last week
   - Invisible proxy (Docker layer) in runtime to simplify/normalize functonality to functions
      - "no added code needed" approach
      - paramater passing
      - parameter binding
      -
      - CRD that acts as a basic "controller" to help with these things (i.e., simplify Kube/knative interactions from CLI)
        - Config mgmt., binding configs to params for function
        -
    - Key OW diff. (discuss implications later)
      - Function signature not sumple args... assumed event always there
        - meaning functions are bound to single event type
        - functions are bound to any event format...
    - Fundamentally, agreed to Dr. Max's "tree" use case
      - but also said Compostions (supported by backend state) were important

## OpenWhisk Approach

### Developer-centric

- Everything we do is **Developer simplicity**

  - Developer only codes functions in their chosen language
     - _No directives | pragmas | annotations_
     - Utilize normal language module/package imports
        - May provide platform callbacks/intrinsic functionality (as functions)
  - Developer has NO knowledge of
     - OS
     - Platform (implementation)
        - _Kube | knative | Pfirecracker, etc._
     - Service Framework


### Reactive Event driven (it's all about an eventing framework that scales as fast as possible)

   - Observer pattern reflected
   - Reactive (as expected by microservices assumed to migrate over)
      - Cold start reduction is paramount
   - Event agnostic
      - Cannot force everyone to single event format; either impractical
        - performance... functions coupled with event formats (e.g., from IoT devices or data sets), e.g., (NASA PIXL, raw NoSQL data, analytics models, genetic model data)
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
- Binding packages (aliasing) so you can bind params
- OpenAPI



