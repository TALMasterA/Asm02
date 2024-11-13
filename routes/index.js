var express = require('express');
var router = express.Router();
const { connectToDB, ObjectId } = require('../utils/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Display all equipments */
router.get('/equipments', async function (req, res) {
  const db = await connectToDB();
  try {
      let results = await db.collection("equipments").find().toArray();
      res.render('equipments', { equipments: results });
  } catch (err) {
      res.status(400).json({ message: err.message });
  } finally {
      await db.client.close();
  }
});

/* Display all users */
router.get('/users', async function (req, res) {
  const db = await connectToDB();
  try {
      let results = await db.collection("Users").find().toArray();
      res.render('Users', { Users: results });
  } catch (err) {
      res.status(400).json({ message: err.message });
  } finally {
      await db.client.close();
  }
});

module.exports = router;