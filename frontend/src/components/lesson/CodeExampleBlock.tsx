import { Copy } from "lucide-react";

interface CodeExampleBlockProps {
  code: string;
}

function CodeExampleBlock({ code }: CodeExampleBlockProps) {
  const handleCopy = async () => {
    await navigator.clipboard?.writeText(code);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-bold text-slate-400">python_example.py</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Copy size={13} />
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default CodeExampleBlock;
