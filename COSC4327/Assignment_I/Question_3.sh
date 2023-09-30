#! /bin/bash

# Tristan Scott
# COSC 4327.001
# Assignment 1 -- Question 3

# Question 3a
mkdir ~/work

# Question 3b
ls /bin -A | head -n 10 >> ~/work/binaries.list

# Question 3c
cat /etc/passwd | tail -n 5 >> ~/work/password.txt

# Question 3d
# This does not keep the file structure but the question does not 
# explicitly request for the file structure to be maintained.
mkdir -p ~/Documents/work/BACKUP/
cp -f $(find ~/ -type f -mtime -14) ~/Documents/work/BACKUP
