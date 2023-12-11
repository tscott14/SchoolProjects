#! /bin/bash

# Tristan Scott
# COSC 4327.001
# Oct 6, 2023
# Assignment 2 - Question 1

# The Question here asks us to printout the follow information:
# 	Current Directory: /home/alice
# 	Number of Files: 11
# 	Largest Hidden File: .hidden2 800
# 	C files: assign1.c, hello.c, program.c

# Get Data Requested.
CURR_DIR=$(pwd)
NUM_OF_FILES=$(ls | wc -w)
LARG_HIDD_FILE=$(find . -type f -name '.*' -printf "%f %s\n" | sort -r -n -k2 |  head -n1)
C_FILES=$(find ~/ -name "*.c" -printf "%f " && echo)

# Print the data requested.
echo "Current Directory: $CURR_DIR"
echo "Number of Files: $NUM_OF_FILES"
echo "Largest Hidden File: $LARG_HIDD_FILE"
echo "C files: $C_FILES"

