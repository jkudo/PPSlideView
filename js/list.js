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

            // スライド一覧を更新
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
        // 初期スライドリスト
        return [
            {
                name: 'demo1',
                title: 'デモスライド1',
                pdfUrl: 'slides/demo1.pdf',
                uploadedAt: '2024-12-21T10:00:00Z'  // アップロード日時を追加
            }
            // 新しいスライドはここに追加
        ];
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

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    renderList() {
        this.listContainer.innerHTML = '';

        this.slides.forEach(slide => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';

            // スライド情報のコンテナ
            const contentDiv = document.createElement('div');
            contentDiv.className = 'd-flex justify-content-between align-items-center w-100';

            // 左側：タイトルとアップロード日時
            const infoDiv = document.createElement('div');

            // タイトル
            const titleDiv = document.createElement('div');
            titleDiv.className = 'fw-bold';
            titleDiv.textContent = slide.title || slide.name;
            infoDiv.appendChild(titleDiv);

            // アップロード日時
            if (slide.uploadedAt) {
                const dateDiv = document.createElement('div');
                dateDiv.className = 'text-muted small';
                dateDiv.textContent = `アップロード: ${this.formatDate(slide.uploadedAt)}`;
                infoDiv.appendChild(dateDiv);
            }

            contentDiv.appendChild(infoDiv);

            // 右側：PDFアイコン
            const icon = document.createElement('i');
            icon.className = 'fas fa-file-pdf text-muted';
            contentDiv.appendChild(icon);

            item.appendChild(contentDiv);

            item.addEventListener('click', () => {
                this.selectSlide(slide);
                // アクティブなアイテムの更新
                document.querySelectorAll('.list-group-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
            });

            this.listContainer.appendChild(item);
        });
    }

    selectSlide(slide) {
        // 選択されたPDFをビューワーに読み込む
        window.pdfViewer.loadDocument(slide.pdfUrl);
    }
}

// ページ読み込み時にスライド一覧を初期化
document.addEventListener('DOMContentLoaded', () => {
    new SlidesList();
});