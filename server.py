import os
import json
from datetime import datetime
from pathlib import Path

def generate_pdf_list():
    """PDFファイルの一覧を生成してJSONファイルに保存する"""
    pdf_dir = Path("pdfs")
    pdf_files = []
    
    # PDFファイルを探索
    for pdf_file in pdf_dir.glob("*.pdf"):
        name = pdf_file.stem
        title = name.replace("-", " ").replace("_", " ").title()
        uploaded_at = datetime.fromtimestamp(pdf_file.stat().st_mtime).isoformat()
        
        pdf_files.append({
            "name": name,
            "title": title,
            "pdfUrl": f"pdfs/{pdf_file.name}",
            "uploadedAt": uploaded_at
        })
    
    # 更新日時でソート
    pdf_files.sort(key=lambda x: x["uploadedAt"], reverse=True)
    
    # JSONファイルに保存
    with open("pdf-list.json", "w", encoding="utf-8") as f:
        json.dump({"slides": pdf_files}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    while True:
        generate_pdf_list()
        # 1分ごとに更新
        import time
        time.sleep(60)
