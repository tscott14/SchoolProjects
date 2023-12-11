#! /bin/bash

# clisp is what was used to develope assignment III.
# on my Linux machine.


if [[ -n $(command -v tee) ]]; then
    clisp main.lisp | tee output.txt
else
    clisp main.lisp > output.txt
    cat output.txt
fi
