// // //Strings are Immutable
// // let str = "Hello";
// // str[0] = "Y";
// // console.log(str); // Hello

// // //to edit string 
// // let str = "Hello";
// // str = "Y" + str.slice(1);
// // console.log(str); // Yello

// // //primitive string
// //     //most used
// // let str = "JavaScript";
// // console.log(typeof str);

// // //string object
// //     //avoid
// // let strObj = new String("JavaScript");
// // console.log(typeof strObj);

// //--------------------------------------------------------------------------------
//                                     //function of string and method
//     //lenth
// // let str="JavaScript";
// // console.log(str.length);

//     //accessing characters
// // let str1="JavaScript";
// // console.log(str1[1]); //preferred in modern js,out of range--->undefined
// // console.log(str1.charAt(1));//out of range --->Empty string ("")

//     //Template Literals(Backticks)
// //Allow variable embedding.
// //Support multi-line strings
// //final sentence always write in ``
// // let fname="Yagna";
// // let lname="Patel";
// // let fullName=`My Name is ${fname} ${lname}.`
// // console.log(fullName);


//                                 //Common String Methods (VERY IMPORTANT)

// //toupperCase and toLowerCase
// // let str2="Patel Yagna";
// // console.log(str2.toUpperCase());
// // console.log(str2.toLocaleLowerCase());

// // //trim
// // //remove all spaces from start to end
// // let str3 = "  hello  ";
// // console.log(str3.trim());

// //slice(start,end)
// // let str4 = "JavaScript";
// // console.log(str4.slice(0, 4)); 
// // console.log(str4.slice(-6)); 
// // console.log(str4.slice(-1,-3));//find reason

// // //substring(start,end)
// // //does not accept negative value
// // let str5 = "JavaScript";
// // console.log(str5.substring(0, 4)); // Java

// // //replace
// // let str6 = "Hello World";
// // console.log(str6.replace("World", "JS")); 


// //startsWith() / endsWith()
// let str7 = "JavaScript";
// console.log(str7.startsWith("Java") );
// console.log(str7.endsWith("Script"));

// //split
// let str8 = "a,b,c";
// let arr = str8.split(",");
// console.log(arr); // ["a", "b", "c"]

