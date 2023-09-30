
'''
    Tristan Scott
    COSC 4375.001
    Programming Assignment III
    April 24, 2023

    Purpose: Create a recursive decent parser to convert language
                defined in instructions into 3AC code segments.

    Additional Notes: 
            This is my first program i've programmed in
        Python. Since this was basically an assignment built
        off the last assignment, I wanted to take this 
        opertunity to use a language that I didn't know and
        that I could use in the future.

            I implemented the graduate portion of this project
        as well for extra credit. A few aspects of the language
        definition provided in the instructions were a bit vage,
        so I took some liberties and made up some aspects of the
        program. Introducing words like "WHILE", "CONDITION", or
        "THEN" into the mockup language defined in the assignment.
        Additionally, for the TST statements, I choose to write
        out the comparisons types as "EQU" for Equals or "LSE" for
        *Less than or equal to* among other examples.
'''
# Load a specified file in as a string.
def Load_File(filename):
    with open(filename, "r+") as file:
        contents = file.read()
    return contents

# Utility class to help get the next token 
# from the stringified file.
class TokenReader:
    def __init__(self, filename):
        self.tokens = Load_File(filename).split()
        self.index = 0

    # Retrieve the next token and increment
    # the iterator.
    def Next(self):
        result1 = self.tokens[self.index + 0]
        result2 = self.tokens[self.index + 1]
        self.index += 2
        return (result1, result2)

    # Retrieve the next token but DON'T 
    # increment the iterator.
    def Peek_Next(self):
        result1 = self.tokens[self.index + 0]
        result2 = self.tokens[self.index + 1]
        return (result1, result2)

# A utility used to generate the 3AC code output.
class IntermediateCodeGenerator:
    # Standard defines for the project.
    MOV_OP='MOV'
    ADD_OP='ADD'
    SUB_OP='SUB'
    MUL_OP='MUL'
    DVD_OP='DVD'
    DIV_OP='DIV'
    MOD_OP='MOD'
    EXP_OP='EXP'
    PLS_OP='PLS'
    NEG_OP='NEG'

    # Graduate and extra credit defines.
    TST_OP='TST'
    JMP_OP='JMP'
    LBL_OP='LBL'

    def __init__(self):
        self.output = []

    # Utility to both print the outputs to
    # stdout and a buffer for later viewing.
    def Print(self, output):
        self.output.append(output)
        print(output)

    # Clear the buffer.
    def Clear(self):
        self.output = []

    # Generates MOV 3AC code.
    def MOV_3AC(self, q, p):
        output = "({} {} {})".format(self.MOV_OP, q[0], p[0])
        self.Print(output)

    # Generates ADD 3AC code.
    def ADD_3AC(self, p, t, r):
        output = "({} {} {} {})".format(self.ADD_OP, p[0], t[0], r[0])
        self.Print(output)

    # Generates SUB 3AC code.
    def SUB_3AC(self, p, t, r):
        output = "({} {} {} {})".format(self.SUB_OP, p[0], t[0], r[0])
        self.Print(output)

    # Generates MUL 3AC code.
    def MUL_3AC(self, p, t, r):
        output = "({} {} {} {})".format(self.MUL_OP, p[0], t[0], r[0])
        self.Print(output)

    # Generates DVD 3AC code.
    def DVD_3AC(self, p, t, r):
        output = "({} {} {} {})".format(self.DVD_OP, p[0], t[0], r[0])
        self.Print(output)

    # Generates DIV 3AC code.
    def DIV_3AC(self, p, t, r):
        output = "({} {} {} {})".format(self.DIV_OP, p[0], t[0], r[0])
        self.Print(output)

    # Generates MOD 3AC code.
    def MOD_3AC(self, p, t, r):
        output = "({} {} {} {})".format(self.MOD_OP, p[0], t[0], r[0])
        self.Print(output)

    # Generates EXP 3AC code.
    def EXP_3AC(self, p, t, r):
        output = "({} {} {} {})".format(self.EXP_OP, p[0], t[0], r[0])
        self.Print(output)

    # Generates PLS 3AC code.
    def PLS_3AC(self, p, r):
        output = "({} {} {})".format(self.PLS_OP, p[0], r[0])
        self.Print(output)

    # Generates NEG 3AC code.
    def NEG_3AC(self, p, r):
        output = "({} {} {})".format(self.NEG_OP, p[0], r[0])
        self.Print(output)

    # Generates TST 3AC code.
    def TST_3AC(self, p, q, c, L):
        output = "({} {} {} {} {})".format(self.TST_OP, p[0], q[0], c[0], L[0])
        self.Print(output)

    # Generates JMP 3AC code.
    def JMP_3AC(self, L):
        output = "({} {})".format(self.JMP_OP, L[0])
        self.Print(output)

    # Generates LBL 3AC code.
    def LBL_3AC(self, L):
        output = "({} {})".format(self.LBL_OP, L[0])
        self.Print(output)

# Global code generator.
IntermediateCodeGenerator = IntermediateCodeGenerator()

# Class that runs the core logic of the compiler program.
class Compiler:
    def __init__(self, filename):
        self.filename = filename
        self.token_reader = TokenReader(filename)
        self.temp_count = 0
        self.label_count = 0

    # Allocator for a Tempory denoted: *T<number>*
    def Alloc_Temp(self):
        result = ['T' + str(self.temp_count)]
        self.temp_count += 1
        return result

    # Allocator for Labels denoted *L<number>*
    def Alloc_Label(self):
        result = ['L' + str(self.label_count)]
        self.label_count += 1
        return result

    # Main execution method.
    def Compile(self):
        # Print a header for the file being converted.
        IntermediateCodeGenerator.Print('============================')
        IntermediateCodeGenerator.Print("Converting {} to 3AC".format(self.filename))
        IntermediateCodeGenerator.Print('============================')

        # Run the compiler.
        self.Program()

    def Program(self):
        # Check for the word "program"
        if not self.token_reader.Next()[1] == 'program':
            print('Error 1')
            return

        # Process sub-Statements
        self.Stmt_List()

        # Check for the token "end"
        if not self.token_reader.Next()[1] == 'end':
            return

        # Check for the token "PERIOD"
        if not self.token_reader.Next()[1] == 'PERIOD':
            print('Error 3')
            return

    def Stmt_List(self):
        # Check to see if another statement exists,
        # if so, process it; otherwise, return back
        # to program.
        if self.token_reader.Peek_Next()[1] == 'end':
            return

        # Process sub-statements
        self.Stmt()

        # Check for token "SEMICOLON"
        if not self.token_reader.Next()[1] == 'SEMICOLON':
            return

        # Spacing between statements. This is purely
        # for astetical purposes.
        IntermediateCodeGenerator.Print('')

        # Reset the Temp counter so new statements
        # can have their tempory variables start at
        # 0.
        self.temp_count=0

        # Run this process recursively until no more 
        # statements exist.
        self.Stmt_List()

    # Get the type of comparison being used in the
    # Graduate level part of the assignment. 
    def Compare(self, c):
        match self.token_reader.Next()[1]:
            case "LESS":
                c[0]='LSS'
            case "LESS-EQUAL":
                c[0]='LSE'
            case "GREATER":
                c[0]='GRT'
            case "GREATER-EQUAL":
                c[0]='GRE'
            case "EQUAL":
                c[0]='EQU'
            case "NOT-EQUAL":
                c[0]='NEQ'

    # Main method for parsing a Statement.
    def Stmt(self):
        match self.token_reader.Next():
            case (id_p, "ID"):
                # Go down this branch if the next token 
                # was an Identifier.

                # Check for a '='
                if not self.token_reader.Next()[1] == 'ASSIGNMENT':
                    print('Error 6')
                    return

                # Create tempory and pass it to the Expression
                # sub-routine.
                q = [None]
                self.Expr(q)

                # Output (MOVE P Q)
                IntermediateCodeGenerator.MOV_3AC(q, id_p)
                pass
            case (_, "CONDITION"):
                # Create tempory and pass it to the Expression
                # sub-routine.
                p = [None]
                self.Expr(p)

                # Create a comparison tempory and pass that
                # to the Compare method.
                c=[None]
                self.Compare(c)

                # Create tempory and pass it to the Expression
                # sub-routine.
                q = [None]
                self.Expr(q)

                # Generate an unused Label
                L = self.Alloc_Label()

                # Output (TST p q c L)
                IntermediateCodeGenerator.TST_3AC(p, q, c, L)
                # Output (JMP L)
                IntermediateCodeGenerator.JMP_3AC(L)

                # Validate that that the token 'THEN' follows.
                if not self.token_reader.Next()[1] == 'THEN':
                    print('Error 7')
                    return

                # Output (LBL L)
                IntermediateCodeGenerator.LBL_3AC(L)
                # Output (JMP L)
                IntermediateCodeGenerator.JMP_3AC(L)

                # Parse the next statement.
                self.Stmt()

                # Output (LBL L)
                IntermediateCodeGenerator.LBL_3AC(L)

                pass
            case (_, 'WHILE'):
                # Generate an unused Label
                L0 = self.Alloc_Label()
                # Output (LBL L0)
                IntermediateCodeGenerator.LBL_3AC(L0)

                # Create tempory and pass it to the Expression
                # sub-routine.
                p = [None]
                self.Expr(p)

                #compare c
                c=[None]
                self.Compare(c)

                # Create tempory and pass it to the Expression
                # sub-routine.
                q = [None]
                self.Expr(q)

                # Output (TST p q c L)
                IntermediateCodeGenerator.TST_3AC(p, q, c, L0)

                # Generate an unused Label
                L1 = self.Alloc_Label()
                # Output (JMP L1)
                IntermediateCodeGenerator.JMP_3AC(L1)

                # Validate that the next token is 'DO'
                if not self.token_reader.Next()[1] == 'DO':
                    print('Error 8')
                    return

                # Generate an unused Label
                L2 = self.Alloc_Label()
                # Output (LBL L2)
                IntermediateCodeGenerator.LBL_3AC(L2)

                # Parse statement method.
                self.Stmt()

                # Output (JMP L0)
                IntermediateCodeGenerator.JMP_3AC(L0)

                # Output (LBL L1)
                IntermediateCodeGenerator.LBL_3AC(L1)
                pass


    def Expr(self, p):
        # Create tempory and pass it to the Term
        # sub-routine.
        q = [None]
        self.Term(q)

        # Run the More Terms method.
        self.More_Terms(q, p)

    def More_Terms(self,p, q):
        # Get next operand '+', '-', etc
        # Check the next token to see if it is
        # either an addition or a subtraction.
        match self.token_reader.Peek_Next()[1]:
            case 'ADDITION':
                # Run Addition Branch
                self.token_reader.Next()

                # Create tempory and pass it to the Term
                # sub-routine.
                t = [None]
                self.Term(t)

                # Allocate an unused Tempory.
                r = self.Alloc_Temp()

                # Output (ADD p t r)
                IntermediateCodeGenerator.ADD_3AC(p, t, r)

                # Parse more terms.
                self.More_Terms(r, q)
            case 'SUBTRACTION':
                # Run Subtraction Branch
                self.token_reader.Next()

                # Create tempory and pass it to the Term
                # sub-routine.
                t = [None]
                self.Term(t)

                # Allocate an unused Tempory.
                r = self.Alloc_Temp()

                # Output (SUB p t r)
                IntermediateCodeGenerator.SUB_3AC(p, t, r)

                # Parse more terms.
                self.More_Terms(r, q)
                pass
            case _:
                # Set the parameters to be equal to 
                # each other.
                q[0] = p[0]
                pass

    def Term(self,p):
        # Create tempory and pass it to the Factor
        # sub-routine.
        q=[None]
        self.Factor(q)

        # Parse more factors.
        self.More_Factors(q, p)

    def More_Factors(self,p, q):
        # Check to see if the next token would be
        # a multiplication, division, or modulus.
        match self.token_reader.Peek_Next()[1]:
            case 'MULTIPLICATION':
                # Multiplication Branch
                self.token_reader.Next()

                # Create tempory and pass it to the Factor
                # sub-routine.
                t=[None]
                self.Factor(t)

                # Allocate an unused Tempory.
                r = self.Alloc_Temp()

                # Output (MUL p t r)
                IntermediateCodeGenerator.MUL_3AC(p, t, r)

                # Parse more factors.
                self.More_Factors(r, q)
                pass
            case 'DIVISION':
                # Division Symbol Branch
                self.token_reader.Next()

                # Create tempory and pass it to the Factor
                # sub-routine.
                t=[None]
                self.Factor(t)

                # Allocate an unused Tempory.
                r = self.Alloc_Temp()

                # Output (DVD p t r)
                IntermediateCodeGenerator.DVD_3AC(p, t, r)

                # Parse more factors.
                self.More_Factors(r, q)
                pass
            case 'div':
                # Division Text Branch
                self.token_reader.Next()

                # Create tempory and pass it to the Factor
                # sub-routine.
                t=[None]
                self.Factor(t)

                # Allocate an unused Tempory.
                r = self.Alloc_Temp()

                # Output (DIV p t r)
                IntermediateCodeGenerator.DIV_3AC(p, t, r)

                # Parse more factors.
                self.More_Factors(r, q)
                pass
            case 'mod':
                # Modulus Branch
                self.token_reader.Next()

                # Create tempory and pass it to the Factor
                # sub-routine.
                t=[None]
                self.Factor(t)

                # Allocate an unused Tempory.
                r = self.Alloc_Temp()

                # Output (MOD p t r)
                IntermediateCodeGenerator.MOD_3AC(p, t, r)

                # Parse more factors.
                self.More_Factors(r, q)
                pass
            case _:
                # Set q to p.
                q[0] = p[0]
                pass

    def Factor(self,p):
        # Run Base sub-method.
        self.Base(p)
        
        # Check to see if this is the first case of 
        # the Factor definition by checking if the
        # next token is a Left Parentesis.
        if self.token_reader.Peek_Next()[1] == 'EXP':
            self.token_reader.Next()

            # Create tempory and pass it to the Factor
            # sub-routine.
            t=[None]
            self.Factor(t)

            # Allocate an unused Tempory.
            r=self.Alloc_Temp()

            # Output (EXP p t r)
            IntermediateCodeGenerator.EXP_3AC(p, t, r)

            # Store r for future reference.
            p[0] = r[0]

    def Base(self,p):
        match self.token_reader.Peek_Next()[1]:
            case 'UNARY-PLUS':
                # Unary Plus Branch
                self.token_reader.Next()

                # Run Value method.
                self.Value(p)

                # Allocate an unused Tempory.
                r=self.Alloc_Temp()

                # Output (PLS p r)
                IntermediateCodeGenerator.PLS_3AC(p, r)
                pass
            case 'UNARY-NEGATION':
                # Unary Negation Branch
                self.token_reader.Next()

                # Run Value method.
                self.Value(p)

                # Allocate an unused Tempory.
                r=self.Alloc_Temp()

                # Output (NEG p r)
                IntermediateCodeGenerator.NEG_3AC(p, r)
                pass
            case _:
                # Return the base case.
                self.Value(p)
                pass

    def Value(self,p):
        # Check to see if the first option as defined by
        # the instructions is present by checking to see
        # if the next token is a left parentesis.
        if self.token_reader.Peek_Next()[1] == 'LEFT-PAREN':
            self.token_reader.Next()

            # Create tempory and pass it to the Expression
            # sub-routine.
            self.Expr(p)

            # Verify that the Right Parentesis is present as well.
            if not self.token_reader.Next()[1] == 'RIGHT-PAREN':
                return
        else:
            # This is either a constant or an identifier.
            # either way, its stringified.
            p[0] = str(self.token_reader.Next()[0])

# Four text samples provided for undergraduate
# part of the assignment. Unchanged from Canvas.
Compiler('first.txt').Compile()
Compiler('second.txt').Compile()
Compiler('third.txt').Compile()
Compiler('fourth.txt').Compile()

# Extra Credit Graduate examples.
Compiler('conditional.txt').Compile()
Compiler('while.txt').Compile()

# Write the buffer defined in the IntermediateCodeGenerator
# to a file. In the case of this program, this will be identical
# to the output provided to stdout.
with open('output.txt', 'w') as filehandle:
    for listitem in IntermediateCodeGenerator.output:
        filehandle.write(f'{listitem}\n')
