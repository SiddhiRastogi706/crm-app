import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { mockDb } from '@/lib/mocks/db';
import { toast } from 'sonner';

interface WebsiteConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledPlan?: {
    endpoints: number;
    services: string[];
    estimatedMonthly: number;
  } | null;
}

export const WebsiteConsultationModal: React.FC<WebsiteConsultationModalProps> = ({
  isOpen,
  onClose,
  prefilledPlan,
}) => {
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: prefilledPlan?.services?.join(', ') || 'Managed EDR Cybersecurity & AMC Support',
    notes: prefilledPlan
      ? `Requested scale: ${prefilledPlan.endpoints} seats. Services: ${prefilledPlan.services.join(', ')}. Est Monthly: ₹${prefilledPlan.estimatedMonthly}`
      : '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      // Direct CRM sync: insert lead into KCIS database
      const estAnnualValue = prefilledPlan?.estimatedMonthly
        ? prefilledPlan.estimatedMonthly * 12
        : 150000;

      const newLead = mockDb.createLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        title: 'Enterprise Decision Maker',
        status: 'new',
        source: 'organic',
        score: 90,
        ownerId: 'usr-1',
        ownerName: 'Alex Morgan',
        estimatedValue: estAnnualValue,
        notes: `Website Consultation Lead: ${formData.service}. Notes: ${formData.notes || 'Inquired through official KCIS website.'}`,
      });

      setSubmittedLeadId(newLead.id);
      toast.success('Consultation request registered in KCIS CRM!');
    } catch (err) {
      toast.error('Failed to register inquiry. Please try again or message via WhatsApp.');
    }
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hello KCIS Info Solution! I just submitted an inquiry on your website for ${formData.company} (Ref: ${submittedLeadId || 'LEAD'}). Can we schedule a technical discussion?`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  const handleResetAndClose = () => {
    setSubmittedLeadId(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      service: 'Managed EDR Cybersecurity & AMC Support',
      notes: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedLeadId ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Inquiry Logged in KCIS CRM!
              </h3>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Reference ID: <strong className="text-blue-600">{submittedLeadId}</strong>
              </p>
              <p className="text-xs text-slate-600 mt-3 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our senior technical architect for <strong>{formData.company}</strong> has received your requirements and will reach out shortly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-left space-y-1.5">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                KCIS Info Solution Pvt Ltd • Faridabad Sector 19 HQ
              </p>
              <p className="text-slate-500">
                A formal GST estimate proposal has been generated under GSTIN: 07AAACK8892F1Z4.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleWhatsAppChat}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleResetAndClose}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 h-11 rounded-xl"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <div>
            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700 mb-2">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>DIRECT CRM INQUIRY</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Request Formal IT Proposal
              </h3>
              <p className="text-xs text-slate-500">
                Connect directly with KCIS senior engineering architects in Faridabad (Sector 19).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Your Name *</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white text-xs h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Company Name *</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Acme Enterprises"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Work Email *</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="rahul@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white text-xs h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Mobile / WhatsApp *</span>
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Interested Solutions / Scope</span>
                </label>
                <Input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="e.g. 24x7 AMC SLA, CrowdStrike EDR, M365 Renewals"
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>

              {formData.notes && (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
                  <strong className="block text-blue-950 mb-0.5">Custom Configuration Attached:</strong>
                  <span>{formData.notes}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to KCIS Desk</span>
                </Button>
                <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                  Direct sync into KCIS CRM • SLA response in &lt; 15 mins for priority accounts.
                </p>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
