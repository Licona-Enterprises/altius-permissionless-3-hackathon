'use client'
// import React, { useState } from 'react'
import React from 'react'
import Link from 'next/link';

export function AltiusFrontendComponent() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Unleash Precision in DeFi Yield Optimization</h1>
          <p className="text-xl mb-8">Cross-chain, Autonomous, Collaborative. Maximize your returns with Altius.</p>
          <div className="space-x-4">
            {/* Internal link to homepage */}
            <Link href="/dashboard" passHref>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Launch App
              </button>
            </Link>

            {/* External link to GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent hover:bg-white hover:text-blue-900 text-white font-semibold py-2 px-4 border border-white rounded"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// export function AltiusFrontendComponent() {
  
//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Hero Section */}
//       <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900">
//         <div className="absolute inset-0 bg-black opacity-50"></div>
//         <div className="relative z-10 text-center">
//           <h1 className="text-5xl font-bold mb-4">Unleash Precision in DeFi Yield Optimization</h1>
//           <p className="text-xl mb-8">Cross-chain, Autonomous, Collaborative. Maximize your returns with Altius.</p>
//           <div className="space-x-4">
//             <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//               Launch App
//             </button>
//             <button className="bg-transparent hover:bg-white hover:text-blue-900 text-white font-semibold py-2 px-4 border border-white rounded">
//               Learn More
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }