// script.js

const urlForm = document.getElementById('urlForm');
const shortUrlContainer = document.getElementById('shortUrlContainer');
const shortUrlSpan = document.getElementById('shortUrl');

urlForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const longUrlInput = document.getElementById('longUrl');
    const longUrl = longUrlInput.value.trim();
    
    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: longUrl })
        });
        
        if (!response.ok) {
            throw new Error('Failed to shorten URL');
        }
        
        const data = await response.json();
        shortUrlSpan.textContent = data.url;
        shortUrlContainer.style.display = 'block';
    } catch (error) {
        console.error(error.message);
        shortUrlSpan.textContent = 'Error: Unable to shorten URL';
        shortUrlContainer.style.display = 'block';
    }
});
