// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Check, Clock, Edit, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../components/ui/Table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: number;
    status: 'pending' | 'completed';
    createdAt: string;
    startTime?: string;
    endTime?: string;
}

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: '3',
        startTime: '',
        endTime: ''
    });
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks`,
                newTask,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 201) {
                setIsCreateDialogOpen(false);
                setNewTask({ title: '', description: '', priority: '3', startTime: '', endTime: '' });
                fetchTasks();
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTask) return;

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${editTask._id}`,
                editTask,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                setIsEditDialogOpen(false);
                setEditTask(null);
                fetchTasks();
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: 'pending' | 'completed') => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`,
                { status: newStatus },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                fetchTasks();
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.priority.toString() === filter;
    });

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1: return 'text-red-500 bg-red-50';
            case 2: return 'text-orange-500 bg-orange-50';
            case 3: return 'text-yellow-500 bg-yellow-50';
            case 4: return 'text-blue-500 bg-blue-50';
            case 5: return 'text-green-500 bg-green-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const PrioritySelect = ({ value, onChange }: { 
        value: string; 
        onChange: (value: string) => void;
    }) => (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Priorities</option>
          <option value="1">High Priority</option>
          <option value="2">Important</option>
          <option value="3">Medium</option>
          <option value="4">Low Priority</option>
          <option value="5">Optional</option>
        </select>
    );
    const InputPrioritySelect = ({ value, onChange }: { 
        value: string; 
        onChange: (value: string) => void;
    }) => (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {/* <option value="all">All Priorities</option> */}
          <option value="1">High Priority</option>
          <option value="2">Important</option>
          <option value="3">Medium</option>
          <option value="4">Low Priority</option>
          {/* <option value="5">Optional</option> */}
        </select>
    );

    return (
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Tasks Dashboard</h1>
            <div className='flex justify-between'>
              <Button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload()
              }} className='bg-red-500 p-4 hover:bg-red-300'>
                Log Out
              </Button>
              <Button style={{color:"black"}} onClick={() => navigate('/stats')} className='bg-slate-100 text-black p-4 mx-2'>
                Stats
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Task
              </Button>
            </div>
          </div>
    
          <div className="mb-6">
            <PrioritySelect
              value={filter}
              onChange={(value) => setFilter(value)}
            />
          </div>
    
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                        {task.priority === 1 ? 'High Priority' :
                         task.priority === 2 ? 'Important' :
                         task.priority === 3 ? 'Medium' :
                         task.priority === 4 ? 'Low Priority' : 'Optional'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>{task.startTime || 'N/A'}</TableCell>
                    <TableCell>{task.endTime || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(
                            task._id,
                            task.status === 'completed' ? 'pending' : 'completed'
                          )}
                        >
                          {task.status === 'completed' ? (
                            <>
                              <Clock className="h-4 w-4 mr-1" />
                              Mark Pending
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Mark Complete
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditTask(task);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
    
          <Dialog 
            open={isCreateDialogOpen} 
            onClose={()=>setIsCreateDialogOpen(false)}
            >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium">
                    Priority
                  </label>
                  <InputPrioritySelect
                    value={newTask.priority}
                    onChange={(value) => setNewTask({ ...newTask, priority: value })}
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium">
                    Start Time
                  </label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium">
                    End Time
                  </label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={newTask.endTime}
                    onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog 
            open={isEditDialogOpen} 
            onClose={()=>setIsEditDialogOpen(false)}
            >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={editTask?.title || ''}
                    onChange={(e) => setEditTask({ ...editTask!, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    value={editTask?.description || ''}
                    onChange={(e) => setEditTask({ ...editTask!, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium">
                    Priority
                  </label>
                  <InputPrioritySelect
                    value={editTask?.priority.toString() || '3'}
                    onChange={(value) => setEditTask({ ...editTask!, priority: parseInt(value) })}
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium">
                    Start Time
                  </label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={editTask?.startTime || ''}
                    onChange={(e) => setEditTask({ ...editTask!, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium">
                    End Time
                  </label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={editTask?.endTime || ''}
                    onChange={(e) => setEditTask({ ...editTask!, endTime: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
    );
};

export default Dashboard;

