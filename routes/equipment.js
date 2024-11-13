const express = require('express');
const router = express.Router();
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');   

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('bookingsDB');
    db.client = client;
    return db;
}

// The form for adding new equipment
router.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname,'addEquipmentForm.html'));
});

/* Handle the Form */
router.post('/add', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.Highlight = req.body.Highlight? true : false;
    req.body.created_at = new Date();
    req.body.modified_at = new Date();

    let result = await db.collection("equipments").insertOne(req.body);
    res.redirect('/equipments');
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }  
});

// The form for editing an existing equipment
router.get('/edit/:id', async (req, res) => {
    const db = await connectToDB();
  try {
    let result = await db.collection("equipments").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('editEquipmentForm', { equipment : result });
    } else {
      res.status(404).json({ message: "Equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Update an equipment */
router.post('/edit/:id/save', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.Highlight = req.body.Highlight? true : false;
    req.body.modified_at = new Date();

    let result = await db.collection("equipments").updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.modifiedCount > 0) {
      res.redirect('/equipments');
    } else {
      res.status(404).json({ message: "Equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Delete an equipment */
router.post('/delete/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("equipments").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
      res.redirect('/equipments');
    } else {
      res.status(404).json({ message: "Equipment not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

/* Display an equipment */
router.get('/detail/:id', async function (req, res) {
  const equipmentId = req.params.id;
  const db = await connectToDB();

  try {
      const equipment = await db.collection("equipments").findOne({ _id: new ObjectId(equipmentId) });

      if (!equipment) {
          return res.status(404).json({ message: 'Equipment not found' });
      }

      res.render('equipmentDetail', { equipment: equipment });
  } catch (err) {
      res.status(400).json({ message: err.message });
  } finally {
      await db.client.close();
  }
});

module.exports = router;