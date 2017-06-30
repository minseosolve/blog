---
title: Streams, Chunks and Pipes in Node.js
date: "2016-01-02T22:12:03.284Z"
layout: post
path: "/node-basics/"
category: JavaScript
description: Starting up a basic web server in Node.js, and understanding the concept of streams, chunks and pipes
---

I had never quite had the clearest mental model of how **servers actually work**, or what the heck happens when I type _google.com_ into my browser. I'll write some snippets and nuggets that helped me along the way. hopefully this series of posts on Node.js will familiarize you with dealing with server-related concepts and the nuances of Node.

---

## Getting a server up and running

Let&#8217;s start with creating our first HTTP server.

```
var http = require('http');

http.createServer(function(req, res)  {
   res.writeHead(200, {'Content-Type' : 'text/plain'});
   res.end('Hello World!');
}).listen(1234, '127.0.0.1');
```

So a few things :

The browser will make a request on the server, which is an **event**. Node is listening for that event in a specific port(1234 in this case). When the request event is emitted, our server responds accordingly.

2. Line 1 basically is telling Node, _&#8220;Hey Node, go get this module called &#8216;http&#8217; for me, and make it available on this file&#8221;_

3. When our server responds to the server, we are communicating through HTTP protocol, which is basically a set of rules for data being transferred on the web. As such, we use status codes like 200, and specify the content-type in our headers so that the browser can understand our response.

You did it! Go ahead, run the server in your command line, and go to your browser at [http://localhost:1234](http://localhost:1234) and you should see your server live and running.

---
## About Streams, Buffers, Chunks and Pipes

As a Node.js newbie, one concept that confused me a lot was that when browser sends a request and we&#8217;re receiving it from the server side, the requests come in the form of **chunks**.

This just means that they come in bits and pieces, and are being sent through a **stream.**

A stream just refers to the sequence of data being made available over time.

What are **buffers**, you say? Try console.log a request that the browser makes, and you&#8217;ll see something like this :

```
    <Buffer 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 67 ... >
```

Buffers are just temporary holding spot for data that&#8217;s being moved from one place to another. They&#8217;re so essential to the way Node deals with binary data that it&#8217;s part of the core C++ module in Node. You can easily create a new Buffer and specify the encoding like this :

```
var buf = new Buffer('Hello World', 'utf8');
//Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64&gt;
```

Say you&#8217;re trying to serve up a static file from your hard drive to the server. What are the implications of using buffer to load files? If the file size is large, or if many people are requesting it, the file sits in memory space in the V8 engine for every request &#8211; This could be a major performance issue.

This is where streams come in.

```
var fs = require('fs');

var readable = fs.createReadStream(__dirname +  '/sampleData.txt');

var writable = fs.createWriteStream(__dirname + '/sampleDataCopy.txt');
//Data comes in as chunks!
readable.on('data', function(chunk) {
   writable.write(chunk);
});
```

Here, we basically created two streams &#8211; A **readable** stream in which we&#8217;re reading from a file called `sampleData.txt`, and a **writable** stream called `sampleDataCopy.txt` in which we&#8217;ll be writing the new data into.

Since streams actually inherit from the EventEmitter function in Node(This means streams are actually event emitters), it can listen to events, emit them and have listeners respond. So when the data event takes place, we can read from our readable stream and write to our writable stream.

By using pipes, we can actually refactor the event listener we wrote above into one line of code like this :

```
var fs = require('fs');

var readable = fs.createReadStream(__dirname +  '/sampleData.txt');

var writable = fs.createWriteStream(__dirname + '/sampleDataCopy.txt');

//Use pipes to pipe from readable stream to writable stream
readable.pipe(writable);
```

That&#8217;s it for today, stay tuned for part 2 as I post more Node.js tips!