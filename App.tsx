import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type TabType = 'All' | 'Active' | 'Completed';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTab, setCurrentTab] = useState<TabType>('All');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const deleteAllCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (currentTab === 'Active') return !task.completed;
    if (currentTab === 'Completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-[#333333] flex flex-col items-center pt-8 px-4">
      <div className="w-full max-w-[600px]">
        <h1 className="text-4xl font-bold text-center mb-8 tracking-tight">#todo</h1>

        {/* Tabs */}
        <div className="flex border-bottom border-[#BDBDBD] mb-6 relative">
          {(['All', 'Active', 'Completed'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                currentTab === tab ? 'text-[#333333]' : 'text-[#333333] opacity-60 hover:opacity-100'
              }`}
            >
              {tab}
              {currentTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#2F80ED] rounded-t-lg"
                />
              )}
            </button>
          ))}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#BDBDBD] -z-10" />
        </div>

        {/* Add Task Form - Only in All and Active tabs */}
        {(currentTab === 'All' || currentTab === 'Active') && (
          <form onSubmit={addTask} className="flex gap-2 mb-8">
            <input
              type="text"
              placeholder="add details"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 border border-[#BDBDBD] rounded-xl focus:outline-none focus:border-[#2F80ED] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#2F80ED] text-white px-10 py-3 rounded-xl font-semibold shadow-sm hover:bg-[#2D74D7] transition-colors flex items-center gap-2"
            >
              Add
            </button>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-6 h-6 border-2 border-[#BDBDBD] rounded cursor-pointer appearance-none checked:bg-[#2F80ED] checked:border-[#2F80ED] transition-all"
                    />
                    {task.completed && (
                      <svg
                        className="absolute w-4 h-4 text-white pointer-events-none left-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-lg font-medium transition-all ${
                      task.completed ? 'line-through text-[#333333] opacity-50' : 'text-[#333333]'
                    }`}
                  >
                    {task.text}
                  </span>
                </div>

                {currentTab === 'Completed' && (
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-[#BDBDBD] hover:text-red-500 transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Delete All Button - Only in Completed tab if there are completed tasks */}
        {currentTab === 'Completed' && tasks.some(t => t.completed) && (
          <div className="flex justify-end mt-8">
            <button
              onClick={deleteAllCompleted}
              className="bg-[#EB5757] text-white px-6 py-3 rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-[#df4e4e] transition-colors"
            >
              <Trash2 size={16} />
              delete all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
