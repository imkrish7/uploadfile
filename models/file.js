const mongodb= require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var file = new Schema({
    name:String,
    type:String,
    fileSize:String,
    path:String
})

const model = mongoose.model('File',file);

module.exports=model;