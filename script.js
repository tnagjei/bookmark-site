document.addEventListener('DOMContentLoaded', function() {
    // Initialize folder click events
    initFolderToggle();
    
    // Initialize search functionality
    initSearch();
});

/**
 * Initialize folder collapse/expand functionality
 */
function initFolderToggle() {
    const folders = document.querySelectorAll('.folder');
    
    folders.forEach(folder => {
        // Default: expand first level folders
        if (folder.parentElement.parentElement.classList.contains('nav-menu')) {
            folder.classList.add('open');
            const subMenu = folder.nextElementSibling;
            if (subMenu) {
                subMenu.classList.add('open');
            }
        }
        
        folder.addEventListener('click', function() {
            this.classList.toggle('open');
            const subMenu = this.nextElementSibling;
            if (subMenu) {
                subMenu.classList.toggle('open');
            }
        });
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        search(searchTerm);
    });
}

/**
 * Execute search
 * @param {string} searchTerm - Search keyword
 */
function search(searchTerm) {
    // Get all links and folders
    const links = document.querySelectorAll('.nav-menu a');
    const folders = document.querySelectorAll('.folder');
    
    // If search term is empty, restore original state
    if (searchTerm === '') {
        resetSearch(links, folders);
        return;
    }
    
    // Hide all folders and links
    folders.forEach(folder => {
        folder.parentElement.classList.add('hidden');
    });
    
    links.forEach(link => {
        link.parentElement.classList.add('hidden');
        // Remove previous highlights
        link.innerHTML = link.textContent;
    });
    
    // Search for matches and display them
    let hasResults = false;
    
    links.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        const url = link.getAttribute('href').toLowerCase();
        
        if (linkText.includes(searchTerm) || url.includes(searchTerm)) {
            // Display matching links
            link.parentElement.classList.remove('hidden');
            
            // Highlight matching text
            if (linkText.includes(searchTerm)) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                link.innerHTML = link.textContent.replace(regex, '<span class="highlight">$1</span>');
            }
            
            // Show parent folders
            let parent = link.parentElement;
            while (parent) {
                if (parent.tagName === 'LI') {
                    parent.classList.remove('hidden');
                }
                
                // Expand parent folders
                const parentFolder = parent.querySelector('.folder');
                if (parentFolder) {
                    parentFolder.classList.add('open');
                    const subMenu = parentFolder.nextElementSibling;
                    if (subMenu) {
                        subMenu.classList.add('open');
                    }
                }
                
                parent = parent.parentElement;
            }
            
            hasResults = true;
        }
    });
    
    // If no results, show a message
    if (!hasResults) {
        // Can add a no results message
        console.log('No matching results found');
    }
}

/**
 * Reset search, restore original state
 * @param {NodeList} links - All link elements
 * @param {NodeList} folders - All folder elements
 */
function resetSearch(links, folders) {
    // Show all folders and links
    folders.forEach(folder => {
        folder.parentElement.classList.remove('hidden');
        
        // Only keep first level folders expanded
        if (folder.parentElement.parentElement.classList.contains('nav-menu')) {
            folder.classList.add('open');
            const subMenu = folder.nextElementSibling;
            if (subMenu) {
                subMenu.classList.add('open');
            }
        } else {
            folder.classList.remove('open');
            const subMenu = folder.nextElementSibling;
            if (subMenu) {
                subMenu.classList.remove('open');
            }
        }
    });
    
    links.forEach(link => {
        link.parentElement.classList.remove('hidden');
        // Remove highlights
        link.innerHTML = link.textContent;
    });
}