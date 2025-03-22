document.addEventListener('DOMContentLoaded', () => {
    // Highlight current page in navigation
    const currentPage = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href').includes(currentPage.split('/').pop())) {
            link.classList.add('active');
        }
    });

    // Handle navigation menu in mobile view
    const searchBar = document.querySelector('.search-bar');
    const mobileSearchToggle = document.createElement('button');
    mobileSearchToggle.className = 'mobile-search-toggle';
    mobileSearchToggle.setAttribute('aria-label', 'Toggle search');
    mobileSearchToggle.innerHTML = '🔍';

    if (window.innerWidth <= 768) {
        searchBar.style.display = 'none';
        document.querySelector('.main-nav').appendChild(mobileSearchToggle);
    }

    mobileSearchToggle.addEventListener('click', () => {
        const isHidden = searchBar.style.display === 'none';
        searchBar.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
            searchBar.querySelector('input').focus();
        }
        hideSearchSuggestions();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            searchBar.style.display = 'flex';
            mobileSearchToggle.style.display = 'none';
        } else {
            searchBar.style.display = 'none';
            mobileSearchToggle.style.display = 'block';
        }
    });
});
