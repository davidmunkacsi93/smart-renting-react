import mongoose from 'mongoose';

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

 
const Account = new Schema({
    id: ObjectId,
    address: String
});

const User = new Schema({
    id: ObjectId,
    name: String,
    address: String,
});

export const connect = () => {
    mongoose.connect('mongodb+srv://SmartRent:Pa\$\$word123@smartrentdb-estgp.mongodb.net/test?retryWrites=true').then((res) => {
        console.log(res);
    });
}

const MongoDbApi = {

}