const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jason:jason@comp3123-assignment1.uo4dy.mongodb.net/?retryWrites=true&w=majority&appName=COMP3123-Assignment1";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



const User = require('./models/user');
const Employee = require('/models/employee');

const newUser = new User({
  username: 'johndoe',
  email: 'johndoe@example.com',
  password: 'hashedpassword123' 
});

const newEmployee = new Employee({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    position: 'Software Engineer',
    salary: 90000,
    date_of_joining: new Date(),
    department: 'Engineering'
  });

newUser.save()
  .then(user => console.log('User created:', user))
  .catch(err => console.error('Error creating user:', err));

  newEmployee.save()
  .then(employee => console.log('Employee created:', employee))
  .catch(err => console.error('Error creating employee:', err));