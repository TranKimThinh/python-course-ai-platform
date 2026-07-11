import { type TranscriptTab } from "./lessonTypes";

interface TranscriptTabsProps {
  activeTab: TranscriptTab;
  onChange: (tab: TranscriptTab) => void;
}

const tabs: Array<{ id: TranscriptTab; label: string }> = [
  { id: "transcript", label: "Transcript" },
  { id: "summary", label: "Tóm tắt AI" },
];

function TranscriptTabs({ activeTab, onChange }: TranscriptTabsProps) {
  return (
    <div className="flex border-b border-slate-100 px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`border-b-2 px-4 py-4 text-sm font-extrabold transition ${
            activeTab === tab.id
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TranscriptTabs;
