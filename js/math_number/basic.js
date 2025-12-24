//--------------------------------Number------------------------------
// NaN === NaN; // false
// NaN !== NaN; // true
// x === NaN; // always false
// Number.isNaN(x); // true
// isNaN("abc");          // true
// Number.isNaN("abc");  // false
// NaN is the only value in JS that is not equal to itself
// Always use Number.isNaN()
// typeof NaN → "number"
//(.is is used to check the true or false)
//toFixed() returns string
//Math.random() never returns 1


//const score = 400
// console.log(score);

//const balance = new Number(400.000)
//console.log(balance);

// console.log(balance.toString().length);
// console.log(balance.toFixed(2)); //it's return value with decimal 

//const otherNumber = 123.8966

//console.log(otherNumber.toPrecision(4)); //do roundof

//const hundreds = 1000000
// console.log(hundreds.toLocaleString('en-IN')); //show calue in indian style 

//Number.parseInt() / parseFloat()
// parseInt("10px");    
// parseFloat("3.14kg"); 
// Number.parseInt("px100"); 
//plz read diffrence in chat 



// ----------------------------------- Maths ---------------------------------------

// Number.isInteger() is safer than typeof
//Math.random() never returns 1
//Math methods do not modify original number



// console.log(Math);
// console.log(Math.abs(-4));
// console.log(Math.round(4.6));
// console.log(Math.ceil(4.2));
// console.log(Math.floor(4.9));
// console.log(Math.min(4, 3, 6, 8));
// console.log(Math.max(4, 3, 6, 8));
console.log(Math.trunc(4.9));
console.log(Math.trunc(-4.9));




// console.log(Math.random()); //value always give b/w 0 and 1 
// console.log((Math.random()*10) + 1); //do +1 to avoid 0 ans
// console.log(Math.floor(Math.random()*10) + 1); ////do +1 to avoid 0 ans

// const min = 10
// const max = 20

// console.log(Math.floor(Math.random() * (max - min + 1)) + min) //to want a number without decimal point and inimum 10  
