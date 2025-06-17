import { Button, TextField } from '@mui/material';
import { useState } from 'react';

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

            <Button variant="contained" className="w-100">
                Create NFT
            </Button>
        </div>
    );
}
