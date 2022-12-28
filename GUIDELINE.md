# Contooper TypeScript Code Style

## Table of Contents

### [Introduction](#introduction)
### [Naming Conventions](#naming-conventions)
- [Class / Interface / Enum / Types](#class--interface--enum--types)
- [Variable / parameter / function / method / property / module alias](#variable--parameter--function--method--property--module-alias)
- [Global constants including enum values](#global-constants-including-enum-values)
- [Files](#files)
### [Strings and Quotes](#strings-and-quotes)
### [File Skeleton](#file-skeleton)

## Introduction

### This document describes the code style formy TypeScript projects. It is based on Google's TypeScript Style Guide.

#

## Strings and Quotes

### Use single quotes when possible.

```typescript
const foo = 'bar'
// JSON
{
  "foo": "bar"
}
```

## Class / Interface / Enum / Types

### UpperCamelCase

```typescript
class MyClass {
  // ...
}
interface MyInterface {
  // ...
}
enum MyEnum {}
// ...
type MyType = {
  // ...
};
```

#

## Variable / parameter / function / method / property / module alias

### lowerCamelCase

```typescript
const myVariable = 1;
function myFunction() {
  // ...
}
const myFunction = () => {
  // ...
};
const myObject = {
  myProperty: 1,
};
```

#

## Global constants including enum values

### UPPER_CASE

```typescript
const MY_CONSTANT = 1;
enum MyEnum {
  MY_VALUE = 1,
}
```

#

## Files

### snake_case

```typescript
// my_file.ts
import MyComponent from "./my_component";
```

#

## File Skeleton

### The file structure should be as follows:

```typescript
// Imports
- modules
- local modules
- types
- functions

// Functions
export function Foo(){
    ...
}

```