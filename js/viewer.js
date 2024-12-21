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
        console.log('PDF viewer initialized');
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

        window.addEventListener('resize', () => {
            if (this.pdfDoc) {
                this.renderCurrentPage();
            }
        });
    }

    async loadDocument(url) {
        try {
            console.log('Loading PDF:', url);
            const absoluteUrl = new URL(url, window.location.href).href;
            console.log('Absolute URL:', absoluteUrl);

            // 日本語フォントサポートのための設定を追加
            const loadingTask = pdfjsLib.getDocument({
                url: absoluteUrl,
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
                cMapPacked: true,
                standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/',
                // 日本語フォント関連の設定
                fontExtraProperties: true,
                useSystemFonts: true,
                disableFontFace: false,
                verbosity: 1
            });

            this.pdfDoc = await loadingTask.promise;
            console.log('PDF loaded successfully');
            this.totalPagesSpan.textContent = this.pdfDoc.numPages;
            this.currentPage = 1;
            await this.renderCurrentPage();
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showError(`スライド ${url} の読み込み中にエラーが発生しました: ${error.message}`);
        }
    }

    showError(message) {
        console.error('Error:', message);
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
        if (!this.pdfDoc) {
            console.warn('No PDF document loaded');
            return;
        }

        try {
            console.log('Rendering page:', this.currentPage);
            const page = await this.pdfDoc.getPage(this.currentPage);
            const viewport = page.getViewport({ scale: 1.5 });

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
                viewport: scaledViewport,
                enableWebGL: true,
                renderInteractiveForms: true,
                // 日本語フォントレンダリングの設定
                useSystemFonts: true,
                fontExtraProperties: true,
                enableFontFaces: true
            };

            const renderTask = page.render(renderContext);
            await renderTask.promise;
            console.log('Page rendered successfully');

            this.currentPageSpan.textContent = this.currentPage;
            this.updateNavigationButtons();
        } catch (error) {
            console.error('Error rendering page:', error);
            this.showError(`ページの表示中にエラーが発生しました: ${error.message}`);
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            console.log('Moving to previous page');
            this.currentPage--;
            this.renderCurrentPage();
        }
    }

    nextPage() {
        if (this.currentPage < this.pdfDoc.numPages) {
            console.log('Moving to next page');
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
console.log('Creating PDF viewer instance');
const viewer = new PDFViewer();

// Export for use in other modules
window.pdfViewer = viewer;