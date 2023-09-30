/**
 * Tristan Scott
 * COSC 4377.001
 * Thursday, 9 March 2023
 * Program Assignment II
 *
 * Purpose: To implement a recursive-descent infix-to-postfix
 *          translator. Take a filepath and output the postfix
 *          version of each statement to the console/terminal.
 * 
 * Additional Notes: The Cargo.toml file provided is needed in
 *          order to execute the program through 'cargo' w/
 *          the command 'cargo run'.
 */
use std::{fs, iter::Peekable};

/**
 * Enums in Rustlang are basically Unions in C combined
 * with enums in C. A Token can be any of the types listed
 * below, but some could have additional values depending
 * on the type of token it is.
 */
#[derive(Clone, PartialEq, Debug)]
enum Token {
    Identifier(String),
    Assignment,

    Exponentiation,
    Multiplication,
    DivisionSym,
    DivisionTxt,
    Modulo,
    Addition,
    Subtraction,

    UnaryNegation,
    UnaryAddition,

    LeftParenthesis,
    RightParenthesis,

    Constant(isize),
    Semicolon,
}

/**
 * A token iterator is a helper type to make processing tokens
 * easier and more streamline. The goal here is to make the
 * code declaritive not imperitive.
 */
struct TokenIterator {
    index: usize,
    token_stream: Vec<Token>,
}

/**
 * The Iterator trait is implemented for the TokenIterator type.
 * A trait in Rustlang is similar to an interface in Java. The
 * next function is required for implementing this trait.
 */
impl Iterator for TokenIterator {
    type Item = Token;
    fn next(&mut self) -> Option<Self::Item> {
        // Get the current element and increment the pointer.
        if let Some(token) = self.token_stream.get(self.index) {
            self.index += 1;
            return Some(token.clone());
        }
        return None;
    }
}

/**
 * Catalog the types of output provided by the program. Exists more
 * debug purposes during creation.
 */

enum OutputType {
    _Console,
    Persistent,
}

/**
 * Simply a buffer to hold our persistent buffer along with other
 * attributes.
 */
struct OutputBuffer {
    buffer: String,
    output_type: OutputType,
}

/**
 * Implementation block for the OutputBuffer.
 */
impl OutputBuffer {
    /**
     * @brief Constructs a new OutputBuffer object, basically a
     * constructor in a OO language.
     * 
     * @param capacity -- The initial size of the buffer.
     * @param output_type -- Deals with if the data being
     *                      appended will be immediately
     *                      output to the screen or if it
     *                      will be saved to the buffer for
     *                      later use.
     */
    fn new(capacity: usize, output_type: OutputType) -> Self {
        OutputBuffer {
            buffer: String::with_capacity(capacity),
            output_type: output_type,
        }
    }

    /**
     * @brief Add a string of characters to the buffer.
     *
     * @param self -- This instance.
     * @param string -- The string to append to the buffer.
     */
    fn append(&mut self, string: &str) {
        match self.output_type {
            OutputType::_Console => print!("{} ", string),
            OutputType::Persistent => {
                let str = format!("{} ", string);
                self.buffer.push_str(str.as_str());
            }
        }
    }

    /**
     * @brief Like 'append' but specifically for newlines.
     *
     * @param self -- This instance.
     */
    fn append_nl(&mut self) {
        match self.output_type {
            OutputType::_Console => println!(),
            OutputType::Persistent => self.buffer.push('\n'),
        }
    }

    /**
     * @brief Get the buffer as a basic string.
     *
     * @param self -- This instance.
     */
    fn to_string(&self) -> String {
        self.buffer.clone()
    }
}

/**
 * @brief Evaluates a single statement. A statement is
 *          defined as a string of tokens beginning with
 *          an identifier followed by an assignment operator
 *          followed by an expression followed by a
 *          semicolon.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_statement(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Statement → id = {print(id.lexeme)} Expression {print(‘=’)} ;

    // If there is a next token, take it from the iterator, and
    // if it matches the pattern for an identifier, place the
    // value into a tempory variable called 'str'.
    if let Some(Token::Identifier(str)) = tokens.next() {
        // Get the next token. If it exists but does NOT contains the
        // pattern provided (i.e. its an Assignment Token), process
        // the error.
        if tokens.next() != Some(Token::Assignment) {
            // Error
            println!("ERROR 6");
        }

        // Print the lexeme provided from the first if condition.
        output.append(str.as_str());

        // Process the expression further.
        proc_expression(&mut tokens, &mut output);

        // End the expression with an assignment operator.
        output.append("=");

        // Check to verify that a semicolon was provided as part of
        // the statement, if NOT, process the error further.
        if tokens.next() != Some(Token::Semicolon) {
            println!("ERROR: No trailing semicolen given!");
        }

        // End the statement with a semicolon to make it a proper
        // statement.
        output.append(";");
        output.append_nl();
    }
}

/**
 * @brief Evaluates an expression as the union of a term
 *          and moreterms.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_expression(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Expression → Term Moreterms
    // Follow the Pseudocode above.

    proc_term(&mut tokens, &mut output);
    proc_moreterms(&mut tokens, &mut output);
}

/**
 * @brief Evaluates the use of summation and diffrenciation.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_moreterms(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Moreterms → + Term {print(‘+’)} Moreterms
    //      | - Term {print(‘-’)} Moreterms
    //      | e

    // Peek at the next token and compare it type. Valid states are
    // Addition, Subtraction, or neither. In the case of the two
    // former, handle as described by the psuedocode above.
    match tokens.peek() {
        Some(Token::Addition) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Addition.
            proc_term(&mut tokens, &mut output);
            output.append("+");
            proc_moreterms(&mut tokens, &mut output);
        }
        Some(Token::Subtraction) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Subtraction.
            proc_term(&mut tokens, &mut output);
            output.append("-");
            proc_moreterms(&mut tokens, &mut output);
        }
        Some(_) => {} // Do absolutely nothing. This is the epsilon case.
        None => {
            println!("ERROR 5");
        } // Error
    }
}

/**
 * @brief Evaluates a term as the union of a factor and
 *          a morefactors.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_term(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Term → Factor Morefactors
    // Follow the Pseudocode above.

    proc_factor(&mut tokens, &mut output);
    proc_morefactors(&mut tokens, &mut output);
}

/**
 * @brief Evaluates the cases that there could be more factors.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_morefactors(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Morefactors → * Factor {print(‘*’)} Morefactors
    //      | / Factor {print(‘/’)} Morefactors
    //      | div Factor {print(‘div’)} Morefactors
    //      | mod Factor {print(‘mod’)} Morefactors
    //      | e

    // Look at, but not move past, the next token and check its type. Each
    // case, Multiplication, Division, and Modulus are all handled in their
    // own respective manners.
    match tokens.peek() {
        Some(Token::Multiplication) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Multiplication.
            proc_factor(&mut tokens, &mut output);
            output.append("*");
            proc_morefactors(&mut tokens, &mut output);
        }
        Some(Token::DivisionSym) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Division Symbole.
            proc_factor(&mut tokens, &mut output);
            output.append("/");
            proc_morefactors(&mut tokens, &mut output);
        }
        Some(Token::DivisionTxt) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Division Text.
            proc_factor(&mut tokens, &mut output);
            output.append("div");
            proc_morefactors(&mut tokens, &mut output);
        }
        Some(Token::Modulo) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Modulus.
            proc_factor(&mut tokens, &mut output);
            output.append("mod");
            proc_morefactors(&mut tokens, &mut output);
        }
        Some(_) => {} // Do absolutely nothing, this is the epsilon case.
        None => {
            println!("ERROR 4");
        } // Error
    }
}

/**
 * @brief Evaluate a factor. This handles potential
 *          exponentiation.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_factor(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Factor → Base ^ Factor {print(‘^’)}
    //      | Base

    // Base needs to get processed first before checking for the existence
    // of an exponentiation symbole.
    proc_base(&mut tokens, &mut output);

    // We check, without displacing the iterator to the next item, to see
    // if the next token would be an exponentiation. If so, we consume the
    // iterator, and follow the psuedocode provided above.
    if tokens.peek() == Some(&Token::Exponentiation) {
        tokens.next(); // Move past the exponentiation operator.
        proc_factor(&mut tokens, &mut output);
        output.append("^");
    }
}

/**
 * @brief Evaluate a base. This handles the translation
 *          of unary operators.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_base(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Base → # Value {print(‘#’)}
    //      | ~ Value {print(‘~’)}
    //      | Value

    // The next token is looked at, without actually moving the iterator to,
    // the next position. It is checked to be either a Unary Addition or
    // Unary Negation operator. If do, process those as described in the
    // psuedocode provided above.
    match tokens.peek() {
        Some(Token::UnaryAddition) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Unary Addition.
            proc_value(&mut tokens, &mut output);
            output.append("#");
        }
        Some(Token::UnaryNegation) => {
            tokens.next(); // Essentially, pop this token from the iterator.

            // Follows the psuedocode above for Unary Negation.
            proc_value(&mut tokens, &mut output);
            output.append("~");
        }
        Some(_) => {
            // Follows the psuedocode above for neither.
            proc_value(&mut tokens, &mut output);
        }
        None => {
            println!("ERROR 3");
        } // Error
    }
}

/**
 * @brief Evaluate a value token. End of the line for
 *          identifiers and numerical values.
 *
 * @param tokens -- A peekable iterator over the tokens
 *                  provided in the source file.
 */
fn proc_value(mut tokens: &mut Peekable<TokenIterator>, mut output: &mut OutputBuffer) {
    // Value → ( Expression )
    //      | id {print(id.lexeme)}
    //      | num {print(num.value)}

    // Unlike the other cases, the next token is viewed and
    // taken from the iterator. It is then processed further
    // as described in the pseudocode above.
    match tokens.next() {
        Some(Token::LeftParenthesis) => {
            // Follows the psuedocode above for Left Parenthesis.
            proc_expression(&mut tokens, &mut output);
            tokens.next(); // Pop off the trailing ')'
        }
        Some(Token::Identifier(str)) => {
            // Follows the psuedocode above for handling an identifier.
            output.append(str.as_str());
        }
        Some(Token::Constant(num)) => {
            // Follows the psuedocode above for handling a constant.
            let num_to_str = format!("{}", num);
            output.append(num_to_str.as_str());
        }
        Some(_) => {} // Error
        None => {
            println!("ERROR 2");
        } // Error
    }
}

/**
 * @brief Parse the stringified contents of the text file
 *          and convert them into a format readable to the
 *          program.
 *
 * @param contents -- A large string with the contents of
 *                    the text file containing the program.
 */
fn load_token_iter_from_string(contents: String) -> TokenIterator {
    // The stringified file contents are split on the delimiter newline '\n'.
    let raw_tokens: Vec<&str> = contents.split('\n').collect();

    // The list of tokens is generated using a series of chained functions.
    let stream = raw_tokens
        // The token string is then grouped into pairs of consecative sequenced pairs.
        // Converting the string from { ['area', 'ID', '=', 'ASSIGNMENT', ...] } into
        //      { [ ['area', 'ID'],['=', 'ASSIGNMENT'], ... ] }
        .chunks(2)
        // The array of two element arrays is then mapped over and the elements of each
        // array is converted into a tuple.
        // Converting the string from { [ ['area', 'ID'],['=', 'ASSIGNMENT'], ... ] } to
        //      { [('area', 'ID'), ('=','ASSIGNMENT'), ... ] }
        .map(|elem| (elem[0].trim(), elem[1].trim()))
        // This array of tuples is then mapped over, being pattern matched into their
        // respective variables. This part will convert each tuple to a Token. If the
        // token has an additional field, such as constants and identifiers, then the
        // token is supplied with that additional value.
        .map(|(token, token_type)| match token_type {
            "ID" => Token::Identifier(String::from(token)),
            "ASSIGNMENT" => Token::Assignment,
            "EXP" => Token::Exponentiation,
            "MULTIPLICATION" => Token::Multiplication,
            "DIVISION" => match token {
                // Since division has two representations, this check is needed.
                "/" => Token::DivisionSym,
                "div" => Token::DivisionTxt,
                _ => Token::Semicolon,
            },
            "MOD" => Token::Modulo,
            "ADDITION" => Token::Addition,
            "SUBTRACTION" => Token::Subtraction,
            "UNARY-PLUS" => Token::UnaryAddition,
            "UNARY-NEGATION" => Token::UnaryNegation,
            "LEFT-PAREN" => Token::LeftParenthesis,
            "RIGHT-PAREN" => Token::RightParenthesis,
            "CONSTANT" => {
                // Converting the numerical string into an actual number.
                let c = isize::from_str_radix(token, 10)
                    // Crash if the numerical string provided can't be parsed.
                    .expect("Could not parse value supplied!");
                Token::Constant(c)
            }
            "SEMICOLON" => Token::Semicolon,

            // Incase a type is provided (like 'DIV'), then the program will intentionally terminate.
            err_token => panic!("ERROR: Invalid token type supplied [{}]!", err_token),
        })
        // Finally, the iterator is collected all together into a new vector.
        .collect();

    TokenIterator {
        index: 0,
        token_stream: stream,
    }
}

/**
 * @brief Load the contents of the text file and put those into
 *          a new String.
 *
 * @param filepath -- The path to the text file containing
 *                    the list of statements to be translated.
 */
fn load_program_from_file(filepath: &str) -> TokenIterator {
    // Load the contents from the file at filepath into a new string.
    let contents = fs::read_to_string(filepath)
        // Crash the program if the filepath provided cannot be opened.
        .expect("ERROR: Could NOT open file!");

    // Load the token_iter from the supplied string.
    load_token_iter_from_string(contents)
}

/**
 * @brief The entry point of the program. Conmtains several
 *          test programs hard-coded into the program.
 */
fn main() {
    // Test statement used to check program. Not Used!
    let _prog1 = TokenIterator {
        index: 0,
        token_stream: vec![
            Token::Identifier(String::from("area")),
            Token::Assignment,
            Token::Identifier(String::from("pi")),
            Token::Multiplication,
            Token::Identifier(String::from("radius")),
            Token::Exponentiation,
            Token::Constant(2),
            Token::Semicolon,
        ],
    };

    // Test statement used to check program. Not used!
    let _prog2 = TokenIterator {
        index: 0,
        token_stream: vec![
            Token::Identifier(String::from("value")),
            Token::Assignment,
            Token::Identifier(String::from("two")),
            Token::Subtraction,
            Token::Constant(3),
            Token::Multiplication,
            Token::LeftParenthesis,
            Token::LeftParenthesis,
            Token::Identifier(String::from("two")),
            Token::Addition,
            Token::Constant(5),
            Token::RightParenthesis,
            Token::DivisionSym,
            Token::Identifier(String::from("six")),
            Token::RightParenthesis,
            Token::Semicolon,
        ],
    };

    // Get the token iterator with the tokens supplied in the file.
    let mut prog = load_program_from_file("input2.txt")
        // Make the iterator peekable so that elements can be viewed
        // before formully moving to the next token.
        .peekable();

    // Create an output buffer instance to pass to all recursive-descent
    // functions.
    let mut output_buffer = OutputBuffer::new(4096, OutputType::Persistent);

    // Run through every statement provided in the file until all
    // have been processed.
    while prog.peek().is_some() {
        proc_statement(&mut prog, &mut output_buffer);
    }

    // Get the output, this will be empty if 'OutputType::Console' was
    // selected. This can be either printed or outputted to a file.
    let output = output_buffer.to_string();

    // Write the output to a file in accordance with the instructions.
    fs::write("postfix_input2.txt", output).unwrap();
    
    // Print out the contents of the FILE, not the 'output' string.
    println!("Contents of the output:\n{}", fs::read_to_string("postfix_input2.txt").unwrap());
}
