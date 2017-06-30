---
title: The most reliable way to check types in JavaScript
date: "2016-06-06T22:12:03.284Z"
layout: post
path: "/js-type-checking/"
category: JavaScript
description: If you've ever wondered why checking typeof(null) returns Object, it's time to consider an alternative way to check types in JavaScript.
---

## Typeof Operator

Type checking in JavaScript is notoriously difficult, as the _**typeof**_ operator is essentially [completely broken](http://bonsaiden.github.io/JavaScript-Garden/#types). JavaScript first uses _weak typing_, which means using the == operator will result in type coercion. When using === for objects, the operator compares for **identity**, not equality, checking to see if it&#8217;s the same instance.

It has some unpredictable behavior, such as returning `Object` when checking null.

Only use `typeof` if you want to check if a variable was declared or not, as such :

```
typeof foo !== 'undefined' //checks if foo is undefined
```

This will allow you to check if foo is declared without the code throwing a Reference Error.

## [[ Class ]] Property

A reliable alternative? By using the `toString()` method on the Object prototype, we can print out its `[[ class ]]` property(_Check out [this](https://toddmotto.com/understanding-javascript-types-and-reliable-type-checking/) article for more info_). We simply override the context of the method by using the `.call()` method and we'll be able to distinguish between Object, Array, Function, String, Number, Boolean, Null, Undefined and Symbol.

Note that since the `toString()` method is inherited from Object, it will return `[Object]` by default, so all we want to look at is the next bit by slicing out indices from 8 till the end.


```
var deepEquals = function(apple, orange){

  //we only care if they're both objects, or both arrays
  if ((objectChecker(apple) && objectChecker(orange)) || (Array.isArray(apple) && Array.isArray(orange))) {
    if (Object.keys(apple).length !== Object.keys(orange).length) {
      return false;
    } else {
      for (var key in apple) {
        if (!deepEquals(apple[key], orange[key])) {
          return false;
        };
      }
    }
    return true;
  } else {
    return apple === orange;
  }
};

function objectChecker(arg) {
  var verify = Object.prototype.toString.call(arg).slice(8, -1);
  return verify === 'Object';
}

 var a = { b : { c : [1,2,3]}};
 var b = { b : { d : [1,2,3]}};
 var c = { b : { c : {d : 1}}};
 var d = { b : { c : {d : 1}}};
 console.log(deepEquals(c,d)); //true
 console.log(deepEquals(a,b)); // false
 ```