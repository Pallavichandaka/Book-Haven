const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing = require("./MODELS/listing.js");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
main()
.then( ()=> {
    console.log("connected to DB");
})
.catch( (err)=> {
 console.log(err);
});
async function main(){
    await mongoose.connect (MONGO_URL);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));






app.get("/", (req, res)=>{
    res.send("Hi, im pallu");
});

//Index Route
app.get("/listings", async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
 });




//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//create route
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

app.post("/listings", async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res.redirect("/listings");
    } catch (error) {
        console.error("Error saving listing:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });

})

//update Route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
});



app.get("/testListing", async (req,res) => {
    let sampleListing = new Listing({
        title: "My New Book",
        author: "John Doe",
        description: "A fascinating book about the world of coding.",
        image: "https://example.com/default-book.jpg",
        price: 19.99,
        category: "Programming",
        publisher: "Tech Press",
        publication_year: 2024,
        stock: 50,
        language: "English"
    });
    await sampleListing.save();
    console.log("sample was saved<3!");
    res.send("Successful testing");
});

app.listen(8080, ()=> {
    console.log("server is listening to port 8080");
});