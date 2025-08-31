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

// Upload file to server
const upload = async () => {
    if (!currentFile) {
        uploadMessageArea.textContent = 'No file selected';
        return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        uploadMessageArea.textContent = 'Please login first';
        return;
    }

    const uploadBtn = document.querySelector('#uploadBtn');

    try {
        // Disable upload button and show loading state
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        const formData = new FormData();
        formData.append('file', currentFile);

        // Send file to backend
        const response = await fetch('/api/file/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            uploadMessageArea.textContent = 'File uploaded successfully!';
            uploadedFileName = currentFile.name; // Store uploaded filename
            window.uploadedFileName = uploadedFileName; // Make globally accessible
            uploadBtn.textContent = 'Upload File';
        } else if (response.status === 401) {
            uploadMessageArea.textContent = 'Unauthorized: Please login again';
            uploadBtn.textContent = 'Upload File';
        } else {
            uploadMessageArea.textContent = `Error uploading file: ${result.message || 'Unknown error'}`;
            uploadBtn.textContent = 'Upload File';
        }
    } catch(error) {
        console.error('Error uploading file:', error);
        uploadMessageArea.textContent = 'Network error: Unable to upload file';
        uploadBtn.textContent = 'Upload File';
    }

    uploadBtn.disabled = false;
}

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