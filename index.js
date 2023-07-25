
// the environment variables defined 
// in the .env file can be taken 
// into use with the expression 
require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require('cors')


const Invoice = require('./models/invoice')

// To access the data easily, we need the help of the express json-parser 
/*
The json-parser functions so that it takes 
the JSON data of a request,
transforms it into a JavaScript object 
and then attaches it to the body property 
of the request object before 
the route handler is called.
*/



// -- MIDDLEWARE
// serves the frontend index html from build/dist folder
app.use(express.static('dist'))

// Makes data from the request object available
app.use(express.json())

// morgan logs changes to the application
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
const watch = morgan(':method :url :status :res[content-length] - :response-time ms :body')
app.use(watch)

// cors allows same orgin policy
app.use(cors())

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
// app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// app.use(errorHandler)



//GET ALL INVOICES
app.get('/', (req, res) => {

    // Using MongoDB
    Invoice.find({}).then(invoice => {
        res.json(invoice)
    })
})
app.get('/invoices', (req, res) => {

    // Using MongoDB
    Invoice.find({}).then(invoice => {
        res.json(invoice)
    })
})

//GET ONE Invoice BY ID
app.get('/api/invoices/:id', (req, res, next) => {
    // WITH MONGOOSE
    Invoice.findById(req.params.id)
        .then(invoice => {
            if (invoice) {
                res.json(invoice)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// CREATE A NEW RESSOURCE
// Adding a invoice happens by making an HTTP POST request to the address
//and by sending all the information for the new note in the request body in JSON format.

app.post('/api/invoices', (req, res) => {
    const body = req.body

    if (!body.description) {
        return res.status(400).json({
            error: 'title is missing'
        })
    } else if (!body.senderAddress) {
        return res.status(400).json({
            error: 'sender address is missing'
        })
    }

    const newInvoice = new Invoice({
        status: body.status,
        senderAddress: body.senderAddress,
        senderCity: body.senderCity,
        senderCode: body.senderCode,
        senderCountry: body.senderCountry,
        invoiceDate: body.invoiceDate,
        paymentDate: body.paymentDate,
        name: body.name,
        address: body.address,
        city: body.city,
        code: body.code,
        country: body.country,
        email: body.email,
        description: body.description,
        itemName: body.itemName,
        quantity: body.quantity,
        price: body.price
    })
 
    newInvoice.save().then(savedInvoice => {
        res.json(savedInvoice)
    })
})






// UPDATE RESSOURCE BY ID
app.put('/api/invoices/:id', (req, res, next) => {
    const body = req.body

    const invoice = {
        status: body.status,
        senderAddress: body.senderAddress,
        senderCity: body.senderCity,
        senderCode: body.senderCode,
        senderCountry: body.senderCountry,
        invoiceDate: body.invoiceDate,
        paymentDate: body.paymentDate,
        name: body.name,
        address: body.address,
        city: body.city,
        code: body.code,
        country: body.country,
        email: body.email,
        description: body.description,
        itemName: body.itemName,
        quantity: body.quantity,
        price: body.price
    }

    Invoice.findByIdAndUpdate(req.params.id, invoice, { new: true })
        .then(updatedInvoice => {
            res.json(updatedInvoice)
        })
        .catch(error => next(error))

})



// DELETE A RESSOURCE BY ID
app.delete('/api/invoices/:id', (req, res, next) => {
    // const id = parseInt(req.params.id);
    // phonebook = phonebook.filter(person => person.id != id)
    Invoice.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

//info
// app.get("/info", (req, res) => {
//     const date = new Date()

//     Person.estimatedDocumentCount()
//         .then(result => {
//             const message = `<p> Phonebook has info for ${result} people </p>`
//             res.send(message + date)
//         })
//     // res.send(message + date)
// })

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}...`);
})
