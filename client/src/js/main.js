import '../scss/style.scss';

function toggleNightMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-bs-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-bs-theme', newTheme);

    const toggleButton = document.getElementById('toggleMode');
    toggleButton.textContent = newTheme === 'dark' ? 'Light Mode' : 'Night Mode';
    toggleButton.classList.toggle('btn-outline-light', newTheme === 'dark');
    toggleButton.classList.toggle('btn-outline-dark', newTheme === 'light');

    localStorage.setItem('theme', newTheme);
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-bs-theme', savedTheme);

    const toggleButton = document.getElementById('toggleMode');
    toggleButton.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Night Mode';
    toggleButton.classList.toggle('btn-outline-light', savedTheme === 'dark');
    toggleButton.classList.toggle('btn-outline-dark', savedTheme === 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    const toggleButton = document.getElementById('toggleMode');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleNightMode);
    }
});