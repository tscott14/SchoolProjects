#! /bin/bash

# Tristan Scott
# COSC 4340.001
# September 28, 2023
# Assignment 1 -- Pascal Programming Assignment
#
# DESC: This is the shell script I used to quickly
#       build and run my pascal program. To accomplish
#       this compilation, I used fpc i.e. Free Pascal.

# Create the bin directory if it does not already exist.
mkdir -p bin

# Clear screen for easier debugging.
clear

# Build and run the Pascal Assignment.
fpc main.pas -obin/main && \
rm bin/main.o && \
./bin/main 