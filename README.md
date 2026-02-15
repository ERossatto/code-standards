# About the Show Case

A company is selling packages - Basic, Plus, and Premium. The price for each package is updated regularly and a pricing log is kept for all packages. 
The company is doing well and the feature requests are pouring in! Help us by implementing the following two feature requests made by our coworkers.

## Feature request 1: Municipalities
Segmenting package prices based on the municipality the package is sold in. In other words, a package should be able to have different prices depending on a municipality.

## Feature request 2: Pricing history
Simple way to fetch pricing history, given a package, a year and optionally a municipality.

## About the existing tests

![test passing](./imgs/tests-print.jpeg)

# Concepts used in this show case

## Domain-Driven Design (DDD)

I did all the domain modelling of this show-case, using domain-driven design.

I remember I started with Package being the aggregate, but then some cross dependencies were happening, as the package knowing about its price but price also knowing about the package.

At the beginning as well, price was a value-object but then I started to challenge it and try different approaches to check how the implementation of the services would look like then (if it was getting way too complex then I was looking back).

I also remember at first I did just a Package entity with a type (Basic, Plus, Premium), but I was not happy with this because these packages are the first thing discussed in the assignment so I want to make them more visible in the domain layer. I was also in doubt whether they should be a value-object or an entity.

## Clean Architecture

I did a folder structure to follow the simple clean-architecture in the picture.
Normally I would not suffix the layers with the word "layer". But I did for quick review understanding 😃

### Layers

- presentation layer
- application layer
- domain layer
- infrastructure layer

With this layering the goal was to keep everything related to the Express framework in the **presentation layer**.
Every request and response communication concern between server and client will be taken care of in this layer.
As well as error-handling (to split context of server errors to client errors), authorization and permissions.

So all the use case logic handling will be at **application layer**.
This layer works as an orchestrator between the other layers here.
It is aware of the domain layer (more internal layer)
But it is not aware of the infrastructure layer and presentation layer (more external layer).

The **domain layer** is the heart of the application.
There all the core business logic of the application sits.
This layer does not know about other layers.
It is totally agnostic to frameworks, databases, etc

Then to finish we have the **infrastructure layer**
This layer is responsible for persistence of data.
Would be responsible as well to connect with external APIs (if it was the case)
And every other necessity of "infrastructure" needed

### Dependency Inversion

One particularity I bring from clean architecture as well is the inversion of the dependencies.
What does that mean?
If you go to domain services or application services, you will see the constructors of it always depend on interfaces instead of real implementations.
It creates a decoupling...

So my constructors ask for ports (interfaces), and the outer layers pick the adapters (actual implementations).
The win is simple: I can swap SQLite for something else, or plug in test doubles, without touching the domain or application logic.
It also keeps the domain pure (no ORM types sneaking in), and all the wiring would live at the edges (controllers).
In short: fewer surprises, easier testing, and freedom to change infra later without a big refactor.

![simplified clean architecture](./imgs/clean_architecture.png)

## SOLID

Let me exemplify how I used SOLID principles in the domain and application layers 😌:

- **Single Responsibility (S):** Domain entities/value-objects encapsulate their own rules and state transitions (e.g., `municipality.entity.ts` only manages municipality invariants and updates; value objects like `value-cents.value-object.ts` validate and compare monetary amounts). Application/domain services orchestrate use cases without leaking infra (`price.domain-service.ts`, `package.domain-service.ts`).

- **Open/Closed (O):** domain depends on repository interfaces (`domain-layer/repositories/*.ts`), allowing new persistence implementations under `infrastructure-layer/**/repositories` without changing domain code. Package variants are modeled via separate classes (`Basic/Plus/Premium`), so adding a new variant extends behavior with minimal impact.

- **Liskov Substitution (L):** `BasicPackage`, `PlusPackage`, and `PremiumPackage` extend `AbstractPackage` and can be used wherever an `AbstractPackage` is expected (e.g., `Price.package: AbstractPackage`, repository returns `AbstractPackage`).

- **Interface Segregation (I):** small, focused interfaces (`IPriceRepository`, `IPackageRepository`, `IMunicipalityRepository`) expose only the methods each service needs, avoiding fat interfaces.

- **Dependency Inversion (D):** services depend on abstractions, not concretions (e.g., `PriceDomainService` constructor takes `IPriceRepository`, `IPackageRepository`, `IMunicipalityRepository`), while concrete implementations live in infrastructure (`infrastructure-layer/db-sqlite-sequelize/repositories`).
