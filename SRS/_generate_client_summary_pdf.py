from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer


def markdown_to_pdf(md_path: Path, pdf_path: Path) -> None:
    styles = getSampleStyleSheet()

    h1 = ParagraphStyle(
        "H1Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        spaceBefore=8,
        spaceAfter=7,
    )
    h2 = ParagraphStyle(
        "H2Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        spaceBefore=7,
        spaceAfter=5,
    )
    h3 = ParagraphStyle(
        "H3Custom",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        spaceBefore=5,
        spaceAfter=4,
    )
    body = ParagraphStyle(
        "BodyCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=13.5,
        spaceBefore=1,
        spaceAfter=1,
    )
    bullet = ParagraphStyle(
        "BulletCustom",
        parent=body,
        leftIndent=12,
        bulletIndent=0,
    )

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title="DigiVahan Marketplace Client Summary v1.2",
        author="Yash Raj Anand",
    )

    story = []

    for raw_line in md_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.rstrip()

        if not line.strip():
            story.append(Spacer(1, 5))
            continue

        escaped = (
            line.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
        )

        if escaped.startswith("# "):
            story.append(Paragraph(escaped[2:].strip(), h1))
        elif escaped.startswith("## "):
            story.append(Paragraph(escaped[3:].strip(), h2))
        elif escaped.startswith("### "):
            story.append(Paragraph(escaped[4:].strip(), h3))
        elif escaped.startswith("- "):
            story.append(Paragraph(escaped[2:].strip(), bullet, bulletText="-"))
        else:
            story.append(Paragraph(escaped, body))

    doc.build(story)


if __name__ == "__main__":
    base = Path(__file__).resolve().parent
    md_file = base / "DigiVahan_Marketplace_SRS_Client_Summary_v1.2.md"
    pdf_file = base / "DigiVahan_Marketplace_SRS_Client_Summary_v1.2.pdf"
    markdown_to_pdf(md_file, pdf_file)
    print(f"Generated: {pdf_file}")
