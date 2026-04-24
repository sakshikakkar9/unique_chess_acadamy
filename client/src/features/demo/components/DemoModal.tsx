import React, { useState } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    scheduledAt: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Updated URL to match your registration.routes.js
      const response = await fetch('http://localhost:5000/api/registrations/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Ensure the date is valid for Prisma
          scheduledAt: new Date(formData.scheduledAt).toISOString() 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Grandmaster moves! Your demo is booked. ♟️');
        onClose();
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      alert('Connection error. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-[#d4af37]/30 p-8 rounded-2xl w-full max-w-md relative shadow-[0_0_50px_rgba(212,175,55,0.1)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">✕</button>
        
        <h2 className="text-2xl font-bold text-[#d4af37] mb-2">Book Free Demo</h2>
        <p className="text-gray-400 text-sm mb-6">Master the game with our expert coaches.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#d4af37] outline-none transition-all"
            onChange={(e) => setFormData({...formData, studentName: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#d4af37] outline-none transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="tel" placeholder="WhatsApp Number" required
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#d4af37] outline-none transition-all"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <div>
            <label className="text-xs text-gray-500 ml-1 block mb-1">Preferred Date & Time</label>
            <input 
              type="datetime-local" required
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#d4af37] outline-none transition-all"
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#b8962e] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98]"
          >
            {loading ? 'Sending Request...' : 'Confirm Demo Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DemoModal;