'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ServicesSection } from '@/components/ServicesSection';
import { TechStackSection } from '@/components/TechStackSection';
import { AboutSection } from '@/components/AboutSection';
import { ProcessSection } from '@/components/ProcessSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { ViewSwitcher, ViewMode } from '@/components/ViewSwitcher';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {(viewMode === 'all' || viewMode === 'col1') && (
          <>
            <Hero />
            <ProjectsSection />
          </>
        )}

        {(viewMode === 'all' || viewMode === 'col2') && (
          <>
            <ServicesSection />
            <TechStackSection />
          </>
        )}

        {(viewMode === 'all' || viewMode === 'col3') && (
          <>
            <AboutSection />
            <ProcessSection />
            <ContactSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating column/view switcher to easily verify exact mockup panels */}
      <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
    </div>
  );
}
