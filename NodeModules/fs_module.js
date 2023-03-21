//here we are using promise file system
// const fs= require("fs/promises");
//creating Directory - Path should be there
// async function createdirectory(){
//         try{
//             await fs.mkdir('D:\\Company\\Nodejs\\demo');
//             console.log("directory is being created");
//         } catch(error){
//             console.log(error);
//         }
// }

//creating Directory - Path should not require to be there
// async function createdirectory(){
//     try{
//         await fs.mkdir('D:\\Company\\Nodejs\\praticefs\\demo',{recursive:true});
//         console.log("directory is being created");
//     } catch(error){
//         console.log(error);
//     }
// }

//Reading content of directory
// async function createdirectory(){
//     try{
//        const files= await fs.readdir('D:\\Company\\Nodejs\\demooo',{recursive:true});
//         for (const file of files){
//             console.log(file);
//         }
//     } catch(error){
//         console.log(error);
//     }
// }

//Removing directory- but directory should be empty
// async function createdirectory(){
//     try{
//        const files= await fs.rmdir('D:\\Company\\Nodejs\\demoo',{recursive:true});// wecan use fs.rm also
//         console.log ("file remode");
//     } catch(error){
//         console.log(error);
//     }
// }

//create file and write data init
// async function createdirectory(){
//     try{
//        await fs.writeFile('readme.txt','Node js fs module');// wecan use fs.rm also

//     } catch(error){
//         console.log(error);
//     }
// }


// //Reading file data
// async function createdirectory(){
//     try{
//        const data =await fs.readFile('readme.txt','utf-8');// wecan use fs.rm also
//         console.log(data);
//     } catch(error){
//         console.log(error);
//     }
// }
//apending file data
// async function createdirectory(){
//     try{
//        await fs.appendFile('readme.txt','its an backend technology');// wecan use fs.rm also
//     } catch(error){
//         console.log(error);
//     }
// }

// // copying the file
// async function createdirectory(){
//     try{
//        await fs.copyFile('readme.txt','D:\\Company\\Nodejs\\demo\\info.txt');// wecan use fs.rm also
//         console.log("file copied");
//     } catch(error){
//         console.log(error);
//     }
// }

// //get info of the file
// async function createdirectory(){
//     try{
//       const info= await fs.stat('D:\\Company\\Nodejs\\demo\\info.txt');// wecan use fs.rm also
//         console.log(info.isDirectory());
//         console.log(info.isFile());
//     } catch(error){
//         console.log(error);
//     }
// }


// createdirectory();


//------------------------------------------------------------------------------------------------------------
// // file system using callback api
// const fs =require('fs');
// fs.mkdir('D:\\Company\\Nodejs\\demo',{'recursive':true},(error)=>{
//     if(error) throw error;
//     console.log("Directory created");
// });


//-----------------------------------------------------------------------------------------
const fs =require('fs');
fs.mkdirSync('D:\\Company\\Nodejs\\demo',{'recursive':true});




