import express from "express";
import axios from "axios";
import bodyParser  from "body-parser";


const app = express();
const port = 3000;
const JOKE_API = "https://v2.jokeapi.dev/joke";

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
 

let single_joke = [];
let twopart_joke_setup = {};
let twopart_joke_delivery = {};
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let date = new Date().getDate();



app.get("/", async(req, res) =>{
    res.render("index.ejs", {single : single_joke, twopart_setup : twopart_joke_setup, twopart_delivery : twopart_joke_delivery, 
    Single_joke : "Single-Joke", Setup : "Setup", Delivery : "Delivery" , year : year, month : month, date : date})
    single_joke = [];
    twopart_joke_setup = {};
    twopart_joke_delivery = {};    

});


app.post("/joke", async(req, res) => {
    const category = req.body['category_type'];   
    const flag = req.body['flag_type'];
    try{
        if(category == " " || flag == " "){
            res.render("error.ejs", {year : year, month : month, date : date})
        }
        else{
            const response = await axios.get(`${JOKE_API}/${category}/${flag}`);
            const joke = response.data;
            if (joke['type'] === 'single')
            {
                single_joke.push(joke["joke"]);     
                console.log("Single Joke");
            }

            else 
            {
                twopart_joke_setup['Setup'] = (joke['setup']);
                twopart_joke_delivery['Delivery'] = (joke['delivery']);
                console.log("TwoPart Joke")
            }
    
            res.redirect("/")
        }

    }catch(err){
        console.log(err)
    }
   
    
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})