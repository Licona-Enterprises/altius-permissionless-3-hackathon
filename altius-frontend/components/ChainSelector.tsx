import React, { useState, useRef, useEffect } from 'react';

// SVG components
const EthereumIcon = () => (
  <svg width="20" height="20" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
    <g>
      <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
      <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
      <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
      <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
      <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
      <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
    </g>
  </svg>
);

const AvalancheIcon = () => (
  <svg width="20" height="20" viewBox="0 0 1503 1504" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="287" y="258" width="928" height="844" fill="white"/>
    <path d="M714.163 345.75H583.327L362.023 784.224H510.915L714.163 345.75Z" fill="#E84142"/>
    <path d="M1140.52 784.224L1010.91 544.143L925.87 784.224H1140.52Z" fill="#E84142"/>
    <path d="M714.163 345.75L925.87 784.224H510.915L714.163 345.75Z" fill="#E84142"/>
    <path d="M362.023 784.224L583.327 1222.7H714.163L510.915 784.224H362.023Z" fill="#E84142"/>
    <path d="M925.87 784.224H1140.52L919.218 1222.7H788.381L925.87 784.224Z" fill="#E84142"/>
    <path d="M788.381 1222.7H919.218L1140.52 784.224H925.87L788.381 1222.7Z" fill="#E84142"/>
  </svg>
);

const ArbitrumIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2D374B"/>
    <path d="M16.4609 15.0937L12.1981 6.89058C12.0638 6.62116 11.7638 6.62116 11.6294 6.89058L7.36663 15.0937C7.25288 15.3235 7.41913 15.5906 7.67413 15.5906H9.84538C9.98288 15.5906 10.1079 15.5203 10.1711 15.4031L12.0056 11.7844C12.0688 11.6672 12.2719 11.6672 12.3352 11.7844L14.1697 15.4031C14.2329 15.5203 14.3579 15.5906 14.4954 15.5906H16.1534C16.4084 15.5906 16.5747 15.3235 16.4609 15.0937Z" fill="white"/>
  </svg>
);

const chains = [
  { id: 'ethereum', name: 'Ethereum', icon: <EthereumIcon /> },
  { id: 'arbitrum', name: 'Arbitrum', icon: <ArbitrumIcon /> },
  { id: 'avalanche', name: 'Avalanche', icon: <AvalancheIcon /> },
];

interface ChainSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedChain = chains.find(chain => chain.id === value) || chains[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center p-2 border rounded cursor-pointer bg-white text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedChain.icon}
        <span className="ml-2">{selectedChain.name}</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {chains.map((chain) => (
            <div
              key={chain.id}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onClick={() => {
                onChange(chain.id);
                setIsOpen(false);
              }}
            >
              {chain.icon}
              <span className="ml-2">{chain.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainSelector;