import { useState, useRef } from 'react';
import { Upload, Download, FileText, Check, AlertTriangle } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import GlassCard from '../components/ui/GlassCard';
import { importApi } from '../services/api';

export default function Import() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    if (f.name.endsWith('.csv')) {
      setFile(f);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await importApi.uploadCSV(file);
      setResult(res);
    } catch (err: any) {
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <TopBar title="Import" subtitle="Import collaborators from CSV" />
      <div className="p-8 space-y-6 max-w-3xl mx-auto">
        {/* Download template */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold">CSV Template</h3>
              <p className="text-sm text-white/40">Download the template to see the expected format</p>
            </div>
            <a href="/api/v1/import/template" download className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Template
            </a>
          </div>
        </GlassCard>

        {/* Upload area */}
        <GlassCard
          className={`p-12 border-2 border-dashed transition-colors ${
            dragOver ? 'border-dr-purple bg-dr-purple/5' : 'border-white/10'
          }`}
        >
          <div
            className="text-center"
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          >
            <Upload className="w-12 h-12 text-dr-purple/40 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">Drop your CSV file here</h3>
            <p className="text-sm text-white/30 mb-4">or click to browse</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
            <button onClick={() => fileRef.current?.click()} className="btn-secondary">
              Choose File
            </button>
          </div>
        </GlassCard>

        {/* Selected file */}
        {file && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-dr-purple" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-white/30">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button onClick={handleUpload} disabled={loading} className="btn-primary">
                {loading ? 'Importing...' : 'Import'}
              </button>
            </div>
          </GlassCard>
        )}

        {/* Results */}
        {result && !result.error && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-400" />
              <h3 className="font-heading font-semibold">Import Complete</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-green-500/10 text-center">
                <p className="text-2xl font-bold text-green-400">{result.imported}</p>
                <p className="text-xs text-white/40">Successfully imported</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 text-center">
                <p className="text-2xl font-bold text-red-400">{result.errors}</p>
                <p className="text-xs text-white/40">Errors</p>
              </div>
            </div>
            {result.details?.errors?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Errors:
                </h4>
                {result.details.errors.map((e: any, i: number) => (
                  <p key={i} className="text-xs text-white/40">Row {e.row}: {e.error}</p>
                ))}
              </div>
            )}
          </GlassCard>
        )}
        {result?.error && (
          <GlassCard className="p-6 border-red-500/30">
            <p className="text-red-400">{result.error}</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
