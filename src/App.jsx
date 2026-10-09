import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/jobs";

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      setMessage("Unable to connect to the backend.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
          editingId ? `${API_URL}/${editingId}` : API_URL,
          {
            method: editingId ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setMessage(editingId ? "Job updated successfully!" : "Job added successfully!");

      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
      });

      setEditingId(null);
      fetchJobs();
    } catch (error) {
      setMessage("Operation failed. Please check the backend.");
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
    });

    setEditingId(job.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMessage("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      setMessage("Unable to delete the job.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      company: "",
      location: "",
      description: "",
    });
    setMessage("");
  };

  return (
      <div className="app">
        <header className="header">
          <h1>Online Job Portal</h1>
          <p>Find and manage job opportunities</p>
        </header>

        <main className="container">
          <section className="form-section">
            <h2>{editingId ? "Update Job" : "Add New Job"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  name="title"
                  placeholder="Job Title"
                  value={form.title}
                  onChange={handleChange}
                  required
              />

              <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={form.company}
                  onChange={handleChange}
                  required
              />

              <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  required
              />

              <textarea
                  name="description"
                  placeholder="Job Description"
                  value={form.description}
                  onChange={handleChange}
                  required
              />

              <div className="form-buttons">
                <button type="submit">
                  {editingId ? "Update Job" : "Add Job"}
                </button>

                {editingId && (
                    <button type="button" className="cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                )}
              </div>
            </form>

            {message && <p className="message">{message}</p>}
          </section>

          <section className="jobs-section">
            <h2>Available Jobs</h2>

            {jobs.length === 0 ? (
                <p className="empty">No jobs available.</p>
            ) : (
                <div className="job-list">
                  {jobs.map((job) => (
                      <div className="job-card" key={job.id}>
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Description:</strong> {job.description}</p>

                        <div className="card-buttons">
                          <button onClick={() => handleEdit(job)}>
                            Edit
                          </button>

                          <button
                              className="delete"
                              onClick={() => handleDelete(job.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </section>
        </main>
      </div>
  );
}

export default App;