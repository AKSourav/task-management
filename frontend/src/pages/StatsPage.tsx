import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  avgCompletionTimeHours: number;
}

interface PendingTaskStats {
  priority: string;
  timeLapsedHours: number;
  estimatedTimeLeftHours: number;
}

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [pendingTaskStats, setPendingTaskStats] = useState<PendingTaskStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/stats`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setStats(response.data);
        // console.log(response.data)
        setPendingTaskStats(response.data.pendingTaskStats);
        setLoading(false);
      } catch (error) {
        setError("Error fetching statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Task Statistics</h1>
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Home
        </Link>
      </div>

      {/* Overall Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Overall Task Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">Total Tasks</p>
            <p className="text-2xl">{stats?.totalTasks}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">Completed Tasks</p>
            <p className="text-2xl">{stats?.completedTasks}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">Pending Tasks</p>
            <p className="text-2xl">{stats?.pendingTasks}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">Completion Percentage</p>
            <p className="text-2xl">{stats?.completionPercentage.toFixed(2)}%</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">Avg Completion Time</p>
            <p className="text-2xl">{stats?.avgCompletionTimeHours} hours</p>
          </div>
        </div>
      </div>

      {/* Pending Task Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Task Statistics by Priority</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Time Lapsed (hrs)</th>
                <th className="px-4 py-2 text-left">Estimated Time Left (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {pendingTaskStats.map((task, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{task.priority}</td>
                  <td className="px-4 py-2">{task.timeLapsedHours}</td>
                  <td className="px-4 py-2">{task.estimatedTimeLeftHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
