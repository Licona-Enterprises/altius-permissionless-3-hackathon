import '../styles/global.css';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { Home, Globe, Blend, ChartCandlestick } from 'lucide-react';
import Link from 'next/link';
import { ThirdwebProvider } from "thirdweb/react";
import ConnectWallet from '../components/ConnectWallet';
import { Provider } from 'urql';
import { ethClient, avaxClient, arbitrumClient } from '../app/theGraphClients';

export default function MyApp({ Component, pageProps }: AppProps) {

    const [activeSection, setActiveSection] = useState('dashboard');

    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard' },
        { name: 'Opportunities', icon: Globe, href: '/opportunities' },
        { name: 'Strategies', icon: Blend, href: '/strategies' },
        { name: 'Portfolio', icon: ChartCandlestick, href: '/portfolio' }
        // Add more navigation items as needed
    ];

    return (
        <ThirdwebProvider>
            <div className="min-h-screen bg-gray-900 text-white">
                {/* Global Header */}
                <nav className="bg-gray-800 p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex space-x-4">
                            {navItems.map((item) => (
                                <Link href={item.href} key={item.name} passHref>
                                    <button
                                        className={`flex items-center space-x-2 ${
                                            activeSection === item.name.toLowerCase() ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                                        }`}
                                        onClick={() => setActiveSection(item.name.toLowerCase())}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </button>
                                </Link>
                            ))}
                        </div>

                        <ConnectWallet />
                    </div>
                </nav>

                {/* Page content */}
                <Provider value={ethClient}>
                  <Component {...pageProps} /> {/* Component for Ethereum */}
                </Provider>

                {/* Footer */}
                <footer className="bg-gray-800 text-center p-4 mt-12">
                    <p>&copy; 2024 Altius</p>
                </footer>
            </div>
        </ThirdwebProvider>
    )
}
