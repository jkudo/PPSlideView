import os
import json
from datetime import datetime
from pathlib import Path
import logging

# ログ設定
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def generate_pdf_list():
    """PDFファイルの一覧を生成してJSONファイルに保存する"""
    pdf_dir = Path("pdfs")
    pdf_files = []

    logger.info(f"Scanning directory: {pdf_dir}")

    # PDFディレクトリが存在しない場合は作成
    if not pdf_dir.exists():
        logger.warning(f"Directory {pdf_dir} does not exist, creating it")
        pdf_dir.mkdir(parents=True, exist_ok=True)

    # PDFファイルを探索
    for pdf_file in pdf_dir.glob("*.pdf"):
        logger.debug(f"Found PDF file: {pdf_file}")
        name = pdf_file.stem
        title = name.replace("-", " ").replace("_", " ").title()
        uploaded_at = datetime.fromtimestamp(pdf_file.stat().st_mtime).isoformat()

        pdf_files.append({
            "name": name,
            "title": title,
            "pdfUrl": f"pdfs/{pdf_file.name}",
            "uploadedAt": uploaded_at
        })

    logger.info(f"Found {len(pdf_files)} PDF files")

    # 更新日時でソート
    pdf_files.sort(key=lambda x: x["uploadedAt"], reverse=True)

    # JSONファイルに保存
    output_file = "pdf-list.json"
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump({"slides": pdf_files}, f, ensure_ascii=False, indent=2)
        logger.info(f"Successfully wrote PDF list to {output_file}")
    except Exception as e:
        logger.error(f"Error writing to {output_file}: {e}")

if __name__ == "__main__":
    logger.info("Starting PDF list generator service")
    while True:
        try:
            generate_pdf_list()
            logger.debug("Waiting 60 seconds before next update")
            import time
            time.sleep(60)
        except Exception as e:
            logger.error(f"Error in main loop: {e}")
            time.sleep(60)  # エラー時も60秒待機