                                            // Dates

//Date internally stores time in milliseconds since 1 Jan 1970

//console.log(typeof myDate);

let now = new Date();
// console.log(now);


let myDate = new Date()
// console.log(myDate.toString());
// console.log(myDate.toDateString()); //(date + time)
// console.log(myDate.toLocaleString()); 
// console.log(myDate.toLocaleDateString);
// console.log(myDate.toTimeString);



// let myCreatedDate = new Date(2023, 0, 23) //month starts from zero
// let myCreatedDate = new Date(2023, 0, 23, 5, 3) //5 and 3 is hr etc..
// let myCreatedDate = new Date("2023-01-14") //month starts from 1
let myCreatedDate = new Date("01-14-2023")
console.log(myCreatedDate.toLocaleString());
console.log(myCreatedDate.toDateString());
console.log(myCreatedDate.toLocaleDateString());
console.log(myCreatedDate.toString());




let myTimeStamp = Date.now()

// console.log(myTimeStamp);
// console.log(myCreatedDate.getTime());
// console.log(Math.floor(Date.now()/1000)); 

let newDate = new Date()
// console.log(newDate);
// console.log(newDate.getMonth() + 1);
// console.log(newDate.getDay());

// `${newDate.getDay()} and the time `

newDate.toLocaleString('default', {
    weekday: "long",
    
}
)
