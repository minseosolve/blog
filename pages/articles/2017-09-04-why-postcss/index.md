---
title: 'Why I''ve fallen in love with PostCSS, the new kid on the CSS block'
date: '2017-09-05T03:54:27.490Z'
layout: post
draft: true
path: /why-postcss/
category: Front-End
description: >-
  As front-end engineers, part of our work involves around keeping up-to-date
  with latest technologies in the fast-changing web. Starting this year, I
  experimented with using PostCSS for writing CSS, and am proud to say I'm sold.
  Here's why.
---

![PostCSS Logo](http://i.imgur.com/4OIpGOB.png)

If you're a front-end engineer, chances are you're already familiar with the hype behind **[PostCSS](http://postcss.org/)**. Perhaps you're already sold, and have been heavily using it as part of your workflow. As someone who was used to writing SASS, or vanilla CSS most of the time, let me illustrate what PostCSS is and what it can offer to us front-end devs.

To provide a little bit of a background, here were some of the SASS features that I was personally depending on on a day-to-day basis :
1. Variables
2. Nesting
3. Mix-ins
4. Minifying CSS
5. Vendor Prefixing

Since I enjoyed using **[Gulp](https://gulpjs.com)** as my build tool of choice for most front-end projects, when I first heard about PostCSS and how it can be integrated quite easily with Gulp, I decided to give it a shot.

### What is PostCSS?

So although PostCSS has replaced SASS for me when it comes to writing CSS, it's technically a misconception to think that PostCSS is a true alternative to common pre-processors like SASS and LESS. This is because PostCSS, essentially is just a way to **extend your CSS with magical powers by leveraging JavaScript**. Unlike SASS/LESS, which are stylistic languages that are transpiled back to CSS, PostCSS is simply just a tool.

### What can you do with PostCSS?

Well, the right question to ask would be "What can you do with PostCSS **plugins**?" PostCSS itself doesn't do anything, it's just an environment that allows you to import plugins using JavaScript and enhance your CSS as a result. The number of [plugins](https://www.postcss.parts/) it now supports are close to 300, and the community and support behind PostCSS is growing like crazy. Oh, you can still write your beloved SASS/SCSS syntax with PostCSS too.
As an example, here are the following plugins I'm using with PostCSS :

- CSS-import(Lets you use import statements with CSS modules)
- Autoprefixer(Appends vendor prefixes automatically)
- CSS-vars(Lets you use variables with CSS)
- Nested(Write nested CSS)
- Mixins(Write mixins)
- Stylelint(You can even lint your CSS! Finally!)
- CSSNano(Minifies your CSS)
- DoIUse(Lints CSS for browser support against the [CanIUse](https://caniuse.com) database, SUPER useful)

### Setting it up with Gulp
Sold yet? And the best part is that integrating/getting it up and running won't add extra complexity to your tooling. Here's what my **styles task** looks like using PostCSS plugins.

```
//Styles
const gulp = require("gulp"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssvars = require("postcss-simple-vars"),
  nested = require("postcss-nested"),
  cssImport = require("postcss-import"),
  mixins = require("postcss-mixins");

gulp.task("styles", function() {
  return gulp
    .src("./app/assets/styles/styles.css")
    .pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
    .on("error", errorInfo => {
      console.log(errorInfo.toString());
      this.emit("end");
    })
    .pipe(gulp.dest("./app/temp/styles"));
});
```

As you can see, to set up the styles task, all I've done is import the plugins I want to use, and pipe them to my styles task. Essentially, I'm taking my original CSS file, and sending them through a pipe(Gulp itself is a pipe!) - and inside the pipe all these plugins will do the work, and the result will be piped out to a destination file that I specify.

With a plugin like [cssnext](https://cssnext.io), for example, you'll also be able to write the latest CSS syntax in the new CSS specs today, like custom properties, custom media queries, etc.

### Why you should start using PostCSS

If you're a front-end developer who's very comfortable with JavaScript, then there's no reason for you to not use PostCSS, in my opinion. It offers a limitless way of extending your CSS to all your needs, and it's also incredibly fast. For me, just being able to solve my CSS pain points using JavaScript is quite liberating, and I think I'll be sticking to PostCSS as part of my workflow for awhile.