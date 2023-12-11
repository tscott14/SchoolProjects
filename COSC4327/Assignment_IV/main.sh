#! /bin/bash

# Tristan Scott
# COSC 4327.001
# Assignment IV
# November 13, 2023
#
# Purpose: Implement a series of unix/linux commands
#	specified by the assignment document.

# Adds the aliases md for mkdir, rd for rmdir, x for exit, and exe for “chmod +x”
echo -ne 'Running commands for task 1...\n'
alias md='mkdir'
alias rd='rmdir'
alias x='exit'
alias exe='chmod +x'

# Changes the prompt (PS1) so that it displays the current command number inside
# square brackets, the current directory, the current date, the current time, and a prompt
# which is $ or # depending if the user is root.
echo -ne 'Running commands for task 2...\n'
PS1="[\#] \w \t \$"
echo "PS1 has now has value \"$PS1\""


# Gets the full name of the user from the /etc/passwd file and stores it in a variable called
# username
echo -ne 'Running commands for task 3...\n'
USERNAME=$(grep "$USER" /etc/passwd | cut -d':' -f5 | cut -d',' -f1)
echo -e "USERNAME is $USERNAME"



# Displays the line "Last 3 commands" followed by the last three (3) commands
# executed by the user.
echo -ne 'Running commands for task 4...\n'
cat ~/.bash_history | tail -n 3



# Appends the current directory (.) and a subdirectory of the user’s home directory
# named bin (e.g. /home/alice/bin) to the PATH variable
echo -ne 'Running commands for task 5...\n'
PATH="$PATH:$(pwd)"
PATH="$PATH:$HOME/bin"

# Changes the second prompt (PS2) so that it displays "(more) " whenever additional
# text is expected from the user.
echo -ne 'Running commands for task 6...\n'
PS2='(more) '
echo "PS2 now has has value \"$PS2\""



# Get the correct day of the week (Sunday, Monday, Tuesday, Wednesday, Thursday,
# Friday, or Saturday) and puts it in a variable $dayofweek
echo -ne 'Running commands for task 7...\n'
DAYOFWEEK_ENUM=$(date +"%u")



# Displays the message "Happy " followed by $dayofweek
echo -ne 'Running commands for task 8...\n'
case $DAYOFWEEK_ENUM in	
	1) DAYOFWEEK='Monday';;
	2) DAYOFWEEK='Tuesday';;
	3) DAYOFWEEK='Wednesday';;
	4) DAYOFWEEK='Thursday';;
	5) DAYOFWEEK='Friday';;
	6) DAYOFWEEK='Saturday';; 
	7) DAYOFWEEK='Sunday';;
esac
echo -ne "Happy $DAYOFWEEK\n"


echo -ne 'Running commands for task 9...\n'
# Creates a .exrc file in the $HOME directory that sets the following for vi
[[ -z $HOME/.exrc ]] && touch $HOME/.exrc

# * Maps the F4 key to ZZ
echo 'map #4 ZZ' >> $HOME/.exrc

# * Shows line numbers
echo 'set nu'>> $HOME/.exrc

# * Sets the abbreviation fori to for (int i=1; i<=10; i++)
echo 'ab fori for (int i=1; i<=10; i++)' >> $HOME/.exrc

# Executes another script called goals
# * The goals script relies on a 7-line text file you create where each line contains
# 	a description of something to accomplish or do each day
echo -ne 'Running commands for task 10...\n'
GOALS_TEXT_FILE="$HOME/goals.txt"

# Create the goals.txt file if it does not already exist.
if [[ ! -f $GOALS_TEXT_FILE ]]; then
	echo -e 'Sunday Time for church!' >> $GOALS_TEXT_FILE
	echo -e 'Monday Unfortunately, you have work today.' >> $GOALS_TEXT_FILE
	echo -e 'Tuesday Just got to make it to Wednesday.' >> $GOALS_TEXT_FILE
	echo -e 'Wednesday The week is half way over!' >> $GOALS_TEXT_FILE
	echo -e 'Thursday Hey, tomorrow is Friday!!!' >> $GOALS_TEXT_FILE
	echo -e 'Friday You know what time it is. TGIF!' >> $GOALS_TEXT_FILE
	echo -e 'Saturday Time to relax...' >> $GOALS_TEXT_FILE
fi

# * If $dayofweek is Monday, Tuesday, ..., Sunday, the goals script should display
# 	the first, second, ..., seventh line of the text file, respectively
# grep is encapsulated and passed into echo to eliminate match highlighting.
echo $(grep "$DAYOFWEEK"  "$GOALS_TEXT_FILE" | cut -d' ' -f2-)
