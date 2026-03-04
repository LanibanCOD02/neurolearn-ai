import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type GeneratedQuestion = { id: string | number; category: string; prompt: string; guidance?: string };
type Evaluation = {
  id: string | number;
  summary: string;
  scores: { reasoning: number; situational: number; aptitude: number; confidence: number; goalClarity: number };
  overall: number;
  feedback: string[];
};

export default function Stage2Assessment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Evaluation[] | null>(null);

  useEffect(() => {
    // generate questions on mount
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assessment/stage2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      });
      const data = await res.json();
      // Expecting an array
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitForEvaluation = async () => {
    const responses = questions.map(q => ({ id: q.id, prompt: q.prompt, answer: answers[q.id] || '' }));

    if (!user || !user.email) {
      alert('Please log in to submit answers so your teacher can review them.');
      return;
    }

    setLoading(true);
    try {
      // First persist student answers (without evaluation) so teacher can review immediately
      try {
        await Promise.all(responses.map(async (r) => {
          await fetch('/api/assessments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              user_email: user.email,
              question_id: r.id,
              prompt: r.prompt,
              answer: r.answer,
              evaluation: null
            })
          });
        }));
      } catch (err) {
        console.error('Failed to persist initial student submissions', err);
      }

      // Then request automated evaluation
      const payload = { action: 'evaluate', responses };
      const res = await fetch('/api/assessment/stage2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const evals = Array.isArray(data) ? data : null;
      setEvaluations(evals);

      // Update persisted rows with evaluation objects (best-effort)
      if (evals) {
        try {
          await Promise.all(evals.map(async (ev: any) => {
            const matchingAnswer = answers[ev.id] || answers[String(ev.id)] || '';
            await fetch('/api/admin/assessments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-user-role': user?.role || '', 'x-user-email': user?.email || '' },
              body: JSON.stringify({
                user_id: user.id,
                user_email: user.email,
                question_id: ev.id,
                prompt: questions.find(q => q.id === ev.id)?.prompt || '',
                answer: matchingAnswer,
                evaluation: ev
              })
            });
          }));
        } catch (err) {
          console.error('Failed to update persisted submissions with evaluation', err);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Stage 2 — Open-ended Reasoning Assessment</h2>

      {loading && <div className="text-sm text-slate-400 mb-4">Working with the assessment engine...</div>}

      {questions.length === 0 && !loading && (
        <div className="mb-4">
          <p className="text-slate-400">No questions available.</p>
          <button onClick={generateQuestions} className="mt-3 px-4 py-2 bg-cyan-600 rounded text-white">Generate</button>
        </div>
      )}

      {questions.map((q) => (
        <div key={q.id} className="mb-6 bg-slate-900/40 p-4 rounded">
          <div className="text-sm text-slate-400 mb-2">{q.category}</div>
          <div className="font-medium text-white mb-2">{q.prompt}</div>
          {q.guidance && <div className="text-xs text-slate-500 mb-2">Guidance: {q.guidance}</div>}
          <textarea
            placeholder="Write your answer here (2-6 sentences)..."
            value={answers[q.id] || ''}
            onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
            className="w-full min-h-[100px] p-2 rounded bg-black/20 text-slate-100"
          />
        </div>
      ))}

      {questions.length > 0 && !evaluations && (
        <div className="flex gap-2">
          <button onClick={submitForEvaluation} className="px-4 py-2 bg-purple-600 rounded text-white">Submit Answers</button>
          <button onClick={generateQuestions} className="px-4 py-2 bg-white/10 rounded text-white">Regenerate Questions</button>
        </div>
      )}

      {evaluations && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-bold">Evaluation</h3>
          {evaluations.map(ev => (
            <div key={ev.id} className="p-4 bg-white/5 rounded">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-slate-400">ID: {ev.id}</div>
                <div className="text-sm text-yellow-400 font-bold">Overall: {ev.overall}</div>
              </div>
              <div className="text-sm text-slate-300 mb-2">{ev.summary}</div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div className="p-2 bg-black/20 rounded">Reasoning: {ev.scores.reasoning}</div>
                <div className="p-2 bg-black/20 rounded">Situational: {ev.scores.situational}</div>
                <div className="p-2 bg-black/20 rounded">Aptitude: {ev.scores.aptitude}</div>
                <div className="p-2 bg-black/20 rounded">Confidence: {ev.scores.confidence}</div>
                <div className="p-2 bg-black/20 rounded">Goal Clarity: {ev.scores.goalClarity}</div>
              </div>
              <div className="text-sm text-slate-400">Feedback:</div>
              <ul className="list-disc ml-5 text-sm text-slate-300">
                {ev.feedback.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
