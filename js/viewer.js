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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevPage();
            } else if (e.key === 'ArrowRight') {
                this.nextPage();
            }
        });

        // ウィンドウサイズ変更時の再レンダリング
        window.addEventListener('resize', () => {
            if (this.pdfDoc) {
                this.renderCurrentPage();
            }
        });
    }

    async loadDocument(url) {
        try {
            console.log('Loading PDF:', url);
            const loadingTask = pdfjsLib.getDocument(url);
            this.pdfDoc = await loadingTask.promise;
            this.totalPagesSpan.textContent = this.pdfDoc.numPages;
            this.currentPage = 1;
            this.renderCurrentPage();
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showError(`スライド ${url} が見つかりません`);
        }
    }

    showError(message) {
        const container = document.getElementById('viewerContainer');
        container.innerHTML = `
            <div class="alert alert-danger m-3">
                <h4 class="alert-heading mb-3">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    エラーが発生しました
                </h4>
                <p class="mb-0">${message}</p>
            </div>`;
    }

    async renderCurrentPage() {
        if (!this.pdfDoc) return;

        try {
            const page = await this.pdfDoc.getPage(this.currentPage);
            const viewport = page.getViewport({ scale: 1.5 });

            // キャンバスのサイズをビューポートに合わせる
            const container = document.getElementById('viewerContainer');
            const scale = Math.min(
                container.clientWidth / viewport.width,
                container.clientHeight / viewport.height
            ) * 0.9;

            const scaledViewport = page.getViewport({ scale });

            this.canvas.height = scaledViewport.height;
            this.canvas.width = scaledViewport.width;

            const renderContext = {
                canvasContext: this.ctx,
                viewport: scaledViewport
            };

            await page.render(renderContext).promise;
            this.currentPageSpan.textContent = this.currentPage;
            this.updateNavigationButtons();
        } catch (error) {
            console.error('Error rendering page:', error);
            this.showError('ページの表示中にエラーが発生しました');
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

// Initialize viewer
const viewer = new PDFViewer();

// Export for use in other modules
window.pdfViewer = viewer;