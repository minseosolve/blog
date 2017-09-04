---
title: 'Creating a RateMyProfessor.com Chrome Extension for your school'
date: '2016-12-15T04:10:25.888Z'
layout: post
draft: true
path: /ratemyp-carleton/
category: Projects
description: >-
  This past weekend, I embarked on a small side project I've been wanting to do for some time now - Creating a Chrome Extension that appends RateMyProfessor.com reviews for professors on class registration pages at my school.
---
![RateMyCarl Image](http://i.imgur.com/FPchPSg.png)

**EDIT : I took down the Chrome Extension from the App Store and from GitHub after being contacted by RateMyProfessor.com – Know that scraping data from RateMyProfessor.com and publicly posting it violates their Terms of Agreement. The following blog post just details the high-level technical details of how one might create a project without the public RateMyProfessor.com API and it'd be strictly for personal, project use.**

This past weekend, I embarked on a small side project I’ve been wanting to do for some time now – Creating a chrome extension that appends RateMyProfessor.com reviews for professors on the class registration page.

At Carleton, we have two places where we go to search for classes in the upcoming term, or register for them : The Hub(Internal Dashboard for all students and faculty), and ENROLL(Where you can see all course listings).

The problem I was solving was an inefficient workflow myself and I’m sure many College students have faced before :

Look for new classes/Register for new classes
Come across new professors, wonder how they are, go to RateMyProfessor and search their name
Read ratings and reviews
Repeat step 2 and 3 for all professors
I wanted to change it to a more efficient workflow :

While browsing for new classes, have average ratings for all professors right next to their name available
If I want to read more reviews/submit review for that professor, go to their page directly in one click without searching for their name on RateMyProfessor.com
A Chrome extension seemed to be perfect, since it’d be small in size, and with its ability to inject javascript, html/css to specific pages it would exactly serve the purpose I was looking for.

So before you had this…(Just professor name, course info)

![Image2](http://i.imgur.com/eKoD5JR.png)

**Which now turns into these : (Rating for professor, most recent review, and link to RateMyProfessor profile page)**

![Image3](http://i.imgur.com/yK2E6ab.png)
![Image4](http://i.imgur.com/9tGMdB9.png)

The two biggest challenges from the project were, formatting professor names to match RateMyProfessor search query and making requests to RateMyProfessor to get data back.

I had to do DOM manipulation from Hub and Enroll to fetch professor all names, which came in different formats. The Hub would have professor names listed as **“LastName, FirstName”** whereas ENROLL had them listed as **“FirstName MiddleInitial LastName”.**

So I had to format them in a way that RateMyProfessor wanted them, which was generally **“FirstName LastName”**, while handling some edge cases(Professors that have accents in their names). I ran searches for multiple departments to see if there were unique cases I didn’t catch(Classes with multiple instructors, etc).

The most important part to point out perhaps is how to get data from RateMyProfessor.com since there is no official API. A huge credit goes to [Casey](https://github.com/cbarbello/) who created RateMyGold(Same version of the app at UCSB) for initially writing up this workaround on Reddit.

Below is a brief breakdown(Actual code taken down by RateMyProfessor.com’s request)

1. So basically, first you have a url that makes a get request using the professor’s name. This is used to find the professor’s specific profile if it exists.
2. Then once we get data back as HTML or XML, we use DOM manipulation(Yes you read that correctly) to locate the professor’s profile link and make another request.
3. Once we have the link, we make a second request to get meaningful data about each professor(ratings, reviews).
4. Then, once we have all the data we want, we can create new elements to store the data into, and append them!

The project was a lot of fun, I liked how it was a small project but it provided quite a lot of value personally to myself since it was scratching an itch I’ve had for awhile.

Furthermore, it was great practice writing some ES6, learning about promises and once again realizing how cool Chrome extensions can be for side projects.

A future feature I’m going to work on is students actually being able to submit reviews directly from the Chrome Extension – I’d need to get users to fill out data in the extension and make a POST request to RateMyProfessor.com.

Let me know if there are any questions or feedback.