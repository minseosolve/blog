---
title: JavaScript OOP Patterns
date: "2015-12-21T22:40:32.169Z"
layout: post
path: "/javascript-objects/"
category: "Javascript"
description: "A gentle guide to creating and re-using objects in JavaScript"
---

One of the core material we covered at Hack Reactor in the first week was an introduction into Object-Oriented Programming(OOP for short) in Javascript. Fundamentally, OOP helps us find ways to reuse code to avoid having to write the same logic more than once, and to set up our codebase so refactoring it is easier in the future.

All the examples and material covered in this post comes from [Udacity's free JavaScript OOP course](https://www.udacity.com/wiki/ud015), taught by Marcus Philips of Hack Reactor. With close to zero OOP background, I found these patterns foreign and challenging at first, but after going through Marcus&#8217; class a couple times(I had to play back what he said more than a few times to process it in my head), they are starting to make much more sense now.

After this post you should :

  1. Understand why we would want to use OOP in Javascript
  2. Know the four functional instantiation(I&#8217;ll cover what this means) patterns to achieve that
  3. Understand the stylistic and functional differences between them

---

The principle of OOP is to manipulate functions in a way that will allow us to **create multiple objects with similar properties and methods**. efficiently. If we were to create a game involving cars driving along the street, we would need to create _objects_ for each Person, and Car. Suppose we wanted to create a car and make it move across the map. Where would we start?

For most people, the starting approach would look something like this :

```
var carlike = function(obj, loc) {
  obj.loc = loc;
  obj.move = function(){
    obj.loc++;
  }
  return obj;
}

var Alex = carlike({}, 6);
Alex.move();
var Hera = carlike({}, 12);
Hera.move();
```

So far, we've added a **Function Decorator**(*A function that takes an object, adds some functionality to it by adding or changing its properties and returns it*) called `carlike`; that will take an empty object literal and a location as its arguments, and add the _move_ method to it.

But to create different car objects Alex and Hera, we are passing in empty object literals to the decorator function twice. Can we just ask the carlike function to **build** the object for us? This is where the term **classes** come in - The only difference between using classes, and using the function decorator pattern is that classes create AND augment the objects we want.

```
var Car = function(loc) {
  var obj = {loc: loc;};
  obj.move = function(){
    obj.loc++;
  }
  return obj;
};

var Alex = Car(6);
Alex.move();
var Hera = Car(12);
Hera.move();
```

This is the **functional-class** pattern, and as you can see, the only difference is that the Car class(capitalized to denote class) creates the object, adds the location property, and the move method on it. One problem we have with this method is, by creating Alex and Hera, we create two different function objects for our _.move _method. This means every time we invoke the Car constructor function, every instance of Car(such as Alex and Hera) has its **own copy** of the move function &#8211; Not the best choice for memory.

There&#8217;s got to be a better way! Is there a way to factor out the move method, so that it&#8217;s written once and shared across all instances of Car?

This seems like the most logical next step :

```
var Car = function(loc) {
  var obj = {loc: loc;};
  obj.move = move;
  return obj;
};

var move = function(){
    obj.loc++;
  }

var Alex = Car(6);
Alex.move();
var Hera = Car(12);
Hera.move();
```

All we just did was move the function body outside our Car class, and have the method `move()` simply point to it, that way we don&#8217;t have to create the function every time Car is invoked. The problem with this approach is that since the definition of the `move()` method is happening **outside** the Car class, it no longer has access to the closure scope access to the obj variable. So since we can&#8217;t access the new object we are creating, we can&#8217;t use this method.

---

This is where the **this** keyword comes in. It will allow us to dynamically refer to the current object.

```
var Car = function(loc) {
  var obj = {loc: loc;};
  _.extend(obj, Car.methods);
  return obj;
};

Car.methods = {
  move : function(){
    this.loc++;
  }
};

var Alex = Car(6);
Alex.move();
var Hera = Car(12);
Hera.move();
```

So we arrive at our second pattern, the **functional-shared.** Notice that instead of the previous example of storing `move()` in a global variable, we create a container called `methods` and store all the methods that every single instance of car can access to. Using `.extend`, we then copy all the methods in that container to the new instance we are creating(Now Alex and Hera can use all the methods inside the `methods` container).

Now, the problem with functional-shared is that the act of extending Car's methods to its instances is a one-time event that _copies_ all the properties from one object to another. Can we utilize the prototype chain in Javascript so that instances of Car will delegate failed property lookups to Car.methods?

---

So this question leads us to the **Prototypal Class :**

```
var Car = function(loc) {
  var obj = Object.create(Car.prototype);
  obj.loc = loc;
  return obj;
};

Car.prototype.move = function(){
    this.loc++;
};

var Alex = Car(6);
Alex.move();
var Hera = Car(12);
Hera.move();
```

A few things to point out about the changes from our previous code :

1. Instead of using _.extend, using _Object.create()_ allows us to set prototypes for the new object. **NOTE**: When you simply use object literals to create a new object, you don&#8217;t get to set its prototype!
2. It makes sense that we want Car.methods to be the prototype for the new object, since we want failed property lookups on every new instance to go to the Car.methods, so it can access methods like _move()_.
3. YES, Writing &#8216;Car.prototype&#8217; scared me too. But it really doesn&#8217;t change anything. Instead of creating a .methods container and storing methods into it, we&#8217;re just using a _different container for our objects_ that&#8217;s provided for us by Javascript &#8211; which happens to be Car.prototype.

**Think of it this way :** The only thing that has changed is that instead of storing methods in our own .methods container, we use a free container that's provided for us called `.prototype`;

---

Don't worry, I was already confused and way over my head at this point. Take time for this to sink in.

So to summarize, the step-by-step approach to creating objects using the prototypal class pattern is thus :

  1. Write a Class function
  2. Inside the Class function, write a line that generates new objects using the Object.create keyword &#8211; this allows you to set a delegation from the new object to some prototype object)
  3. Augment the object with properties
  4. Return the new object

So it seems like every time we do this, we are repeating step 2 : The act of delegating the new object to some prototype and 4: returning the new object.


Since we will be repeating steps 2 and 4 every time we create a Class, Javascript has so kindly helped us to refactor that part. So thus we have our final, **Pseudoclassical Pattern**

```
var Car = function(loc) {
  //this = Object.create(Car.prototype);
  this.loc = loc;
  //return this
};

Car.prototype.move = function(){
    this.loc++;
};

var Alex = new Car(6);
Alex.move();
var Hera = new Car(12);
Hera.move();
```

The lines commented out on 2 and 4 are what the Javascript Interpreter are writing for us(Using the **new** keyword when we actually invoke the Car class writes those lines for us). So as you can see, the Pseudoclassical Pattern is really just syntactically a bit more concise than the Prototypal pattern. But since it factors out a lot of steps, to a beginner's eye it might not be totally clear what's happening.

So that just about covers functional instantiation patterns in a lengthy post. I hope that helps see the thought process behind creating different patterns and the strengths and weaknesses of each one. I'll be covering closures, and prototypes in detail in my next posts. Stay tuned!