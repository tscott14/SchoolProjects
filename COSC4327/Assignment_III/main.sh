#! /bin/bash
#############################################
###                                         ##
## Tristan Scott                             #
## COSC 4327.001                             ##
## Dr. Leonard Brown                          #
## Assignment III -- Shell Game Script        ##
## October 30, 2023 @ 11:59PM                 ##
###                                           #
## Description: A basic Lord of the Rings    ##
##      themed terminal game.                #
###                                         ##
#############################################

# ADDITIONAL: Please read the attached README.md for
#               further information and credits.

# Define Various Constants
TRUE='TRUE'
FALSE='FALSE'

# Cardinal Directions
NORTH='North'
SOUTH='South'
EAST='East'
WEST='West'

# Land Type Field Constants
LAND_TITLE_FIELD='Title'
LAND_SPLASH_PATH_FIELD='SplashPath'
LAND_LAYOUT_PATH_FIELD='LayoutPath'
LAND_CELL_FIELD='Cell'
LAND_DESC_FIELD='Description'
LAND_SEARCH_FIELD='Search'

# Locations/names of config files.
CONFIG_FILE='config.conf'
MAP_FILE='map.conf'
NAV_FILE='nav.conf'

# Set execution flags based on passed in @parameters.
[[ $1 == 'no_ascii_art' ]] && NO_ASCII_ART="$TRUE"

# Environment Variables
IFS=$'\n'

#################################
# Basic String/Output Utilities #
#################################

# @brief Print a blank line. Eye-candy for more elegant code.
#
# @param COUNT - The number of lines to print.
#
# @return A string of COUNT newlines.
print_blank_lines() {
    local count="$1"

    [[ -z $count ]] && count=1

    local unused=''
    for unused in {0..$count}; do
        echo -ne "\n"
    done
}

# @brief Print a string to the screen utilizing a set console width for word wrapping.
#
# @param LINE_WIDTH - The total length of the console width to use.
# @param BLOCK - The block of text to print.
#
# @return The text but with correct width.
print_console() {
    local line_width=$1
    local block="$2"

    for line in $block; do
        local console_text=$(echo "$line" | fold -s -w $line_width)
        echo -ne "$console_text\n"
    done

}

# @brief Center a string of text along a single line.
#
# @param LINE_WIDTH - The total length of the console width to use.
# @param TEXT - The text to center.
#
# @return The text with correct padding before and after original text.
center_text() {
    local line_width=$1
    local text="$2"

    # Magical line of text retrieved from the internet.
    # Obtained here: 'https://stackoverflow.com/questions/12471951/text-alignment-center-shell-script'
    local output=$(
        echo -e "$text" |
            sed -e :a -e "s/^.\{1,$line_width\}$/ & /;ta" |
            tr -d '\n' |
            head -c $line_width
    )
    echo -ne "$(print_console $line_width $output)"
}

# @brief Centers a list of strings delimited by a newline.
#
# @param LINE_WIDTH - Line width to center block within.
# @param TEXT - The block of text, ASCII or a paragraph
#
# @return The original block but with each line contain correct padding before and after it.
center_block() {
    local line_width=$1
    local block="$2"
    for line in $block; do
        local output=$(center_text "$line_width" "$line")
        echo -ne "$output\n"
    done
}

# @brief Wrapper function for center_text. Folds the text as well to emulate a line-wrap effect.
#
# @param LINE_WIDTH - Line width to center block within.
# @param TEXT- The text to center.
#
# @return The centered text with correct padding before and after.
print_text_center() {
    local line_width=$1
    local text="$2"
    local block=$(echo -e "$text\n" | fold -s -w $line_width)
    local output=$(center_block $CONSOLE_WIDTH "$block")
    echo -ne "$output\n"
}

# @brief Similar to print_text_center, but spectifically designed for quotes.
#
# @param LINE_WIDTH - Line width to center block within.
# @param TEXT- The text to center.
#
# @return The centered quote with correct padding before and after.
print_quote_center() {
    local line_width=$1
    local text="$2"
    local output=$(echo -e "$text\n" | fold -s -w $line_width)
    center_block $CONSOLE_WIDTH "$output"
}

##########################
# Configuration Loading. #
##########################

# Config Helper Functions
# @brief Load a key-value from a config file.
#
# @param CONF_FILE - The filename to load key from.
# @param KEY - The key to get the value of.
#
# @return The value associated with the key @parameter.
get_config() {
    local conf_file="$1"
    local key="$2"

    local conf_delim='='
    local value=$(
        grep "$key" "$conf_file" |
            cut -d"$conf_delim" -f2- |
            sed -e 's/^"//' -e 's/"$//'
    )
    echo -ne "$value"
}

# Load Static Runtime Variables
PASSCODE=$(get_config $CONFIG_FILE 'PasscodeRegex')
CONSOLE_WIDTH=$(get_config $CONFIG_FILE 'ConsoleWidth')
QUOTE_WIDTH=$(get_config $CONFIG_FILE 'QuoteWidth')
CURR_LAND_ID=$(get_config $CONFIG_FILE 'DefaultLandID')
DEFAULT_NAME=$(get_config $CONFIG_FILE 'DefaultPlayerName')

# Load Program Paths
ASCII_MAP_SPLASHES=$(get_config $CONFIG_FILE 'MapSplashes')
ASCII_MAP_LAYOUTS=$(get_config $CONFIG_FILE 'MapLayouts')
ASCII_MAP_FULL=$(get_config $CONFIG_FILE 'MapFull')

# Load Various Texts
WELCOME_TEXT_PATH=$(get_config $CONFIG_FILE 'WelcomeText')
CREDENTIALS_TEXT_PATH=$(get_config $CONFIG_FILE 'CredentialsText')
HELP_TEXT_PATH=$(get_config $CONFIG_FILE 'HelpText')
LORE_TEXT_PATH=$(get_config $CONFIG_FILE 'LoreText')
INVALID_IO_TEXT_PATH=$(get_config $CONFIG_FILE 'InvalidInputText')
INVALID_DIRECTION=$(get_config $CONFIG_FILE 'InvalidPath')
VICTORY_TEXT_PATH=$(get_config $CONFIG_FILE 'VictoryText')

# Load Synamic Runtime Variables
PLAYER_NAME="$DEFAULT_NAME"
QUIT_GAME="$FALSE"

############################
# Various Helper Functions #
############################

# @brief Helper function to minimize promptings.
#
# @param PROMPT - The prompt statement to supply the user.
#
# @return The value enter by the user.
prompt() {
    local prompt_msg="$1"

    local value=''
    read -p "$prompt_msg" value
    echo -ne "$value"
}

##############################################################
# Functionality to handle traveling from one land to another #
##############################################################

# @brief Get the directional suggestion for the prompt.
#
# @param LAND_KEY - The KEY to the corosponding land data in the nav.conf file
#
# @return A prompt of the allowed directions of travel.
get_directions() {
    local land_key="$1"

    local land_north=$(get_config "$NAV_FILE" "$land_key.$NORTH")
    local land_south=$(get_config "$NAV_FILE" "$land_key.$SOUTH")
    local land_east=$(get_config "$NAV_FILE" "$land_key.$EAST")
    local land_west=$(get_config "$NAV_FILE" "$land_key.$WEST")

    local prompt_dirs=''
    [[ -n $land_north ]] && prompt_dirs="$prompt_dirs(N)orth\n"
    [[ -n $land_south ]] && prompt_dirs="$prompt_dirs(S)outh\n"
    [[ -n $land_east ]] && prompt_dirs="$prompt_dirs(E)ast\n"
    [[ -n $land_west ]] && prompt_dirs="$prompt_dirs(W)est\n"

    echo -ne "$prompt_dirs"
}

# @brief Move from one land to another.
#
# @param LAND_ID - The ID of the current land occupied.
# @param DIRECRION_OF_TRAVEL - One of the four cardnal directions to travel.
travel() {
    local land_key="$1"
    local direction_of_travel="$2"

    local key="$land_key.$direction_of_travel"
    local value=$(get_config $NAV_FILE $key)

    if [[ -n $value ]]; then
        CURR_LAND_ID=$value
    fi
}

###############################
# Various Animation functions #
###############################

# @brief Animate a searching routine.
#
# @param TIME_INT - The interval from one '.' to another.
# @param TEXT - The name of the process.
process_text() {
    local time_int=$1
    local text="$2"

    echo -n "$text"
    local unused=''
    for unused in {0..3}; do
        echo -n '.'
        sleep $time_int
    done
    echo -ne '\n'
}

##########################
# Map Processing Section #
##########################

# @brief Print the full map.
print_full_map() {

    # Load the full map ASCII art in advance.
    local map_splash_raw=$(cat "$ASCII_MAP_FULL")
    local map_splash=$(
        echo "$map_splash_raw" |
            sed "s/$CURR_LAND_ID/X/g; s/[1-7]/ /g"
    )
    [[ -z $NO_ASCII_ART ]] &&
        center_block $CONSOLE_WIDTH "$map_splash" ||
        echo -ne 'ASCII art disabled :(\n'
}

##############
# Game Logic #
##############

# @brief The first stage of the games initialization.
intro_stage() {
    # Print the LORE
    local lore_desc=$(fold -s -w $CONSOLE_WIDTH "$LORE_TEXT_PATH")
    echo -ne "$lore_desc\n\n"

    # Get the players name.
    PLAYER_NAME=$(prompt "What is your name fellow traveler? [$DEFAULT_NAME]> ")
    [[ -z $PLAYER_NAME ]] &&
        PLAYER_NAME=$DEFAULT_NAME

    return 0
}

# @brief Run the dynamic game logic.
game_stage() {
    local display_clue=''
    local player_input=''
    until [[ $player_input =~ $PASSCODE || $player_input =~ ':q!' ]]; do
        # Process all relevant field keys for the currently inhabited land
        local land_obj="Land$CURR_LAND_ID"
        local land_title=$(get_config $MAP_FILE "$land_obj.$LAND_TITLE_FIELD")
        local land_splash_path=$(get_config $MAP_FILE "$land_obj.$LAND_SPLASH_PATH_FIELD")
        local land_layout_path=$(get_config $MAP_FILE "$land_obj.$LAND_LAYOUT_PATH_FIELD")
        local land_cell=$(get_config $MAP_FILE "$land_obj.$LAND_CELL_FIELD")
        local land_desc=$(get_config $MAP_FILE "$land_obj.$LAND_DESC_FIELD")
        local land_search=$(get_config $MAP_FILE "$land_obj.$LAND_SEARCH_FIELD")

        # Print the ASCII art representing the land currently inhabited.
        local land_splash=$(cat "$ASCII_MAP_SPLASHES/$land_splash_path")
        [[ -z $NO_ASCII_ART ]] &&
            center_block $CONSOLE_WIDTH "$land_splash"

        # Prepare and print ASCII map of the land currently inhabited.
        local name_centered=$(center_text 31 "$PLAYER_NAME")
        local middle_centered=$(center_text 31 'X')
        local cell_centered=$(center_text 31 "$land_cell")
        local map_output=$(
            cat $ASCII_MAP_LAYOUTS/$land_layout_path |
                sed "s/A/$name_centered/g; s/B/$middle_centered/g; s/C/$cell_centered/g"
        )
        [[ -z $NO_ASCII_ART ]] &&
            center_block $CONSOLE_WIDTH "$map_output"

        # Print the description of the land. Can be reprinted with the 'look' command.
        print_text_center $CONSOLE_WIDTH "$land_desc"

        # Prepare prompt text for the available directions of travel.
        local prompt_dirs=$(get_directions "$land_obj")

        # Handle further user input.
        local restate_prompt="$TRUE"
        while [[ $restate_prompt = $TRUE ]]; do
            restate_prompt="$FALSE"

            # Read user input with possible options provided.
            print_console $CONSOLE_WIDTH "Options Available:"
            print_console $CONSOLE_WIDTH "(Se)arch\n(L)ook\n$prompt_dirs\n(M)ap"
            read -p "What would you like to do?> " player_input

            # Match if the user supplied input is an acceptable variant of 'search'.
            if [[ $player_input =~ ^[S|s][E|e]([A|a][R|r][C|c][H|h])?$ ]]; then
                process_text '0.5' 'Searching'
                print_quote_center $QUOTE_WIDTH "\"\"\"\n$land_search\n\"\"\""
                restate_prompt="$TRUE"
                # Match if the user supplied input is an acceptable variant of 'look'.
            elif [[ $player_input =~ ^[L|l]([O|o][O|o][K|k])?$ ]]; then
                print_text_center $CONSOLE_WIDTH "$land_desc"
                restate_prompt="$TRUE"
                # Match if the user supplied input is an acceptable variant of 'north'.
            elif [[ $player_input =~ ^[N|n]([O|o][R|r][T|t][H|h])?$ ]]; then
                if [[ $prompt_dirs =~ \([Nn]\) ]]; then
                    travel $land_obj $NORTH && clear
                else
                    restate_prompt="$TRUE"
                    local err_msg=$(
                        cat "$INVALID_DIRECTION" |
                            sed "s/\[DIRECTION\]/$NORTH/g"
                    )
                    print_console $CONSOLE_WIDTH $err_msg
                fi
                # Match if the user supplied input is an acceptable variant of 'south'.
            elif [[ $player_input =~ ^[S|s]([O|o][U|u][T|t][H|h])?$ ]]; then
                if [[ $prompt_dirs =~ \([Ss]\) ]]; then
                    travel $land_obj $SOUTH && clear
                else
                    restate_prompt="$TRUE"
                    local err_msg=$(
                        cat "$INVALID_DIRECTION" |
                            sed "s/\[DIRECTION\]/$SOUTH/g"
                    )
                    print_console $CONSOLE_WIDTH $err_msg
                fi
            # Match if the user supplied input is an acceptable variant of 'east'.
            elif [[ $player_input =~ ^[E|e]([A|a][S|s][T|t])?$ ]]; then
                if [[ $prompt_dirs =~ \([Ee]\) ]]; then
                    travel $land_obj $EAST && clear
                else
                    restate_prompt="$TRUE"
                    local err_msg=$(
                        cat "$INVALID_DIRECTION" |
                            sed "s/\[DIRECTION\]/$EAST/g"
                    )
                    print_console $CONSOLE_WIDTH $err_msg
                fi
                # Match if the user supplied input is an acceptable variant of 'west'.
            elif [[ $player_input =~ ^[W|w]([E|e][S|s][T|t])?$ ]]; then
                if [[ $prompt_dirs =~ \([Ww]\) ]]; then
                    travel $land_obj $WEST && clear
                else
                    restate_prompt="$TRUE"
                    local err_msg=$(
                        cat "$INVALID_DIRECTION" |
                            sed "s/\[DIRECTION\]/$WEST/g"
                    )
                    print_console $CONSOLE_WIDTH $err_msg
                fi
                # Match if the user supplied input is an acceptable variant of 'map'.
            elif [[ $player_input =~ ^[M|m]([A|a][P|p])?$ ]]; then
                restate_prompt="$TRUE"
                print_full_map
                # Match if the user supplied input is an acceptable variant of the passcode.
            elif [[ $player_input =~ $PASSCODE ]]; then
                # The passcode has been successfully guessed.
                # Proceed to print a game success message.
                clear
                local victory_text=$(cat "$VICTORY_TEXT_PATH")
                print_console $CONSOLE_WIDTH "$victory_text"

                print_blank_lines

                [[ -z $NO_ASCII_ART ]] &&
                    center_block $CONSOLE_WIDTH "$FULL_MAP_SPLASH"

                print_blank_lines

                print_console $CONSOLE_WIDTH '[Y]es\n[N]o'
                read -p "Would you be interested in playing again? [No]> " QUIT_GAME
                [[ -z $QUIT_GAME ]] && QUIT_GAME='No'

                [[ $QUIT_GAME =~ [Y|y]([E|e][S|s])? ]] &&
                    QUIT_GAME="$FALSE" ||
                    QUIT_GAME="$TRUE"

                return 0
                # Match if the user supplied input blank.
            elif [[ -z $player_input ]]; then
                restate_prompt="$TRUE"
                # Match if the user supplied input is an acceptable variant of ':q!'.
            elif [[ $player_input =~ :q! ]]; then
                exit
                # Match if the user supplied input is anything not enumerated above.
            else
                restate_prompt="$TRUE"
                cat "$INVALID_IO_TEXT_PATH"
                print_blank_lines
            fi
        done
    done
}

# @brief Heartbeat of the game.
rungame() {
    # Execute the name gathering and basic world building parts.
    intro_stage && clear

    # Main game loop
    game_stage

    return $?
}

# @brief Main entry point of the program.
main() {
    until [[ $QUIT_GAME == $TRUE ]]; do
        clear
        [[ -z $NO_ASCII_ART ]] && cat art/splash.dat
        cat "$WELCOME_TEXT_PATH"
        cat "$CREDENTIALS_TEXT_PATH"

        echo -ne "\n"
        echo -ne "[C]ontinue to the game.\n"
        echo -ne "[H]elp for basic how-to.\n"
        echo -ne "[E]xit to quit this program.\n"
        echo -ne "\n"

        local choice=$(prompt "What would you like to do? [C]> ")
        [[ -z $choice ]] && choice='continue'

        if [[ $choice =~ ^[Cc]([Oo][Nn][Tt][Ii][Nn][Uu][Ee])?$ ]]; then
            clear && rungame
        elif [[ $choice =~ ^[H|h]([E|e][L|l][P|p])?$ ]]; then
            if [[ -n $(command -v less) ]]; then
                local HELP_TEXT=$(cat "$HELP_TEXT_PATH")
                echo -ne "$HELP_TEXT" |
                    head -n -2 |
                    fold -s -w $CONSOLE_WIDTH |
                    less
            fi
            print_blank_lines
        elif [[ $choice =~ ^[E|e]([X|x][I|i][T|t])?$ ]]; then
            echo "Exiting the game!"
            exit
        else
            echo -e "Invalid response '$choice'."
        fi
    done
}

# Execute the program
while [[ $QUIT_GAME == "$FALSE" ]]; do
    main
done

# Laters alligator
echo -ne "Farewell...\n"
