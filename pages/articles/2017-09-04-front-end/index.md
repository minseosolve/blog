---
title: CORS and Same-Origin Policy Basics
date: '2017-09-04T19:10:43.898Z'
layout: post
draft: true
path: /cors-basics/
category: Front-End
description: Have you ever tried to make an API call, and seen a red error message on your Chrome DevTools console along the lines of 'No Access-Control-Allow-Origin'? It's time to get an understanding of the same-origin-policy on the web, as well as how CORS can be a solution.
---
![Mixed-Content Error Image](http://i.imgur.com/DiZcerB.png)
![Cors Error Image](http://i.imgur.com/cU9wITg.png)
---
Have you ever tried to fetch data from an API, or load an external resource in your application and seen a red error message on the console along the lines of  `No  'Access-Control-Allow-Origin' header is present on the request resource. Origin XYZ is therefore not allowed access...`?

When I first started out writing web apps, I had a somewhat surface-level understanding of what that error meant - Turns out it's one of the most important rules that govern the web. In this post, we'll take a brief look at important basics all front-end engineers should know about **Same-Origin Policy**, **CORS** and **JSONP**.

---
### Same-Origin Policy

One of the oldest rules in the web is the **same-origin-policy**. What exactly does this mean? An origin on the web is made up of three parts : _Data Scheme, Hostname, and Port_ :
```
   https://       google.com     /433
<Data Scheme>     <Hostname>    <Port>
```
On the web, we're only allowed to request resources if it's from the same origin. Meaning, from `https://www.domain-A.com`, I can't make a request to `https://www.domain-B.com`. Such **cross-origin fetch requests** CAN work under certain criteria, but in most cases you won't be able to directly access/read the response. For example, if it's JavaScript script that's from another origin, you can't inspect the content(They'll appear silently empty). Or in most modern browser APIs it will even throw an error.

The same goes for images as well. You can't interact with an image from another origin the same way you would with an image from your own origin - You won't be able to inspect the pixels from inside the canvas element, for example. The **same-origin policy** is critical because it will prevent me, for example, from making a request to my friend's facebook to fetch all his messages. Another important thing to point out is that it's the **client-side**, the user's browser that enforces same-origin policy, NOT the server.

---
### JSONP and CORS to the rescue

#### JSONP

Before CORS was adopted most browsers, JSONP was the method of choice for getting around the same-origin policy. JSONP, or JSON with Padding, is a clever and simple way of getting data from a foreign resource. It exploits the fact that while you aren't allowed to make an ajax request to a foreign origin, you ARE allowed to include a `<script>` tag from a different origin. How you implement JSONP is very straightforward :

1. Create a new _script_ tag, and set the _src_ attribute to the endpoint you want to request data from
2. Inside the _src_ attribute, include a callback function that will be executed
3. Once the script loads and executes, the script will invoke the callback function with the data from the origin

JSONP is simple but obviously very limited. Since it's read-only, it's limited to GET requests and is best served for simple services like News APIs and the weather.

#### CORS

**CORS**, or **Cross-Origin Resource Sharing** on the other hand, is the de facto solution for making cross-origin requests. CORS enables servers to specify a set of origins(Like a whitelist) that are allowed to access its resources. For example, in one of my past projects, [Leaflet](https://leaflet-d2550.firebaseapp.com/), I made calls to my Book Review site using the WordPress API and had to enable CORS on the server in order to allow for the Leaflet app to make fetch requests.

An important thing to point out is that it's the **response** that's blocked. Meaning, when a browser makes a request to another origin, the request itself will go through, but if CORS isn't enabled the response will come be blocked.

This is critical in the case of PUT requests - If we made a PUT request to another resource, since the request itself goes through, the POST request can potentially have a destructive effect on the foreign origin on the server. It wouldn't matter if the response is blocked, the damage would have been done anyway.

That's why for POST requests, CORS actually does something called **pre-flight checks**. Before sending out POST requests, CORS will first send an OPTIONS request to do a pre-flight check, and only if it gets back a header from the server saying, 'You're good to go, I recognize you as someone I've allowed to make requests to me', it will then make a PUT request.

---
For more information on CORS, check out the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS), as well as a fantastic tutorial by [HTML5Rocks](https://www.html5rocks.com/en/tutorials/cors/). Now that you're armed with an understanding of the same-origin policy, hopefully you can comfortably handle `Mixed-Content` errors and `No Access-Control-Allow-Origin` errors.



