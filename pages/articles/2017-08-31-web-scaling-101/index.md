---
title: Web scaling 101
date: '2017-08-31T21:07:13.550Z'
layout: post
draft: true
path: /web-scaling-101/
category: front-end
description: >-
  For a long time, I have to honestly admit I didn't have a good idea of how to
  scale a website, or words like 'load balancers', and how horizontal scaling is
  different from vertical scaling. In this post I'll go through a high-level
  overview of how basic scaling works on the web.
---
![Image of scaling from Silicon Valley](http://i.imgur.com/sdJo1bi.jpg)

Suppose your website, or your business is now starting to generate traffic and it's attracting more visitors & requests than you expected. What do you do? I have to admit, that even as someone working in front-end, I didn't take time to actually learn how scaling works. It wasn't until I watched the brilliant David Malan from Harvard's CS50(I highly recommend the lecture videos from his CS75 class on Web Development) that I started understanding the basics of scaling on the web. In this post I'll provide a gentle, high-level overview of scaling.

#### Scaling web servers

So there's two basic types of scaling, **vertical** and **horizontal**. **Vertical** scaling can be summarized as to throwing more resources/money at the problem - Buying more CPU, RAM, more processors and disk spaces. Unfortunately, more often than not this doesn't turn out to be a sustainable solution because every machine will have a 'ceiling' in terms of the amount of upgrades it can go through.

**Horizontal** scaling is much more interesting, and is much more nuanced. To horizontally scale an application, we have to accept that there is a ceiling in terms of the hardware that we use, so we __architect our systems in such a way that we hopefully won't hit that ceiling__. So rather than purchasing an expensive machine, we might use multiple machines with the same level of performance to solve the problem.

So let's say we're getting a ton of traffic, and in hopes to alleviate the problem we decide to use an additional web server on the back-end to handle the incoming requests.

![Diagram of load balancer](http://www.2bnet.co.il/webfiles/fck/image/loadbalancer.JPG)*Full Photo credit : 2B.net*

#### Load Balancers

This is where **load balancers** come in. A load balancer is the 'black box' that sits in between client and server and trusted with the task of directing each request to the proper server. They can also be a very expensive piece of machine, by the way.

So then the obvious question is, how does the load balancer decide to handle client requests?
1. _Load_ : Decide based on load of a server at a specific point in time. So ask each server, _Hey, how busy are you? Let me know if you can handle this request!_

2. _Function_ : Another way is to use dedicated servers, and assign one server to handle all HTMLs, one to handle all images, one to handle all video, etc. The load balancer will look at the URL of an incoming HTTP request and direct it to the proper server.

3. _The Round Robin_ : The famous Round Robin is one of the ways load balancers handle the scheduling of requests. The goal is to spread out requests **evenly** across multiple servers, and achieve **uniform distribution** in terms of assigning servers with requests. So as an example, we can have the load balancer return the IP address of server #1 for the first request, server #2's IP address for the second request - this way, we don't need any bi-directional communication with the servers like approach #1 and #2 and the load balancer can remember to 'go around' and take turns assigning each server with one request. What are potential issues with the Round Robin approach? One server could get totally owned with handling a particularly tough request(A 'power user' requesting lots of resources), whereas another server could be coasting.

Another serious downside with the Round Robin approach as we've described is the problem of __sessions and shared state__. Typically, each user's session is saved in a server's hard disk as a text file. If a user's session is saved in server #1, and by any chance Round Robin directs to server two the next time around, the user will be told to sign in again. Alternatively, if I'm shopping on an e-commerce site, there could be a scenario in which I'll have added a book to my cart on one server, added another on another server, and in the end have no way of __checking out all of them in aggregate, even though I wanted to buy all of them__, because each action of adding to the cart is a session that's saved in separate servers.

So what the heck do we do if we want sticky sessions? We could have one file server designated to storing all session data that other servers could use. Or, since we already have someone sitting between client and server, store the sessions directly on the load balancer!(All the requests will have to go through the load balancer anyway).

The caveat with this approach is that now, if our file server dies, or if our load balancer dies, we've lost all sessions. We've solved the problem of sticky sessions but we've sacrificed robustness and redundancy, and this is the problem of **single point of failure**.

So let's say our load balancer can now deal with sessions. We're not overly concerned with exactly how, it probably uses a giant table with random #'s - this random # belongs to server #1, that random # belongs to server #2, it will remember to associate each session with its correct server.

---
![Silicon Valley Data Storage Image](http://i.imgur.com/d887eoj.jpg)

#### Scaling databases

What about storing data in our servers? We'll need to use a database, and the easiest way we know to store data is directly on our web servers themselves, meaning the database lives on the same box, the same machine as the web server.

The obvious problem with this is that if a user does something that 'persists' - meaning some data is stored about the user on server #1, if that user happens to log in from a different computer, or somehow gets routed to a **different server**, we have no way of collecting the data about the user from the original location(Server #1).

So a better architectural design would be to obviously factor out the database separately into a different machine, connected to our back-end servers as such :
![Application Architecture Diagram](http://i.imgur.com/E7418TJ.png)

A common pattern you might've noticed so far with scaling is that once we solve a problem, we introduce a new one...we still have a single point of failure with having only one database as the single source of truth.

To solve this, we can do things like **master-master** or **master-slave** database replication which deserves a post of its own(For details on this check out [this helpful StackOverflow article)](https://stackoverflow.com/questions/3736969/master-master-vs-master-slave-database-architecture). In the simplest terms, we replicate the database so that even if one fails, we have another backup that can take over as necessary.

Eventually, we'll have to introduce a load balancer for our databases as well as we end up using more than one databases, because we can't scale if we want each server to be able to talk to every single database.

![Application Architecture Diagram#2](http://i.imgur.com/uX3eGqY.png)

#### What next?

Whew. Still here so far? To summarize, we have a new architecture where we now have a load balancer in between the servers & the databases to make intelligent decisions on routing communication between servers & databases. Now, what to do about yet another single point of failure problem? We can use two load balancers again, using the _Active:Active_ approach where a pair of laod balancers constantly listen to each other for connection, and either one can receive packets and relay them to back-end servers. They send heartbeats across each other, and if at any point the heartbeat STOPS, the one that's still alive becomes completely in charge. _Active:Passive_ is similar, except only one load balancer is kept active, and if it dies, the passive one will promote itself to active, and take over the other load balancer's IP address as well.

This is a good time to also mention __switches__, which will enable us to scale the above architecture if we keep introducing more servers, databases and load balancers. We obviously don't want to be connecting them directly with each other - that would be a mess and impossible to manage. We can use then, a __switch__, where we can potentially have ethernet cables all going into one central source, which will create a centralized network.

Ideally, we'd want to use two switches to again protect ourselves against the single point of failure problem(One switch...). What now?

Something else that could fail is the data center goes offline, or the power in the building goes out, or there's some network disconnect between you and your ISP. So ideally, if one data center fails, there should be another building nearby that __doesn't share the same power source or the network source__ that can take over. This is what you see when you look at Amazon EC(Elastic Computing) instances for example(They have things called _Availability Zones_, that will have names like East1, East2, and so on).

---
Hopefully that wasn't too much to absorb - Key points to remember is that with scaling, a common pattern is that once we solve one problem, we introduce another(Often in the form of single point of failure). Furthermore, as we scale our application, we start going from scaling servers, databases, load balancers eventually to networks, data centers and so forth. I'll update this article as I learn more about scaling, and a tremendous resource I've come across is [High Scalability](http://highscalability.com/), so be sure to check it out. Thanks for reading!


