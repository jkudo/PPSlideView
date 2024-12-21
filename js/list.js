class SlidesList {
    constructor() {
        this.listContainer = document.getElementById('slidesList');
        this.slides = [];
        this.loadSlidesList();
    }

    async loadSlidesList() {
        try {
            console.log('Loading slides list...');
            // サーバー上のPDFファイルを直接探索
            const slides = [];
            
            // テスト用のデモスライドを追加
            slides.push({
                name: 'demo1',
                title: 'デモスライド1',
                pdfUrl: './pdfs/demo1.pdf',
                uploadedAt: new Date().toISOString()
            });

            // スライドを表示
            this.slides = slides;
            console.log(`Found ${slides.length} slides:`, slides);
            this.renderList();

            // PDFファイルの存在確認（表示には影響しない）
            for (const slide of slides) {
                try {
                    const response = await fetch(slide.pdfUrl, { method: 'HEAD' });
                    if (!response.ok) {
                        console.warn(`PDF file not found: ${slide.pdfUrl}`);
                    } else {
                        console.log(`PDF file found: ${slide.pdfUrl}`);
                    }
                } catch (error) {
                    console.error(`Error checking PDF file ${slide.pdfUrl}:`, error);
                }
            }

        } catch (error) {
            console.error('Error loading slides list:', error);
            this.showErrorMessage(error.message);
        }
    }

    // 残りのメソッドは変更なし
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return new Intl.DateTimeFormat('ja-JP', options).format(date);
    }

    renderList() {
        this.listContainer.innerHTML = '';
        console.log('Rendering slides list...');

        if (this.slides.length === 0) {
            this.showNoSlidesMessage();
            return;
        }

        this.slides.forEach(slide => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'd-flex w-100 justify-content-between align-items-start';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'me-3';

            const title = document.createElement('h6');
            title.className = 'mb-1';
            title.textContent = slide.title || slide.name;
            infoDiv.appendChild(title);

            if (slide.uploadedAt) {
                const dateText = document.createElement('small');
                dateText.className = 'text-muted';
                dateText.textContent = `アップロード：${this.formatDate(slide.uploadedAt)}`;
                infoDiv.appendChild(dateText);
            }

            contentDiv.appendChild(infoDiv);

            const iconDiv = document.createElement('div');
            iconDiv.className = 'ms-2';
            const icon = document.createElement('i');
            icon.className = 'fas fa-file-pdf';
            iconDiv.appendChild(icon);

            contentDiv.appendChild(iconDiv);
            item.appendChild(contentDiv);

            item.addEventListener('click', () => {
                this.selectSlide(slide);
                document.querySelectorAll('.list-group-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
            });

            this.listContainer.appendChild(item);
        });
        console.log('Slides list rendered successfully');
    }

    selectSlide(slide) {
        console.log('Loading slide:', slide);
        window.pdfViewer.loadDocument(slide.pdfUrl);
    }

    showNoSlidesMessage() {
        this.listContainer.innerHTML = `
            <div class="alert alert-info">
                <h4 class="alert-heading mb-3">
                    <i class="fas fa-info-circle me-2"></i>
                    スライドがありません
                </h4>
                <p class="mb-3">現在表示可能なスライドはありません。</p>
                <hr>
                <p class="mb-2">スライドを追加するには：</p>
                <ol class="mt-2">
                    <li class="mb-2"><code>slides</code>ディレクトリにPowerPointファイル（.pptx）をアップロードしてください。</li>
                    <li>GitHub Actionsにより自動的にPDFに変換され、<code>pdfs</code>ディレクトリに保存されます。</li>
                </ol>
            </div>`;
    }

    showErrorMessage(errorDetail = '') {
        const errorMessage = errorDetail ? `<p class="mb-2">エラー詳細: ${errorDetail}</p>` : '';
        this.listContainer.innerHTML = `
            <div class="alert alert-danger">
                <h4 class="alert-heading mb-3">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    エラーが発生しました
                </h4>
                <p class="mb-2">スライド一覧の読み込みに失敗しました。</p>
                ${errorMessage}
                <p>ページを更新してもう一度お試しください。</p>
            </div>`;
    }
}

// ページ読み込み時にスライド一覧を初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing slides list...');
    window.slidesList = new SlidesList();
});
