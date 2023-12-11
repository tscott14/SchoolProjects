#! /bin/bash

# Tristan Scott
# COSC 4327.001
# Oct 6, 2023
# Assignment 2 - Question 2

# This question asks us to print out information 
# about the last three users added to the system.
# The details asked for each user is as follows:
#	Unix name
#	Fullname
#	Hashed Password
#	Home Directory
# These fields are to be printed on a single line
# per user; being delimited by commas.

# Get array of contents requested
# Last three username delimited by newline.
USERNAMES="$(cat /etc/passwd | tail -n3 | cut -d ":" -f 1)"

# Last three Full Names delimited by newline.
FULLNAMES="$(cat /etc/passwd | tail -n3 | cut -d ":" -f 5 | sed 's/,//g')"

# Last three hashed passwords delimited by newline.
USERPASSWDS="$(sudo cat /etc/shadow | tail -n3 | cut -d ":" -f2 | sed 's/\*/NO_HASHED_PASSWORD_PROVIDED/g')"

# Last three home folders delimited by newline.
HOMEDIRS="$(cat /etc/passwd | tail -n3 | cut -d ":" -f 6)"

# Print the info for user 1.
echo -e "$(echo $USERNAMES | awk '{print $1}'),\t	\
	$(echo $FULLNAMES | awk '{print $1}'),\t	\
	$(echo $USERPASSWDS | awk '{print $1}'),\t	\
	$(echo $HOMEDIRS | awk '{print $1}')" > output.txt

# Print the info for user 2.
echo -e "$(echo $USERNAMES | awk '{print $2}'),\t	\
	$(echo $FULLNAMES | awk '{print $2}'),\t	\
	$(echo $USERPASSWDS | awk '{print $2}'),\t	\
	$(echo $HOMEDIRS | awk '{print $2}')" >> output.txt

# Print the info for user 3.
echo -e "$(echo $USERNAMES | awk '{print $3}'),\t	\
	$(echo $FULLNAMES | awk '{print $3}'),\t	\
	$(echo $USERPASSWDS | awk '{print $3}'),\t	\
	$(echo $HOMEDIRS | awk '{print $3}')" >> output.txt

cat output.txt
