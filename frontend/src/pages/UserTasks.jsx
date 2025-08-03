import { useState } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/Modal";

export default function UserTasks() {
  const { id: currentUserId, role } = useAuth();
  const { tasks, users, updateTask, forwardTask, addTask } = useTasks();
  const [forwardUsers, setForwardUsers] = useState({}); // Separate state for each task
  const [feedback, setFeedback] = useState("");
  const [feedbackTaskId, setFeedbackTaskId] = useState(null);
  const [toast, setToast] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    userId: currentUserId // Default naar huidige gebruiker
  });

  // Forward a task to another user
  const handleForward = async (taskId) => {
    const userId = forwardUsers[taskId];
    if (!userId) return;
    
    try {
      await forwardTask(taskId, userId);
      setToast("Taak toegewezen!");
      
      // Clear only the specific task's forward user
      setForwardUsers(prev => ({
        ...prev,
        [taskId]: ""
      }));
      
      setTimeout(() => setToast(""), 1500);
    } catch (error) {
      console.error('Error forwarding task:', error);
      setToast("Er ging iets mis bij het toewijzen van de taak");
      setTimeout(() => setToast(""), 3000);
    }
  };

  // Handle task completion
  const handleFinish = async (taskId) => {
    if (!feedback) {
      setToast("Voeg eerst feedback toe");
      return;
    }
    
    try {
      await updateTask(taskId, { status: "afgerond", feedback });
      setFeedback("");
      setFeedbackTaskId(null);
      setToast("Taak afgerond!");
      setTimeout(() => setToast(""), 1500);
    } catch (error) {
      console.error('Error completing task:', error);
      setToast("Er ging iets mis bij het afronden van de taak");
      setTimeout(() => setToast(""), 3000);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (taskId, value) => {
    setForwardUsers(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  // Filter tasks for the current user
  const myTasks = tasks.filter(task => task.userId === currentUserId && task.status !== "afgerond");
  const generalTasks = tasks.filter(task => task.userId === null && task.status !== "afgerond");

  // Function to parse task description
  const parseTaskDetails = (task) => {
    try {
      // Try to parse as JSON first
      const workOrder = JSON.parse(task.description);
      return {
        isWorkOrder: true,
        data: workOrder,
        date: workOrder.date
      };
    } catch (e) {
      // If not JSON, handle as plain text
      const lines = task.description.split('\n');
      const details = {
        customerName: '',
        customerPhone: '',
        workDescription: task.description,
        date: task.createdAt || new Date().toISOString()
      };

      // Try to extract customer info from text format
      let hasCustomerInfo = false;
      lines.forEach(line => {
        if (line.startsWith('Klant:')) {
          details.customerName = line.replace('Klant:', '').trim();
          hasCustomerInfo = true;
        }
        if (line.startsWith('Telefoon:')) {
          details.customerPhone = line.replace('Telefoon:', '').trim();
        }
      });

      return {
        isWorkOrder: hasCustomerInfo, // Mark as work order if it has customer info
        data: details,
        date: details.date
      };
    }
  };

  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description) {
      setToast("Vul alle verplichte velden in");
      return;
    }

    try {
      // Convert userId to the correct format (null for general tasks)
      const userId = newTask.userId === "0" || !newTask.userId ? null : parseInt(newTask.userId);
      
      await addTask({
        ...newTask,
        userId,
        status: "open"
      });
      
      // Reset form to default state (assigned to current user)
      setNewTask({ title: "", description: "", userId: currentUserId });
      setShowNewTaskModal(false);
      setToast("Taak toegevoegd!");
      setTimeout(() => setToast(""), 1500);
    } catch (error) {
      console.error('Error adding task:', error);
      setToast("Er ging iets mis bij het toevoegen van de taak");
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header met knoppen */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Mijn taken</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nieuwe Taak
          </button>
          <Link 
            to="/workorder" 
            className="bg-domred text-white px-4 py-2 rounded-lg hover:bg-domred/90 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
            </svg>
            Nieuwe Werkorder
          </Link>
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      {/* Nieuwe Taak Modal */}
      {showNewTaskModal && (
        <Modal onClose={() => setShowNewTaskModal(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-navy">Nieuwe Taak</h2>
            <form onSubmit={handleNewTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Omschrijving <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Toewijzen aan <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.userId || ""}
                  onChange={(e) => setNewTask({ ...newTask, userId: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy"
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
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90"
                >
                  Taak Toevoegen
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Mijn taken */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Mijn taken</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Taak</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myTasks.map(task => {
                const { isWorkOrder, data } = parseTaskDetails(task);
                return (
                  <tr key={task.id} className="hover:bg-gold/10 cursor-pointer">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isWorkOrder 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isWorkOrder ? 'Werkorder' : 'Taak'}
                      </span>
                    </td>
                    <td 
                      className="px-6 py-4"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="font-semibold">{task.title || "(geen titel)"}</div>
                      {data.customerName && <div className="text-xs text-gray-500">{data.customerName}</div>}
                      <div className="text-sm text-gray-600">
                        {data.workDescription.substring(0, 20)}
                        {data.workDescription.length > 20 ? "..." : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">{task.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <select
                          value={forwardUsers[task.id] || ""}
                          onChange={(e) => handleDropdownChange(task.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="">Stuur door naar...</option>
                          <option value="0">Algemeen (voor iedereen)</option>
                          {users
                            .filter(u => u.id !== currentUserId)
                            .map(user => (
                              <option key={user.id} value={user.id}>
                                {user.email}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => handleForward(task.id)}
                          disabled={!forwardUsers[task.id]}
                          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Stuur door
                        </button>
                        <button
                          onClick={() => setFeedbackTaskId(task.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Afronden
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algemene taken */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Algemene taken</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Taak</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {generalTasks.map(task => {
                const { isWorkOrder, data } = parseTaskDetails(task);
                return (
                  <tr key={task.id} className="hover:bg-gold/10 cursor-pointer">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isWorkOrder 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isWorkOrder ? 'Werkorder' : 'Taak'}
                      </span>
                    </td>
                    <td 
                      className="px-6 py-4"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="font-semibold">{task.title || "(geen titel)"}</div>
                      {data.customerName && <div className="text-xs text-gray-500">{data.customerName}</div>}
                      <div className="text-sm text-gray-600">
                        {data.workDescription.substring(0, 20)}
                        {data.workDescription.length > 20 ? "..." : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">{task.status}</td>
                    <td className="px-6 py-4 flex flex-col gap-2">
                      {/* Toevoegen: dropdown en knop voor toewijzen */}
                      <div className="flex gap-2 items-center">
                        <select
                          className="border rounded px-2 py-1"
                          value={forwardUsers[task.id] || ""}
                          onChange={e => handleDropdownChange(task.id, e.target.value)}
                        >
                          <option value="">Kies gebruiker</option>
                          <option value="0">Algemene takenlijst</option>
                          <option value={currentUserId}>Mijzelf</option>
                          {users.filter(u => u.id !== currentUserId).map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleForward(task.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                          disabled={!forwardUsers[task.id]}
                        >
                          Toewijzen
                        </button>
                      </div>
                      <button
                        onClick={() => setFeedbackTaskId(task.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Afronden
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Voeg feedback toe</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              rows="4"
              placeholder="Schrijf hier je feedback..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setFeedbackTaskId(null);
                  setFeedback("");
                }}
                className="px-4 py-2 border rounded"
              >
                Annuleren
              </button>
              <button
                onClick={() => handleFinish(feedbackTaskId)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Verstuur feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal onClose={() => setSelectedTask(null)}>
          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-navy">Werkorder Details</h2>
              <div className="text-gray-600">
                {new Date(parseTaskDetails(selectedTask).date).toLocaleDateString('nl-NL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            {(() => {
              const { isWorkOrder, data } = parseTaskDetails(selectedTask);

              if (isWorkOrder) {
                // Render full work order format
                return (
                  <div className="space-y-6">
                    {/* Klantgegevens sectie */}
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="bg-navy text-white px-4 py-2 rounded-t-lg">
                        <h3 className="font-semibold">Klantgegevens</h3>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Naam</label>
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            {data.customerName}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Telefoon</label>
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            {data.customerPhone}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            {data.customerEmail || 'Niet opgegeven'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Adres</label>
                          <div className="p-2 bg-gray-50 rounded border border-gray-200">
                            {data.customerAddress || 'Niet opgegeven'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Werkzaamheden sectie */}
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="bg-navy text-white px-4 py-2 rounded-t-lg">
                        <h3 className="font-semibold">Omschrijving Werkzaamheden</h3>
                      </div>
                      <div className="p-4">
                        <div className="p-2 bg-gray-50 rounded border border-gray-200 min-h-[100px] whitespace-pre-wrap">
                          {data.workDescription}
                        </div>
                      </div>
                    </div>

                    {/* Producten sectie */}
                    {data.items && data.items.length > 0 && (
                      <div className="bg-white rounded-lg border border-gray-200">
                        <div className="bg-navy text-white px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">Producten</h3>
                        </div>
                        <div className="p-4">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50 border-b">
                                  <th className="px-4 py-2 text-left font-medium text-gray-600">Product</th>
                                  <th className="px-4 py-2 text-right font-medium text-gray-600">Aantal</th>
                                  <th className="px-4 py-2 text-right font-medium text-gray-600">Prijs per stuk</th>
                                  <th className="px-4 py-2 text-right font-medium text-gray-600">BTW %</th>
                                  <th className="px-4 py-2 text-right font-medium text-gray-600">Totaal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {data.items.map((item, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                                    <td className="px-4 py-2 text-right">€{item.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right">{item.vat}%</td>
                                    <td className="px-4 py-2 text-right">€{(item.quantity * item.price * (1 + item.vat/100)).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="mt-4 border-t pt-4">
                            <div className="flex justify-end space-y-2 text-sm">
                              <div className="w-48 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Subtotaal:</span>
                                  <span>€{data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">BTW:</span>
                                  <span>€{(data.items.reduce((sum, item) => sum + (item.quantity * item.price * (item.vat/100)), 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                  <span>Totaal incl. BTW:</span>
                                  <span>€{data.items.reduce((sum, item) => sum + (item.quantity * item.price * (1 + item.vat/100)), 0).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notities sectie */}
                    {data.notes && (
                      <div className="bg-white rounded-lg border border-gray-200">
                        <div className="bg-navy text-white px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">Notities</h3>
                        </div>
                        <div className="p-4">
                          <div className="p-2 bg-gray-50 rounded border border-gray-200 min-h-[60px] whitespace-pre-wrap">
                            {data.notes}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                // Render simple task format
                return (
                  <div className="space-y-6">
                    {/* Klantgegevens sectie */}
                    {(data.customerName || data.customerPhone) && (
                      <div className="bg-white rounded-lg border border-gray-200">
                        <div className="bg-navy text-white px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">Klantgegevens</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.customerName && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Naam</label>
                              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                                {data.customerName}
                              </div>
                            </div>
                          )}
                          {data.customerPhone && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Telefoon</label>
                              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                                {data.customerPhone}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Werkzaamheden sectie */}
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="bg-navy text-white px-4 py-2 rounded-t-lg">
                        <h3 className="font-semibold">Omschrijving Werkzaamheden</h3>
                      </div>
                      <div className="p-4">
                        <div className="p-2 bg-gray-50 rounded border border-gray-200 min-h-[100px] whitespace-pre-wrap">
                          {data.workDescription}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
} 