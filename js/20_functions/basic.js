
function sayMyName(){
    console.log("Y");
    console.log("A");
    console.log("G");
    console.log("N");
    console.log("A");
}

// sayMyName()  // CALLING + PRINT FUNCTION
// sayMyName    //JUST REFRANCE

// function addTwoNumbers(number1, number2){

//     console.log(number1 + number2);
// }

function addTwoNumbers(number1, number2){

    // let result = number1 + number2
    // return result
}

const result = addTwoNumbers(3, 5)

// console.log("Result: ", result);


function loginUserMessage(username = "sam"){
    if(!username){
        console.log("PLease enter a username");
        return
    }
    return `${username} just logged in`
}


                        