class SlidesList {
    constructor() {
        this.listContainer = document.getElementById('slidesList');
        this.slides = [];
        this.loadSlidesList();
    }

    async loadSlidesList() {
        try {
            // スライドの一覧を定義
            const slides = [
                {
                    name: 'demo1',
                    pdfUrl: 'slides/demo1.pdf'
                }
            ];

            // スライド一覧を更新
            this.slides = slides;
            this.renderList();

            // 各スライドの存在確認
            for (const slide of this.slides) {
                try {
                    const response = await fetch(slide.pdfUrl, { method: 'HEAD' });
                    if (!response.ok) {
                        console.warn(`Slide ${slide.name} not found at ${slide.pdfUrl}`);
                    }
                } catch (error) {
                    console.error(`Error checking slide ${slide.name}:`, error);
                }
            }
        } catch (error) {
            console.error('Error loading slides list:', error);
            this.listContainer.innerHTML = '<div class="alert alert-danger">スライド一覧の読み込みに失敗しました</div>';
        }
    }

    renderList() {
        this.listContainer.innerHTML = '';
        if (this.slides.length === 0) {
            this.listContainer.innerHTML = '<div class="alert alert-info">スライドがありません</div>';
            return;
        }

        this.slides.forEach(slide => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = slide.name;

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