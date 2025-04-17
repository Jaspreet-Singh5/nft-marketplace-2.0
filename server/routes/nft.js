const express = require('express');
const multer = require('multer');
const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const upload = multer();
const { PinataSDK } = require('pinata');
require("dotenv").config();

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGatewayKey: process.env.PINATA_GATEWAY_URL,
});

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
    const {
        buffer,
    } = req.file;

    const {
        name,
        description,
    } = req.body;
    
    const upload = await pinata.upload.public.file(new File([buffer], name)).keyvalues({
        name,
        description,
    });
});

module.exports = router;
