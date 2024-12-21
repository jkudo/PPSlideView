# スライドビューワー

GitHub Pages上でPowerPointスライドをPDFとして表示するビューワーアプリケーションです。

## 使い方

1. スライドのアップロード
   - `slides`ディレクトリに表示したいPowerPointファイル（.pptx）をアップロードします
   - GitHub Actionsによって自動的にPDFに変換されます

2. スライドの表示
   - 左側のサイドバーに変換されたスライド一覧が表示されます
   - 表示したいスライドをクリックすると、右側のビューワーに表示されます
   - 「前のページ」「次のページ」ボタンでスライドを切り替えることができます

## 技術的な詳細

- PowerPointからPDFへの変換は`.github/workflows/convert-ppt.yml`で定義されたGitHub Actionで自動的に行われます
- ビューワーはPDF.jsを使用してPDFを表示します
- すべての処理はクライアントサイドで行われ、サーバーは必要ありません

## セットアップ

1. このリポジトリをフォークまたはクローンします
2. リポジトリの設定でGitHub Pagesを有効にします（Settings > Pages）
   - Source: GitHub Actions
3. リポジトリの設定でWorkflow permissionsを変更します（Settings > Actions > General > Workflow permissions）
   - 「Read and write permissions」を選択
   - 「Allow GitHub Actions to create and approve pull requests」にチェックを入れる
4. `slides`ディレクトリにPowerPointファイルをアップロードします
   - サポートされる形式: .ppt, .pptx
   - アップロード後、自動的にPDFに変換されます
5. 変換されたPDFファイルは自動的にリポジトリにコミットされ、ウェブサイト上で表示できるようになります