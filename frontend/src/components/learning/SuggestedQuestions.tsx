interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestions;
