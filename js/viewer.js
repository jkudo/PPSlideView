// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

class PDFViewer {
    constructor() {
        this.pdfDoc = null;
        this.currentPage = 1;
        this.canvas = document.getElementById('pdfViewer');
        this.ctx = this.canvas.getContext('2d');
        
        // Navigation controls
        this.prevButton = document.getElementById('prevPage');
        this.nextButton = document.getElementById('nextPage');
        this.currentPageSpan = document.getElementById('currentPage');
        this.totalPagesSpan = document.getElementById('totalPages');
        
        this.initializeControls();
    }

    initializeControls() {
        this.prevButton.addEventListener('click', () => this.prevPage());
        this.nextButton.addEventListener('click', () => this.nextPage());
    }

    async loadDocument(url) {
        try {
            const loadingTask = pdfjsLib.getDocument(url);
            this.pdfDoc = await loadingTask.promise;
            this.totalPagesSpan.textContent = this.pdfDoc.numPages;
            this.currentPage = 1;
            this.renderCurrentPage();
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    }

    async renderCurrentPage() {
        if (!this.pdfDoc) return;

        try {
            const page = await this.pdfDoc.getPage(this.currentPage);
            const viewport = page.getViewport({ scale: 1.5 });

            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            this.currentPageSpan.textContent = this.currentPage;
            this.updateNavigationButtons();
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderCurrentPage();
        }
    }

    nextPage() {
        if (this.currentPage < this.pdfDoc.numPages) {
            this.currentPage++;
            this.renderCurrentPage();
        }
    }

    updateNavigationButtons() {
        this.prevButton.disabled = this.currentPage <= 1;
        this.nextButton.disabled = this.currentPage >= this.pdfDoc.numPages;
    }
}

const viewer = new PDFViewer();

// Export for use in other modules
window.pdfViewer = viewer;
