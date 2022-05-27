const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const app = express();


const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(flash());

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
const https = require("https");
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "sessions"
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(adminRoutes);
app.use(authRoutes);


app.post('/', (req, res) => {
    const city = req.body.cName;
    const apiKey = "713fb4c45956cf24221511fbda5dde5a";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit + ""

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const wData = JSON.parse(data);
            const temp = wData['main']['temp'];
            const wDescription = wData['weather'][0]['description'];
            const icon = wData['weather'][0]['icon'];
            const humidity = wData['main']['humidity'];
            const pressure = wData['main']['pressure'];
            const wind = wData['main']['wind']['speed'];
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h3>The weather is " + wDescription + "</h3>");
            res.write("<h1>The temperature in " + city + "is " + temp + " degrees Celcius </h1>");
            res.write("<h1>The humidity in " + city + " is, while pressure is " + pressure + " and speed of wind is " + wind + "</h1>");
            res.write("<img src=" + imageURL + ">");

            res.send();
        })

    })

})

mongoose
    .connect(process.env.MONGODB_URI, {dbName: "shop"}, {useNewUrlParser: true})
    .then(result => {
        app.listen(process.env.PORT);
        console.log("Web Server is Running");
    })
    .catch(err => {
        console.log(err);
    });
