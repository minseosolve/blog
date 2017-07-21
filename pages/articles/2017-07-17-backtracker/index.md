---
title: 'New side project : Backtracker'
date: '2017-07-11T03:29:30.284Z'
layout: post
path: "/projects-backtracker/"
category: "Projects"
description:
  I just finished a small side project using React.js called Backtracker - it's
  an algorithm learning/visualization tool to help learn recursive
  algorithms(especially backtracking) with step-by-step visualizations. Check it out!
---
[![Image](http://i.imgur.com/ZHs5rqz.png)](https://minseokim.github.io/backtracker)

[Backtracker](https://minseokim.github.io/backtracker) is an algorithm learning/visualization tool built with **React.js** that displays step-by-step environment visualization for popular recursive algorithms.

I created to scratch my own itch of wanting to develop a more solid mental model of how backtracking algorithms work - When solving them I'd find myself having to use pen and paper in order to follow the recursion call stack all the way through the algorithm. This is precisely what *Backtracker* helps out with - you can click through, or navigate with a keyboard, each step of the recursive algorithm. It was heavily inspired by Ovidiu's [Illustrated Algorithms](https://illustrated-algorithms.now.sh/) so I have to give credit where it's due!

It currently supports the following popular recursive algorithms :

- [**Generate Parentheses**](https://leetcode.com/problems/generate-parentheses)
- **Rock, Paper, Scissors Permutation**
- [**Permutations**](https://leetcode.com/problems/permutations/#/description)
- [**Combinations**](https://leetcode.com/problems/combinations/#/description)
- [**Subsets**](https://leetcode.com/problems/subsets/#/description)

The most interesting part about the project was implementing a 'trace' function that would essentially create a snapshot of each algorithm at every step. This meant I'd have to invoke each recursive algorithm, think about what would constitute as a single step(assignment, comparison, entering recursion, returning, etc), and for each step create a snapshot of the environment and store it. All steps are stored as application state, and all React does is render each step upon user click/keyboard event.

The trace function has an API for the following types of events :

- initWrapper (the wrapper function for the algorithm is invoked)
- initRecursive (the recursive function for the algorithm is invoked)
- compare
- assign
- AddToSolution
- returnRecursive (returning from Recursive function)
- return (just return any value)
- finishWrapper (wrapper is finished)
- invokeFirstRecursiveCall (The first invocation of the recursive function)
- recurse (Invoke subsequent invocations)

Each step keeps track of :
  1. callStackDepth
  2. CurrentLine
  3. Type
  4. Execution Context(Variables, etc)


The trace function is built to handle any kind of recursive algorithms, provided you give it the right API's for each step.

For future features, I plan on improving the UI by adding animations, and SVGs or pictures for the environment variables instead of displaying as JSON, and adding a small walkthrough for solving general backtracking problems. Also, more canonical backtracking problems like Sudoku, and N-Queens.