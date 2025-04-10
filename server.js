const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'My-first-DB';

let db, studentsCollection;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to DB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log(' Connected to MongoDB');
    db = client.db(dbName);
    studentsCollection = db.collection('my-crud');
  })
  .catch(err => console.error(' MongoDB Connection Failed', err));

// READ (Display all students)
app.get('/', async (req, res) => {
  const students = await studentsCollection.find().toArray();
  res.render('index', { students });
});

// CREATE
app.post('/create', async (req, res) => {
  const { name, rollno, email } = req.body;
  await studentsCollection.insertOne({ name, rollno, email });
  res.redirect('/');
});

// UPDATE
app.post('/update/:id', async (req, res) => {
  const { name, rollno, email } = req.body;
  await studentsCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { name, rollno, email } }
  );
  res.redirect('/');
});

// DELETE
app.get('/delete/:id', async (req, res) => {
  await studentsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

