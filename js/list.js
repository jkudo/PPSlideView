class SlidesList {
    constructor() {
        this.listContainer = document.getElementById('slidesList');
        this.slides = [];
        this.loadSlidesList();
    }

    async loadSlidesList() {
        try {
            // slidesディレクトリ内のファイル一覧を取得
            const response = await fetch('slides/');
            if (!response.ok) {
                throw new Error('Failed to fetch slides directory');
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // PDFファイルのみをフィルタリング
            this.slides = Array.from(doc.querySelectorAll('a'))
                .filter(a => a.href.toLowerCase().endsWith('.pdf'))
                .map(a => {
                    const filename = decodeURIComponent(a.href.split('/').pop());
                    return {
                        name: filename,
                        download_url: `slides/${filename}`
                    };
                });

            this.renderList();
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
            item.textContent = slide.name.replace('.pdf', '');

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
        window.pdfViewer.loadDocument(slide.download_url);
    }
}

// ページ読み込み時にスライド一覧を初期化
document.addEventListener('DOMContentLoaded', () => {
    new SlidesList();
});