---
title: 'Making sense of HTTPS, HTTP1 vs. HTTP2'
date: '2017-09-04T04:10:25.888Z'
layout: post
draft: true
path: /http-party/
category: Front-End
description: >-
  Are you a front-end engineer concatenating your assets into a single
  bundle before serving them up to your users? Think again! In this post, we'll try to make sense of HTTPS, and the advantages of using HTTP2 vs. HTTP1.
---
### What's the deal with HTTPS?
If you're a front-end developer, chances are you've read articles, or listened to people urging you to convert your platform to start using HTTPS. In fact, Google announced back in 2014 that using HTTPS will [impact search ranking results](https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html), sparking another frenzy on the web. Today, HTTPS website account for more than 30% of all Google search results.

Let's take a scenario that may be very common in our day-to-day lives : You take your laptop to work at a local Starbucks nearby, and connect using their public Wi-Fi. Without giving it extra thought, you check your bank account using online banking, like and comment some pictures on your Facebook account. Just think of all your personal data that's being sent in naked form back and forth across public connection - You're making a huge, naïve assumption that people connected to that same Starbucks wi-fi won't intercept or listen to your sensitive data that's being exchanged back and forth.

Enter HTTPS! Yes, the S stands for Secure(It can also stand for SSL). With HTTPS, all your requests will be encrypted so that **only the server you're communicating with** will be able to understand it. HTTPS is also often called 'HTTP over Transport Layer Security', which we'll take a moment to dissect. **TLS** Encryption basically establishes a 'Chain of Trust', where the server will first identify itself with two things :

1. A little metadata about itself
2. A fingerprint of an encryption key(These fingerprints are certified by authorities/companies that support them, you can think of them as a drivers' license. You can also check which certificates are stored locally in your browser)

So once the server hands you the certificate, it will contain some information including the **public key of the server, the domain name, and the signature by the certificate authority**. The client will then check if the domain is correct, and if the authority signature is valid(All browsers have certificates included locally as I mentioned). This is what a  certificate looks like for _github.com_ :

![Github Certificate](http://i.imgur.com/dTuXfRO.png)

The client will then generate a random key for symmetric encryption(Which deserves another article of its own), and the browser encrypts this random key with the server's public key and sends it over.

You might also be wondering why HTTPS isn't enabled for this site - Although the original blog published at _https://minseokim.github.io/blog_ **does** support HTTPS, the domain I bought at GoDaddy that POINTS to the blog using DNS CNAME doesn't, and it's quite pricey to implement at the moment(Something I'm planning on doing in the near future).

---
### HTTP/1 vs. HTTP/2

As front-end devs, it's common to use a build tool like [Grunt](https://gruntjs.com) or [Gulp](https://gulpjs.com) to automate our workflow to do a variety of things - Write PostCSS/SASS, watch for changes, use Browserify, and most commonly, **concatenate our JavaScript files and CSS stylesheets into one**, minify and uglify them.

Traditionally, the intent behind concatenation/bundling up our assets into a single file is to reduce the number of HTTP requests. But you'll be surprised to find that this isn't always optimal for our users or for application performance with HTTP/2.

Research indicates that as the web grows, the number of resources that a website requests along with the total size of the assets have been steadily increasing - This means that the architectural designs behind HTTP/1 leave some shortcomings that leave much to be desired. Let's first look at some of the problems HTTP/1 gives us :

1. **Head-Of-Line Blocking** : This is a fancy term for saying one request blocks others from completing. This is equivalent to waiting in a line at a coffee shop for a cup of green tea, where the person before you wants to get an elaborate hand-dripped, bean-ground coffee along with a full panini. Although your order will take significantly less time, you're forced to wait idly for the cashier to finish serving the previous 'power customer'. HTTP by default can open up **six connections** at most at parallel to deal with this, which often isn't a complete solution.

2. **Uncompressed Headers** : When we think of the data that we exchange back and forth between servers, we rarely include headers as part of the data. But examine the following typical HTTP request header :
```
GET /pictures/kitty.jpg HTTP/1.1
Host: www.google.com
User-Agent : Mozilla/5.0
Connection : Keep-alive
Accept : text/html
If-None-Match : b2arb0a1r6a //Version to match w/ browser cache
```
Although the request body can usually be gZipped, the headers are **still plain text**, and more importantly, they're usually the SAME TEXT that's sent back and forth. Each HTTP header is approximately 80KB, which means for 10 requests, that's an average of 800KB of data being spent.

3. **Security** : We touched on HTTPS at a high-level above, but TLS encryption is a required part of HTTP/2, so it provides an extra layer when dealing with sensitive data.

So how does HTTP/2 improve upon these three problems?

1. **Multiplexing** : Let's break this fancy term down into easy-to-understand concepts. So while HTTP/1 can open six connections at the same time, HTTP/2 only has one. Isn't this a step backward? Actually, under HTTP/2, all connections are _streams_, and all the _streams_ share that single connection. These streams can now be split up into smaller chunks(frames), and when **one stream is blocked, another stream can take over that connection**. So we're able to use that single connection as an efficient pipe of sorts to transport data.

2. **Header Compression** : Shockingly, with HTTP/2, we have a fancy compressor(Check out **[HPACK](https://http2.github.io/http2-spec/compression.html)** for more detail on how the compressor works under the hood) for the headers. All streams share this compressor, which means that the compressor actually **recognizes a header if it's the same one that's in the cache(One that was sent before)**. This means the compressor can send a reference of that header instead, which saves a lot of data. Even better, we can also do this with cookies, which tend to be even larger in size.

---

### Conclusion
What does this all mean? This means that **you should use HTTP/2**. All modern browsers support it now, and and it's backwards-compatible meaning it will simply fall back to HTTP/1 if it's not supported. For us developers, this means that more often than not, concatenating our JavaScript/CSS with our beloved build tools can actually worsen our app performance. For one, even if our assets utilize caching, if we make one minute change to our JavaScript(Adding a comma, or deleting an empty line) file, this means our users will have to re-download the entire bundle again - whereas if we're serving up assets in smaller modules, they'll only have to download that specific module only.

CSS-Tricks recently [published an article](https://css-tricks.com/musings-on-http2-and-bundling/) arguing the opposite, saying there's a bit more nuance to this issue - So it'll be critical to test and adjust depending on your use case, but it's important to understand how HTTP/2 works under the hood with regards to multiplexing.

Another important thing to point out is that asset sharding(Serving up assets across multiple domains vs. one) also won't take advantage of all that HTTP/2 offers. With more requests that we send using HTTP/2, the more we can utilize the compressor - more headers/cookies can be re-used in the compressor. So serving up assets across different servers won't give you the performance benefit of HTTP/2.
