import { Button, styled, TextField } from '@mui/material';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function NFTForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [image, setImage] = useState();

    const createNft = event => {
        event.preventDefault();

        axios
            .post(
                `${import.meta.env.VITE_BACKEND_URL}/api/nft/upload`,
                {
                    image,
                    walletAddress,
                    name,
                    description,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
    };

    return (
        <form enctype="multipart/form-data" onSubmit={e => createNft(e)}>
            <div className="h-100 m-2 flex justify-center items-center flex-col gap-2">
                <TextField
                    id="outlined-basic"
                    label="Wallet address"
                    variant="outlined"
                    onChange={e => setWalletAddress(e.currentTarget.value)}
                    className="w-100"
                />

                <TextField id="outlined-basic" label="Name" variant="outlined" onChange={e => setName(e.currentTarget.value)} className="w-100" />

                <TextField
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    onChange={e => setDescription(e.currentTarget.value)}
                    className="w-100"
                />

                <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />} className="w-100">
                    Upload files
                    <VisuallyHiddenInput type="file" onChange={event => setImage(event.target.files[0])} accept="image/*" />
                </Button>

                <Button variant="contained" className="w-100" type="submit">
                    Create NFT
                </Button>
            </div>
        </form>
    );
}
