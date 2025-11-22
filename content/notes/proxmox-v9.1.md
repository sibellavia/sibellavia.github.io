---
title: "Proxmox VE 9.1"
date: 2025-11-22T12:02:00+01:00
---

[Proxmox VE 9.1, new release.](https://www.proxmox.com/en/about/company-details/press-releases/proxmox-virtual-environment-9-1) The most important part of this new release is definitely the support for OCI images, getting closer and closer to a Docker-style workload. But what does this actually mean?

To run containers in Proxmox before, you first had to create an LXC container, install Docker, and only then would you finally be able to run the container. With this new release, Proxmox allows you to query and pull directly from the Registry the image you need, unpack it, and then convert it into a disk image that LXC can use. It’s as if it uses them as templates for LXC containers. So, it isn’t native support in the strict sense: Proxmox continues to use LXC, this is simply a convenience feature to allow generating an LXC from an OCI image.

What I’m wondering is how the update of these images is handled. I’ve read some posts and watched a few videos, but it seems Proxmox hasn’t gone quite this far yet. 