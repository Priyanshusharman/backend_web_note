const mongoose = require('mongoose');
const dburl = 'mongodb+srv://aidpriyanshu:uQV9tbTDN9uuPlhV@webnote.s52wq4d.mongodb.net/?retryWrites=true&w=majority';
               
// const coonectToMongoose = () => {
//     mongoose.connect(dburl)
//         .then(console.log("Connected"))
// }
const coonectToMongoose = () => {
mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Set to a higher value if needed
  });
}

module.exports = coonectToMongoose;
