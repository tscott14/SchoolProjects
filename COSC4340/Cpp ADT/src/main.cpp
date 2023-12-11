/*
 * Tristan Scott
 * COSC 4340.001
 * October 19, 2023
 * Assignment #2 -- C/C++ ADT Programming Assignment
 *
 * Objective: This software application simulates 64-bit integer
 *          operations by utilizing 32-bit integers. It reads
 *          in a file containing two columns of hexadecimal
 *          integers and outputs the original values, as well as
 *          their sum and product.
 *
 * Additional: The input file path is defined by the variable INPUT_FILE_PATH,
 *      while the output file path is defined by the variable OUTPUT_FILE_PATH.
 *      To produce an outfile without leading zeros, define NO_LEADING_ZEROS
 *      macro in the big_int.cpp translation unit or supply it as a compiler
 *      option.
 *
 * Purpose: This file serves as the client for this emulator.
 */

#include "big_int.hpp"

/*
 * Input and output file paths are defined here.
 */
static const char *INPUT_FILE_PATH = "input.txt";
static const char *OUTPUT_FILE_PATH = "output.txt";

/**
 * @brief The entry point of the program.
 *
 * @param argv The number of parameters.
 * @param args The list of parameters
 * @return int The program exit status.
 */
int main(int argv, char **args) {
  // Attempt to open file specified by INPUT_FILE_PATH
  std::ifstream file_input(INPUT_FILE_PATH);

  // Verify that the file was successfully opened;
  if (!file_input) {
    std::cerr << "Could not open file." << '\n';
    exit(1);
  }

  // The outfile defined by OUTPUT_FILE_PATH is declared and opened.
  std::ofstream out_stream;
  out_stream.open(OUTPUT_FILE_PATH, std::ios::out);

  // Declare the input to read both columns from the input file.
  BigInt left, right;
  while (!file_input.eof()) {
    // Read the numbers as BigInts.
    file_input >> left >> right;

    // Calculate their sum and products.
    BigInt sum = left + right;
    BigInt prod = left * right;

    // Output the result to the output file.
    out_stream << left << right << sum << prod << std::endl;
  }

  // Close and save the output file stream.
  out_stream.close();

  // Close input file stream.
  file_input.close();

  // Exit program.
  return 0;
}