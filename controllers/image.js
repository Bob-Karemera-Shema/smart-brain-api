import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_PAT}`);

export const handleAPICall = (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": process.env.CLARIFAI_USER_ID,
                "app_id": "smart-brain"
            },
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            version_id: "34ce21a40cc24b6b96ffee54aabff139",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
            
            res.json(response);
        }
    );
};

export const image = (req, res, database) => {
    const { id } = req.body;
    database('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}