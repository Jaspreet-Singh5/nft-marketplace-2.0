import { Button, TextField } from '@mui/material';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

export const LoginWithEmail = () => {
    const { sendCode, loginWithCode } = useLoginWithEmail();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState();

    return (
        <div className="h-100 m-2 flex justify-center items-center flex-col gap-2">
            <TextField id="outlined-basic" label="Email" variant="outlined" onChange={e => setEmail(e.target.value)} className="w-100" />

            <Button variant="contained" endIcon={<SendIcon />} onClick={e => sendCode({ email })} className="w-100">
                Send OTP
            </Button>

            <TextField id="outlined-basic" label="Enter OTP" variant="outlined" onChange={e => setCode(e.target.value)} className="w-100" />

            <Button variant="contained" onClick={e => loginWithCode({ code })} className="w-100">
                Login
            </Button>
        </div>
    );
};
