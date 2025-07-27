import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Task } from '../types';
import { Plus, Search, Edit, Trash2, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Installations: React.FC = () => {
  const { tasks, customers, addTask, updateTask, deleteTask, exportData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    type: 'installation' as const,
    status: 'pending' as const,
    assignedTo: '',
    scheduledDate: '',
    notes: ''
  });

  const assignees = Array.from(new Set(tasks.map(t => t.assignedTo))).filter(Boolean);
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesAssignee = !filterAssignee || task.assignedTo === filterAssignee;
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    const taskData = {
      ...formData,
      customerName: customer?.name || formData.customerName
    };
    
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      type: 'installation',
      status: 'pending',
      assignedTo: '',
      scheduledDate: '',
      notes: ''
    });
    setEditingTask(null);
    setShowModal(false);
  };

  const handleEdit = (task: Task) => {
    setFormData({
      customerId: task.customerId,
      customerName: task.customerName,
      type: task.type,
      status: task.status,
      assignedTo: task.assignedTo,
      scheduledDate: task.scheduledDate,
      notes: task.notes || ''
    });
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const updates: Partial<Task> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString();
    }
    updateTask(taskId, updates);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Installation Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage solar panel installations
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => exportData('tasks')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="block w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
        >
          <option value="">All Assignees</option>
          {assignees.map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(task.status)}
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {task.customerName}
                        </p>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <p>
                          {task.type.charAt(0).toUpperCase() + task.type.slice(1)} • 
                          Assigned to {task.assignedTo} • 
                          Scheduled for {format(new Date(task.scheduledDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {task.notes && (
                        <p className="mt-1 text-sm text-gray-600">{task.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status !== 'completed' && (
                      <div className="flex space-x-1">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Start
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new installation task.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={resetForm} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer</label>
                      <select
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.customerId}
                        onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                      >
                        <option value="">Select a customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.address}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        >
                          <option value="installation">Installation</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="inspection">Inspection</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                          placeholder="Team member name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                        <input
                          type="date"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.scheduledDate}
                          onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Additional notes or instructions..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingTask ? 'Update' : 'Add'} Task
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Installations;