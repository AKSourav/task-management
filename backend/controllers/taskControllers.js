const Task = require('../models/Task');

const createTask = async (req, res)=>{
    try {
      const task = new Task({
        ...req.body,
        userId: req.user._id
      });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

const getTasks = async (req, res)=>{
    try {
      const { priority, status, sortBy } = req.query;
      const { userId } = req.params;
      
      const query={}
      query.userId= userId || req.user._id;
      if (priority) query.priority = priority;
      if (status) query.status = status;
      
      const sortOptions = {};
      if (sortBy && sortBy.toLowerCase() === 'startTime'.toLowerCase()) sortOptions.startTime = 1;
      if (sortBy && sortBy.toLowerCase() === 'endTime'.toLowerCase()) sortOptions.endTime = 1;
      
      const tasks = await Task.find(query).sort(sortOptions);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

const getStatistics = async (req, res)=>{
  // console.log("jee")
    try {
      const currentTime = new Date();
      const userId = req.user._id;
      const stats = await Task.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            },
            pendingTasks: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
            },
            // Calculate average completion time for finished tasks
            avgCompletionTime: {
              $avg: {
                $cond: [
                  { $eq: ["$status", "completed"] },
                  { $divide: [{ $subtract: ["$endTime", "$startTime"] }, 3600000] }, // Convert to hours
                  null
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalTasks: 1,
            completedTasks: 1,
            pendingTasks: 1,
            completionPercentage: {
              $multiply: [
                { $divide: ["$completedTasks", "$totalTasks"] },
                100
              ]
            },
            avgCompletionTimeHours: { $round: ["$avgCompletionTime", 2] }
          }
        }
      ]);

      // Calculate time statistics for pending tasks by priority
      const pendingTaskStats = await Task.aggregate([
        {
          $match: {
            userId: userId,
            status: "pending"
          }
        },
        {
          $group: {
            _id: "$priority",
            timeLapsed: {
              $sum: {
                $divide: [
                  { $subtract: [currentTime, "$startTime"] },
                  3600000
                ]
              }
            },
            estimatedTimeLeft: {
              $sum: {
                $max: [
                  {
                    $divide: [
                      { $subtract: ["$endTime", currentTime] },
                      3600000
                    ]
                  },
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            priority: "$_id",
            timeLapsedHours: { $round: ["$timeLapsed", 2] },
            estimatedTimeLeftHours: { $round: ["$estimatedTimeLeft", 2] }
          }
        }
      ]);

      res.json({
        ...stats[0],
        pendingTaskStats
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const deleteTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user._id;
  
      // Find and delete the task
      const task = await Task.findOneAndDelete({_id:taskId,userId});
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user._id
  
      // Find and update the task
      const task = await Task.findOneAndUpdate({
        _id:taskId,
        userId: userId
      }, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Validate fields before saving
      });
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

module.exports = {createTask, getTasks, getStatistics,deleteTask, updateTask};
