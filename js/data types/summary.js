//  Primitive
// js is a dynamically typed 
//  7 types : String, Number, Boolearn, null, undefined, Symbol, BigInt

// const score = 100
// const scoreValue = 100.3

// const isLoggedIn = false
// const outsideTemp = null
// let userEmail;

// const id = Symbol('123')
// const anotherId = Symbol('123')

// console.log(id === anotherId);

// const bigNumber = 3456543576654356754n



// Reference (Non primitive)

// Array, Objects, Functions

// const heros = ["shaktiman", "naagraj", "doga"];
// let myObj = {
//     name: "hitesh",
//     age: 22,
// }

// const myFunction = function(){
//     console.log("Hello world");
// }

// console.log(typeof anotherId);

                            //type chaking
// typeof 10;        
// typeof "hello";  
// typeof true;     
// typeof null;      
// typeof undefined; 
// typeof {};        
// typeof [];        
// typeof function(){};

// https://262.ecma-international.org/5.1/#sec-11.4.3


// ---------------------------------------
                        //memory
// stack(primitive) and heap(non-primitive)
//Stack → copy of value
//Heap → copy of reference
//Stack stores value, heap stores reference
//Stack is faster than heap.
        //stack
// let myName="Patel Yagna";
// let yourName=myName ;
// console.log(yourName); 
// yourName="Yagna Patel";
// console.log(yourName);
// console.log(myName);
//Changes do not affect original value.
//Memory is allocated in a LIFO (Last In, First Out) manner.

let a = 10;
let b = a;

b = 20;

console.log(a); 
console.log(b); 
console.log(a);



        //Heap
//Memory is allocated dynamically.(Dynamic memory = flexible size at runtime.)
//Memory is given at runtime, not fixed in advance.
//JavaScript decides how much memory is needed while the program is running.
// let person1={
//     email : "xyx@gmail.com",
//     upi : "xyz@ybl"
// }

// let person2=person1;
// console.log(person1);
// console.log(person2);

// person2={
//     email : "abc@gmail.com",
//     upi : "abc@ybl"
// }
// console.log(person2);
// console.log(person1);

// person2.email = "abcd@gmail.com";
// console.log(person1);
// console.log(person2);










