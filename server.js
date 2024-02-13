//Server code

var path = require('path')
var express = require('express')
var exphbs = require('express-handlebars')
var fs = require('fs')

var postData = require('./posts.json')

var app = express()



app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

var port = process.env.PORT || 3000

app.use(express.static('static'))
app.use(express.json())


app.get('', function (req, res)
{
  res.status(200).render('indexPage')
})
//Index Page (Handlebar: indexPage)
app.get('/index', function (req, res)
{
  res.status(200).render('indexPage')
})

//MyRecipes Page (Handlebar: browse)
app.get('/myPosts', function (req, res)
{
  console.log(postData)
  res.status(200).render('browse', {
    isBrowse: false,
    recipes:postData
  })
})

//Add on myrecipes
app.get('/myPosts/newPost', function (req, res)
{
  res.status(200).render('addPost')
})

//Browse Page (Handlebar: browse)
app.get('/browse', function (req, res)
{
  res.status(200).render('browse', {
    browse: true,
    recipes:postData
  })
})


//Write to posts.json
app.post('/myPosts/newPost', function(req, res, next){
  if (req.body && req.body.name && req.body.ingredients && req.body.link && req.body.photoURL) {
    console.log("== Client sent the following post:");
    console.log("  - title:", req.body.name);
    console.log("  - description:", req.body.ingredients);
    console.log("  - link:", req.body.link);
    console.log("  - photoURL:", req.body.photoURL);
    console.log("  - library:", "False");

    //add recipe here
    postData.push({
      name: req.body.name,
      ingredients: req.body.ingredients,
      link: req.body.link,
      photoURL: req.body.photoURL,
      library: req.body.library
    })

    fs.writeFile(
      "./posts.json",
      JSON.stringify(postData, null,2),
      function (err) {
        if (err) {
          res.status(500).send("Error writing post to DB")
        } else {
          res.status(200).send("Post successfully added to DB")
        }
      }
    )
  } else {
    res.status(400).send("Requests to this path must contain a JSON body with all fields filled.");
  }

})

//404 Page (404)
app.get('*', function(req, res, next)
{
  res.status(404).render('404')
})

app.listen(port, function ()
{
  console.log("== Coding Server is listening on port", port)
})