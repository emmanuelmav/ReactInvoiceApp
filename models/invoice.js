const mongoose = require ('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

// The schema tells Mongoose 
// how the note objects are to be stored in the database.

const invoiceSchema = new mongoose.Schema({
    status: String,
    senderAddress: String,
    senderCity: String,
    senderCode: String,
    senderCountry: String,
    invoiceDate: String,
    paymentDate: String,
    name: String,
    address: String,
    city: String,
    code: String,
    country: String,
    email: String,
    description: String,
    itemName: String,
    quantity: Number,
    price: Number
})



// const Invoice = new mongoose.model('Invoice', invoiceSchema)

// const invoice = new Invoice({
    // title: "Example A",
    // status: "Paid",
    // senderAddress: "19 Union Terrace",
    // senderCity: "London",
    // senderCode: "E1 3EZ",
    // senderCountry: "United Kingdom",
    // invoiceDate: "2021-08-21",
    // paymentDate: "2021-09-20",
    // name: "Alex Grim",
    // address: "84 Church Way",
    // city: "Bradford",
    // code: "BD1 9PB",
    // country: "United Kingdom",
    // email: "alexgrim@mail.com",
    // description: "Invoice Example A",
    // itemName: "Desktop Design",
    // quantity: 1,
    // price: 1800
// })

invoiceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Invoice', invoiceSchema)