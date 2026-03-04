import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type Student = { id: number; username: string; email: string; level: number; xp: number };
type AssessmentRow = { id: number; user_email: string; question_id: string; prompt: string; answer: string; evaluation_json: string; created_at: string };

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students', { headers: { 'x-user-role': user?.role || '' } });
      const data = await res.json();
      setStudents(data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const fetchAssessments = async (email?: string) => {
    setLoading(true);
    try {
      const url = email ? `/api/admin/assessments?email=${encodeURIComponent(email)}` : '/api/admin/assessments';
      const res = await fetch(url, { headers: { 'x-user-role': user?.role || '' } });
      const data = await res.json();
      setAssessments(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedEmail) fetchAssessments(selectedEmail);
  }, [selectedEmail]);

  if (!user || user.role !== 'admin') return <div className="p-6">Access restricted to teachers only.</div>;

  return (
    <div className="p-6 max-w-5xl">
      <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h3 className="font-semibold mb-2">Students</h3>
          {loading && <div className="text-sm text-slate-400">Loading...</div>}
          <ul className="space-y-2">
            {students.map(s => (
              <li key={s.email}>
                <button className="w-full text-left p-2 rounded hover:bg-white/5" onClick={() => setSelectedEmail(s.email)}>
                  <div className="font-medium">{s.username}</div>
                  <div className="text-xs text-slate-400">{s.email}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Assessments {selectedEmail ? `— ${selectedEmail}` : ''}</h3>
            <div>
              <button onClick={() => fetchAssessments(selectedEmail || undefined)} className="px-3 py-1 bg-cyan-600 rounded text-white">Refresh</button>
            </div>
          </div>

          {/* Video upload area for teachers */}
          <div className="mb-4 p-3 bg-slate-800/40 rounded">
            <div className="font-medium mb-2">Upload Course Video</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="mb-2"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                setSelectedFile(f);
              }}
            />
            <div className="mb-2 text-sm text-slate-300">{selectedFile ? selectedFile.name : 'No file selected'}</div>
            <div className="flex gap-2">
              <button onClick={async () => {
                const file = selectedFile;
                if (!file) return alert('Select a file');
                try {
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1];
                    const res = await fetch('/api/admin/upload-video', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'x-user-role': user?.role || '', 'x-user-email': user?.email || '' },
                      body: JSON.stringify({ filename: file.name, dataBase64: base64 })
                    });
                    const data = await res.json();
                    if (data.ok) {
                      alert('Uploaded: ' + data.url);
                      // optionally refresh courses or UI
                    } else {
                      alert('Upload failed');
                    }
                  };
                  reader.readAsDataURL(file);
                } catch (err) {
                  console.error(err);
                  alert('Upload error');
                }
              }} className="px-3 py-1 bg-purple-600 rounded text-white">Upload</button>
            </div>
          </div>

          {assessments.length === 0 && <div className="text-sm text-slate-400">No assessments found.</div>}

          <div className="space-y-3">
            {assessments.map(a => {
              let evalObj: any = null;
              try { evalObj = JSON.parse(a.evaluation_json || '{}'); } catch { evalObj = null; }
              return (
                <div key={a.id} className="p-3 bg-slate-800/50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm text-slate-300">Question: {a.question_id}</div>
                      <div className="font-medium text-white">{a.prompt}</div>
                    </div>
                    <div className="text-xs text-slate-400">{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-slate-200 mb-2">Answer: {a.answer}</div>
                  {evalObj ? (
                    <div className="text-sm text-slate-300">
                      <div>Overall: {evalObj.overall ?? evalObj.score ?? '—'}</div>
                      <div className="mt-1">Feedback:</div>
                      <ul className="ml-4 list-disc text-slate-300">
                        {Array.isArray(evalObj.feedback) ? evalObj.feedback.map((f: string, i: number) => <li key={i}>{f}</li>) : <li>{JSON.stringify(evalObj)}</li>}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">Evaluation not available.</div>
                  )}
                  {/* Existing comments */}
                  <div className="mt-3">
                    <div className="text-sm text-slate-400">Comments:</div>
                    {a.comments_json ? (
                      (() => { try { const cs = JSON.parse(a.comments_json); return (
                        <ul className="ml-4 list-disc text-slate-300">{Array.isArray(cs) ? cs.map((c: any, i: number) => <li key={i}><strong>{c.teacher_email}:</strong> {c.comment} <span className="text-xs text-slate-500">({new Date(c.created_at).toLocaleString()})</span></li>) : null}</ul>
                      ); } catch { return <div className="text-xs text-slate-500">Invalid comments</div>; } })()
                    ) : (
                      <div className="text-xs text-slate-500">No comments yet.</div>
                    )}
                  </div>

                  {/* Add comment */}
                  <div className="mt-2 flex gap-2">
                    <input placeholder="Write a comment..." id={`comment-input-${a.id}`} className="flex-1 p-2 rounded bg-black/20 text-slate-100" />
                    <button onClick={async () => {
                      const el: any = document.getElementById(`comment-input-${a.id}`);
                      if (!el) return;
                      const comment = el.value.trim();
                      if (!comment) return alert('Enter comment');
                      const res = await fetch(`/api/admin/assessments/${a.id}/comment`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': user?.role || '', 'x-user-email': user?.email || '' }, body: JSON.stringify({ comment }) });
                      const data = await res.json();
                      if (data.ok) { alert('Comment saved'); fetchAssessments(selectedEmail || undefined); } else alert('Save failed');
                    }} className="px-3 py-1 bg-emerald-600 rounded text-white">Save</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
