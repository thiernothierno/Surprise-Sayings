import express from "express";
import axios from "axios";
import bodyParser  from "body-parser";


const app = express();
const port = 3000;
const JOKE_API = "https://v2.jokeapi.dev/joke";

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

const categories = ["Programming", "Misc", "Pun", "Dark", "Spooky"];
const flags = ["nsfw", "religious", "political", "racist", "sexist", "explicit"];

const random_categorie = categories[Math.floor(Math.random(categories) * categories.length)];
const random_flag = flags[Math.floor(Math.random(flags) * flags.length)];

let result = "";

app.get("/", async(req, res) =>{
    res.render("index.ejs", {joke : result})
    result = [];
});


app.post("/joke", async(req, res) => {
    try{
        const category = req.body['category_type'];
        const flag = req.body['flag_type'];
        const response = await axios.get(`${JOKE_API}/${category}/${flag}`);
        const joke = response.data;
        if (joke['type'] === 'single'){
            result += joke['joke'];
            
        }

        else {
           const data = {
            "setup" : joke['setup'],
            "delivery" : joke['delivery']
           }
           result += joke['setup'];
           result += joke['delivery'];
        }
        
        res.redirect("/")
        console.log(result)
       
    } catch(error){
        res.status(500).json({message : "Error fetching data."})
    }   
})






















// app.get("/joke/:type", async(req, res) => {
//     try{
//         const type = req.params.type;
//         console.log(type);
//         const response = await axios.get(`${JOKE_API}/${type}`);
//         const joke = response.data;
//         if (joke['type'] === 'single'){
//             console.log(joke['joke']);
//             res.json(joke['joke'])
//         }

//         else {
//            const data = {
//             "setup" : joke['setup'],
//             "delivery" : joke['delivery']
//            }
//            console.log(data)
//            res.json(data)
//         }

//     }catch(error){
//          res.status(500).json({message : "Error fetching data."})
//     }
// })





app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})