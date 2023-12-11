/*
 * Tristan Scott
 * COSC 4340.001
 * October 19, 2023
 * Assignment #2 -- C/C++ ADT Programming Assignment
 *
 * Purpose: This file serves as the compilation unit containing
 *          the implementation of the BigInt stream operations
 *          and arythmetic operations.
 */

#include "big_int.hpp"

// Uncomment to enable no leading zeros in output file.
// #define NO_LEADING_ZEROS

/**
 * @brief This method checks to verify that the input character is a numeric
 *      value.
 *
 * @param ch The character to check.
 * @return true If the character is in-fact of numeric value.
 * @return false If the character is NOT of numeric value.
 */
static bool isNumChar(char ch) { return ch >= '0' && ch <= '9'; }

/**
 * @brief This method checks to verify that the input character is an uppercase
 *      alphabetic character.
 *
 * @param ch The character to check.
 * @return true If the character is in-fact an uppercase alphabetic character.
 * @return false If the character is NOT an uppercase alphabetic character.
 */
static bool isUpperChar(char ch) { return ch >= 'A' && ch <= 'F'; }

/**
 * @brief This method checks to verify that the input character is an lowercase
 *      alphabetic character.
 *
 * @param ch The character to check.
 * @return true If the character is in-fact an lowercase alphabetic character.
 * @return false If the character is NOT an lowercase alphabetic character.
 */
static bool isLowerChar(char ch) { return ch >= 'a' && ch <= 'f'; }

/**
 * @brief This method converts a character to its corrosponding numeric value.
 *
 * @param digit The character to assertain the numeric value of.
 * @return uint32_t The numeric value of the 'digit' supplied.
 */
static uint32_t charToNum(char digit) {
  if (isNumChar(digit))
    return digit - '0';

  if (isUpperChar(digit))
    return digit - 'A' + 10;

  if (isLowerChar(digit))
    return digit - 'a' + 10;

  return 0;
}

/**
 * @brief This function processes taking in the next BigInt supplied by the
 *      ifstream.
 *
 * @param fs The input stream to read BigInt object from.
 * @param obj A reference to the BigInt to store the value of the stream to.
 * @return std::ifstream& The original stream for further processing.
 */
std::ifstream &operator>>(std::ifstream &fs, BigInt &obj) {
  char digit;
  BigInt acc;
  uint32_t number;

  // Initialize local values.
  acc.loworder = 0;
  acc.highorder = 0;
  fs >> std::noskipws >> digit;

  // Read input until a non-numerical value is reached.
  while (isNumChar(digit) | isUpperChar(digit) | isLowerChar(digit)) {
    number = charToNum(digit);
    acc.shiftLeft(4);
    acc.loworder |= number;
    fs >> std::noskipws >> digit;
  }

  // Move values to the input BigInt.
  obj.loworder = acc.loworder;
  obj.highorder = acc.highorder;
  obj.overflow = 0;

  return fs;
}

/**
 * @brief This function formats a BigInt into a form that can be output to the
 *      file stream.
 *
 * @param fs The file stream to output to.
 * @param obj The BigInt to output to the stream.
 * @return std::ofstream& The original file stream for further use.
 */
std::ofstream &operator<<(std::ofstream &fs, BigInt &obj) {
  int32_t n;
  uint32_t t, x, z;

  // Initialize local values.
  x = 0x0000000f;

#ifdef NO_LEADING_ZEROS
  bool hasNonZeroBeenReached = false;
#endif

  // Print the highorder bits.
  for (n = 28; n >= 0; n -= 4) {
    t = obj.highorder >> n;
    z = t & x;

#ifdef NO_LEADING_ZEROS
    if (z != 0)
      hasNonZeroBeenReached = true;

    if (hasNonZeroBeenReached)
#endif
      fs << std::uppercase << std::hex << z;
  }

  // Print the loworder bits.
  for (n = 28; n >= 0; n -= 4) {
    t = obj.loworder >> n;
    z = t & x;

#ifdef NO_LEADING_ZEROS
    if (z != 0)
      hasNonZeroBeenReached = true;

    if (hasNonZeroBeenReached)
#endif
      fs << std::uppercase << std::hex << z;
  }

  // Demonstrate the fact that an overflow occured.
  if (obj.overflow) {
    fs << 'T';
  }

  fs << '\t';
  return fs;
}

/**
 * @brief This method adds two BigInts.
 *
 * @param right The other BigInt to add to this instance.
 * @return BigInt The resulting BigInt sum.
 */
BigInt BigInt::operator+(const BigInt &right) const {
  BigInt c;
  uint32_t u, v, w, z;
  int32_t carry;

  // Initialize local values.
  u = 0xFFFF;
  v = 0xFFFF0000;

  // Handle loworder bits for summation algorythm.
  w = (this->loworder & u) + (right.loworder & u);
  carry = (w & v) >> 16;
  c.loworder = w & u;
  w = this->loworder & v;
  z = right.loworder & v;
  w >>= 16;
  z >>= 16;
  w += z + carry;
  carry = (w & v) >> 16;
  z = (w & u) << 16;
  c.loworder |= z;

  // Handle highorder bits for summation algorythm.
  w = (this->highorder & u) + (right.highorder & u) + carry;
  carry = (w & v) >> 16;
  c.highorder = w & u;
  w = this->highorder & v;
  z = right.highorder & v;
  w >>= 16;
  z >>= 16;
  w += z + carry;
  carry = (w & v) >> 16;
  z = (w & u) << 16;
  c.highorder |= z;
  c.overflow = carry;

  return c;
}

/**
 * @brief This method multiplies two BigInts.
 *
 * @param right The other BigInt to multiply to this instance.
 * @return BigInt The resulting BigInt product.
 */
BigInt BigInt::operator*(const BigInt &right) const {
  BigInt product, d1, acc, f;
  int32_t bit, sw, n;
  uint32_t k, m;

  // Initialize local values.
  product.loworder = 0;
  acc.loworder = 0;
  product.highorder = 0;
  acc.highorder = 0;
  m = 0x00000001;
  d1.loworder = loworder;
  d1.highorder = highorder;
  sw = 0;

  // Handle highorder bits for product algorythm.
  for (n = 31; n >= 0; n--) {
    bit = product.highorder >> 31;
    if (bit) {
      sw = 1;
    }
    product.shiftLeft(1);
    acc.shiftLeft(1);
    k = (right.highorder >> n) & m;
    if (k) {
      product = d1 + acc;
      acc.loworder = product.loworder;
      acc.highorder = product.highorder;
      if (product.overflow) {
        sw = 1;
      }
    }
  }

  // Handle loworder bits for product algorythm.
  for (n = 31; n >= 0; n--) {
    bit = product.highorder >> 31;
    if (bit) {
      sw = 1;
    }
    product.shiftLeft(1);
    acc.shiftLeft(1);
    k = (right.loworder >> n) & m;
    if (k) {
      product = d1 + acc;
      acc.loworder = product.loworder;
      acc.highorder = product.highorder;
      if (product.overflow) {
        sw = 1;
      }
    }
  }

  // Move the accumilator into the result.
  f.loworder = acc.loworder;
  f.highorder = acc.highorder;
  f.overflow = sw;
  return f;
}

/**
 * @brief Shift the bits of this BigInt like wheel. The front bits go to the
 *      back.
 *
 * @param count The number of bits to shift left.
 */
void BigInt::shiftLeft(int count) {
  uint32_t temp;

  // Handle case that shift is less than a 32-bit WORD.
  if ((0 < count) && (count < 32)) {
    temp = loworder >> (32 - count);
    loworder <<= count;
    highorder <<= count;
    highorder |= temp;
  }
  // Handle case that shift is greater than a 32-bit WORD.
  else if ((32 <= count) && (count < 64)) {
    highorder = loworder << (count - 32);
    loworder = 0;
  }
}