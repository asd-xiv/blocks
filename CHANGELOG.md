<!-- markdownlint-disable no-duplicate-header line-length -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.4] - 7 February 2019

### Change

- JSON stringify based on route response type 

## [0.5.3] - 7 February 2019

### Change

- Move tracking in `goodbye` middleware to also catch error responses

## [0.5.2] - 7 February 2019

### Change

- Make Prometheus tracking optional

## [0.5.1] - 5 February 2019

### Change

- `/metrics` has no schema restrictions on headers

## [0.5] - 31 January 2019

### Add

- Add Prometheus metrics support via `/metrics` 

## [0.4.3] - 15 January 2019

### Change

- Update packages

## [0.4.2] - 6 December 2018

### Change

- Fix bug where CORS middlware was not loaded properly
- Fix bug where having a single error middleware and an error happen the response would not get setup as json

## [0.4.1] - 28 November 2018

### Change

- Pass the error object to the next middleware

## [0.4.0] - 28 November 2018

### Add

- Allow setting middleware after an error occurs

## [0.3.1] - 27 November 2018

### Change

- Allow custom properties on routes

## [0.3.0] - 23 November 2018

### Change

- Add debug message when adding a route
- Update pluginus, send settings as seed to plugin create

## [0.2.0] - 18 November 2018

### Add

- Add basic [`tests`](/src/index.test.js)

### Change

- Enable CORS middleware only if CORS_ORIGIN is not null
- Expose Base, Auth, Input and NotFound errors

## [0.1.0] - 15 November 2018

First

[Unreleased]: https://github.com/leeruniek/blocks/compare/v0.5.4...HEAD

[0.5.4]: https://github.com/leeruniek/blocks/compare/v0.5.3...v0.5.4
[0.5.3]: https://github.com/leeruniek/blocks/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/leeruniek/blocks/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/leeruniek/blocks/compare/v0.5.0...v0.5.1
[0.5]: https://github.com/leeruniek/blocks/compare/v0.4.3...v0.5
[0.4.3]: https://github.com/leeruniek/blocks/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/leeruniek/blocks/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/leeruniek/blocks/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/leeruniek/blocks/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/leeruniek/blocks/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/leeruniek/blocks/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/leeruniek/blocks/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/leeruniek/blocks/compare/v0.1.0
