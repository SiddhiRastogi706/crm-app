import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Settings2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { parseCSV } from '@/utils/export';
import { formatCurrency } from '@/utils/formatters';
import { Contact } from '@/lib/api/types';
import { toast } from 'sonner';

interface ContactCsvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (contacts: Partial<Contact>[]) => Promise<void>;
}

export const ContactCsvModal: React.FC<ContactCsvModalProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Column Mappings (CRM Field -> CSV column index)
  const [mapping, setMapping] = useState({
    nameIndex: 0,
    emailIndex: 1,
    phoneIndex: 2,
    companyIndex: 3,
    titleIndex: 4,
    valueIndex: 5,
  });

  const autoDetectColumns = (headers: string[]) => {
    const lower = headers.map((h) => h.toLowerCase().trim());
    const findIdx = (keywords: string[], defaultIdx: number) => {
      const idx = lower.findIndex((h) => keywords.some((k) => h.includes(k)));
      return idx !== -1 ? idx : Math.min(defaultIdx, headers.length - 1);
    };

    setMapping({
      nameIndex: findIdx(['name', 'contact', 'person', 'lead'], 0),
      emailIndex: findIdx(['email', 'mail'], 1),
      phoneIndex: findIdx(['phone', 'mobile', 'cell', 'tel'], 2),
      companyIndex: findIdx(['company', 'organization', 'client', 'firm'], 3),
      titleIndex: findIdx(['title', 'designation', 'role', 'position'], 4),
      valueIndex: findIdx(['value', 'amount', 'budget', 'revenue', 'deal'], 5),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          const { headers, rows } = parseCSV(text);
          if (headers.length === 0 || rows.length === 0) {
            toast.error('The selected file appears to be empty.');
            return;
          }
          setRawHeaders(headers);
          setRawRows(rows);
          autoDetectColumns(headers);
          toast.success(`Detected ${rows.length} records with ${headers.length} columns!`);
        } catch {
          toast.error('Failed to parse file format. Please upload a valid CSV/Excel export.');
        }
      };
      reader.readAsText(selected);
    }
  };

  const parsedContacts: Partial<Contact>[] = rawRows.map((row) => ({
    name: row[mapping.nameIndex] || 'Unknown',
    email: row[mapping.emailIndex] || 'client@company.com',
    phone: row[mapping.phoneIndex] || '+91 (0) 000-0000',
    company: row[mapping.companyIndex] || 'Enterprise Client',
    title: row[mapping.titleIndex] || 'Decision Maker',
    value: Number((row[mapping.valueIndex] || '50000').replace(/[^0-9.]/g, '')) || 50000,
    status: 'lead',
    source: 'website',
    ownerId: 'user-3',
    ownerName: 'Sam Rivera',
    tags: ['Spreadsheet Import', 'KCIS Lead'],
  }));

  const handleImport = async () => {
    if (parsedContacts.length === 0) return;
    setIsLoading(true);
    try {
      await onImport(parsedContacts);
      toast.success(`Successfully imported ${parsedContacts.length} contacts into KCIS database!`);
      setFile(null);
      setRawHeaders([]);
      setRawRows([]);
      onOpenChange(false);
    } catch {
      toast.error('Failed to import contacts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Smart Excel & CSV Column Mapping Importer
            <Badge className="bg-primary/10 text-primary text-[10px]">Auto-Mapper</Badge>
          </DialogTitle>
          <DialogDescription>
            Upload client spreadsheets and map your columns directly into KCIS CRM fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!file ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-colors">
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">Click to upload spreadsheet or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">Supports UTF-8 CSV, Excel Exports (.csv), TSV</p>
              <input type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="space-y-4">
              {/* File Info Card */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {rawRows.length} rows • {rawHeaders.length} columns detected
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setRawHeaders([]);
                    setRawRows([]);
                  }}
                  className="text-xs h-7"
                >
                  Change File
                </Button>
              </div>

              {/* Column Mapping Section */}
              <div className="rounded-xl border border-border/80 p-3.5 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Settings2 className="h-3.5 w-3.5 text-primary" /> Column Mapping (Excel Column → CRM Field)
                  </h4>
                  <span className="text-[10px] text-muted-foreground">Auto-detected from file headers</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Contact Name *</label>
                    <select
                      value={mapping.nameIndex}
                      onChange={(e) => setMapping({ ...mapping, nameIndex: parseInt(e.target.value, 10) })}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {rawHeaders.map((h, i) => (
                        <option key={i} value={i}>Col {i + 1}: {h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Email Address *</label>
                    <select
                      value={mapping.emailIndex}
                      onChange={(e) => setMapping({ ...mapping, emailIndex: parseInt(e.target.value, 10) })}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {rawHeaders.map((h, i) => (
                        <option key={i} value={i}>Col {i + 1}: {h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Company / Organization *</label>
                    <select
                      value={mapping.companyIndex}
                      onChange={(e) => setMapping({ ...mapping, companyIndex: parseInt(e.target.value, 10) })}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {rawHeaders.map((h, i) => (
                        <option key={i} value={i}>Col {i + 1}: {h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Phone / Mobile</label>
                    <select
                      value={mapping.phoneIndex}
                      onChange={(e) => setMapping({ ...mapping, phoneIndex: parseInt(e.target.value, 10) })}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {rawHeaders.map((h, i) => (
                        <option key={i} value={i}>Col {i + 1}: {h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Job Title</label>
                    <select
                      value={mapping.titleIndex}
                      onChange={(e) => setMapping({ ...mapping, titleIndex: parseInt(e.target.value, 10) })}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {rawHeaders.map((h, i) => (
                        <option key={i} value={i}>Col {i + 1}: {h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Est. Value / Budget</label>
                    <select
                      value={mapping.valueIndex}
                      onChange={(e) => setMapping({ ...mapping, valueIndex: parseInt(e.target.value, 10) })}
                      className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {rawHeaders.map((h, i) => (
                        <option key={i} value={i}>Col {i + 1}: {h}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Preview Table */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-muted-foreground">
                  Mapped Records Preview (Showing first 4 rows):
                </p>
                <div className="max-h-48 overflow-auto rounded-xl border border-border">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/70 text-muted-foreground font-semibold sticky top-0">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Company</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Est. Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {parsedContacts.slice(0, 4).map((row, i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="p-2 font-semibold text-foreground">{row.name}</td>
                          <td className="p-2 text-muted-foreground">{row.email}</td>
                          <td className="p-2">{row.company}</td>
                          <td className="p-2 text-muted-foreground">{row.phone}</td>
                          <td className="p-2 font-bold text-foreground">{formatCurrency(row.value || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsedContacts.length === 0}
            isLoading={isLoading}
            className="gap-1.5 font-semibold"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Import {parsedContacts.length > 0 ? `(${parsedContacts.length} Contacts)` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
