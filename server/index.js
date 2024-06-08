const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://stayvista-12.web.app"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

// MongoDB Connection
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
    const assetCollection = client.db("ReturnTrack").collection("assets");
    const userCollection = client.db("ReturnTrack").collection("users");
    const requestCollection = client.db("ReturnTrack").collection("requests");
    const employerCollection = client.db("ReturnTrack").collection("employers");
    const managerCollection = client.db("ReturnTrack").collection("managers");

    // Auth related API
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res.send({ token });
    });

    // Logout
    app.get("/logout", async (req, res) => {
      try {
        res.send({ success: true });
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Save a user data in DB
    app.put("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const isExist = await userCollection.findOne(query);
      if (isExist) {
        if (user.status === "requested") {
          const result = await userCollection.updateOne(query, {
            $set: { status: user?.status },
          });
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

    // Update a user role
    app.patch("/users/update/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email };
      const updateDoc = {
        $set: { ...user, timestamp: Date.now() },
      };
      try {
        const result = await userCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to update user role", error: err });
      }
    });

    // Get all users from DB
    app.get("/users", async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch users", error: err });
      }
    });

    // Get a user info from DB
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      try {
        const result = await userCollection.findOne({ email });
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch user", error: err });
      }
    });

    // Request an asset
    app.put("/requestAsset", async (req, res) => {
      const { assetId, notes, name, type, requestDate, requestedBy, requestedByName } = req.body;
      if (!assetId || !requestedBy) {
        return res.status(400).send({ message: "Asset ID and requestedBy are required" });
      }

      try {
        const query = { _id: new ObjectId(assetId) };
        const asset = await assetCollection.findOne(query);
        if (!asset) {
          return res.status(404).send({ message: "Asset not found" });
        }
        if (asset.availability === "Out of stock") {
          return res.status(400).send({ message: "Asset is out of stock" });
        }

        const request = {
          assetId: new ObjectId(assetId),
          name,
          type,
          notes,
          requestDate,
          requestedBy,
          requestedByName,
          status: "Pending",
          approvalDate: null,
        };

        const requestResult = await requestCollection.insertOne(request);
        const updateDoc = {
          $set: {
            availability: "Requested",
            lastRequestedBy: requestedBy,
            lastRequestDate: requestDate,
            requestNotes: notes,
          },
        };
        const assetResult = await assetCollection.updateOne(query, updateDoc);
        res.send({ requestResult, assetResult });
      } catch (err) {
        res.status(500).send({ message: "Failed to request asset", error: err });
      }
    });

    // Cancel a request
    app.delete("/cancelRequest/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const requestQuery = { _id: new ObjectId(id) };
        const request = await requestCollection.findOne(requestQuery);
        if (!request) {
          return res.status(404).send({ message: "Request not found" });
        }
        if (request.status !== "Pending") {
          return res.status(400).send({ message: "Only pending requests can be canceled" });
        }

        const deleteResult = await requestCollection.deleteOne(requestQuery);
        const assetQuery = { _id: new ObjectId(request.assetId) };
        const assetUpdateDoc = { $set: { availability: "Available" } };
        const assetUpdateResult = await assetCollection.updateOne(assetQuery, assetUpdateDoc);

        res.send({ deleteResult, assetUpdateResult });
      } catch (err) {
        res.status(500).send({ message: "Failed to cancel request", error: err });
      }
    });

    // Return an asset
    app.put("/returnAsset/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const requestQuery = { _id: new ObjectId(id) };
        const request = await requestCollection.findOne(requestQuery);
        if (!request) {
          return res.status(404).send({ message: "Request not found" });
        }
        if (request.status !== "Approved") {
          return res.status(400).send({ message: "Only approved requests can be returned" });
        }

        const updateRequestDoc = { $set: { status: "Returned", returnDate: new Date().toISOString() } };
        const requestUpdateResult = await requestCollection.updateOne(requestQuery, updateRequestDoc);
        const assetQuery = { _id: new ObjectId(request.assetId) };
        const assetUpdateDoc = { $set: { availability: "Available" } };
        const assetUpdateResult = await assetCollection.updateOne(assetQuery, assetUpdateDoc);

        res.send({ requestUpdateResult, assetUpdateResult });
      } catch (err) {
        res.status(500).send({ message: "Failed to return asset", error: err });
      }
    });

    // Add a new route to update an asset
    app.put("/assets/:id", async (req, res) => {
      const id = req.params.id;
      const { name, type, quantity, dateAdded } = req.body;
      const updateDoc = { $set: { name, type, quantity, dateAdded } };
      try {
        const result = await assetCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update asset", error: error.message });
      }
    });

// Get all user requests
app.get("/requests", verifyToken, async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    const query = { requestedBy: email };
    const result = await requestCollection.find(query).toArray();
    res.send(result);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Failed to fetch requests", error: err });
  }
});


// get requested data by filter and searching
    // Get user requests with filtering(user assets)
    app.get("/requests/filter", async (req, res) => {
      const { email, search, status, type } = req.query;

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const query = { requestedBy: email };

      if (search) {
        query.name = { $regex: search, $options: "i" }; // Case-insensitive regex search
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
        res
          .status(500)
          .send({ message: "Failed to fetch requests", error: err });
      }
    });

    // filter assets----
    app.get("/filtered-assets", async (req, res) => {
      const { search, availability, type } = req.query;
      const filter = {};

      // Add search query to filter
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { type: { $regex: search, $options: "i" } },
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
        res.status(500).send({ message: "Failed to fetch assets", error: err });
      }
    });


    // Create an asset
    app.post("/asset", async (req, res) => {
      const asset = req.body;
      try {
        const result = await assetCollection.insertOne(asset);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to create asset", error: err });
      }
    });

  
    // Get all assets
    app.get('/assets', async (req, res) => {
      try {
        const result = await assetCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: 'Failed to fetch assets', error: err });
      }
    });

    // Delete an asset
    app.delete("/assets/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const result = await assetCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to delete asset", error: err });
      }
    });


     // Get all requests
     app.get("/allRequests", async (req, res) => {
      try {
        const result = await requestCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res
          .status(500)
          .send({ message: "Failed to fetch requests", error: err });
      }
    });

    // Approve a request
    app.put("/approveRequest/:id", async (req, res) => {
      const id = req.params.id;
      const { approvalDate } = req.body;
      const approvalData = new Date();

      try {
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            status: "Approved",
            approvalDate: approvalData,
          },
        };
        const result = await requestCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        res
          .status(500)
          .send({ message: "Failed to approve request", error: err });
      }
    });

    // Reject a request
    app.put("/rejectRequest/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { status: "Rejected" },
        };
        const result = await requestCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (err) {
        res
          .status(500)
          .send({ message: "Failed to reject request", error: err });
      }
    });


    // Create an employer
    app.post("/employers", async (req, res) => {
      const employer = req.body;
      try {
        const result = await employerCollection.insertOne(employer);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to create employer", error: err });
      }
    });

    // Get all employers
    app.get("/employers", async (req, res) => {
      try {
        const result = await employerCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch employers", error: err });
      }
    });

    // Delete an employer
    app.delete("/employers/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const result = await employerCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to delete employer", error: err });
      }
    });

    // Create a manager
    app.post("/managers", async (req, res) => {
      const manager = req.body;
      try {
        const result = await managerCollection.insertOne(manager);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to create manager", error: err });
      }
    });

    // Get all managers
    app.get("/managers", async (req, res) => {
      try {
        const result = await managerCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch managers", error: err });
      }
    });

    // Delete a manager
    app.delete("/managers/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const result = await managerCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to delete manager", error: err });
      }
    });

    // Ping route for server status
    app.get("/", async (req, res) => {
      res.send("Server is running");
    });

    // Ensure indexes are created
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB!");
  } finally {
    // Do not close the client as it will be reused
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
