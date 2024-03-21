const mongoose = require('mongoose')
const Review = require('./review.js')
const Schema = mongoose.Schema

const ClubSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

ClubSchema.post('findOneAndDelete', async(doc) => {
    if(doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
})


module.exports = mongoose.model('Club', ClubSchema);

