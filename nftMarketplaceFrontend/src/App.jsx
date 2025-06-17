import './App.css';
import { usePrivy } from '@privy-io/react-auth';
import { LoginWithEmail } from './LoginWithEmail';
import { CircularProgress } from '@mui/material';
import NFTForm from './NFTForm';

function App() {
    const { ready, authenticated, user } = usePrivy();

    if (!ready) {
		return (
            <div className='flex justify-center items-center h-100'>
                <CircularProgress />
            </div>
        );
    } else if (!authenticated) {
		return (
			<>
				<LoginWithEmail />
			</>
		);
	} else {
		return <NFTForm />;
	}
}

export default App;
