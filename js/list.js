class SlidesList {
    constructor() {
        this.listContainer = document.getElementById('slidesList');
        this.slides = [];
        this.loadSlidesList();
    }

    async loadSlidesList() {
        try {
            // GitHub Pages用に静的に定義されたスライドリスト
            const slides = await this.fetchSlidesList();
            this.slides = slides;
            this.renderList();

            if (slides.length === 0) {
                this.showNoSlidesMessage();
            }
        } catch (error) {
            console.error('スライド一覧の読み込み中にエラーが発生しました:', error);
            this.showErrorMessage();
        }
    }

    async fetchSlidesList() {
        // GitHub Pages用の静的スライドリスト
        return [
            {
                name: 'demo1',
                title: 'デモスライド1',
                pdfUrl: 'slides/demo1.pdf',
                uploadedAt: '2024-12-21T10:00:00Z'
            }
            // 新しいスライドはここに追加されます
        ];
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

        this.slides.forEach(slide => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';

            // スライド情報のレイアウト
            const contentDiv = document.createElement('div');
            contentDiv.className = 'd-flex w-100 justify-content-between align-items-start';

            // 左側：タイトルと日時
            const infoDiv = document.createElement('div');
            infoDiv.className = 'me-3';

            // タイトル
            const title = document.createElement('h6');
            title.className = 'mb-1';
            title.textContent = slide.title || slide.name;
            infoDiv.appendChild(title);

            // アップロード日時
            if (slide.uploadedAt) {
                const dateText = document.createElement('small');
                dateText.className = 'text-muted';
                dateText.textContent = `アップロード：${this.formatDate(slide.uploadedAt)}`;
                infoDiv.appendChild(dateText);
            }

            contentDiv.appendChild(infoDiv);

            // 右側：PDFアイコン
            const iconDiv = document.createElement('div');
            iconDiv.className = 'ms-2';
            const icon = document.createElement('i');
            icon.className = 'fas fa-file-pdf';
            iconDiv.appendChild(icon);

            contentDiv.appendChild(iconDiv);
            item.appendChild(contentDiv);

            // クリックイベント
            item.addEventListener('click', () => {
                this.selectSlide(slide);
                document.querySelectorAll('.list-group-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
            });

            this.listContainer.appendChild(item);
        });
    }

    selectSlide(slide) {
        window.pdfViewer.loadDocument(slide.pdfUrl);
    }

    showNoSlidesMessage() {
        this.listContainer.innerHTML = `
            <div class="alert alert-info">
                <h4 class="alert-heading">スライドがありません</h4>
                <p>現在表示可能なスライドはありません。</p>
                <hr>
                <p class="mb-0">スライドを追加するには：</p>
                <ol class="mt-2">
                    <li><code>slides</code>ディレクトリにPowerPointファイル（.pptx）をアップロードしてください。</li>
                    <li>自動的にPDFに変換され、ここに表示されます。</li>
                </ol>
            </div>`;
    }

    showErrorMessage() {
        this.listContainer.innerHTML = `
            <div class="alert alert-danger">
                <h4 class="alert-heading">エラーが発生しました</h4>
                <p>スライド一覧の読み込みに失敗しました。</p>
                <p>ページを更新してもう一度お試しください。</p>
            </div>`;
    }
}

// ページ読み込み時にスライド一覧を初期化
document.addEventListener('DOMContentLoaded', () => {
    new SlidesList();
});