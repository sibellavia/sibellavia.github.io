---
title: 'Persistent Bugger – Code solution'
date: '2021-09-08'
series: 'Codewars Kata – Code solutions'
---

Hello there. I was digging in Codewars and I found a *kata* that piqued my curiosity:

> Write a function, **persistence**, that takes in a positive parameter **num** and returns its multiplicative persistence, which is the number of times you must multiply the digits in **num** until you reach a single digit.
> For example:

    persistence(39) # returns 3, because 3*9=27, 2*7=14, 1*4=4
                    # and 4 has only one digit
                                                
    persistence(999) # returns 4, because 9*9*9=729, 7*2*9=126,
                     # 1*2*6=12, and finally 1*2=2`

    persistence(4)   # returns 0, because 4 is already a one-digit number

If it is not fully understandable, perhaps it is better to clarify first what multiplicative persistence is. 

## Persistence of a number

From Wikipedia:

> In mathematics, the persistence of a number is the number of times one must apply a given operation to an integer before reaching a fixed point at which the operation no longer alters the number.
> For example: the additive persistence of 2718 is 2: first we find that 2 + 7 + 1 + 8 = 18, and then that 1 + 8 = 9. The multiplicative persistence of 39 is 3, because it takes three steps to reduce 39 to a single digit: 39 → 27 → 14 → 4. Also, 39 is the smallest number of multiplicative persistence 3.

In our case, we have to consider not the sum, but the product of the digits.

## My solution

Here's how I solved the problem, in Python:

![my code.](/persistent-bugger/persistent-bugger.png)

I declared a function that takes the number **n** as input. About the while loop: as long as the number **n** always has more than two digits, these are multiplied by each other. The counter **mp** (Multiplicative Persistence) increases and the loop renews **n** with the number obtained. When the fixed point is reached, then the function will return **mp**.

Tested with numerous scenarios and it works!

Hope you found it interesting. Thanks for reading and SYL with the next solution.