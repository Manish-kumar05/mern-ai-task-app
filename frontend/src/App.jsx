import { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [operation, setOperation] = useState("uppercase");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);

    const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmI4MWU1YjI5MTNmMzU5OTNhNWRlOSIsImlhdCI6MTc3ODE2NjQ3NiwiZXhwIjoxNzc4MjUyODc2fQ.t_bTTp46JI0dAc_5MtAYelQtqZJjMRi-MmKiyKTYXMY";

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          title: "Text Task",
          inputText: text,
          operation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setResult(data.result);
      setText("");

      fetchTasks();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
        fontFamily: "Arial",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "25px",
          alignItems: "start",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "white",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              marginBottom: "10px",
              fontSize: "56px",
              lineHeight: "1.1",
            }}
          >
           MERN AI Task App
          </h1>

          <p
            style={{
              color: "#666",
              marginBottom: "25px",
              fontSize: "18px",
            }}
          >
            Enter text and choose an operation to process it.
          </p>

          <textarea
            rows="6"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
              resize: "none",
              outline: "none",
            }}
          />

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
            }}
          >
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="reverse">Reverse</option>
            <option value="word_count">Word Count</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: loading ? "#94a3b8" : "#2563eb",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Processing..." : "Process Text"}
          </button>

          {loading && (
  <p
    style={{
      marginTop: "15px",
      color: "#2563eb",
      fontWeight: "bold",
    }}
  >
    AI is processing your text...
  </p>
)}

{error && (
  <p
    style={{
      color: "red",
      marginTop: "15px",
      fontWeight: "bold",
    }}
  >
    {error}
  </p>
)}

{result && (
  <div
    style={{
      marginTop: "25px",
      padding: "18px",
      background: "#f1f5f9",
      borderRadius: "12px",
      textAlign: "left",
    }}
  >
    <h3>Latest Result:</h3>

    <p
      style={{
        fontSize: "20px",
        color: "#334155",
        wordBreak: "break-word",
      }}
    >
      {result}
    </p>
  </div>
)}

          
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              fontSize: "38px",
            }}
          >
            Task History
          </h2>

          {tasks.length === 0 ? (
            <p style={{ color: "#666", textAlign: "center" }}>
              No tasks yet.
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                style={{
                  background: "#f8fafc",
                  padding: "18px",
                  borderRadius: "14px",
                  marginBottom: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p>
                  <strong>Operation:</strong> {task.operation}
                </p>

                <p>
                  <strong>Input:</strong> {task.inputText}
                </p>

                <p>
                  <strong>Result:</strong> {task.result}
                </p>

                <p
                  style={{
                    color: "#16a34a",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Status:</strong> {task.status}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;