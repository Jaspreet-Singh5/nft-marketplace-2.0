import './App.css';
import { usePrivy } from '@privy-io/react-auth';
import { LoginWithEmail } from './LoginWithEmail';
import { CircularProgress } from '@mui/material';

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
		return <p>User {user?.id} is logged in.</p>;
	}
}

export default App;
