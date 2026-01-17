document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const scheduleContainer = document.getElementById('schedule');
    const talks = Array.from(scheduleContainer.getElementsByClassName('talk'));

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        talks.forEach(talk => {
            const categories = Array.from(talk.getElementsByClassName('category'));
            const matches = categories.some(category => category.textContent.toLowerCase().includes(searchTerm));
            
            if (matches || searchTerm === '') {
                talk.style.display = 'block';
            } else {
                talk.style.display = 'none';
            }
        });
    });
});
