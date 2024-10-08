'use client'
import React, { useEffect, useRef } from 'react'
import Link from 'next/link';

export function AltiusFrontendComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current || null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const blobs: Blob[] = [];
    const blobCount = 5;

    class Blob {
      x: number;
      y: number;
      radius: number;
      xSpeed: number;
      ySpeed: number;
      hue: number;

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 800);
        this.y = Math.random() * (canvas?.height ?? 800);
        this.radius = Math.random() * 200 + 100;
        this.xSpeed = Math.random() * 3 - 1.5; // Increased speed range
        this.ySpeed = Math.random() * 3 - 1.5; // Increased speed range
        this.hue = Math.random() * 60 + 180; // Blue to purple range
      }

      update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x < -this.radius) this.x = (canvas?.width ?? 800) + this.radius;
        if (this.x > (canvas?.width ?? 800) + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = (canvas?.height ?? 800) + this.radius;
        if (this.y > (canvas?.height ?? 800) + this.radius) this.y = -this.radius;
      }

      draw() {
        ctx?.beginPath();
        const gradient = ctx?.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius) ?? ctx?.createRadialGradient(0, 0, 0, 0, 0, 0);
        if (gradient) {
          gradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, 0.4)`); // Increased opacity
          gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        }
        if (ctx && gradient) {
          ctx.fillStyle = gradient;
        }
        if (ctx) {
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < blobCount; i++) {
      blobs.push(new Blob());
    }

    function animate() {
      ctx?.clearRect(0, 0, (canvas?.width ?? 800), (canvas?.height ?? 800)) ?? ctx?.clearRect(0, 0, 800, 800);
      for (const blob of blobs) {
        blob.update();
        blob.draw();
      }
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 text-white relative font-inter">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 leading-tight">Unleash Precision in DeFi Yield Optimization</h1>
          <p className="text-xl mb-8 font-light">Cross-chain, Autonomous, Collaborative. Maximize your returns with Altius.</p>
          <div className="space-x-4 mb-12">
            {/* Internal link to homepage */}
            <Link href="/dashboard" passHref>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Launch App
              </button>
            </Link>

            {/* External link to GitHub */}
            <a
              href="#about"
              onClick={scrollToAbout}
              className="bg-transparent hover:bg-white hover:text-blue-900 text-white font-semibold py-2 px-4 border border-white rounded"
            >
              Learn More
            </a>
          </div>
          <div className="flex justify-center space-x-12 mt-12">
            <div>
              <p className="text-sm uppercase font-medium">Total Supply</p>
              <p className="text-2xl font-bold">$1,583,244,971</p>
            </div>
            <div>
              <p className="text-sm uppercase font-medium">Total Borrow</p>
              <p className="text-2xl font-bold">$590,373,629</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutSectionRef} className="relative py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About Altius</h2>
          <p className="mb-4 font-light">
            Altius is a cutting-edge DeFi yield optimization platform that leverages advanced technologies to maximize your returns across multiple chains.
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Advanced Smart Contracts: Our proprietary smart contracts ensure secure and efficient transactions.</li>
            <li>Machine Learning: We use AI to predict market trends and optimize your yield strategies in real-time.</li>
            <li>Cross-Chain Interoperability Protocol (CCIP): Seamlessly optimize your yield across multiple blockchains.</li>
          </ul>
          <p>
            With Altius, your assets are automatically allocated to the most profitable yield opportunities, saving you time and maximizing your returns.
          </p>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="relative py-16 px-4 md:px-8 lg:px-16 bg-black bg-opacity-30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Liquidity Provision Card */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Liquidity Provision</h3>
              <p className="font-light">
                Provide liquidity to decentralized exchanges and earn fees from trades. Our smart contracts automatically rebalance your positions to maximize returns.
              </p>
            </div>

            {/* Yield Farming Card */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Yield Farming</h3>
              <p className="font-light">
                Participate in yield farming opportunities across multiple protocols. Our AI-driven system identifies and allocates assets to the most profitable farms.
              </p>
            </div>

            {/* Staking Card */}
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Staking</h3>
              <p className="font-light">
                Stake your assets in proof-of-stake networks and governance protocols. We optimize your staking rewards while maintaining liquidity through liquid staking solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}