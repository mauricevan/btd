import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

export default function UserTasks() {
  const { id: currentUserId, role } = useAuth();
  const { tasks, users, updateTask, forwardTask } = useTasks();
  const [forwardUser, setForwardUser] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackTaskId, setFeedbackTaskId] = useState(null);
  const [toast, setToast] = useState("");

  // Forward a task to another user
  const handleForward = async (taskId, userId = forwardUser) => {
    if (!userId) return;
    await forwardTask(taskId, Number(userId));
    setToast("Taak toegewezen!");
    setTimeout(() => setToast("") , 1500);
    setForwardUser("");
  };

  // Mark as finished and send feedback
  const handleFinish = async (taskId) => {
    await updateTask(taskId, { 
      status: "afgerond", 
      feedback,
      completed: true,
      completedAt: new Date().toISOString()
    });
    setToast("Taak afgerond en feedback verzonden naar admin!");
    setTimeout(() => setToast("") , 3000);
    setFeedback("");
    setFeedbackTaskId(null);
  };

  const myTasks = tasks.filter(t => Number(t.userId) === Number(currentUserId) && t.status !== "afgerond");
  const generalTasks = tasks.filter(t => Number(t.userId) === 0 && t.status !== "afgerond");
  const completedTasks = tasks.filter(t => Number(t.userId) === Number(currentUserId) && t.status === "afgerond");

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-navy">Mijn taken</h1>
      {toast && <div className="text-green-700 text-sm mb-4">{toast}</div>}
      <div className="flex flex-col md:flex-row gap-8">
        <section className="md:basis-[60%] flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass mb-8 md:mb-0">
          <h2 className="text-lg font-bold mb-2 text-navy">Mijn taken</h2>
          <table className="w-full border rounded shadow text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="p-2 text-left">Titel</th>
                <th className="p-2 text-left">Omschrijving</th>
                <th className="p-2 text-left">PDF</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Acties</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.map(task => (
                <tr key={task.id} className="bg-white hover:bg-gold/10">
                  <td className="p-2 font-medium text-navy">{task.title}</td>
                  <td className="p-2">{task.description}</td>
                  <td className="p-2">
                    {task.pdfName ? <a href={task.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-domred underline">{task.pdfName}</a> : "-"}
                  </td>
                  <td className="p-2">{task.status}</td>
                  <td className="p-2 flex flex-col gap-2">
                    <select
                      value={forwardUser}
                      onChange={e => setForwardUser(e.target.value)}
                      className="border rounded px-2 py-1 mb-1"
                    >
                      <option value="">Stuur door naar...</option>
                      {users.filter(u => u.id !== currentUserId).map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    <button
                      className="bg-navy text-white px-3 py-1 rounded hover:bg-gold hover:text-navy text-xs"
                      onClick={() => handleForward(task.id)}
                    >
                      Stuur door
                    </button>
                    {task.status !== "afgerond" && (
                      <>
                        <button
                          className="bg-domred text-white px-3 py-1 rounded hover:bg-gold hover:text-navy text-xs mt-2"
                          onClick={() => setFeedbackTaskId(task.id)}
                        >
                          Markeer als afgerond
                        </button>
                        {feedbackTaskId === task.id && (
                          <div className="mt-2">
                            <textarea
                              value={feedback}
                              onChange={e => setFeedback(e.target.value)}
                              placeholder="Feedback voor admin..."
                              className="border rounded px-2 py-1 w-full"
                              rows={2}
                            />
                            <button
                              className="bg-navy text-white px-3 py-1 rounded hover:bg-gold hover:text-navy text-xs mt-1"
                              onClick={() => handleFinish(task.id)}
                            >
                              Verstuur feedback
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="md:basis-[60%] flex-1 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass">
          <h2 className="text-lg font-bold mb-2 text-navy">Algemene taken</h2>
          <table className="w-full border rounded shadow text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="p-2 text-left">Titel</th>
                <th className="p-2 text-left">Omschrijving</th>
                <th className="p-2 text-left">PDF</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Acties</th>
              </tr>
            </thead>
            <tbody>
              {generalTasks.map(task => (
                <tr key={task.id} className="bg-white hover:bg-gold/10">
                  <td className="p-2 font-medium text-navy">{task.title}</td>
                  <td className="p-2">{task.description}</td>
                  <td className="p-2">{task.pdfName ? <a href={task.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-domred underline">{task.pdfName}</a> : "-"}</td>
                  <td className="p-2">{task.status}</td>
                  <td className="p-2 flex flex-col gap-2">
                    <select
                      value={forwardUser}
                      onChange={e => setForwardUser(e.target.value)}
                      className="border rounded px-2 py-1 mb-1"
                    >
                      <option value="">Wijs toe aan...</option>
                      <option value={currentUserId}>Mijzelf</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    <button
                      className="bg-navy text-white px-3 py-1 rounded hover:bg-gold hover:text-navy text-xs"
                      onClick={() => { if (forwardUser) handleForward(task.id, forwardUser); }}
                    >
                      Wijs toe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      
      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <section className="mt-8 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass">
          <h2 className="text-lg font-bold mb-4 text-navy">Voltooide taken</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded shadow text-sm">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 text-left">Titel</th>
                  <th className="p-2 text-left">Omschrijving</th>
                  <th className="p-2 text-left">PDF</th>
                  <th className="p-2 text-left">Voltooid op</th>
                  <th className="p-2 text-left">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map(task => (
                  <tr key={task.id} className="bg-green-50 hover:bg-green-100">
                    <td className="p-2 font-medium text-navy">{task.title}</td>
                    <td className="p-2">{task.description}</td>
                    <td className="p-2">
                      {task.pdfName ? (
                        <a href={task.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-domred underline">
                          {task.pdfName}
                        </a>
                      ) : "-"}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {task.completedAt ? new Date(task.completedAt).toLocaleDateString('nl-NL') : 'Onbekend'}
                    </td>
                    <td className="p-2 text-sm text-gray-700 max-w-xs">
                      {task.feedback || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
} 