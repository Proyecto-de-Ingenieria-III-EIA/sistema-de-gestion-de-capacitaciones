"use client";

import { useState } from "react";

interface FileUploadProps {
  onUpload: (file: File) => void; 
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <input
        type="file"
        accept="*/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {selectedFile && (
        <p className="text-sm text-gray-600">
          Selected file: <span className="font-medium">{selectedFile.name}</span>
        </p>
      )}
    </div>
  );
}