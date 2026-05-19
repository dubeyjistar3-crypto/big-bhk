import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import EnquiryModal from '../components/EnquiryModal';
import Footer from '../components/Footer';
import Header from '../components/Header';
import WhatsAppButton from '../components/WhatsAppButton';

function SiteLayout() {
  const [enquiryProperty, setEnquiryProperty] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEnquiry = (property = null) => {
    setEnquiryProperty(property);
    setModalOpen(true);
  };

  return (
    <>
      <Header onEnquire={() => openEnquiry()} />
      <main>
        <Outlet context={{ openEnquiry }} />
      </main>
      <Footer />
      <WhatsAppButton />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} property={enquiryProperty} />
    </>
  );
}

export default SiteLayout;
