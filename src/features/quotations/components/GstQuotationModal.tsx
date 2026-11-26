import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  Calendar,
  X,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { toast } from 'sonner';

interface QuotationItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
}

interface GstQuotationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: {
    name: string;
    company: string;
    email: string;
    phone?: string;
    value?: number;
    gstin?: string;
  };
  productName?: string;
}

export const GstQuotationModal: React.FC<GstQuotationModalProps> = ({
  open,
  onOpenChange,
  client,
  productName,
}) => {
  const [qtnNumber] = useState(`KCIS/QTN/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
  const [issueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [clientGstin, setClientGstin] = useState(client.gstin || '07AABCB9821K1Z2');
  const [clientState, setClientState] = useState('07 - Delhi / NCR');
  const [gstType, setGstType] = useState<'intra' | 'inter'>('inter'); // inter = IGST 18%, intra = CGST 9% + SGST 9%

  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: 'item-1',
      description: productName || 'KCIS Enterprise Security & Managed Cloud License',
      hsn: '998313',
      qty: 1,
      rate: client.value || 95000,
    },
    {
      id: 'item-2',
      description: 'Annual Maintenance Contract (AMC) & 24x7 Platinum SLA Support',
      hsn: '998314',
      qty: 1,
      rate: 15000,
    },
  ]);

  if (!open) return null;

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: 'KCIS Professional Deployment & Integration Service',
        hsn: '998319',
        qty: 1,
        rate: 20000,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) {
      toast.error('Quotation must have at least one line item');
      return;
    }
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuotationItem, val: any) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    );
  };

  const taxableAmount = items.reduce((acc, i) => acc + (Number(i.qty) || 1) * (Number(i.rate) || 0), 0);
  const gstRate = 0.18;
  const gstAmount = Math.round(taxableAmount * gstRate);
  const grandTotal = taxableAmount + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Quotation link copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*KCIS Info Solution Pvt Ltd — Formal Quotation*\n` +
      `Ref: ${qtnNumber}\n` +
      `Client: ${client.company} (Attn: ${client.name})\n` +
      `Total Package Value: ₹${grandTotal.toLocaleString('en-IN')} (incl. 18% GST)\n` +
      `Valid Until: ${validUntil}\n\n` +
      `Please let us know if you need any technical alignment or contract revisions.`
    );
    const phone = (client.phone || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone || '919876543210'}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-muted/30 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">KCIS GST Quotation & Proposal Generator</h3>
              <p className="text-[11px] text-muted-foreground">{qtnNumber} • {client.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleShareWhatsApp} className="h-8 text-xs gap-1.5 text-emerald-600 hover:text-emerald-700">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Quote
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopyLink} className="h-8 text-xs gap-1.5">
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground">
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Printable Quotation Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-card text-foreground print:p-0 print:m-0" id="kcis-quotation-printable">
          {/* Company Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-red-600">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <img src="/kcis-icon.png" alt="KCIS" className="h-10 w-10 object-contain rounded-lg shadow-sm" />
                <div>
                  <h1 className="text-lg font-black tracking-tight text-foreground">KCIS INFO SOLUTION PVT LTD</h1>
                  <p className="text-xs font-semibold text-red-600 tracking-wide uppercase">We Breathe Technology</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Regd. Office: Office No. 221, Second Floor, Vardhman Star Shop Mall, Sector 19, Faridabad, Haryana 121002<br />
                CIN: U72900DL2018PTC334512 • GSTIN: <span className="font-semibold text-foreground">07AAACK8892F1Z4</span><br />
                Email: billing@kcisindia.com • Phone: +91 (0120) 456-7890 • Web: www.kcisindia.com
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 shrink-0">
              <Badge className="bg-red-600 text-white font-bold text-xs uppercase px-2.5 py-0.5">
                Tax Quotation / Proforma
              </Badge>
              <p className="text-xs font-semibold pt-1">
                Quotation No: <span className="font-mono text-foreground">{qtnNumber}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Date: <span className="text-foreground font-medium">{issueDate}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Valid Until: <span className="text-foreground font-medium">{validUntil}</span>
              </p>
            </div>
          </div>

          {/* Client & Tax Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-muted/30 border border-border/80 text-xs">
            <div>
              <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1.5">Quotation Prepared For:</p>
              <p className="text-sm font-bold text-foreground">{client.company}</p>
              <p className="text-foreground/90 font-medium pt-0.5">Attn: {client.name}</p>
              <p className="text-muted-foreground">{client.email} {client.phone ? `• ${client.phone}` : ''}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Client GSTIN:</span>
                <input
                  type="text"
                  value={clientGstin}
                  onChange={(e) => setClientGstin(e.target.value)}
                  className="bg-background border border-border px-2 py-0.5 rounded text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <div className="sm:text-right flex flex-col sm:items-end justify-between">
              <div>
                <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1.5">Tax Details & Destination:</p>
                <div className="space-y-1">
                  <div className="flex items-center sm:justify-end gap-2">
                    <span className="text-muted-foreground">Place of Supply:</span>
                    <input
                      type="text"
                      value={clientState}
                      onChange={(e) => setClientState(e.target.value)}
                      className="bg-background border border-border px-2 py-0.5 rounded text-xs font-semibold"
                    />
                  </div>
                  <div className="flex items-center sm:justify-end gap-2">
                    <span className="text-muted-foreground">Tax Type:</span>
                    <select
                      value={gstType}
                      onChange={(e) => setGstType(e.target.value as any)}
                      className="bg-background border border-border px-2 py-0.5 rounded text-xs font-semibold"
                    >
                      <option value="inter">Inter-State (IGST 18%)</option>
                      <option value="intra">Intra-State (CGST 9% + SGST 9%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/70 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 w-8">#</th>
                    <th className="py-2.5 px-3">Product / Service Scope</th>
                    <th className="py-2.5 px-3 w-20 text-center">HSN/SAC</th>
                    <th className="py-2.5 px-3 w-16 text-center">Qty</th>
                    <th className="py-2.5 px-3 w-28 text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 w-32 text-right">Taxable Amt (₹)</th>
                    <th className="py-2.5 px-2 w-8 print:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="py-2 px-3 text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full bg-transparent border-0 font-medium text-foreground focus:ring-1 focus:ring-primary rounded px-1"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="text"
                          value={item.hsn}
                          onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                          className="w-16 text-center bg-transparent border-0 font-mono text-muted-foreground focus:ring-1 focus:ring-primary rounded"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value, 10) || 1)}
                          className="w-12 text-center bg-transparent border-0 font-semibold focus:ring-1 focus:ring-primary rounded"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 text-right bg-transparent border-0 font-semibold focus:ring-1 focus:ring-primary rounded"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-foreground">
                        ₹{(item.qty * item.rate).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-2 text-center print:hidden">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-start print:hidden">
              <Button size="sm" variant="outline" onClick={addItem} className="h-7 text-xs gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Scope Item
              </Button>
            </div>
          </div>

          {/* Totals & Tax Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-6 mt-4 border-t border-border">
            <div className="space-y-2 max-w-sm text-xs">
              <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Commercial Terms & Conditions:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px] leading-relaxed">
                <li>100% advance on official license issuance / net 30 days for enterprise SLA.</li>
                <li>Includes standard KCIS 1-year warranty, patch upgrades, and technical support.</li>
                <li>All disputes subject to Faridabad / Delhi NCR jurisdiction only.</li>
                <li>Payment via NEFT/RTGS to KCIS Info Solution Pvt Ltd account.</li>
              </ul>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border text-muted-foreground">
                <span>Taxable Subtotal:</span>
                <span className="font-semibold text-foreground">₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              {gstType === 'inter' ? (
                <div className="flex justify-between py-1 border-b border-border text-muted-foreground">
                  <span>Integrated GST (IGST @ 18%):</span>
                  <span className="font-semibold text-foreground">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between py-0.5 text-muted-foreground">
                    <span>Central GST (CGST @ 9%):</span>
                    <span className="font-semibold text-foreground">₹{(gstAmount / 2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-border text-muted-foreground">
                    <span>State GST (SGST @ 9%):</span>
                    <span className="font-semibold text-foreground">₹{(gstAmount / 2).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between py-2 border-b-2 border-foreground text-sm font-black text-foreground">
                <span>Total Amount (INR):</span>
                <span className="text-emerald-600 font-extrabold text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <p className="text-[10px] text-muted-foreground italic text-right">
                All amounts in Indian Rupees (INR) inclusive of applicable taxes.
              </p>
            </div>
          </div>

          {/* Authorized Signature Block */}
          <div className="flex justify-between items-end pt-12 mt-6 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>System Generated by KCIS Cloud CRM</p>
              <p className="text-[10px]">Verified digital transmission • {new Date().toLocaleDateString()}</p>
            </div>

            <div className="text-right space-y-2">
              <div className="inline-block p-2 rounded border border-red-200 bg-red-50/50 dark:bg-red-950/20 text-center">
                <span className="text-[10px] font-bold text-red-600 block">KCIS INFO SOLUTION PVT LTD</span>
                <span className="text-[9px] text-muted-foreground italic">Authorized Signatory & Seal</span>
              </div>
              <p className="text-xs font-semibold text-foreground">For KCIS Info Solution Pvt Ltd</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
