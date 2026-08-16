import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface EmbedScriptPanelProps {
  contractorId: string;
}

export default function EmbedScriptPanel({ contractorId }: EmbedScriptPanelProps) {
  const widgetUrl = `${window.location.origin}/widget/${contractorId}`;
  const embedCode = `<script src="${window.location.origin}/embed.js" data-contractor-id="${contractorId}" async></script>`;
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  function copy(text: string, which: 'embed' | 'url') {
    navigator.clipboard.writeText(text);
    if (which === 'embed') { setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); }
    else { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000); }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-1"><Code2 className="w-4 h-4 text-blue-600" /><h2 className="text-lg font-semibold text-slate-900">Embed Script</h2></div>
      <p className="text-sm text-slate-500 mb-5">Paste this snippet anywhere in your website's HTML where you want the quote calculator to appear.</p>
      <div className="relative">
        <pre className="bg-slate-900 text-slate-100 text-xs rounded-xl p-4 pr-12 overflow-x-auto font-mono leading-relaxed">{embedCode}</pre>
        <button onClick={() => copy(embedCode, 'embed')} className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Copy embed code">{copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
      </div>
      <div className="mt-5 pt-5 border-t border-slate-100">
        <p className="text-sm font-medium text-slate-700 mb-2">Or share your direct widget link:</p>
        <div className="flex items-center gap-2">
          <input readOnly value={widgetUrl} className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-600 bg-slate-50 font-mono" />
          <button onClick={() => copy(widgetUrl, 'url')} className="px-3 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors" aria-label="Copy widget URL">{copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}</button>
        </div>
      </div>
    </div>
  );
}
