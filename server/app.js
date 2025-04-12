const express = require('express');
const cors = require('cors');
const { PinataSDK } = require('pinata');
const fs = require('fs');
const { Blob } = require('buffer');
const path = require('path');
require('dotenv').config();
const app = express();
const port = 3000;
const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
async function upload() {
    try {
        // Use path.join to get the correct file path
        const filePath = path.join(__dirname, 'hello-world.txt');
        const blob = new Blob([fs.readFileSync(filePath)], { type: 'text/plain' });
        const upload = await pinata.upload.public.file(blob);
        console.log(upload);
    } catch (error) {
        console.log(error);
    }
}

app.post('/nft', async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const imagePinResponse = await upload();
        console.log(imagePinResponse);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mint NFT' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
