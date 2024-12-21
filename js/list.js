class SlidesList {
    constructor() {
        this.listContainer = document.getElementById('slidesList');
        this.slides = [];
        this.loadSlidesList();
    }

    async loadSlidesList() {
        try {
            // Load slides directly from the repository path
            const repoPath = window.location.pathname.split('/')[1]; // Get repository name from URL
            const slidesPath = `/${repoPath}/slides`; // Path to slides directory

            // List all PDF files in the slides directory
            const files = await this.listFilesInDirectory(slidesPath);
            this.slides = files.filter(file => file.name.endsWith('.pdf'));
            this.renderList();
        } catch (error) {
            console.error('Error loading slides list:', error);
            this.listContainer.innerHTML = '<div class="alert alert-danger">Failed to load slides list</div>';
        }
    }

    async listFilesInDirectory(path) {
        // In GitHub Pages, we'll directly access the files in the slides directory
        // This is a simplified version that works with the static file structure
        const response = await fetch(`${path}/`);
        if (!response.ok) throw new Error('Failed to fetch slides list');

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Parse the directory listing
        const files = Array.from(doc.querySelectorAll('a'))
            .filter(a => a.href.endsWith('.pdf'))
            .map(a => ({
                name: a.textContent,
                download_url: a.href
            }));

        return files;
    }

    renderList() {
        this.listContainer.innerHTML = '';
        this.slides.forEach(slide => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = slide.name.replace('.pdf', '');

            item.addEventListener('click', () => {
                this.selectSlide(slide);
                // Remove active class from all items
                document.querySelectorAll('.list-group-item').forEach(el => {
                    el.classList.remove('active');
                });
                // Add active class to clicked item
                item.classList.add('active');
            });

            this.listContainer.appendChild(item);
        });
    }

    selectSlide(slide) {
        // Load the selected PDF into the viewer
        window.pdfViewer.loadDocument(slide.download_url);
    }
}

// Initialize the slides list when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SlidesList();
});