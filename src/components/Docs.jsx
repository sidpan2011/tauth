import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Button } from './ui/button.jsx';
import { ChevronRight, ChevronDown, Cpu, Rocket, Code, BookOpen } from 'lucide-react';
import { Card, CardContent } from './ui/card.jsx';
import { ScrollArea } from './ui/scroll-area.jsx';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [openMenus, setOpenMenus] = useState({
    'getting-started': true,
  });

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      icon: Rocket,
      subsections: [
        { id: 'introduction', title: 'Introduction' },
        { id: 'installation', title: 'Installation' }
      ]
    },
    'core-concepts': {
      title: 'Core Concepts',
      icon: Cpu,
      subsections: [
        { id: 'keystroke-biometrics', title: 'Keystroke Biometrics' },
        { id: 'authentication', title: 'Authentication' },
        { id: 'security', title: 'Security' }
      ]
    },
    'api-reference': {
      title: 'API Reference',
      icon: Code,
      subsections: [
        { id: 'authentication-api', title: 'Authentication API' },
        { id: 'metrics-api', title: 'Metrics API' },
        { id: 'webhook-api', title: 'Webhook API' }
      ]
    },
    'guides': {
      title: 'Guides',
      icon: BookOpen,
      subsections: [
        { id: 'integration', title: 'Integration Guide' },
        { id: 'best-practices', title: 'Best Practices' },
        { id: 'troubleshooting', title: 'Troubleshooting' }
      ]
    }
  };

  return (
    <div className="min-h-screen">
      <div className='xl:px-44 lg:px-20 md:px-14 px-6'>
        <Header />
        <div className="flex gap-6 py-6">
          <ScrollArea className="h-[85vh]">
            <aside className="w-64 flex-shrink-0">
              <nav className="space-y-2 sticky top-6">
                {Object.entries(sections).map(([key, section]) => (
                  <div key={key} className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-white"
                      onClick={() => toggleMenu(key)}
                    >
                      <span className="flex items-center">
                        <section.icon className="mr-2 h-4 w-4" />
                        {section.title}
                      </span>
                      {openMenus[key] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    {openMenus[key] && (
                      <div className="ml-4 space-y-1">
                        {section.subsections.map((subsection) => (
                          <Button
                            key={subsection.id}
                            variant="ghost"
                            className={`w-full justify-start text-white pl-6 ${activeSection === subsection.id
                              ? 'bg-muted'
                              : ''
                              }`}
                            onClick={() => setActiveSection(subsection.id)}
                          >
                            {subsection.title}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </aside>
          </ScrollArea>

          <main className="flex-1 min-h-screen">
            <Card className="p-6">
              <CardContent className="p-0">
                {activeSection === 'introduction' && (
                  <div className="prose dark:prose-invert max-w-none space-y-4">
                    <h1>Introduction</h1>
                    <p>
                      Welcome to the TAuth documentation. TAuth is a powerful keystroke biometric authentication system that provides secure and seamless user verification through typing patterns.
                    </p>
                    <h2>What is TAuth?</h2>
                    <p>
                      TAuth uses advanced algorithms to analyze and verify users based on their unique typing patterns. This provides an additional layer of security beyond traditional authentication methods.
                    </p>
                    <h2>Key Features</h2>
                    <ul>
                      <li>Keystroke pattern analysis</li>
                      <li>Real-time authentication</li>
                      <li>Machine learning algorithms</li>
                      <li>Easy integration</li>
                      <li>Secure and reliable</li>
                    </ul>
                  </div>
                )}

                {activeSection === 'installation' && (
                  <div className="prose dark:prose-invert max-w-none space-y-5">
                    <h1>Installation</h1>
                    <p>Getting started with TAuth is easy. Follow these steps to install and configure TAuth in your project.</p>

                    <h2>NPM Installation</h2>
                    <pre><code>npm install @tauth/keystroke-js</code></pre>

                    <h2>Basic Setup</h2>
                    <pre>
                      <code>
                        {`import { TAuth } from '@tauth/keystroke-js';
const tauth = new TAuth({
  apiKey: 'your-api-key'
});`}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Add more content sections as needed */}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Docs;