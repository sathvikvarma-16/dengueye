import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';

interface IntroScreenProps {
  onGetStarted: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onGetStarted }) => (
  <main className="intro-screen">
    <div className="intro-grid" aria-hidden="true" />
    <div className="intro-pulse intro-pulse-one" aria-hidden="true" />
    <div className="intro-pulse intro-pulse-two" aria-hidden="true" />

    <section className="intro-content" aria-labelledby="intro-title">
      <div className="intro-kicker"><Activity size={16} /> GVMC PUBLIC HEALTH INTELLIGENCE</div>
      <h1 id="intro-title" className="intro-title" aria-label="DENGUEYE">
        {'DENGUEYE'.split('').map((letter, index) => (
          <span key={`${letter}-${index}`} style={{ animationDelay: `${index * 55}ms` }}>{letter}</span>
        ))}
      </h1>
      <p className="intro-tagline">AI-powered dengue surveillance and response for faster, smarter public health action.</p>
      <button type="button" className="intro-start-button" onClick={onGetStarted}>
        <span>Get Started</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </section>
  </main>
);