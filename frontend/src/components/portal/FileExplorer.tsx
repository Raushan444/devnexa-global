"use client";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";
import { FileText, Download, Trash2, Upload, AlertCircle, RefreshCw } from "lucide-react";

interface UploadedFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

interface FileExplorerProps {
  projectId: number;
}

export default function FileExplorer({ projectId }: FileExplorerProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    setErrorMsg("");
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/portal/files/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      } else {
        setErrorMsg("Failed to retrieve file assets.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to file service API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", targetFile);
    formData.append("projectId", projectId.toString());

    try {
      const res = await fetch(`${API_BASE_URL}/api/portal/files/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setSuccessMsg("File uploaded successfully.");
        fetchFiles();
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to upload file.");
      }
    } catch (err) {
      setErrorMsg("File upload failed. Ensure server connection is active.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/portal/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg("Document deleted.");
        fetchFiles();
      } else {
        setErrorMsg("Failed to delete file.");
      }
    } catch (err) {
      setErrorMsg("Delete failed.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-grotesk text-xl font-bold text-white">Project Documents</h3>
          <p className="font-sans text-xs text-slate-500">Shared asset registry and specification wireframes.</p>
        </div>

        <label className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-xs font-bold text-white shadow-lg cursor-pointer hover:scale-[1.01] transition-all flex items-center gap-2">
          {uploading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </>
          )}
          <input type="file" disabled={uploading} onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 skeleton w-full" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="border border-dashed border-white/5 rounded-2xl p-12 text-center text-slate-500 font-sans text-xs">
          No documents uploaded yet. Share assets by clicking the upload button above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-4 bg-[#050816] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all font-sans text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                  <FileText className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <div>
                  <h5 className="font-semibold text-white leading-tight">{file.fileName}</h5>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    {formatSize(file.fileSize)} • {file.fileType.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`${API_BASE_URL}/api/portal/files/download/${file.fileName}`}
                  download
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleFileDelete(file.id)}
                  className="p-2 bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
