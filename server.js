require('dotenv').config()
const express = require('express')
const app =  express()
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const Fruit = require('./models/fruit')
const PORT = 3000

//MIDDLEWARE//
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))
app.use('/assets', express.static('public'))

//DATABASE CONNECTION//
mongoose.connect(MONGO_URI)
mongoose.connection.once('open', () => {
    console.log('Connection with mongoose established')
})
mongoose.connection.on('error', () => {
    console.error('Connection with Mongo stopped')
})

/*
**********************************************
 * ****************************************
 * CONTROLLER LOGIC START
 * ****************************************
 *********************************************
 */

  /*
**********************************************
 * ****************************************
 * CREATE FUNCTIONALITY START
 * ****************************************
 *********************************************
 */
 app.post('/fruits', async (req, res) => {
    req.body.isRipe === 'on' || req.body.isRipe === true? 
    req.body.isRipe = true : 
    req.body.isRipe = false
    try {
        const createdFruit =  await Fruit.create(req.body)
        // res.status(301).redirect(`/fruits/${createdFruit._id}`)
        res.json(createdFruit)
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message })
        
    }
})

app.get('/fruits/new', (req, res) => {
    res.render('new.ejs')
})

 /*
**********************************************
 * ****************************************
 * CREATE FUNCTIONALITY END
 * ****************************************
 *********************************************
 */

 /*
**********************************************
 * ****************************************
 * READ FUNCTIONALITY START
 * ****************************************
 *********************************************
 */
/////INDEX////
 app.get('/fruits', async (req, res) => {
    try {
        const foundFruits = await Fruit.find({})
        res.render('index.ejs', {
            fruits: foundFruits
        })
        // res.json(foundFruits)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

///SHOW///
app.get('/fruits/:id', async (req, res) => {
    try {
        const foundFruit = await Fruit.findOne({ _id: req.params.id})
        res.render('show.ejs', {
            fruit: foundFruit
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })  
    }
})

 /*
**********************************************
 * ****************************************
 * READ FUNCTIONALITY END
 * ****************************************
 *********************************************
 */

 /*
**********************************************
 * ****************************************
 * UPDATE FUNCTIONALITY START
 * ****************************************
 *********************************************
 */

 app.put('/fruits/:id', async (req, res) => {
    req.body.isRipe === 'on' || req.body.isRipe === true? 
    req.body.isRipe = true : 
    req.body.isRipe = false
    try {   
        const updatedFruit = await Fruit.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })// new: true sends the updated version
        res.redirect(`/fruits/${updatedFruit._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message})
    }
})

app.get('/fruits/:id/edit', async (req, res) => {
    const foundFruit = await Fruit.findOne({ _id: req.params.id})
    res.render('edit.ejs', {
        fruit: foundFruit
    })
}) 

 /*
**********************************************
 * ****************************************
 * UPDATE FUNCTIONALITY END
 * ****************************************
 *********************************************
 */

 /*
**********************************************
 * ****************************************
 * DELETE FUNCTIONALITY START
 * ****************************************
 *********************************************
 */

 app.delete('/fruits/:id', async (req, res) => {
    try {
        await Fruit.findOneAndDelete({ _id: req.params.id })
        .then((fruit) => {
            res.redirect('/fruits')
        })        
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})


  /*
**********************************************
 * ****************************************
 * DELETE FUNCTIONALITY END
 * ****************************************
 *********************************************
 */


 /*
**********************************************
 * ****************************************
 * CONTROLLER LOGIC END
 * ****************************************
 *********************************************
 */


//LISTENING PORT//
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})