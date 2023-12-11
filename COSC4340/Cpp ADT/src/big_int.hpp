/*
 * Tristan Scott
 * COSC 4340.001
 * October 19, 2023
 * Assignment #2 -- C/C++ ADT Programming Assignment
 *
 * Purpose: Here, BigInt is declared and defined.
 */

#include <cstdint>
#include <fstream>
#include <iostream>

/**
 * @brief An emulated object to represent a 64-bit integer.
 *
 */
class BigInt {
  unsigned int loworder;
  unsigned int highorder;
  int overflow;

public:
  BigInt() = default; // DEFAULT CONSTRUCTOR

  // Stream operators defined here.
  friend std::ifstream &operator>>(std::ifstream &in, BigInt &);
  friend std::ofstream &operator<<(std::ofstream &out, BigInt &);

  // Arythmetic operations defined here.
  BigInt operator+(const BigInt &b) const;
  BigInt operator*(const BigInt &e) const;

private:
  void shiftLeft(int);
};