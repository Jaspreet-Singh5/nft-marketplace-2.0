import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { PrivyProvider } from '@privy-io/react-auth';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PrivyProvider
            appId={import.meta.env.VITE_PRIVY_APP_ID}
            clientId={import.meta.env.VITE_PRIVY_CLIENT_ID}
            config={{
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
            }}>
            <App />
        </PrivyProvider>
    </StrictMode>
);
