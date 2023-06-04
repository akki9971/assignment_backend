const express = require("express")
const bodyParser = require("body-parser");
const fs = require("fs");
const moviesList = require("./moviesList.json")
const usersJSON = require("./usersList.json")
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cors())


app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", (req, res) => {
    res.send("hello");
})
app.get("/movies/list", (req, res) => {
    res.json(moviesList.movies);
})
app.get("/movies/:uid", (req, res) => {
    const uid = req.params.uid
    const movies = moviesList.movies.filter(movie => movie.uid == uid)
    res.json(movies);
})
app.post("/register", (req, res) => {
    console.log(req.body);
    try {
        if (req.body == undefined || req.body == null || Object.keys(req.body).length == 0) {
            res.status(404).end('please avoid sending empty body. Insert name, email, password fields')
            return
        }

        if (req.body.name != (undefined || null) && req.body.email != (undefined || null) && req.body.password != (undefined || null)) {
            if (req.body?.name?.length < 3) {
                if (req.body?.name?.length == 0) {
                    res.status(404).end('Name should not be empty.')
                    return
                } else {
                    res.status(404).end('Name should be greater then 3 character.')
                    return
                }
            }
            if (req.body?.email?.length == 0) {
                res.status(404).end('Email address should not be empty.')
                return
                
            }
            if (!req.body?.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                console.log('inside email validation');
                res.status(404).end('Email address should be valid.')
                return
                
            }
            if (req.body?.password?.length == 0 || req.body?.password?.length <= 7) {
                res.status(404).end('Password should not be empty. Must have atleast 8 characters.')
                return
                
            }


            // finally there are no errors
            // store the data to json file for a while.

            const users = (usersJSON).users

            const {name, email, password} = req.body

            users.push({
                name, email, password
            })

            const userString = JSON.stringify({users})

            fs.writeFile('./usersList.json', (userString), err=> {
                if(err) {
                    res.send('something unexpected happens')
                    return
                } else {
                    res.status(201).send('Created successfully')

                }
            })



        } else {
            res.status(404).end('Please Insert All mandatory fields i.e. name, email, password')
            return

        }

    } catch (error) {
        res.status(503).send(error.message)

    }
})

app.get('/users/list', (req, res)=>{
    try {
        fs.readFile('./usersList.json',"utf-8", (err, data)=>{
            if (err) {
                return 

            }
            if(data){
                // let {users} = data
                res.send(data)
            } 
        })
    }
    catch (error){
        res.status(404).send(error.message)
    }
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
})