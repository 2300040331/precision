// cms-client.js
// This script makes your static HTML site dynamic by connecting to the CMS API

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch global settings and content from our Node API
    const response = await fetch('http://localhost:5000/api/settings');
    
    if (response.ok) {
      const cmsData = await response.json();
      
      // Select all elements tagged with data-cms
      // Example: <h1 data-cms="heroTitle">Precision in Numbers.</h1>
      const editableElements = document.querySelectorAll('[data-cms]');
      
      editableElements.forEach(element => {
        const key = element.getAttribute('data-cms');
        if (cmsData[key]) {
          // If the element is an image, update src. Otherwise update text.
          if (element.tagName === 'IMG') {
            element.src = cmsData[key];
          } else {
            element.innerHTML = cmsData[key];
          }
        }
      });
    }
  } catch (error) {
    console.error('CMS Integration Error:', error);
    // Silent failure allows the static HTML to still function exactly as it did before!
  }
});
