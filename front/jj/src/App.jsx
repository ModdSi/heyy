import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Check,
  Clock,
  Users,
  Calendar,
  UserPlus,
  Settings,
  LogOut,
  AlertCircle,
} from "lucide-react";

export default function AttendanceSystem() {
  const [page, setPage] = useState("home");
  const [recognizing, setRecognizing] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Jane Smith",
      department: "Marketing",
      image: "/api/placeholder/100/100",
    },
    {
      id: 2,
      name: "John Doe",
      department: "Engineering",
      image: "/api/placeholder/100/100",
    },
    {
      id: 3,
      name: "Emma Wilson",
      department: "HR",
      image: "/api/placeholder/100/100",
    },
    {
      id: 4,
      name: "Michael Brown",
      department: "Finance",
      image: "/api/placeholder/100/100",
    },
  ]);

  const videoRef = useRef(null);

  // Function to simulate face recognition
  const recognizeFace = () => {
    setRecognizing(true);
    setTimeout(() => {
      setRecognizing(false);
      setRecognized(true);
      setUser(employees[0]);

      // Record attendance
      const now = new Date();
      setAttendance([
        ...attendance,
        {
          id: attendance.length + 1,
          employeeId: employees[0].id,
          employeeName: employees[0].name,
          time: now.toLocaleTimeString(),
          date: now.toLocaleDateString(),
        },
      ]);

      setTimeout(() => {
        setRecognized(false);
        setUser(null);
      }, 3000);
    }, 2000);
  };

  // Simulate webcam feed
  useEffect(() => {
    if (page === "home" && videoRef.current) {
      // This would be where you'd actually connect to a webcam
      // For demo purposes, we'll just use a placeholder
    }
  }, [page]);

  // Page navigation
  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <div className="flex flex-col items-center justify-start w-full">
            <div className="relative w-full max-w-lg h-96 bg-gray-800 rounded-lg mb-6 overflow-hidden">
              {/* Placeholder for webcam */}
              <img
                src="/api/placeholder/600/500"
                alt="Webcam feed"
                className="w-full h-full object-cover"
              />

              {/* Face recognition overlay */}
              {recognizing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                  <div className="animate-pulse">
                    <Camera size={48} className="mb-4" />
                    <p className="text-xl font-semibold">Recognizing...</p>
                  </div>
                </div>
              )}

              {/* Success overlay */}
              {recognized && user && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500 bg-opacity-80 text-white">
                  <Check size={48} className="mb-4" />
                  <p className="text-2xl font-bold">{user.name}</p>
                  <p className="text-xl">{user.department}</p>
                  <p className="mt-2 text-lg">Attendance Recorded</p>
                  <p className="text-lg">{new Date().toLocaleTimeString()}</p>
                </div>
              )}
            </div>

            <button
              onClick={recognizeFace}
              disabled={recognizing}
              className={`py-4 px-8 rounded-full bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors ${
                recognizing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {recognizing ? "Processing..." : "Check In/Out"}
            </button>

            <div className="mt-8 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
              <div className="bg-white rounded-lg shadow p-4 max-h-64 overflow-y-auto">
                {attendance.length > 0 ? (
                  <div className="space-y-3">
                    {attendance
                      .slice()
                      .reverse()
                      .map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">{record.employeeName}</p>
                            <p className="text-sm text-gray-600">
                              {record.date}
                            </p>
                          </div>
                          <p className="text-blue-600 font-semibold">
                            {record.time}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "employees":
        return (
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Employees</h2>
              <button className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <UserPlus size={16} />
                <span>Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center"
                >
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-gray-600">{employee.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">Attendance Reports</h2>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
              </div>
              <button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                Generate Report
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Employee
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Department
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Check In
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Check Out
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4">Jane Smith</td>
                    <td className="py-3 px-4">Marketing</td>
                    <td className="py-3 px-4">04/20/2025</td>
                    <td className="py-3 px-4">9:05 AM</td>
                    <td className="py-3 px-4">5:15 PM</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">John Doe</td>
                    <td className="py-3 px-4">Engineering</td>
                    <td className="py-3 px-4">04/20/2025</td>
                    <td className="py-3 px-4">8:45 AM</td>
                    <td className="py-3 px-4">5:30 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Face Recognition Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <span>Enable face detection</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <span>Require confirmation on recognition</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recognition confidence threshold
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="75"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low security</span>
                      <span>High security</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">
                  Notification Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <span>Email notifications for late arrivals</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <span>Daily attendance reports</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-blue-800 text-white">
        <div className="p-4 md:p-6">
          <h1 className="text-xs md:text-xl font-bold truncate">FaceTime</h1>
          <p className="hidden md:block text-sm text-blue-300">
            Attendance System
          </p>
        </div>

        <nav className="mt-8">
          <button
            onClick={() => setPage("home")}
            className={`w-full flex items-center ${
              page === "home" ? "bg-blue-900" : "hover:bg-blue-700"
            } p-3 md:px-6 text-left`}
          >
            <Camera size={20} className="mx-auto md:mx-0 md:mr-3" />
            <span className="hidden md:inline">Check In/Out</span>
          </button>

          <button
            onClick={() => setPage("employees")}
            className={`w-full flex items-center ${
              page === "employees" ? "bg-blue-900" : "hover:bg-blue-700"
            } p-3 md:px-6 text-left`}
          >
            <Users size={20} className="mx-auto md:mx-0 md:mr-3" />
            <span className="hidden md:inline">Employees</span>
          </button>

          <button
            onClick={() => setPage("reports")}
            className={`w-full flex items-center ${
              page === "reports" ? "bg-blue-900" : "hover:bg-blue-700"
            } p-3 md:px-6 text-left`}
          >
            <Calendar size={20} className="mx-auto md:mx-0 md:mr-3" />
            <span className="hidden md:inline">Reports</span>
          </button>

          <button
            onClick={() => setPage("settings")}
            className={`w-full flex items-center ${
              page === "settings" ? "bg-blue-900" : "hover:bg-blue-700"
            } p-3 md:px-6 text-left`}
          >
            <Settings size={20} className="mx-auto md:mx-0 md:mr-3" />
            <span className="hidden md:inline">Settings</span>
          </button>

          <div className="mt-auto pt-8">
            <button className="w-full flex items-center hover:bg-blue-700 p-3 md:px-6 text-left">
              <LogOut size={20} className="mx-auto md:mx-0 md:mr-3" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </h2>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-600">System Administrator</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  );
}
