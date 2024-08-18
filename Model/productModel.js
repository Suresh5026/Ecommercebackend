const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      size : {
        type : [String],
        required : true
      },
      color : {
        type: [String],
        required: true
      },
      stock: {
        type: Number,
        required: true,
      },
      discount : {
        type : Number,
        required : true
      },
      imageUrl: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      }
},{ timestamps : true })

const productModel = mongoose.model('products',productSchema)
module.exports = productModel;