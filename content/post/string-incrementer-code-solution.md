---
title: 'String Incrementer – Code solution'
date: '2022-02-05'
series: 'Codewars Kata – Code solutions'
---

Hello there. Another day, another kata from Codewars. Here's *String Incrementer*:

>Your job is to write a function which increments a string, to create a new string.
>
> - If the string already ends with a number, the number should be incremented by 1.
> - If the string does not end with a number. the number 1 should be appended to the new string.
>
>Examples:
>
>foo -> foo1
>
>foobar23 -> foobar24
>
>foo0042 -> foo0043
>
>foo9 -> foo10
>
>foo099 -> foo100
>
>*Attention: If the number has leading zeros the amount of digits should be considered.*

I have to tell the truth. At first I thought it was trivial. I was doing it in Pair Programming with my best friend, and then we realised that the problem of leading zeros had to be taken into account more. The reported tests are samples, and there are more complicated conditions to be met.

## My solution
```python
def increment_string(strng):
                    
    stripped = strng.rstrip('1234567890')

    digits = strng[len(stripped):]

    if len(digits) == 0:
        return strng + "1"
    else:
        length = len(digits)
        digits_plus_one = 1 + int(digits)
        digits_plus_one = str(digits_plus_one).zfill(length)

        return stripped + digits_plus_one
```

In tests, the digits are always placed on the right. So at first I strip the decimals from the right, and store the characters in a *stripped* variable. In *digits* you then get the other part of the string that has been stripped, i.e. all the digits.

If the variable containing the digits is null (its length is zero), then it will merge the variable containing the characters with a number 1.

Otherwise, it converts the variable *digits* to an integer, which is incremented by one. But in this way, after the conversion to integer, the numeric variable loses its leading zeros, if any. It is necessary to add them back. The *zfill* method comes to our aid, adding the missing zeros to the left of the digit (the input parameter is the previously saved length, computing the difference in length between the two variables then adds as many zeros as there were before).

At this point the merge between the characters and the digits is returned, increased by one.

In addition to this solution, there is an alternative, more elegant one. The most popular on Codewars:

```python
def increment_string(strng):
    characters = strng.rstrip('0123456789')
    digits = strng[len(characters):]
    
    if digits == "": 
        return characters + "1"
    else:
        return characters + str(int(digits) + 1).zfill(len(digits))
```

I hope this was useful. Bye!