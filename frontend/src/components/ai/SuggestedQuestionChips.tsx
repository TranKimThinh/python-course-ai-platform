import { type SuggestedQuestion } from "./aiTypes";

interface SuggestedQuestionChipsProps {
  questions: SuggestedQuestion[];
  onSelect: (question: string) => void;
}

function SuggestedQuestionChips({ questions, onSelect }: SuggestedQuestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question) => (
        <button
          key={question.id}
          type="button"
          onClick={() => onSelect(question.label)}
          className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100"
        >
          {question.label}
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestionChips;
