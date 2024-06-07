const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'https://stayvista-12.web.app'],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'unauthorized access' });
    }
    req.user = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bahxz3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const assetCollection = client.db('ReturnTrack').collection('assets');
    const userCollection = client.db('ReturnTrack').collection('users');
    const requestCollection = client.db('ReturnTrack').collection('requests');
    const employerCollection = client.db('ReturnTrack').collection('employers');
    const managerCollection = client.db('ReturnTrack').collection('managers');

    // auth related api
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true });
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // save a user data in db
    app.put('/user', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      // check user already exists
      const isExist = await userCollection.findOne(query);
      if (isExist) {
        if (user.status === 'requested') {
          const result = await userCollection.updateOne(query, { $set: { status: user?.status } });
          return res.send(result);
        } else {
          return res.send(isExist);
        }
      }

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      };
      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // Request an asset
    app.put('/requestAsset', async (req, res) => {
      const { assetId, notes, name, type, requestDate, requestedBy, requestedByName } = req.body;

      if (!assetId || !requestedBy) {
        return res.status(400).send({ message: 'Asset ID and requestedBy are required' });
      }

      try {
        const query = { _id: new ObjectId(assetId) };
        const asset = await assetCollection.findOne(query);

        if (!asset) {
          return res.status(404).send({ message: 'Asset not found' });
        }

        if (asset.availability === 'Out of stock') {
          return res.status(400).send({ message: 'Asset is out of stock' });
        }

        const request = {
          assetId: new ObjectId(assetId),
          name,
          type,
          notes,
          requestDate,
          requestedBy,
          requestedByName,
          status: 'Pending',
          approvalDate: null,
        };

        const requestResult = await requestCollection.insertOne(request);

        const updateDoc = {
          $set: {
            availability: 'Requested',
            lastRequestedBy: requestedBy,
            lastRequestDate: requestDate,
            requestNotes: notes,
          },
        };
        const assetResult = await assetCollection.updateOne(query, updateDoc);

        res.send({ requestResult, assetResult });
      } catch (err) {
        res.status(500).send({ message: 'Failed to request asset', error: err });
      }
    });

    // Cancel a request
    app.delete('/cancelRequest/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const requestQuery = { _id: new ObjectId(id) };
        const request = await requestCollection.findOne(requestQuery);

        if (!request) {
          return res.status(404).send({ message: 'Request not found' });
        }

        if (request.status !== 'Pending') {
          return res.status(400).send({ message: 'Only pending requests can be canceled' });
        }

        const deleteResult = await requestCollection.deleteOne(requestQuery);

        const assetQuery = { _id: new ObjectId(request.assetId) };
        const assetUpdateDoc = {
          $set: { availability: 'Available' },
        };
        const assetUpdateResult = await assetCollection.updateOne(assetQuery, assetUpdateDoc);

        res.send({ deleteResult, assetUpdateResult });
      } catch (err) {
        res.status(500).send({ message: 'Failed to cancel request', error: err });
      }
    });

    // Return an asset
    app.put('/returnAsset/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const requestQuery = { _id: new ObjectId(id) };
        const request = await requestCollection.findOne(requestQuery);

        if (!request) {
          return res.status(404).send({ message: 'Request not found' });
        }

        if (request.status !== 'Approved') {
          return res.status(400).send({ message: 'Only approved requests can be returned' });
        }

        const updateRequestDoc = {
          $set: { status: 'Returned', returnDate: new Date().toISOString() },
        };
        const requestUpdateResult = await requestCollection.updateOne(requestQuery, updateRequestDoc);

        const assetQuery = { _id: new ObjectId(request.assetId) };
        const assetUpdateDoc = {
          $set: { availability: 'Available' },
        };
        const assetUpdateResult = await assetCollection.updateOne(assetQuery, assetUpdateDoc);

        res.send({ requestUpdateResult, assetUpdateResult });
      } catch (err) {
        res.status(500).send({ message: 'Failed to return asset', error: err });
      }
    });


        // Add a new route to update an asset
        app.put('/assets/:id', async (req, res) => {
          const id = req.params.id;
          const { name, type, quantity, dateAdded } = req.body;
          const updateDoc = {
            $set: { name, type, quantity, dateAdded },
          };
          try {
            const result = await assetCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
            res.send(result);
          } catch (error) {
            res.status(500).send({ message: 'Failed to update asset', error: error.message });
          }
        });

    // Get all user requests
    app.get('/requests', verifyToken, async (req, res) => {
      const email = req.query.email;

      if (!email) {
        return res.status(400).send({ message: 'Email is required' });
      }

      try {
        const query = { requestedBy: email };
        const result = await requestCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: 'Failed to fetch requests', error: err });
      }
    });


    // get requested data by filter and searching
    // Get user requests with filtering(user assets)
app.get('/requests/filter', async (req, res) => {
  const { email, search, status, type } = req.query;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  const query = { requestedBy: email };

  if (search) {
    query.name = { $regex: search, $options: 'i' }; // Case-insensitive regex search
  }

  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = type;
  }

  try {
    const requests = await requestCollection.find(query).toArray();
    res.send(requests);
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch requests', error: err });
  }
});



// filter assets----
app.get('/filtered-assets', async (req, res) => {
  const { search, availability, type } = req.query;
  const filter = {};
  
  // Add search query to filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Add availability query to filter
  if (availability) {
    filter.availability = availability;
  }
  
  // Add type query to filter
  if (type) {
    filter.type = type;
  }

  try {
    const assets = await assetCollection.find(filter).toArray();
    res.send(assets);
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch assets', error: err });
  }
});




    // Get all users from db
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // Get a user info from db
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    // update a user role
    app.patch('/users/update/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email };
      const updateDoc = {
        $set: { ...user, timestamp: Date.now() },
      };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Get all assets from db
    app.get('/assets', async (req, res) => {
      const category = req.query.category;
      let query = {};
      if (category && category !== 'null') query = { category };
      const result = await assetCollection.find(query).toArray();
      res.send(result);
    });

    // Get all assets for host from db
    app.get('/myListings/:email', async (req, res) => {
      const email = req.params.email;
      let query = { 'host.email': email };
      const result = await assetCollection.find(query).toArray();
      res.send(result);
    });

    // Get single asset data from db using _id
    app.get('/asset/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assetCollection.findOne(query);
      res.send(result);
    });

    // Get employer data from db
    app.get('/employer', async (req, res) => {
      const result = await employerCollection.find().toArray();
      res.send(result);
    });

    // Get all requests
    app.get('/allRequests', async (req, res) => {
      try {
        const result = await requestCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: 'Failed to fetch requests', error: err });
      }
    });

    // Approve a request
    app.put('/approveRequest/:id', async (req, res) => {
      const id = req.params.id;
      const { approvalDate } = req.body;
      const approvalData = new Date()

      try {
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { 
            status: 'Approved',
            approvalDate: approvalData
           },
        };
        const result = await requestCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: 'Failed to approve request', error: err });
      }
    });

    // Reject a request
    app.put('/rejectRequest/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status: 'Rejected' },
        };
        const result = await requestCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: 'Failed to reject request', error: err });
      }
    });


    // Get manager data from db
    app.get('/manager', async (req, res) => {
      const result = await managerCollection.find().toArray();
      res.send(result);
    });

    // Save data in db
    app.post('/asset', async (req, res) => {
      const assetData = req.body;
      const result = await assetCollection.insertOne(assetData);
      res.send(result);
    });

    // Save employer data in db
    app.post('/employer', async (req, res) => {
      const assetData = req.body;
      const result = await employerCollection.insertOne(assetData);
      res.send(result);
    });

    // Save manager data in db
    app.post('/manager', async (req, res) => {
      const assetData = req.body;
      const result = await managerCollection.insertOne(assetData);
      res.send(result);
    });

    // Delete an asset by ID
app.delete('/assets/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await assetCollection.deleteOne(query);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete asset', error: err });
  }
});

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from ReturnTrack Server..');
});

app.listen(port, () => {
  console.log(`ReturnTrack is running on port ${port}`);
});
