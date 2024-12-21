class SlidesList {
    constructor() {
        this.listContainer = document.getElementById('slidesList');
        this.slides = [];
        this.loadSlidesList();
    }

    async loadSlidesList() {
        try {
            // リポジトリ名をURLから取得
            const pathSegments = window.location.pathname.split('/');
            const repoPath = pathSegments.length > 1 ? pathSegments[1] : '';
            const slidesPath = repoPath ? `/${repoPath}/slides` : '/slides';

            // スライドディレクトリのファイル一覧を取得
            const files = await this.listFilesInDirectory(slidesPath);
            this.slides = files.filter(file => file.name.endsWith('.pdf'));
            this.renderList();
        } catch (error) {
            console.error('Error loading slides list:', error);
            this.listContainer.innerHTML = '<div class="alert alert-danger">スライド一覧の読み込みに失敗しました</div>';
        }
    }

    async listFilesInDirectory(path) {
        try {
            const response = await fetch(`${path}/`);
            if (!response.ok) throw new Error('Failed to fetch slides list');

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // ディレクトリ一覧からPDFファイルを抽出
            return Array.from(doc.querySelectorAll('a'))
                .filter(a => a.href.endsWith('.pdf'))
                .map(a => ({
                    name: decodeURIComponent(a.href.split('/').pop()),
                    download_url: a.href
                }));
        } catch (error) {
            console.error('Error listing files:', error);
            return [];
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