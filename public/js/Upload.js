const token = localStorage.getItem('token');
const uploadMessageArea = document.querySelector('#uploadMessage');
let currentFile = null;

let uploadedFileName = null; // Store the uploaded filename globally

// Trigger the hidden file input (simulate clicking the input element)
const openFilePicker = () => {
    const fileInput = document.querySelector('#fileInput');
    fileInput.click();
}

// Handle file selection
const selectFile = async () => {
    const fileInput = document.querySelector('#fileInput');
    const fileInfo = document.querySelector('#fileInfo');
    const uploadBtn = document.querySelector('#uploadBtn');
    const fileName = document.querySelector('#fileName');
    const fileSize = document.querySelector('#fileSize');
    const fileType = document.querySelector('#fileType');

    // No file selected → stop
    if (!fileInput.files.length) return;
    const file = fileInput.files[0];
    currentFile = file;

    // Display file information
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileType.textContent = file.type || 'Unknown';
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;

    // Clear any previously stored uploaded file name
    uploadedFileName = null;
    window.uploadedFileName = null;

    showMessage('File selected successfully!', 'success');
}

// Convert file size into human-readable format
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Upload file + observation details
const upload = async () => {
    if (!currentFile) {
        uploadMessageArea.textContent = "No file selected";
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        uploadMessageArea.textContent = "Please login first";
        return;
    }

    const uploadBtn = document.querySelector("#uploadBtn");
    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    try {
        // 1. upload file to S3
        const formData = new FormData();
        formData.append("file", currentFile);

        const response = await fetch("/api/file/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            uploadMessageArea.textContent = `❌ Error uploading file: ${result.message || "Unknown error"}`;
            return;
        }

        const fileURL = result.fileURL;

        // 2. write metadata to DynamoDB
        const metadataRes = await fetch("/api/observations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                species: document.querySelector("#speciesSearch").value,
                year: document.querySelector("#year").value,
                month: document.querySelector("#month").value,
                day: document.querySelector("#day").value,
                location: document.querySelector("#savedLocations").value,
                comment: document.querySelector("#comment").value,
                fileURL: fileURL,
            }),
        });

        const metadataResult = await metadataRes.json();

        if (metadataRes.ok) {
            uploadMessageArea.innerHTML = `
                ✅ File + metadata saved<br>
                <strong>ID:</strong> ${metadataResult.observationId}<br>
                <strong>Species:</strong> ${document.querySelector("#speciesSearch").value}<br>
                <strong>Date:</strong> ${document.querySelector("#year").value}-${document.querySelector("#month").value}-${document.querySelector("#day").value}<br>
                <strong>Location:</strong> ${document.querySelector("#savedLocations").value}<br>
                <strong>Comment:</strong> ${document.querySelector("#comment").value}<br>
                <strong>File URL:</strong> <a href="${fileURL}" target="_blank">${fileURL}</a>
            `;
        } else {
            uploadMessageArea.textContent = `❌ Error saving metadata: ${metadataResult.message}`;
        }

    } catch (error) {
        console.error("Error uploading file + metadata:", error);
        uploadMessageArea.textContent = `Network error: ${error.message}`;
    } finally {
        uploadBtn.textContent = "Upload File";
        uploadBtn.disabled = false;
    }
};



// Display a message in the UI
const showMessage = (message, type = 'info') => {
    uploadMessageArea.textContent = message;
    uploadMessageArea.className = `message-area ${type}`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // File input change triggers file selection handler
    const fileInput = document.querySelector('#fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', selectFile);
    }
});

