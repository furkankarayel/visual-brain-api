const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
require("dotenv").config();

const PAT = process.env.PAT;

const handleFaceApiCall = async (req, res) => {
  const USER_ID = "clarifai";
  const APP_ID = "main";
  const MODEL_ID = "face-detection";

  const stub = ClarifaiStub.grpc();

  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      inputs: [
        {
          data: {
            image: {
              url: req.body.input,
              allow_duplicate_url: true,
            },
          },
        },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        res.status(404).json("failed to fetch face detection api");
      }
      res.json(response)
    }
  );

};

const handleDescriptionApiCall = async (req, res) => {
    const USER_ID = 'salesforce';
    const APP_ID = 'blip';
    const MODEL_ID = "general-english-image-caption-blip";

    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        model_id: MODEL_ID,
        inputs: [
            {
            data: {
                image: {
                url: req.body.input,
                allow_duplicate_url: true,
                },
            },
            },
        ],
        },
        metadata,
        (err, response) => {
        if (err) {
            res.status(404).json("failed to fetch description api");
        }
        res.json(response)
        }
    );
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("failed to get entries"));
};

module.exports = {
  handleImage: handleImage,
  handleFaceApiCall: handleFaceApiCall,
  handleDescriptionApiCall: handleDescriptionApiCall,
};
