const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const port = process.env.PORT || 3001;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fn;
    const lastName = req.body.ln;
    const email = req.body.mail;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/81aea807d8"
    const options = {
        method: "POST",
        auth: "key:0521ff5537918f0550159950d90f7b9c-us21"
    }

    const request = https.request( url, options , (response) => {
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/faliure.html");
        }
        // response.on("data", (data) => {
        //     console.log(JSON.parse(data));
        // })
    })

    request.write(jsonData);
    request.end();
});

app.post("/faliure", (req, res) => {
    res.redirect("/");
})

app.listen(port, () => {
    console.log("SERVER UP");
});