import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

export default function AdminTasks() {
  const { tasks, users, addTask, forwardTask, deleteTask } = useTasks();
  const { id: currentUserId, role } = useAuth();
  const [taskForm, setTaskForm] = useState({ title: "", description: "", userId: "", pdf: null });
  const [taskError, setTaskError] = useState("");
  const [taskToast, setTaskToast] = useState("");
  const [forwardUser, setForwardUser] = useState("");

  // Filter tasks by status
  const activeTasks = tasks.filter(task => task.status !== "afgerond");
  const completedTasks = tasks.filter(task => task.status === "afgerond");

  console.log('users', users);
  console.log('tasks', tasks);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setTaskForm(f => ({ ...f, pdf: files[0] }));
    } else {
      setTaskForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.userId) {
      setTaskError("Vul alle verplichte velden in.");
      return;
    }
    setTaskError("");
    await addTask({
      ...taskForm,
      pdfName: taskForm.pdf ? taskForm.pdf.name : null,
      pdfUrl: taskForm.pdf ? URL.createObjectURL(taskForm.pdf) : null,
      status: "open",
      feedback: "",
    });
    setTaskForm({ title: "", description: "", userId: "", pdf: null });
    setTaskToast("Taak toegevoegd!");
    setTimeout(() => setTaskToast("") , 1500);
  };

  const handleForward = async (taskId, userId = forwardUser) => {
    if (!userId) return;
    await forwardTask(taskId, Number(userId));
    setTaskToast("Taak toegewezen!");
    setTimeout(() => setTaskToast("") , 1500);
    setForwardUser("");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-navy">Takenbeheer</h1>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass text-center">
          <div className="text-3xl font-bold text-navy mb-2">{activeTasks.length}</div>
          <div className="text-sm text-gray-600">Actieve taken</div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{completedTasks.length}</div>
          <div className="text-sm text-gray-600">Voltooide taken</div>
        </div>
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass text-center">
          <div className="text-3xl font-bold text-domred mb-2">{tasks.length}</div>
          <div className="text-sm text-gray-600">Totaal taken</div>
        </div>
      </div>
      <section className="mb-10 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass">
        <h2 className="text-xl font-bold mb-4 text-navy">Taak toevoegen</h2>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              name="title"
              value={taskForm.title}
              onChange={handleChange}
              placeholder="Titel*"
              className="border rounded px-3 py-2 flex-1"
            />
            <select
              name="userId"
              value={taskForm.userId}
              onChange={handleChange}
              className="border rounded px-3 py-2 flex-1"
            >
              <option value="">Kies gebruiker*</option>
              <option value="0">Algemeen (voor iedereen)</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <input
              name="pdf"
              type="file"
              accept="application/pdf"
              onChange={handleChange}
              className="border rounded px-3 py-2 flex-1"
            />
          </div>
          <textarea
            name="description"
            value={taskForm.description}
            onChange={handleChange}
            placeholder="Omschrijving"
            className="border rounded px-3 py-2 w-full"
            rows={2}
          />
          {taskError && <div className="text-red-600 text-sm">{taskError}</div>}
          <button type="submit" className="bg-navy text-white py-2 px-6 rounded-lg font-semibold hover:bg-gold hover:text-navy transition-all">Toevoegen</button>
          {taskToast && <div className="text-green-700 text-sm mt-2">{taskToast}</div>}
        </form>
      </section>
      <section className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass">
        <h2 className="text-xl font-bold mb-4 text-navy">Actieve taken</h2>
        <table className="w-full border rounded shadow text-sm">
          <thead>
            <tr className="bg-navy text-white">
              <th className="p-2 text-left">Titel</th>
              <th className="p-2 text-left">Gebruiker</th>
              <th className="p-2 text-left">PDF</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeTasks.map(task => {
              console.log('task', task);
              return (
                <tr key={task.id} className="bg-white hover:bg-gold/10">
                  <td className="p-2 font-medium text-navy">{task.title}</td>
                  <td className="p-2">
                    {Number(task.userId) === 0
                      ? "Algemeen"
                      : (
                          users.find(u => Number(u.id) === Number(task.userId))?.name ||
                          users.find(u => Number(u.id) === Number(task.userId))?.email ||
                          "-"
                        )
                    }
                  </td>
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
                    <button
                      className="bg-domred text-white px-3 py-1 rounded hover:bg-black text-xs mt-2"
                      onClick={() => {
                        if (window.confirm('Weet je zeker dat je deze taak wilt verwijderen?')) deleteTask(task.id);
                      }}
                    >
                      Verwijder
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <section className="mt-8 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-glass">
          <h2 className="text-xl font-bold mb-4 text-navy">Voltooide taken</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded shadow text-sm">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 text-left">Titel</th>
                  <th className="p-2 text-left">Gebruiker</th>
                  <th className="p-2 text-left">PDF</th>
                  <th className="p-2 text-left">Voltooid op</th>
                  <th className="p-2 text-left">Feedback</th>
                  <th className="p-2 text-left">Acties</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map(task => (
                  <tr key={task.id} className="bg-green-50 hover:bg-green-100">
                    <td className="p-2 font-medium text-navy">{task.title}</td>
                    <td className="p-2">
                      {Number(task.userId) === 0
                        ? "Algemeen"
                        : (
                            users.find(u => Number(u.id) === Number(task.userId))?.name ||
                            users.find(u => Number(u.id) === Number(task.userId))?.email ||
                            "-"
                          )
                      }
                    </td>
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
                    <td className="p-2">
                      <button
                        className="bg-domred text-white px-3 py-1 rounded hover:bg-black text-xs"
                        onClick={() => {
                          if (window.confirm('Weet je zeker dat je deze voltooide taak wilt verwijderen?')) deleteTask(task.id);
                        }}
                      >
                        Verwijder
                      </button>
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