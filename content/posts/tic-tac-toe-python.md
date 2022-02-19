---
title: 'A simple Tic Tac Toe in Python'
date: '2022-02-19'
id: 'tic-tac-toe-python'
---

Hello there. I developed a simple Tic Tac Toe in Python, just to keep the gears moving and to practice some OOP. [You can check out my repository on Github.](https://github.com/simoneb1x/tic-tac-toe-python)

![Tic Tac Toe in Python](/tic-tac-toe-python/cli.png)

As you can see, it's very simple. It provides for the presence of four classes:

- TicTacToe, which includes a series of methods for the realization of the board and for controlling the available and remaining moves
- Player, which is the basis for generating the other two playable classes, HumanPlayer and RandomComputerPlayer
- HumanPlayer, obtained by inheritance and that allows with the get_move method to express the move
- RandomComputerPlayer, basically the class that allows the computer to express a random move on the board

Can be played via CLI (GUIs suck) and you can play both in Singleplayer and Multiplayer.

Just to share this little virtuosity with the world. Thanks for reading this far. Seeya!