import './App.css';
import { usePrivy } from '@privy-io/react-auth';
import { LoginWithEmail } from './LoginWithEmail';

function App() {
    const { ready } = usePrivy();

    if (!ready) {
        return <div>loading...</div>;
    }

    return (
        <>
            <LoginWithEmail />
        </>
    );
}

export default App;
