import React, { useState, useEffect, useRef } from "react";
import { Camera, Check, AlertCircle } from "lucide-react";
import { faceAPI, attendanceAPI } from "../api";
import { initializeWebcam, detectFaces } from "../utils/webcamUtils";

const CheckIn = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recognizing, setRecognizing] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  // Initialize webcam on component mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const videoStream = await initializeWebcam(videoRef);
        setStream(videoStream);
      } catch (err) {
        setError("Could not access camera. Please check permissions.");
      }
    };

    initCamera();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Load recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const res = await attendanceAPI.getAllAttendance({
          limit: 10,
          sort: "-timestamp",
        });
        setRecentActivity(res.data);
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };

    fetchRecentActivity();
    // Set up polling or websocket in production
  }, []);

  // Handle face recognition
  const handleRecognition = async () => {
    try {
      if (!videoRef.current) return;

      setRecognizing(true);
      setError(null);

      // Detect faces in the current video frame
      const faceDetectionResult = await detectFaces(videoRef.current);

      if (!faceDetectionResult.detected) {
        setError(
          "No face detected. Please position yourself in front of the camera."
        );
        setRecognizing(false);
        return;
      }

      // Send face data to server for recognition
      const recognitionRes = await faceAPI.recognizeFace(
        faceDetectionResult.faceData
      );

      if (recognitionRes.data.recognized) {
        setUser(recognitionRes.data.employee);
        setRecognized(true);

        // Record attendance
        const attendanceRes = await attendanceAPI.createAttendance({
          employeeId: recognitionRes.data.employee._id,
          verificationMethod: "FACE",
        });

        // Update recent activity
        setRecentActivity((prevActivity) =>
          [attendanceRes.data, ...prevActivity].slice(0, 10)
        );

        // Reset after 3 seconds
        setTimeout(() => {
          setRecognized(false);
          setUser(null);
        }, 3000);
      } else {
        setError("Face not recognized. Please try again or contact admin.");
      }
    } catch (err) {
      setError("Recognition failed. Please try again.");
      console.error("Face recognition error:", err);
    } finally {
      setRecognizing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <div className="relative w-full max-w-lg h-96 bg-gray-800 rounded-lg mb-6 overflow-hidden">
        {/* Video element for webcam */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Processing overlay */}
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

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500 bg-opacity-80 text-white">
            <AlertCircle size={48} className="mb-4" />
            <p className="text-xl font-semibold text-center px-4">{error}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleRecognition}
        disabled={recognizing}
        className={`py-4 px-8 rounded-full bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors ${
          recognizing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {recognizing ? "Processing..." : "Check In/Out"}
      </button>

      {/* Recent Activity */}
      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-4 max-h-64 overflow-y-auto">
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{record.employeeId.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-semibold">
                      {record.type === "CHECK_IN" ? "In" : "Out"}
                    </p>
                    <p className="text-sm">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
