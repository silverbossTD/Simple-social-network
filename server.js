const mongoose  = require('mongoose');
const uri       = "mongodb+srv://silverboss:duy024680@cluster0.kx62y.mongodb.net/test?retryWrites=true&w=majority";

function connectDatabase() {
    mongoose.connect(uri, {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        useUnifiedTopology: true,
        useNewUrlParser: true
     }).then(respone => {
        console.log('Database connected');
     }).catch(error => {
        console.log('Database error: ' + error);
     });
}

module.exports = connectDatabase;
