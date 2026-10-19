import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from '../ui/Toast';

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
