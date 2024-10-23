document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    const sectionButtons = document.getElementById('sectionButtons');
    for (let i = 1; i <= 6; i++) {
        const button = document.createElement('a');
        button.href = `section.html?id=${i}`;
        button.className = 'section-button';
        button.textContent = `Section ${i}`;
        sectionButtons.appendChild(button);
    }
});

 