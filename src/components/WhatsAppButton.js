import { MessageCircle } from 'lucide-react';

function WhatsAppButton() {
  const text = encodeURIComponent('Hi BIG BHK, I want to discuss luxury property options.');
  return (
    <a className="whatsapp" href={`https://wa.me/918505943530?text=${text}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      <MessageCircle />
    </a>
  );
}

export default WhatsAppButton;
