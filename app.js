const express = require("express");

const app = express();

const https = require("https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/signup.html")
})

//we take data from the form and make a js object
//with the params the mailchimp api needs and fill the 
//value with the values from our form and a status
app.post("/", (req,res) =>{
    let firstName = req.body.first
    let lastName = req.body.last
    let email = req.body.email
    
    let data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //we compress it
    let jsonData= JSON.stringify(data);
    //this is the mailchimp api call
    const url = "https://us14.api.mailchimp.com/3.0/lists/f13c0b0e4c";

    const options ={
        method: "POST",
        auth: "Yuri:3242b406669d13285bc8fd3c700eff3a-us14"
    }
    //https request needs an url, options and a callback function with a response

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname +"/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData); //send it with the json data
    request.end(); //end the request
})


app.post("/failure", (req,res) =>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000")
})


