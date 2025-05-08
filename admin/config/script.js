import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// 🔁 Replace this with your actual Firebase config
const firebaseConfig = {
apiKey: "AIzaSyAqzjDSYawZr9IdPR8Yr5pIhTxdei10DRA",
authDomain: "travel-agency-3ea70.firebaseapp.com",
projectId: "travel-agency-3ea70",
storageBucket: "travel-agency-3ea70.firebasestorage.app",
messagingSenderId: "630304664282",
appId: "1:630304664282:web:12a885b210b77cf77f53e3",
measurementId: "G-GM0QYDSV1F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded",()=>{

  const form = document.getElementById("tourForm");
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("image");
const fileName = document.getElementById("fileName");
const submitBtn = form.querySelector("button[type='submit']");
const normalText = form.querySelector(".normal-text");
const loadingSpinner = form.querySelector(".loading-spinner");
const successMessage = document.querySelector(".success-message");

// File upload interactions
dropArea.addEventListener("click", () => {
  fileInput.click();
});

// Show file name and preview when selected
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");
const removePreview = document.getElementById("removePreview");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    const file = fileInput.files[0];
    fileName.textContent = `Selected: ${file.name}`;
    fileName.style.display = "block";
    
    // Show image preview
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      imagePreviewContainer.style.display = "block";
    }
    reader.readAsDataURL(file);
  } else {
    fileName.style.display = "none";
    imagePreviewContainer.style.display = "none";
  }
});

// Remove preview button
removePreview.addEventListener("click", () => {
  imagePreviewContainer.style.display = "none";
  fileInput.value = "";
  fileName.style.display = "none";
  document.getElementById('dimensionError').style.display = "none";
});

// Drag and drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  dropArea.classList.add('border-primary');
  dropArea.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
}

function unhighlight() {
  dropArea.classList.remove('border-primary');
  dropArea.style.backgroundColor = '';
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  if (files.length && files[0].type.startsWith('image/')) {
    fileInput.files = files;
    const file = files[0];
    fileName.textContent = `Selected: ${file.name}`;
    fileName.style.display = "block";
    
    // Show image preview
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      imagePreviewContainer.style.display = "block";
    }
    reader.readAsDataURL(file);
  }
}

function validateImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      if (img.naturalWidth > 800 || img.naturalHeight > 600) {
        reject('Image must be under 800px width and 600px height');
      } else {
        resolve();
      }
    };
    
    img.onerror = () => reject('Invalid image file');
  });
}

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Loading state
  normalText.style.display = "none";
  loadingSpinner.style.display = "inline-block";
  submitBtn.disabled = true;
  successMessage.style.display = "none";

  const imageFile = form.image.files[0];
  const storageRef = ref(storage, `tourImages/${Date.now()}_${imageFile.name}`);

  try {
    
    await validateImage(imageFile);
    dimensionError.style.display = "none";

    // Upload to Firebase
    const storageRef = ref(storage, `tourImages/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await addDoc(collection(db, "tourPackages"), {
      image: downloadURL,
      location: form.location.value,
      title: form.title.value,
      type: form.type.value,
    });

    // Show success message
    successMessage.style.display = "block";
    form.reset();
    fileName.style.display = "none";
    imagePreviewContainer.style.display = "none";
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Reset button state
    normalText.style.display = "inline-block";
    loadingSpinner.style.display = "none";
    submitBtn.disabled = false;
  } catch (err) {
    console.error("Error adding tour package:", err);
    alert("Failed to add tour. See console.");
    
    // Reset button state
    normalText.style.display = "inline-block";
    loadingSpinner.style.display = "none";
    submitBtn.disabled = false;
  }
});

})
