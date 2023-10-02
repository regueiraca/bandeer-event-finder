import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static('public'));

const API_URL = "https://app.ticketmaster.com/discovery/v2/events.json";
const yourApiKey = "dsVdDbHuMugLQmpOAYAFtae3o1gMWQXI";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {  
    res.render("index.ejs", { events: [], content: null }); 
});

app.get("/submit", async (req, res) => {
    try {
        const { city, keyword } = req.query;
        const params = {
            keyword: keyword,
            city: city,
            size: 100,
            segmentId: "KZFzniwnSyZfZ7v7nJ",
            apikey: yourApiKey
        };
        const result = await axios.get(API_URL, { params });
        
        console.log(JSON.stringify(result.data._embedded.events[0], null, 2));
        
        const events = result.data._embedded ? result.data._embedded.events : [];
        
        res.render("index.ejs", { events: events });

    } catch (error) {
        console.log(error); 

        const errorMessage = error.response && error.response.data 
                             ? JSON.stringify(error.response.data) 
                             : "No results found.";
                             
        res.render("index.ejs", { events: [], content: errorMessage });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });