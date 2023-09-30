#! /bin/bash

# Tristan Scott
# COSC 4327.001
# Assignment 1 -- Question 6

# Make the mount point if it doesn't already exist.
mkdir -p /mnt

# Assuming that the USB device partion to be 
# copied to is called /dev/sdb1.
mount /dev/sdb1 /mnt

# Copy everything recursively from here to /mnt/
cp -fr . /mnt/.

