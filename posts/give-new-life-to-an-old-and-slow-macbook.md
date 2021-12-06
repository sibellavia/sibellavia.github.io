---
title: 'Give new life to an old and slow MacBook Air with Xubuntu'
date: '2021-12-05'
id: 'give-new-life-to-an-old-and-slow-macbook'
---

My girlfriend has an old 2009 MacBook Air. After some updates of macOS, the computer had become unusable: really very slow, it was impossible even to use any browser. The only solution that seemed possible to make it at least usable was to replace the operating system. So I immediately opted for Linux. At first I tried Ubuntu: after installing it seemed to work well, but GNOME seemed to weigh everything down. So I turned to an even more efficient solution, and installed [Xubuntu.](https://xubuntu.org/) Which is much lighter: it uses Xfce as desktop environment, which seems to me much more stable, efficient and configurable. Definitely more suitable for older hardware!

![MacBook Air 2009 with Xubuntu](/images/give-new-life-to-an-old-and-slow-macbook/macbook-air-with-xubuntu.png)
*MacBook Air 2009 finally back to life with Xubuntu.*

I was very surprised with the result. Xubuntu seems to me the best Linux distribution for those who want to speed up and use an old MacBook. However, it must also be said that after the installation I had to perform some tricks and solve some long-standing bugs. Below I explain how.

## How I installed Xubuntu

Very simple. I downloaded the ISO from [Xubuntu official website,](https://xubuntu.org/download) then I made a bootable USB flash drive with [Etcher](https://www.balena.io/etcher/) and inserted it into the MacBook. I booted from the pendrive and proceeded with the installation wizard. 

By the way, I've read on some forums that it is advisable to maintain the dual boot with macOS + Linux. Anyway, I did the full disk erase, removing macOS and keeping only Xubuntu. Note that although your MacBook is very old, you will always be able to restore macOS by simply running Disk Utility while booting the computer.

## How to fix Wi-Fi

After installing Xubuntu, the Wi-Fi was not working. It wasn't detecting networks to connect to. Again, the solution was quite simple.

Go to "Software & Updates" and go to the "Additional Drivers" tab. You should check the "Using Broadcom 802.11 ..." box. If no option is present, you may want to run these commands from the terminal:

```unix
sudo apt-get update
sudo apt-get --reinstall install bcmwl-kernel-source

sudo modprobe -r b43 ssb wl brcmfmac brcmsmac bcma
sudo modprobe wl
```

You can find more information [on this link (which helped me solve the problem).](https://askubuntu.com/questions/1076964/macbook-can-t-find-wifi-for-ubuntu-18-04)

## How to fix long boot times and black/white screen

The first few times I started the computer, the computer would suffer very long boot times, and often a white screen would appear on which it would remain for a few seconds.

I did the following:

1. Restarted and held CMD + R
2. Utilities -> Terminal
3. Then typed:

```unix
bless --device /dev/disk0s1 --setBoot --legacy
```

I'm assuming that your bootloader is on sda1, otherwise /dev/disk0s2 if it's on sda2, etc. [More details here.](https://help.ubuntu.com/community/MactelSupportTeam/AppleIntelInstallation)

## Trackpad issues

I had some issues with the trackpad at first. The cursor would move very slowly and jerkily. I actually solved it in a very basic way, and that is by updating the packages:

```unix
sudo apt-get clean
sudo apt-get update
sudo apt-get dist-upgrade -y
```

And so I solved it. But I read on the internet that many users couldn't solve this way, so I found [mtrack, a Github project.](https://github.com/BlueDragonX/xf86-input-mtrack) An Xorg driver for multitouch trackpads. There is a very comprehensive and clear guide on how to install it. Many, thanks to this, have managed to solve the issue.

## Other issues

You may find other small bugs and problems. To solve them, I did a lot of research on Google and visited many forums, testing different solutions. I suggest you do the same, and visit the section of [the official Ubuntu forum, Ask Ubuntu, dedicated to the most relevant Macbook questions.](https://askubuntu.com/questions/tagged/macbook-pro?sort=frequent)

If you wish to have a step-by-step guide on how to install Xubuntu, there is a plethora of guides on the internet that you can draw from. I recommend looking at more than one.

That's it. See ya!

*The page is constantly being updated. Last modified: 06/12/21.*