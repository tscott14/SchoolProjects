all: bin/program

bin/program: obj/main.o obj/big_int.o
	g++ obj/main.o obj/big_int.o -o bin/program

obj/main.o: src/main.cpp
	g++ -c src/main.cpp -o obj/main.o

obj/big_int.o: src/big_int.cpp
	g++ -c src/big_int.cpp -o obj/big_int.o

clean:
	rm obj/*.o bin/program