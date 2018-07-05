var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models")

var PORT = process.env.PORT || 5000;

var app = express();

const path = require('path');

var cors = require('cors');

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/NewYorkTimes'

app.use(logger("dev"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// app.get('/', function (req,res) {
//     res.send('Hello There')
// })


app.use(express.static('client/build'));

//const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
})


app.get('/api/articles', function (req,res) {
   db.Article.find({}).then(function(dbArticle) {
       console.log(dbArticle)
       res.json(dbArticle)
   }).catch(function(err) {
    res.json(err);
  })
})

app.post('/api/scrape', function (req,res) {
    axios.get('https://www.nytimes.com/section/technology').then(function(response) {
    var $ = cheerio.load(response.data);
    var results = [];
        $('article.story').each(function(i, element) {
            headline = $(element).find('h2.headline').text().trim();
            summary = $(element).find('p.summary').text()
            link = $(element).find('a').attr('href')
            results.push({
                headline: headline,
                link: link,
                summary: summary
        })
        }) 
        results.forEach((element,i) => {
            db.Article.findOne({headline: element.headline}).then(
                function(dbArticle) {
                    if (dbArticle) {
                    console.log(i + 'In Records')
                        if (i === results.length - 1 && dbArticle) {
                            console.log('complete')
                            res.send('complete')
                        }
                    }
                    else {
                        db.Article.create(results).then(function(dbArticle) {
                            console.log(dbArticle)
                            if (i === results.length - 1 & dbArticle) {
                                console.log('complete')
                                db.Article.find({}, function (dbArticle) {
                                    res.json(dbArticle)
                                })
                            }
                        }).catch(function(err) {
                            return res.json(err)
                        });
                    }
                    // if (i === results.length - 1) {
                    //     console.log(i, 'records')
                    //     db.Article.find({}, function (dbArticle) {
                    //         res.json(dbArticle)
                    //     })
                    // }
                    // else if (i === results.length - 1 && !dbArticle) {
                    //     console.log(i, ' not records')
                    //     db.Article.create(results).then(function(dbArticle) {
                    //         //res.send(dbArticle)
                    //         console.log(dbArticle)
                    //         db.Article.find({}, function (dbArticle) {
                    //             res.json(dbArticle)
                    //         }).catch(function(err) {
                    //             return res.json(err)
                    //         })
                    //     })
                    // }
                })
        })
        //res.send('Hello')
     })
})

app.put('/api/save', function(req,res) {
    console.log(req.body)
    db.Article.findOneAndUpdate({_id: req.body.mongoId}, {saved: true}, {'new': true}, function(result) {
        console.log(result)
        res.end()
    })
})

app.put('/api/unsave', function(req,res) {
    console.log(req.body)
    db.Article.findOneAndUpdate({_id: req.body.mongoId}, {saved: false}, {'new': true}, function(result) {
        console.log(result)
        res.end()
    })
})

app.get('/api/saved', function (req, res) {
    db.Article.find({saved: true}).then(function(dbArticle) {
        res.json(dbArticle)
    }).catch(function(err) {
     res.json(err);
   })
})

app.post('/api/notes', function (req,res) {
    var note = req.body.note
    var id = req.body.id
    db.Note.create({body: req.body.note}).then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: id}, {$push: {note: dbNote._id}}, {new: true})
    }).then(function(dbArticle) {
        res.json(dbArticle)
    }).catch(function(err) {
        res.json(err)
    })
})

app.get('/api/articlepop', function(req,res) {
   //console.log(req.params)
    //console.log(req.body)
    console.log(req.query.id)
    db.Article.findOne({_id: req.query.id}).populate('note').then((dbArticle) => {
        res.json(dbArticle)
      }).catch((err) => {
        res.json(err)
      })
})

app.get('/api/note', function (req,res) {
    db.Note.find({}).then(function(dbNote) {
        res.json(dbNote)
    })
})

app.delete('/api/note/delete',function(req,res) {
    var id = req.body.id
    db.Note.deleteOne({_id: id}, function(err) {
        if(err) {
            res.json(err)}
            else {
        res.end()
                 }
    })
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


