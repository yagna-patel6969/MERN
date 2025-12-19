            //into number

let score = "hitesh" // try this to enter:"33abc", "true/false", null , undefined ,  

console.log(typeof score);
console.log(typeof(score));

let valueInNumber = Number(score)
console.log(typeof valueInNumber);
console.log(valueInNumber);


// "33" => 33
// "33abc" => NaN (not a number but type=number)
//  true => 1; 
// false => 0


//------------------------------------

                //into boolean


let isLoggedIn = "hitesh" // try to enter a true, false, "", "yagna"

let booleanIsLoggedIn = Boolean(isLoggedIn)
console.log(booleanIsLoggedIn);

// 1 => true; 0 => false
// "" => false
// "yagna" => true

//---------------------------------

                //into string

let someNumber = 33

let stringNumber = String(someNumber)
console.log(stringNumber);
console.log(typeof stringNumber);