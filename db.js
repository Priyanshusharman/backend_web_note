const mongoose = require('mongoose');
const dburl = 'mongodb+srv://aidpriyanshu:uQV9tbTDN9uuPlhV@webnote.s52wq4d.mongodb.net/';

const coonectToMongoose = () => {
    mongoose.connect(dburl)
        .then(console.log("Connected"))
}
module.exports = coonectToMongoose;