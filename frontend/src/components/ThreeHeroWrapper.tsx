'use client';
import dynamic from 'next/dynamic';

const ThreeHero = dynamic(() => import('./ThreeHero'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] md:min-h-[500px] bg-gradient-to-br from-violet-900/20 to-cyan-900/20 rounded-2xl animate-pulse" />
  ),
});

export default ThreeHero;
