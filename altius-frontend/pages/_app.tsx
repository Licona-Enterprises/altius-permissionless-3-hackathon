import '../styles/global.css';
import { useState } from 'react';
import { AppProps } from 'next/app'
import { 
  // ArrowRight,
  // BarChart2, 
  ChevronDown, 
  Globe, 
  Home, 
  PieChart, 
  // Settings, 
  Sliders 
} from 'lucide-react'
import Link from 'next/link'

export default function MyApp({ Component, pageProps }: AppProps) {

  const [activeSection, setActiveSection] = useState('dashboard');

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Opportunities', icon: Globe, href: '/opportunities' },
    { name: 'Strategies', icon: PieChart, href: '/strategies' },
    { name: 'Analytics', icon: Sliders, href: '/analytics' },
    // { name: 'Portfolio', icon: BarChart2, href: '/portfolio' },  // You can add more links as needed
    // { name: 'Settings', icon: Settings, href: '/settings' },
  ];


  return (
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

        <div className="relative">
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <span>Account</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>

      {/* Page content */}
      <Component {...pageProps} />

      {/* Footer */}
      <footer className="bg-gray-800 text-center p-4 mt-12">
        <p>&copy; 2024 Permissionless III hackathon</p>
      </footer>
    </div>
  )
}
