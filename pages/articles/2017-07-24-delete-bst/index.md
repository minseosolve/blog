---
title: Using recursion to delete a node from a binary search tree
date: '2017-07-25T02:52:17.238Z'
layout: post
draft: true
path: /delete-bst/
category: Algorithms
description: >-
  We will explore an algorithm to delete a node from a binary search tree while
  taking advantage of recursion
---
While binary search trees support easy insertion and search, deletion is probably the trickier operation out of all its interface.

Let's look at a simpler version of the **delete** operation, by implementing **deleteMin()**. Since we want to delete the minimum, the first thing to do is how we plan on finding the minimum - we will have to traverse all the way down to the leftmost node to find the minimum. We can use a recursive approach to do this - Our *deleteMin()* function will simply do three things :

1. Check if it has a leftChild, and if it doesn't(this means we've reached minimum), *simply return the rightChild*. We return the rightChild because we want to handle both cases - one where our minimum is a leaf node with no children, and another where our minimum has one child(rightChild). And regardless of the rightChild exists or not, we will return it to the parent.

2. Re-set the rightChild links

3. **Return the current tree**. This is especially important because we need to do this to take advantage of our recursive approach - we are using recursion to travel all the way down to our minimum, and as we return back up in the call stack, we have **access to the child from the parent's perspective**, and we can simply re-set the rightChild pointer.

```
BinarySearchTree.prototype.deleteMin = function() {
  //if we've reached leftmost node, return its rightChild
  //its rightChild can be either an element, or null
  if (this.leftChild === null) {
    return this.rightChild;
  }
  this.leftChild = this.leftChild.deleteMin();
  //need to return this every time so the parent can preserve the leftChild
  return this;
};
```

What about a general **delete()** operation? We can take the same recursive approach, this time we just have to break the problem down into three large cases : One where the node to delete is a leaf, one where it has one child, and one where it has two children. The last case involving two children is the trickiest one, and it involves first finding the **minimum in the right-subtree**(Since this is the node that will replace our doomed node), copying its value to our deleting node, and then removing this duplicate node in the right-subtree. Another useful note here is to pass the reference of the parent node(root node) as an argument, since we won't be able to change the `this` context from inside the method.

```
BinarySearchTree.prototype.delete = function(val, root) {
  //we will have to re-set 'this'(which isn't possible), so we will pass in an additional parameter called root that will be initialized to 'this'
  root = root || this;

  if (!root) return null;

  //Go left
  if (root.data > val) {
    root.leftChild = root.delete(val, root.leftChild);

    //Go right
  } else if (root.data < val) {
    root.rightChild = root.delete(val, root.rightChild);
  } else {
    //We've found our node, need to delete it

    //Caes 1 : Leaf node
    if (root.leftChild === null && root.rightChild === null) {
      root = null;
    } else if (root.leftChild === null) {
      //Case 2 : Only rightChild or Only leftChild
      root = root.rightChild;
    } else if (root.rightChild === null) {
      root = root.leftChild;
    } else {
      //Case 3 : Two children

      //Find minimum in rightSubtree
      let minInRightSubTree = root.rightChild.findMin();
      //Copy this data into root!
      root.data = minInRightSubTree.data;

      //now there is a duplicate node in RightSubtree, delete it(We're calling it FROM the reference of the right subtree.)
      root.rightChild = root.delete(minInRightSubTree.data, root.rightChild);
    }
  }

  //Don't forget to return root
  return root;
};
```

For more practice with binary search trees, check out my [repo](https://github.com/minseokim/data-structures-tdd) that incorporates a test-driven development approach to implementing a binary search tree from scratch.