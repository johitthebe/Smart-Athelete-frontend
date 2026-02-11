"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/component/Navbar";
import Sidebar from "@/app/component/coachsidebar";
import { API_BASE_URL } from "@/lib/config";

type Credential = {
  id: number;
  credential_type: string;
  credential_name: string;
  issuing_organization: string;
  issue_date: string;
  file_url: string;
  uploaded_at: string;
};

export default function CoachCredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    credential_type: "",
    credential_name: "",
    issuing_organization: "",
    issue_date: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coach/credentials/list/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCredentials(data);
      }
    } catch (err) {
      console.error("Error fetching credentials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("File type not supported. Please upload PDF, JPG, PNG, or DOCX");
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10485760) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!formData.credential_type || !formData.credential_name || !formData.issuing_organization || !formData.issue_date) {
      setError("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("credential_type", formData.credential_type);
      formDataToSend.append("credential_name", formData.credential_name);
      formDataToSend.append("issuing_organization", formData.issuing_organization);
      formDataToSend.append("issue_date", formData.issue_date);
      formDataToSend.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/auth/coach/credentials/`, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Credentials submitted for review");
        setShowUploadForm(false);
        setFormData({
          credential_type: "",
          credential_name: "",
          issuing_organization: "",
          issue_date: "",
        });
        setFile(null);
        fetchCredentials();
      } else {
        setError(data.error || "Failed to upload credential");
      }
    } catch (err) {
      setError("An error occurred while uploading");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this credential?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coach/credentials/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setSuccess("Credential deleted successfully");
        fetchCredentials();
      } else {
        setError("Failed to delete credential");
      }
    } catch (err) {
      setError("An error occurred while deleting");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-6 space-y-5">
          {/* Header */}
          <header>
            <h1 className="text-xl font-semibold text-gray-900">My Credentials</h1>
            <p className="text-sm text-gray-500">Manage your coaching credentials and certifications</p>
          </header>

          <div className="flex justify-end">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              {showUploadForm ? "Cancel" : "+ Upload Credential"}
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Upload Form */}
          {showUploadForm && (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Upload New Credential</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Credential Type
                    </label>
                    <select
                      value={formData.credential_type}
                      onChange={(e) => setFormData({ ...formData, credential_type: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Certification">Certification</option>
                      <option value="License">License</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Degree">Degree</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Credential Name
                    </label>
                    <input
                      type="text"
                      value={formData.credential_name}
                      onChange={(e) => setFormData({ ...formData, credential_name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                      placeholder="e.g., CPR Certification"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={formData.issuing_organization}
                      onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                      placeholder="e.g., Red Cross"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Upload File (PDF, JPG, PNG, DOCX - Max 10MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
                    required
                  />
                  {file && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:bg-gray-400"
                  >
                    {uploading ? "Uploading..." : "Upload Credential"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Credentials List */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Uploaded Credentials</h2>
              <p className="text-xs text-gray-500">
                {credentials.length} credential{credentials.length !== 1 ? "s" : ""} on file
              </p>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : credentials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500 mb-4">No credentials uploaded yet</p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                >
                  Upload Your First Credential
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="border-b bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Credential</th>
                      <th className="px-4 py-2 font-medium">Organization</th>
                      <th className="px-4 py-2 font-medium">Issue Date</th>
                      <th className="px-4 py-2 font-medium">Uploaded</th>
                      <th className="px-4 py-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {credentials.map((cred) => (
                      <tr key={cred.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{cred.credential_name}</div>
                          <div className="text-[11px] text-gray-500">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                              {cred.credential_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{cred.issuing_organization}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(cred.issue_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(cred.uploaded_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <a
                              href={cred.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] text-gray-800 hover:bg-gray-100"
                            >
                              View
                            </a>
                            <a
                              href={cred.file_url}
                              download
                              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] text-gray-800 hover:bg-gray-100"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => handleDelete(cred.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-red-300 px-3 py-1 text-[11px] text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
