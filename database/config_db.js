const mongoose = require('mongoose');

const dbConnection = async() => { 
    try{
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Data base connection saccessful');
    }catch (error){
        console.log(error);
        throw new Error('Data base connection failed');
    }
}

module.exports = {
    dbConnection: dbConnection
}