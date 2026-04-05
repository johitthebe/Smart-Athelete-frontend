import React from 'react';
import Header from '@/app/component/landing/Header';
import Footer from '@/app/component/landing/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
