document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accountForm');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileUpload');
    const filePreview = document.getElementById('filePreview');
    const successModal = document.getElementById('successModal');
    const reqIdSpan = document.getElementById('reqId');

    // Drag & Drop Functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                filePreview.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--success);">
                        <i class="fa-solid fa-file-circle-check"></i>
                        <span>${file.name} (${formatBytes(file.size)})</span>
                    </div>
                `;
            }
        }
    }

    function validateFile(file) {
        // Just a basic check for demo
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image (JPG/PNG) or PDF.');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size exceeds 5MB limit.');
            return false;
        }
        return true;
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate Processing
        const btn = form.querySelector('.submit-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
            // Generate Random ID
            const reqId = Math.floor(100000 + Math.random() * 900000);
            reqIdSpan.textContent = reqId;

            // Show Modal
            successModal.style.display = 'flex';
            // Trigger reflow for transition
            successModal.offsetHeight;
            successModal.classList.add('show');

            // Reset Button
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });
});

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('accountForm').reset();
        document.getElementById('filePreview').innerHTML = '';
    }, 300);
}
