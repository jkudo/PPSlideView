class SlidesList {
    constructor() {
        this.listContainer = document.getElementById('slidesList');
        this.slides = [];
        this.loadSlidesList();

        // 30秒ごとに一覧を更新
        setInterval(() => this.loadSlidesList(), 30000);
    }

    async loadSlidesList() {
        try {
            console.log('Loading slides list...');

            // JSONファイルから一覧を読み込む
            const response = await fetch('pdf-list.json');
            if (!response.ok) {
                throw new Error('Failed to load slides list');
            }

            const data = await response.json();
            this.slides = data.slides;
            console.log(`Found ${this.slides.length} slides:`, this.slides);
            this.renderList();

        } catch (error) {
            console.error('Error loading slides list:', error);
            this.showErrorMessage(error.message);
        }
    }

    formatTitle(filename) {
        // ファイル名からタイトルを生成
        return filename
            .replace(/[-_]/g, ' ')  // ハイフンとアンダースコアをスペースに
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

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
            title.textContent = slide.title;
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
</replit_file>
}