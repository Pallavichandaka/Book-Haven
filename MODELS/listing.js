const mongoose = require("mongoose");
const { Schema } = mongoose; 

const listingSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    image: { 
        type: String,
        set: (v) => v.trim() === "" ? "default link" : v 
    },
    price: { type: Number, required: true },
    category: { type: String },
    publisher: { type: String },
    publication_year: { type: Number },
    stock: { type: Number, default: 0 }, 
    language: { type: String }
}); 

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 