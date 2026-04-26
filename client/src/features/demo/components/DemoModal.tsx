import React, { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    scheduledAt: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/demo/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scheduledAt: new Date(formData.scheduledAt).toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        alert(result.error || 'Registration failed. Please try again.');
      }
    } catch {
      alert('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setFormData({ studentName: '', email: '', phone: '', scheduledAt: '' });
    onClose();
  };

  const inputCls =
    'w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-royal via-primary to-transparent" />

        <div className="p-8">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {success ? (
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                <CheckCircle className="h-9 w-9 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Demo Booked! ♟️</h3>
                <p className="text-sm text-muted-foreground">
                  We'll reach out to confirm your free demo class shortly.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gradient-gold mb-1">Book Free Demo</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Master the game with our expert coaches.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.studentName}
                  className={inputCls}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  className={inputCls}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  required
                  value={formData.phone}
                  className={inputCls}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <div>
                  <label className="text-xs text-muted-foreground ml-1 block mb-1">
                    Preferred Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledAt}
                    className={inputCls}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold py-3.5 rounded-xl transition-all duration-300 gold-glow flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending Request…</>
                  ) : (
                    'Confirm Demo Booking ♟️'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
