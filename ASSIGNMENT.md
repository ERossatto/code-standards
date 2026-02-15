# Coding Assignment

A company ‘MediaNow’ is selling packages - Basic, Plus, and Premium. The price for each package is updated regularly and a pricing log is kept for all packages. The company is doing well and the feature requests are pouring in! Help us by implementing the following two feature requests made by our coworkers.

## Feature request 1: Municipalities
The company pricing expert wants to start segmenting our package prices based on the municipality the package is sold in. In other words, a package should be able to have different prices depending on a municipality. The current code doesn't really support this well (on purpose) and some structural changes are needed. We still want to have our pricing log, but now with the added municipalities.

Look into the pending test in `tests/services/package.spec.ts` for guidance and make all the tests pass.

## Feature request 2: Pricing history
An accounting department needs information on price changes that happened for the package basic in 2023. This kind of request will happen frequently, so we need a simple way to fetch pricing history, given a package, a year and optionally a municipality.

Look into the pending tests in `tests/services/price.spec.ts` for guidance and make all the tests pass.
