import React, { useState, useRef, useEffect } from 'react';

const USDCIcon = () => (
  <svg width="20" height="20" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="1000" cy="1000" r="1000" fill="#2775CA"/>
    <path d="M1275 1158.33C1271.67 1247.5 1200 1320.83 1100 1325.83V1408.33H950V1325.83C858.333 1321.67 791.667 1261.67 783.333 1183.33H875C883.333 1222.5 925 1252.5 1000 1252.5C1080 1252.5 1141.67 1216.67 1141.67 1158.33C1141.67 1108.33 1105 1075 1000 1060.83C883.333 1045 783.333 1000 783.333 900C783.333 815.833 850 750 950 741.667V658.333H1100V741.667C1188.33 751.667 1250 816.667 1258.33 891.667H1166.67C1160 853.333 1118.33 825 1050 825C978.333 825 916.667 858.333 916.667 908.333C916.667 958.333 966.667 983.333 1058.33 1000C1166.67 1020.83 1275 1058.33 1275 1158.33Z" fill="white"/>
  </svg>
);

const EtherIcon = () => (
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

const tokens = [
  { id: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USDC', icon: <USDCIcon /> },
  { id: 'ETH', name: 'Ether', icon: <EtherIcon /> },
];

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ value, onChange }) => {
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

  const selectedToken = tokens.find(token => token.id === value) || tokens[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center p-2 border rounded cursor-pointer bg-white text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedToken.icon}
        <span className="ml-2">{selectedToken.name}</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onClick={() => {
                onChange(token.id);
                setIsOpen(false);
              }}
            >
              {token.icon}
              <span className="ml-2">{token.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenSelector;