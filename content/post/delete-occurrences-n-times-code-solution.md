---
title: 'Delete occurrences of an element if it occurs more than n times – Code solution'
date: '2021-09-13'
id: 'delete-occurrences-n-times-code-solution'
---

Yes, I am enjoying Codewars a lot. Here's another kata:

> Given a list lst and a number N, create a new list that contains each number of lst at most N times without reordering. For example if N = 2, and the input is [1,2,3,1,2,1,2,3], you take [1,2,3,1,2], drop the next [1,2] since this would lead to 1 and 2 being in the result 3 times, and then take 3, which leads to [1,2,3,1,2,3].
> For example:

    delete_nth ([1,1,1,1],2) # return [1,1]
    delete_nth ([20,37,20,21],1) # return [20,37,21]

## My solution

I used Python in this case too, because I'm practicing it.

![first solution.](/delete-occurrences/first-solution.png)

For this first solution I have initialized two variables, **number_to_check** and **counter**.

I then created two nested for loops. In the first, I scroll through all the integers on the list. At each occurrence, I assign item to number_to_check. Immediately after the assignment, another cycle is started which again runs through all the elements of the list and makes a comparison between the considered value and number_to_check. Here I have inserted some flow controls: trivially, **if the counter is greater than max_e** (the maximum value of the occurrences that an item can have), **then the element is eliminated from the list.** Otherwise the counter increases and the loop continues until the end of the list.

That works, but we can refactor the code to make it leaner. And here comes the second solution.

## Refactoring

![second solution.](/delete-occurrences/second-solution.png)

Here we initialize **res** as an empty list. In the for loop the magic happens. Thanks to the **count() method** we are able to check if the occurrences of item exceed the maximum index **max_e:** if so, **item** is ignored and we move forward, otherwise **item is added to the res list.** In this way we will have a list in which there will be only elements that do not occur more than n times. Much easier!

Hope you liked it. Thanks for reading and SYL with the next solution.