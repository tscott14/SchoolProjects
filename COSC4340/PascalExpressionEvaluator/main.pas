(**
 * 
 * @author Tristan Scott
 * COSC 4340.001
 * September 28, 2023
 * Assignment 1 -- Pascal Programming Assignment
 * 
 * Desc: This assignment has us take in an input file
 *       of mathematical expressions; requiring us to
 *       parse the syntax and produce the appropriate
 *       evaluation for said expressions.
 *)
program Assignment1;
uses crt;

(*
 * The file paths for the input and output text 
 *    files are defined here as constants. Since I
 *    intend on uploading this project to github
 *    I choose to use a more professional file
 *    structure for this assignment. These paths
 *    are relative to the current path of execution.
 *    Please feel free to change these as need be.
 *)
const 
INPUT_FILE_PATH = 'assignment/dos_input.txt';
OUTPUT_FILE_PATH = 'output.txt';

(*
 * These are all the variables needed for the
 *    program to function correctly.
 * 
 * The type of file for the input and output
 *    files is diffrent because the input file
 *    is read character by character while the
 *    output file is written to token by token.
 *)
var 
current : char; 
expr_result: integer; 
input_file: file of char;
output_file: TextFile;

(**
 * This function simply checks to see if 
 *    the character input is a numerical 
 *    character.
 * 
 * @param ch - The input character that is 
 *             to be checked.
 * 
 * @return     True if the input character 
 *             is of a numerical character 
 *             or false otherwise.
 *)
function isNumericalCharacter(ch: char): boolean;
begin { Beginning of the isNumericalCharacter Function }
   isNumericalCharacter := ch in ['0'..'9'];
end; { End of the isNumericalCharacter Function }

(**
 * This function simply checks to see if 
 *    the character input is a known operator 
 *    character.
 * 
 * @param ch - The input character that is 
 *             to be checked.
 * 
 * @return  True if the input character is 
 *          of an operator character or 
 *          false otherwise.
 *)
function isOperatorCharacter(ch: char): boolean;
begin { Beginning of the isOperatorCharacter Function }
   isOperatorCharacter := ch in ['+', '*', '(', ')'];
end; { End of the isOperatorCharacter Function }

(**
 * This function simply checks to see if 
 *    the character input is a newline 
 *    character.
 * 
 * @param ch - The input character that is 
 *             to be checked.
 * 
 * @return  True if the input character is 
 *          of a newline character or 
 *          false otherwise.
 *)
function isEndOfLine(ch: char): boolean;
begin { Beginning of the isEndOfLine Function }
   isEndOfLine:= ch in [#10, #13];
end; { End of the isEndOfLine Function }

(**
 * This function simply checks to see if 
 *    the character input can be considered
 *    valid. A character is considered valid
 *    if it is either a numerical character
 *    or an operator character.
 * 
 * @param ch - The input character that is 
 *             to be checked.
 * 
 * @return  True if the input character is 
 *          of a valid character or false 
 *          otherwise.
 *)
function isValidCharacter(ch: char): boolean;
var
   isNumerical, isOperator: boolean;
begin { Beginning of the isValidCharacter Function }
   isNumerical := isNumericalCharacter(ch);
   isOperator := isOperatorCharacter(ch);
   isValidCharacter:= isNumerical or isOperator;
end; { End of the isValidCharacter Function }

(**
 * This function will fetch the next character 
 *    from the input file
 * 
 * @param token - A reference to the character
 *                to assigned the next 
 *                character from the input 
 *                file.
 *)
procedure getNextCharacter(var token: char) ;
begin { Beginning of the getNextCharacter Procedure }
   (*
    * If the token aquired from the input text
    * file is an EoL character, i.e. #10 or #13
    * then the '@' character is assigned to the
    * param token in its place.
    *)
   if isEndOfLine(token) then begin
      read(input_file, token);
      token:='@';
   end
   else begin
      repeat
         read(input_file, token);
         
         (*
          * Text files can come in two formats, 
          * the DOS format and the UNIX format. 
          * For the sake of this program, both 
          * formats are anticipated. In the event 
          * that the file uses the DOS format, we 
          * simply pass over the carriage return 
          * character.
          *)
         if (token = #13) then
            read(input_file, token);
         
         (*
          * Now, irregardless of format, the next
          * character should always be a simple
          * newline character. If this is the case,
          * we will skip printing this character
          * to the output file.
          *)
         if not (token = #10) then
            write(output_file, token);

      until isValidCharacter(token) or isEndOfLine(token);

      { Same as line 1 of this function }
      if not isValidCharacter(token) then
         token:='@';
   end;
end; { End of the getNextCharacter Procedure }

(**
 * The branch used to evaluate an expression.
 * 
 * The BNF representation of this function is:
 *    EXPRESSION ::= TERM { ‘+’ TERM }
 * 
 * @param curr_token - The last token retrieved 
 *                     from the input text file.
 * 
 * @return  The numerical value of the evaluated
 *          expression.
 *)
function Expression(var curr_token: char): integer;
var expr_result: integer;

(**
 * The branch used to evaluate a factor.
 * 
 * The BNF representation of this function is:
 *    FACTOR ::= digit | ( ‘(’ EXPRESSION ‘)’ )
 * 
 * @param curr_token - The last token retrieved
 *                     from the input text file.
 * 
 * @return The numerical value of the evaluated
 *         factor.
 *)
function Factor(var curr_token: char): integer;
var fact_result: integer;
begin { Beginning of the Factor Function }
   (* 
    * This is the first case as outlined in the 
    * BNF stated in the function documentation. 
    *)
   if isNumericalCharacter(curr_token) then begin
      fact_result := ord(curr_token) - ord('0');
      getNextCharacter(curr_token);
   end
   (* 
    * This is the second case as outlined in the 
    * BNF stated in the function documentation. 
    *)
   else if curr_token = '(' then begin
      getNextCharacter(curr_token);
      fact_result := Expression(curr_token);
      if curr_token = ')' then
         getNextCharacter(curr_token)
      else begin
         { This is a Rejected syntax }
      end;
   end;

   { Assign the result to be the output. }
   Factor := fact_result;
end; { End of the Factor Function }

(**
 * The branch used to evaluate a term.
 * 
 * The BNF representation of this function is:
 *    TERM ::= FACTOR { ‘*’ FACTOR }
 * 
 * @param curr_token - The last token retrieved
 *                     from the input text file.
 * 
 * @return The numerical value of the evaluated
 *         term.
 *)
function Term(var curr_token: char): integer;
var term_result: integer;
begin { Beginning of the Term Function }
   { Initial call to Factor }
   term_result := Factor(curr_token);

   { Keep multiplying Factors until no more exist. }
   while curr_token = '*' do begin
      getNextCharacter(curr_token);
      term_result := term_result * Factor(curr_token);
   end;

   { Assign the result to be the output. }
   Term := term_result;
end; { End of the Term Function }

begin { Beginning of the Expression Function }
   { Initial call to Term }
   expr_result := Term(curr_token);

   { Keep adding Terms until no more exist. }   
   while curr_token = '+' do
   begin
      getNextCharacter(curr_token);
      expr_result := expr_result + Term(curr_token);
   end;

   { Assign the result to be the output. }
   Expression := expr_result;
end; { End of the Expression Function }

begin { Beginning of the Entry Procedure }
   { Initialize the input file. }
   assign(input_file, INPUT_FILE_PATH);
   reset(input_file);

   { Initialize the output file. }
   assign(output_file, OUTPUT_FILE_PATH);
   rewrite(output_file);

   (*
    * Parse the input file and convert it to the 
    * format specified in the assignment instructions. 
    * Each iteration of this loop represents a single 
    * line in the output file. 
    *)
   while not eof(input_file) do
   begin
      write(output_file, 'THE VALUE OF ');
      getNextCharacter(current);
      expr_result := Expression(current);
      writeln(output_file, ' IS ', expr_result);

   end;

   { Clean up IO by closing input and output files. }
   close(input_file);
   close(output_file);
end. { End of Assignment1 Main }
{ End of Assignment 1 }