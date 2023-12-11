;;;; Tristan Scott
;;;; COSC 4340.001
;;;; Assignment III -- LISP Set Parsers
;;;; November 9, 2023
;;;;
;;;; Purpose: Implement LISP Set functions to perform various
;;;;            mathematical operations such as membership, union,
;;;;            intersection, and difference.

;;; Definition for membership evaluation.
(defun MY_MEMBER (elt lst)
    (COND 
        ((NULL lst) nil)                                ;; if lst is empty then 
                                                        ;;  return false
        ((EQUAL elt (CAR lst)) T)                       ;; else if elt is equal to the first element of lst
                                                        ;;  then return true
        (T (MY_MEMBER elt (CDR lst)))                   ;; else return the value of the member function
                                                        ;;  with elt and the rest of lst as arguments
    )
)

;;; Run tests on the MY_MEMBER function.

(print "Value of (MY_MEMBER 'a '(a b c)) is ")
(write (MY_MEMBER 'a '(a b c)))

(print "Value of (MY_MEMBER 'a '(b c d)) is ")
(write (MY_MEMBER 'a '(b c d)))

;;; Definition for generating the union of two sets.
(defun MY_UNION (a b)
    (COND 
          ((NULL a) b)                                  ;; if lista is empty then 
                                                        ;;  return listb
          ((MY_MEMBER (CAR a) b) (MY_UNION (CDR a) b))  ;; else if the first element of lista is a member of listb
                                                        ;;  then return the union of the rest of lista with listb
          (T (CONS (CAR a) (MY_UNION (CDR a) b)))       ;; else return the constructor of the first element of lista
                                                        ;;  and the union of the rest of lista with listb
    )
)

;;; Run tests on the MY_UNION function.

(fresh-line)

(print "Value of (MY_UNION '(a b c) '(a b c)) is ")
(write (MY_UNION '(a b c) '(a b c)))

(print "Value of (MY_UNION '(a b c) '(d e f)) is ")
(write (MY_UNION '(a b c) '(d e f)))

(print "Value of (MY_UNION '(a b c) '(b c d)) is ")
(write (MY_UNION '(a b c) '(b c d)))

(print "Value of (MY_UNION '() '(a b c)) is ")
(write (MY_UNION '() '(a b c)))

(print "Value of (MY_UNION '(a b c) '()) is ")
(write (MY_UNION '(a b c) '()))

(print "Value of (MY_UNION '() '()) is ")
(write (MY_UNION '() '()))


;;; Definition for generating the intersection of two sets.
(defun MY_INTERSECT (a b)
    (COND 
        ((NULL a) a)                                    ;; if lista is empty 
                                                        ;;  then return lista
        ((MY_MEMBER (CAR a) b)                          ;; else if the first element of lista is a member of listb
            (CONS (CAR a) (MY_INTERSECT (CDR a) b)))    ;;  then return the constructor of the first element of lista
                                                        ;;   and the intersection of the rest of lista with listb
        (T (MY_INTERSECT (CDR a) b))                    ;; else return the intersection of the rest of lista with listb
    )
)

;;; Run tests on the MY_INTERSECT function.

(fresh-line)

(print "Value of (MY_INTERSECT '(a b c) '(a b c)) is ")
(write (MY_INTERSECT '(a b c) '(a b c)))

(print "Value of (MY_INTERSECT '(a b c) '(d e f)) is ")
(write (MY_INTERSECT '(a b c) '(d e f)))

(print "Value of (MY_INTERSECT '(a b c) '(b c d)) is ")
(write (MY_INTERSECT '(a b c) '(b c d)))

(print "Value of (MY_INTERSECT '() '(a b c)) is ")
(write (MY_INTERSECT '() '(a b c)))

(print "Value of (MY_INTERSECT '(a b c) '()) is ")
(write (MY_INTERSECT '(a b c) '()))

(print "Value of (MY_INTERSECT '() '()) is ")
(write (MY_INTERSECT '() '()))

;;; Definition for generating the difference of two sets.
(defun MY_DIFFERENCE (a b)
    (COND 
        ((NULL a) nil)                                  ;; if lista is empty
                                                        ;;  return nil
        ((MY_MEMBER (CAR a) b)                          ;; else if the first member of lista is in listb
            (MY_DIFFERENCE (CDR a) b))                  ;;  then recursively call the rest of a with listb
        (T (CONS (CAR a) (MY_DIFFERENCE (CDR a) b)))    ;; else return concatination of the first elem
                                                        ;; of lista with a recursive call of the rest
                                                        ;; of lista and listb.
    )
)

;;; Run tests on the MY_DIFFERENCE function.

(fresh-line)

(print "Value of (MY_DIFFERENCE '(a b c) '(a b c)) is ")
(write (MY_DIFFERENCE '(a b c) '(a b c)))

(print "Value of (MY_DIFFERENCE '(a b c) '(d e f)) is ")
(write (MY_DIFFERENCE '(a b c) '(d e f)))

(print "Value of (MY_DIFFERENCE '(a b c) '(b c d)) is ")
(write (MY_DIFFERENCE '(a b c) '(b c d)))

(print "Value of (MY_DIFFERENCE '() '(a b c)) is ")
(write (MY_DIFFERENCE '() '(a b c)))

(print "Value of (MY_DIFFERENCE '(a b c) '()) is ")
(write (MY_DIFFERENCE '(a b c) '()))

(print "Value of (MY_DIFFERENCE '() '()) is ")
(write (MY_DIFFERENCE '() '()))