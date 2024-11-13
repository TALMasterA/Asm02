var express = require('express');
var router = express.Router();
const path = require('path');
const { connectToDB, ObjectId } = require('../utils/db');

// The form for adding new user
router.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname,'addUserForm.html'));
  });
  
  /* Handle the Form */
  router.post('/new', async function (req, res) {
    const db = await connectToDB();
    try {
      req.body.Terms = req.body.Terms? true : false;
      req.body.created_at = new Date();
      req.body.modified_at = new Date();
  
      let result = await db.collection("Users").insertOne(req.body);
      res.redirect('/users');
    } catch (err) {
      res.status(400).json({ message: err.message });
    } finally {
      await db.client.close();
    }  
  });

/* Delete an user */
router.post('edit/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("Users").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.redirect('/Users');
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// The form for editing an existing user
router.get('/edit/:id', async (req, res) => {
    const db = await connectToDB();
  try {
    let result = await db.collection("Users").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('editUserForm', { User : result });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

module.exports = router;
