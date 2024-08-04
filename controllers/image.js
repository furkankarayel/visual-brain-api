const { Model } = require("clarifai-nodejs");
require('dotenv').config();

const PAT = process.env.PAT 

const handleFaceApiCall = async (req, res) => {
    const modelUrl ="https://clarifai.com/clarifai/main/models/face-detection";
    const detectorModel = new Model({
    url: modelUrl,
    authConfig: {
        pat: PAT,
    },
    });

    try {
        const result = await detectorModel
            .predictByUrl({
                url: req.body.input,
                inputType: "image",
            })
            
        res.json(result)
    } catch (error) {
        res.status(404).json('failed to fetch face detection api')
    }
}

const handleDescriptionApiCall = async (req, res) => {
    const modelUrl = "https://clarifai.com/salesforce/blip/models/general-english-image-caption-blip"
    const detectorModel = new Model({
    url: modelUrl,
    authConfig: {
        pat: PAT,
    },
    });

    try {
        const result = await detectorModel
            .predictByUrl({
                url: req.body.input,
                inputType: "image",
            })
            
        res.json(result)
    } catch (error) {
        res.status(404).json('failed to fetch description api')
    }
}


const handleImage = (db) => (req,res) => {
 
    const { id } = req.body;
        db('users')
        .where('id', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json('failed to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleFaceApiCall: handleFaceApiCall,
    handleDescriptionApiCall: handleDescriptionApiCall
}