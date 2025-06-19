import { Button, styled, TextField } from '@mui/material';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

    return (
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
                <VisuallyHiddenInput type="file" onChange={event => console.log(event.target.files)} accept="image/*" />
            </Button>

            <Button variant="contained" className="w-100">
                Create NFT
            </Button>
        </div>
    );
}
