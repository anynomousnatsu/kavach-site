"""Generate a minimal valid one-page sample service record PDF (pure stdlib)."""
import os

LINES = [
    ("Helvetica-Bold", 16, "KAVACH PEST MANAGEMENT PVT. LTD."),
    ("Helvetica", 10, "Every visit, on record.  |  981-8499308  |  kavach.com.np"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 12, "SAMPLE MONTHLY SERVICE RECORD"),
    ("Helvetica", 10, "Client: Thamel Kitchen (sample) | 1,850 sq ft | Kitchen Shield M | Since 2026-02"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "VISIT LOG - 2026-07-12"),
    ("Helvetica", 10, "In/Out: 23:30 - 01:20 | Technician: R. Tamang | Duration: 1h 50m"),
    ("Helvetica", 10, "Areas: kitchen, dry store, drains, back lane | Status: CLEAR"),
    ("Helvetica", 10, "All 14 stations checked. Gel refreshed at stations 02, 07. Drains foamed."),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "PRODUCTS USED"),
    ("Helvetica", 10, "Cockroach gel bait | Fipronil 0.05% | Batch FG-2604-118 | 6 g | No re-entry"),
    ("Helvetica", 10, "Residual concentrate | Imidacloprid 30.5% SC | Batch IM-2603-077 | 4 hr re-entry"),
    ("Helvetica", 10, "Drain foam | Bio-enzymatic | Batch DF-2606-021 | 120 ml | 1 hr re-entry"),
    ("Helvetica", 10, "Rodenticide blocks | Bromadiolone 0.005% | Batch BR-2601-431 | stations 12, 13"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "ACTIVITY INDEX"),
    ("Helvetica", 10, "FEB 100 (baseline) | MAR 70 | APR 40 | MAY 55 | JUN 30 | JUL 22"),
    ("Helvetica", 10, "Activity down 78% since programme start."),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "GUARANTEE"),
    ("Helvetica", 10, "Unlimited callbacks within 48 hours, free, in writing. Night service included."),
    ("Helvetica", 10, ""),
    ("Helvetica", 8, "This is a sample document with fictional client data, illustrating the record"),
    ("Helvetica", 8, "every Kavach client receives monthly. Ask your current provider for theirs."),
]

content = ["BT"]
y = 780
for font, size, text in LINES:
    fkey = "/F1" if font == "Helvetica" else "/F2"
    text = text.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
    content.append(f"{fkey} {size} Tf 1 0 0 1 60 {y} Tm ({text}) Tj")
    y -= size + 8
content.append("ET")
stream = "\n".join(content).encode("latin-1")

objs = []
objs.append(b"<< /Type /Catalog /Pages 2 0 R >>")
objs.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
objs.append(b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>")
objs.append(b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream")
objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

out = bytearray(b"%PDF-1.4\n")
offsets = []
for i, obj in enumerate(objs, 1):
    offsets.append(len(out))
    out += f"{i} 0 obj\n".encode() + obj + b"\nendobj\n"
xref_pos = len(out)
out += f"xref\n0 {len(objs)+1}\n0000000000 65535 f \n".encode()
for off in offsets:
    out += f"{off:010d} 00000 n \n".encode()
out += f"trailer\n<< /Size {len(objs)+1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode()

dest = r"D:\pest control\assets\docs\kavach-sample-service-record.pdf"
os.makedirs(os.path.dirname(dest), exist_ok=True)
with open(dest, "wb") as f:
    f.write(out)
print("Wrote", dest, len(out), "bytes")
