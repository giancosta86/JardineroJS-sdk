# JardineroJS - SDK

_TypeScript kit for creating JardineroJS linguistic plugins_

![GitHub CI](https://github.com/giancosta86/JardineroJS-sdk/actions/workflows/publish-to-npm.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@giancosta86%2Fjardinero-sdk.svg)](https://badge.fury.io/js/@giancosta86%2Fjardinero-sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

![Overview](./docs/diagrams/overview.png)

**JardineroJS - SDK** is the _TypeScript_ library enabling developers to create plugins for [JardineroJS](https://github.com/giancosta86/JardineroJS) - the **NodeJS** implementation of the _web architecture_ devoted to _linguistic analysis_.

Basically speaking, a plugin is a concrete subclass of `LinguisticPlugin`, providing JardineroJS with:

- a **unique id** - used, for example, to allocate _a dedicated SQLite database_ for each plugin

- instructions related to the process of _dictionary creation_:

  - the _DDL code_ to set up the **SQLite schema**

  - the chain of **source streams** - that will be parsed to _extract source pages_

  - the chain of **transform streams** to _extract data_ - especially **terms** - _from each page_

  - the `SqliteWritableBuilder` - from the [sqlite-writable](https://github.com/giancosta86/sqlite-writable) library - used to create the `Writable` stream that _will store the above data to the SQLite db_

But there is more! 🥳 The SDK actually includes a lot of utilities for both **implementing** and **testing** your plugins: please, feel free to explore the source code for both the SDK and the main plugins - especially [CervantesJS](https://github.com/giancosta86/CervantesJS) for Spanish and [RayonJS](https://github.com/giancosta86/RayonJS) for French.

## Installation

```bash
npm install @giancosta86/jardinero-sdk
```

or

```bash
yarn add @giancosta86/jardinero-sdk
```

The public API entirely resides in the root package index, so you shouldn't reference specific modules.

## Usage

In order to create a _linguistic plugin_ for JardineroJS, you'll need to:

1. Import the `LinguisticPlugin` abstract class and extend it:

   ```typescript
   import { LinguisticPlugin } from "@giancosta86/jardinero-sdk";

   export class MyLinguisticPlugin extends LinguisticPlugin {
     //Here, implement the abstract methods
   }
   ```

1. **Export the custom plugin class itself** - usually, _in the index module of your package_ - and mark it as **the default export**:

   ```typescript
   export default MyLinguisticPlugin;
   ```

1. To run your plugin in JardineroJS, you'll need to invoke the **jardinero** command, passing the **module id** (usually, the path) of the above module

## Implementing LinguisticPlugin

- `getId()`: must return a string that identifies your plugin in a unique way; an effective strategy could be a reverse-domain notation à la Java, but the choice is yours. Please, note that _each plugin has an isolated db_, whose path is

  > $HOME/.jardinero/\<plugin id\>/dictionary.db

- `getName()`: returns a string displayed in the title of the current browser tab

- `getSqliteSchema()`: must return **the DDL code** executed _when initializing the db_

- `createSourceStreams()`: must create an array containing a `Readable` stream, maybe followed by a sequence of `Transform` streams; the output of the last stream in the sequence will be piped into the transforms produced by `createExtractionTransforms()`, described below

  > The two steps are structurally decoupled for a few reasons - in particular, to simplify testing.

- `createExtractionTransforms()`: an array containing one or more `Transform` streams; this chain of transforms receives the _source pages_ produced by `createSourceStreams()` and must return _objects that will be serialized to the plugin's SQLite db_

- `createSqliteWritableBuilder()`: must return a `SqliteWritableBuilder` - provided by the [sqlite-writable](https://github.com/giancosta86/sqlite-writable) library, to actually serialize the linguistic terms to db.

  In particular, you'll probably need to call a few methods of the newly-instantiated builder, before returning it:

  - `.withSafeType<T>` or `withType<T>`: to _register each type_ that will flow into the db

  - `.withMaxObjectsInTransaction()`: setting a value higher than the default might be hyper-effective in terms of _performances_ when storing _remarkable quantities_ of items

**Please, note**: when implementing `LinguisticPlugin`:

- most methods actually support not only a `T` return value, but also `Promise<T>` - as you prefer

- in lieu of an _array_, a method can actually return _just a single item_, with no array notation. In both cases, the above sync/async note still applies

## Optional methods

Optionally, a plugin can override predefined behavior:

- `getStartupQuery()` returns the query string initially displayed in the query input box of the app. **Default**: empty string

- `translateQueryToSql()`: since every Jardinero plugin reads data from its dedicated SQLite database, this method allows you to translate the input query written by the user, within the UI, into the actual SQL code executed by the db - thus enabling the creation of arbitrary domain-specific languages. It can return a `string` or a `Promise<string>` - whichever you prefer

  > By default, it just returns the input query, assuming the user is already writing SQL code.

## Logging

Your method implementations can access:

- the `this.logger` field, whose `Logger` type is declared by the [unified-logging](https://github.com/giancosta86/unified-logging) library

- the `this.pipelineOutput` field, for sending user-friendly text messages to the pipeline

## Further reference

Please, feel free to explore:

- the [CervantesJS](https://github.com/giancosta86/CervantesJS) project - a vast, sophisticated plugin devoted to the analysis of the _Spanish language_

- [RayonJS](https://github.com/giancosta86/RayonJS) - the hyper-performant, SAX-based plugin dedicated to the analysis of the _French language_

- [JardineroJS](https://github.com/giancosta86/JardineroJS) - the web architecture itself
