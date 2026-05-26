"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/app/component/ToastContainer";

type Credential = {
  id: number;
  credential_type: string;
  credential_name: string;
  issuing_organization: string;
  issue_date: string;
  file: string;
  uploaded_at: string;
};

export default function CoachCredentialsPage() {
  const toast = useToast();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    credential_type: "",
    credential_name: "",
    issuing_organization: "",
    issue_date: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/coach/credentials/list/`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCredentials(data);
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);

    try {
      let csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];

      if (!csrfToken) {
        await fetch(`${API_BASE_URL}/api/csrf/`, { credentials: "include" });
        csrfToken = document.cookie.split("csrftoken=")[1]?.split(";")[0];
      }

      const formDataToSend = new FormData();
      formDataToSend.append("credential_type", formData.credential_type);
      formDataToSend.append("credential_name", formData.credential_name);
      formDataToSend.append("issuing_organization", formData.issuing_organization);
      formDataToSend.append("issue_date", formData.issue_date);
      formDataToSend.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/api/auth/coach/credentials/`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Credential uploaded successfully! 🎉");
        setShowUploadForm(false);
        setFormData({
          credential_type: "",
          credential_name: "",
          issuing_organization: "",
          issue_date: "",
        });
        setSelectedFile(null);
        fetchCredentials();
      } else {
        const error = await response.json();
        toast.error(`Failed to upload credential: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading credential:", error);
      toast.error("Failed to upload credential");
    } finally {
      setUploading(false);
    }
  };

  const getFileUrl = (filePath: string) => {
    if (filePath.startsWith("http")) {
      return filePath;
    }
    return `${API_BASE_URL}${filePath}`;
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">My Credentials</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your coaching certifications and documents</p>
      </header>

      <div className="flex justify-end">
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
        >
          {showUploadForm ? "Cancel" : "+ Upload Credential"}
        </button>
      </div>

        {showUploadForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Credential</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential Type *
                  </label>
                  <select
                    value={formData.credential_type}
                    onChange={(e) => setFormData({ ...formData, credential_type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential Name *
                  </label>
                  <input
                    type="text"
                    value={formData.credential_name}
                    onChange={(e) => setFormData({ ...formData, credential_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., NASM Certified Personal Trainer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={formData.issuing_organization}
                    onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., National Academy of Sports Medicine"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Document * (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                {selectedFile && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload Credential"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Uploaded Credentials</h2>
            <p className="text-sm text-gray-500 mt-1">{credentials.length} credential{credentials.length !== 1 ? "s" : ""}</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading credentials...</p>
            </div>
          ) : credentials.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-base font-medium text-gray-900 mb-1">No credentials uploaded yet</p>
              <p className="text-sm text-gray-500 mb-4">Upload your coaching certifications to get approved</p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Upload Your First Credential
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {credentials.map((credential) => (
                <div key={credential.id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{credential.credential_name}</h3>
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {credential.credential_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Issued by: {credential.issuing_organization}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Issue Date: {new Date(credential.issue_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Uploaded: {new Date(credential.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <a
                      href={getFileUrl(credential.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
