import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

export default function AdminTasks() {
  const { tasks, users, addTask, forwardTask, deleteTask } = useTasks();
  const { id: currentUserId, role } = useAuth();
  const [taskForm, setTaskForm] = useState({ title: "", description: "", userId: "", pdf: null });
  const [taskError, setTaskError] = useState("");
  const [taskToast, setTaskToast] = useState("");
  const [forwardUsers, setForwardUsers] = useState({}); // Separate state for each task

  // Filter tasks by status
  const activeTasks = tasks.filter(task => task.status !== "afgerond");
  const completedTasks = tasks.filter(task => task.status === "afgerond");

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
    if (!taskForm.title || taskForm.userId === "") {
      setTaskError("Vul alle verplichte velden in.");
      return;
    }
    setTaskError("");
    
    try {
      // Convert userId to the correct format
      const userId = taskForm.userId === "0" ? null : parseInt(taskForm.userId);
      
      await addTask({
        ...taskForm,
        userId,
        pdfName: taskForm.pdf ? taskForm.pdf.name : null,
        pdfUrl: taskForm.pdf ? URL.createObjectURL(taskForm.pdf) : null,
        status: "open",
        feedback: "",
      });
      
      setTaskForm({ title: "", description: "", userId: "", pdf: null });
      setTaskToast("Taak toegevoegd!");
      setTimeout(() => setTaskToast(""), 1500);
    } catch (error) {
      console.error('Error adding task:', error);
      setTaskError("Er ging iets mis bij het toevoegen van de taak.");
    }
  };

  const handleForward = async (taskId) => {
    const userId = forwardUsers[taskId];
    if (!userId) return;
    
    try {
      // Convert userId to the correct format
      const parsedUserId = userId === "0" ? null : parseInt(userId);
      
      await forwardTask(taskId, parsedUserId);
      setTaskToast("Taak toegewezen!");
      
      // Clear only the specific task's forward user
      setForwardUsers(prev => ({
        ...prev,
        [taskId]: ""
      }));
      
      setTimeout(() => setTaskToast(""), 1500);
    } catch (error) {
      console.error('Error forwarding task:', error);
      setTaskToast("Er ging iets mis bij het toewijzen van de taak");
      setTimeout(() => setTaskToast(""), 3000);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (taskId, value) => {
    setForwardUsers(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Taken beheer</h1>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-navy mb-2">{activeTasks.length}</div>
          <div className="text-sm text-gray-600">Actieve taken</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{completedTasks.length}</div>
          <div className="text-sm text-gray-600">Voltooide taken</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-domred mb-2">{tasks.length}</div>
          <div className="text-sm text-gray-600">Totaal taken</div>
        </div>
      </div>
      
      <section className="mb-10 bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Taak toevoegen</h2>
        <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titel <span className="text-red-500">*</span>
              </label>
            <input
                type="text"
              name="title"
              value={taskForm.title}
              onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
            />
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijving
              </label>
          <textarea
            name="description"
            value={taskForm.description}
            onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Toewijzen aan <span className="text-red-500">*</span>
              </label>
              <select
                name="userId"
                value={taskForm.userId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                  >
                <option value="">Selecteer een optie</option>
                <option value="0">Algemeen (niet toegewezen)</option>
                    <option value={currentUserId}>Mijzelf</option>
                <optgroup label="Andere gebruikers">
                  {users
                    .filter(user => user.id !== currentUserId)
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))
                  }
                </optgroup>
                  </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF bijlage
              </label>
              <input
                type="file"
                name="pdf"
                onChange={handleChange}
                accept=".pdf"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {taskError && (
              <div className="text-red-600 text-sm">{taskError}</div>
            )}

                  <button
              type="submit"
              className="w-full bg-navy text-white py-2 rounded hover:bg-navy/90 transition-colors"
                  >
              Taak toevoegen
                  </button>
          </form>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Actieve taken</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded shadow text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Titel</th>
                  <th className="px-4 py-2 text-left">Beschrijving</th>
                  <th className="px-4 py-2 text-left">Toegewezen aan</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{task.title}</td>
                    <td className="px-4 py-2">{task.description}</td>
                    <td className="px-4 py-2">
                      {task.user ? task.user.name : "Algemeen"}
                    </td>
                    <td className="px-4 py-2">{task.status}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <select
                          value={forwardUsers[task.id] || ""}
                          onChange={(e) => handleDropdownChange(task.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="">Toewijzen aan...</option>
                          <option value="0">Algemeen</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      <button
                          onClick={() => handleForward(task.id)}
                          disabled={!forwardUsers[task.id]}
                          className="bg-navy text-white px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-navy/90 transition-colors"
                      >
                          Toewijzen
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </section>

      {taskToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
          {taskToast}
        </div>
      )}
    </div>
  );
} 