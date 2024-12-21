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

            // 各スライドの存在確認
            const availableSlides = await this.checkAvailableSlides(slides);

            // 利用可能なスライドで更新
            this.slides = availableSlides;
            this.renderList();

            if (availableSlides.length === 0) {
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
                pdfUrl: 'slides/demo1.pdf'
            }
            // 新しいスライドはここに追加
        ];
    }

    async checkAvailableSlides(slides) {
        const availableSlides = [];
        for (const slide of slides) {
            try {
                const response = await fetch(slide.pdfUrl, { method: 'HEAD' });
                if (response.ok) {
                    availableSlides.push(slide);
                } else {
                    console.warn(`スライド ${slide.title} (${slide.pdfUrl}) が見つかりません`);
                }
            } catch (error) {
                console.error(`スライド ${slide.title} の確認中にエラーが発生しました:`, error);
            }
        }
        return availableSlides;
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

    renderList() {
        this.listContainer.innerHTML = '';

        this.slides.forEach(slide => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';

            // スライドタイトルの表示
            const titleSpan = document.createElement('span');
            titleSpan.textContent = slide.title || slide.name;
            item.appendChild(titleSpan);

            // PDFアイコンの追加
            const icon = document.createElement('i');
            icon.className = 'fas fa-file-pdf text-muted';
            item.appendChild(icon);

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