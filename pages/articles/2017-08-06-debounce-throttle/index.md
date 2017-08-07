---
title: What's up with debouncing vs. throttling anyway?
date: '2017-08-06T22:09:55.648Z'
layout: post
draft: true
path: /debounce-throttle/
category: front-end
description: >-
  Today we'll examine two common functions for limiting the amount of JavaScript
  you're executing based on user-fired DOM events for performance reasons. I
  found it hard to distinguish between the two at first, but we'll take a quick
  high-level dive into both of them today!
---

If you're a front-end developer, chances are you've heard of **debouncing** and **throttling**. They're used in many scenarios involving rapidly-executing user events. It's easy to confuse the two(guilty as charged), so in this post I'll help distinguish between the two and help brainstorm simple implementations of both. For robust implementations of both, check out underscore or Lodash.

Here is a live, breathing example of both before we get started :

<p data-height="265" data-theme-id="0" data-slug-hash="vOZNQV" data-default-tab="js,result" data-user="chriscoyier" data-embed-version="2" data-pen-title="The Difference Between Throttling, Debouncing, and Neither" class="codepen">See the Pen <a href="https://codepen.io/chriscoyier/pen/vOZNQV/">The Difference Between Throttling, Debouncing, and Neither</a> by Chris Coyier  (<a href="https://codepen.io/chriscoyier">@chriscoyier</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

--

**Debouncing** allows us to __group__ multiple sequential calls into a single one. Think of a rapid burst of events, like keystrokes or clicks. We are essentially trying to **filter** a sequences of events into a single one.

Common use-cases include resizing a browser window. If we're listening for the __resize__ event, it will be triggered every time the window size changes. We don't want this, as we're only interested in the 'final' resized value after the user STOPS resizing. Another use-case is the autocomplete form on an input box - if we're listening for the user's __keypress__ event, we want to wait until they're done typing instead of firing a handler for every single letter.

We can brainstorm an implementation of **debounce** as a function that will receive an event handler, a threshold(in milliseconds) and return a 'debounced' version of it. This brand-new, shiny function will NOT be triggered as long as it's continuing to be invoked within the threshold. It'll be called only AFTER the last invocation was certain miliseconds ago(the threshold value).

I should mention that we can implement two types of **debounce** :

1. One that waits the given threshold before triggering. So the function triggers on the 'tail-end' of the threshold
2. One that triggers the function immediately and on the 'leading-edge' of the threshold.

If this doesn't make sense, check out [this article](https://css-tricks.com/debouncing-throttling-explained-examples/).

A basic implementation of **debounce** looks like this :

```
const debounce = function(fn, threshold, immediate) {
  let timer;
  let args, context;

  return function() {
    args = arguments;
    context = this;

    if (immediate && !timer) {
      return fn.apply(context, args);
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, threshold);
  };
};
```

--
In contrast, **throttling** limits a function from executing more than once in a given threshold(Every X miliseconds, for example). An example includes infinite-scrolling - If we were to debounce this, we'd only be able to render additional UI to the user once the user STOPS scrolling. In contrast, we want to check every X miliseconds for the user's scroll position and render additional UI.

With implementing **throttling**, we can simply record the time at which the last event was fired using a closure variable, and check if we're within the 'threshold' start off another timer. If we're safely past the threshold, we can simply trigger right away.

See below for a simple implementation :

```
const throttle = function(fn, threshold) {
  let timer;
  let lastCalledTime;
  let args;
  let context;

  return function() {
    args = arguments;
    context = this;

    //check if we're within the threshold by calculating current date - lastCalledTime and comparing it to threshold
    let pastThreshold = new Date() - lastCalledTime > threshold;

    if (!lastCalledTime || (pastThreshold && !timer)) {
      //reset lastcalledtime
      lastCalledTime = new Date();
      //call right away
      return fn.apply(context, args);
    } else {
      if (!timer) {
        timer = setTimeout(() => {
          lastCalledTime = new Date();
          fn.apply(context, args);
          //set it to null.
          timer = null;
        }, threshold);
      }
    }
  };
};
```

