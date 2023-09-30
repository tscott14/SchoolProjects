#! /bin/bash

# Tristan Scott
# COSC 4327.001
# Assignment 1 -- Question 2

# Make all the directories in one go.
mkdir -p /home/semesters/{spring,summer,fall}

# Print the first 4 months of 2023 starting in Janurary.
cal 1 2023 -n4 >> /home/semesters/spring/months.txt
# Print the second 4 months of 2023 starting in May.
cal 5 2023 -n4 >> /home/semesters/summer/months.txt
# Print the third 4 months of 2023 starting in September.
cal 9 2023 -n4 >> /home/semesters/fall/months.txt

