const cityData = require('./cities.js')
const {places, descriptors} = require('./seedHelpers.js')
const mongoose = require('mongoose')
const ClubReview = require('../models/clubreview.js')
mongoose.connect('mongodb://127.0.0.1:27017/clubreviews', {})
const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async() => {
    await ClubReview.deleteMany({})
    for(let i = 0; i < 50; i++){
        const rand1000 = Math.floor(Math.random()*(cityData.length-1))
        const price = Math.floor(Math.random() * 20 ) + 10
        const place = new ClubReview({location: `${cityData[rand1000].city}, ${cityData[rand1000].admin_name}`, 
                                        title: `${sample(descriptors)} ${sample(places)}`,
                                        image: "https://source.unsplash.com/collection/8647462/800x450",
                                        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit alias placeat commodi minima quibusdam, mollitia ipsa fugiat repellendus eos. Eos ipsum expedita corrupti inventore libero similique voluptas fugiat autem nobis. Qui veritatis ipsa fugiat earum accusamus optio. Facilis earum quod nemo sed repellendus repellat illum consequuntur, temporibus blanditiis ea aspernatur neque libero ex quaerat, officia autem perferendis nulla exercitationem nihil. Itaque modi beatae recusandae cumque reiciendis laudantium expedita autem dolore vitae? Inventore vero rem, quisquam impedit explicabo hic, repellat eveniet iste ducimus, officiis cumque dolorem magnam nulla eaque quidem sed? Iusto in eum quas exercitationem nemo aliquam molestias qui, esse vero, praesentium voluptatum reprehenderit saepe corporis minus tenetur aspernatur, neque earum eveniet nobis non. Possimus, illo! Ducimus, quaerat inventore! Atque. Officia nobis qui molestias sed culpa deserunt repellat ea aperiam dignissimos expedita unde, mollitia, magnam ipsa sequi in recusandae quos nulla obcaecati alias minima rerum numquam optio nam? Impedit, at.",
                                        price: price 
                                    })
        await place.save()
    }
}

const sample = (arr) => {
    return arr[Math.floor(Math.random()*(arr.length-1))]
}

seedDB().then(() => {mongoose.connection.close()})
