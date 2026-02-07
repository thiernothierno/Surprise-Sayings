import express from "express";
import axios from "axios";
import bodyParser  from "body-parser";


const app = express();
const port = 3000;
const JOKE_API = "https://v2.jokeapi.dev/joke";

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

// const categories = ["Programming", "Misc", "Pun", "Dark", "Spooky"];
// const flags = ["nsfw", "religious", "political", "racist", "sexist", "explicit"];

// const random_categorie = categories[Math.floor(Math.random(categories) * categories.length)];
// const random_flag = flags[Math.floor(Math.random(flags) * flags.length)];

let single_joke = [];
let twopart_joke_setup = [];
let twopart_joke_delivery = [];

app.get("/", async(req, res) =>{
    res.render("index.ejs", {single_joke : single_joke, twopart_joke_setup : twopart_joke_setup, twopart_joke_delivery : twopart_joke_delivery})
    single_joke = [];
    twopart_joke_setup = [];
    twopart_joke_delivery = [];
});


app.post("/joke", async(req, res) => {
    const category = req.body['category_type'];
    const flag = req.body['flag_type'];
    try{
        if(category !== " " && flag !== " ")
        {
            try
            {
                const response = await axios.get(`${JOKE_API}/${category}/${flag}`);
                const joke = response.data;
                if (joke['type'] === 'single')
                {
                    single_joke.push(joke["joke"]);
                    console.log("Single Joke");
                    console.log(single_joke);
                }

                else 
                {
                    twopart_joke_setup.push(joke['setup']);
                    twopart_joke_delivery.push(joke['delivery']);
                    console.log("TwoPart Joke")
                    console.log(twopart_joke_setup);
                    console.log(twopart_joke_delivery)
                }
            
                res.redirect("/")
        
            } catch(error)
            {
                res.status(500).json({message : "Error fetching data."})
            }   
        }

    } catch(error)
    {
       
        res.status(404).json({message : "Please choose a category and a flag type."})
    }
    
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})