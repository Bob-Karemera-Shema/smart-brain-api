import Clarifai from 'clarifai';

const clarifaiRequest = (imageURL) => {
    const PAT = '98e42e8a626b46ffa9ededb80f51c34c';
    const USER_ID = 'b9f8884cvz0m';
    const APP_ID = 'smart-brain';
    const IMAGE_URL = imageURL;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions;
};

export const handleAPICall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", clarifaiRequest(req.body.input))
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to connect to API'));
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