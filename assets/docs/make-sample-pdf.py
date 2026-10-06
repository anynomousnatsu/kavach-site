"""Generate the public sample service record: a labelled BLANK TEMPLATE (pure stdlib).

It deliberately holds no client, technician or result data, so nothing on it can be
mistaken for a real job. Run from anywhere; it writes next to this script.
"""
import os

CALLBACK = ("If pests come back within 48 hours of a scheduled service, tell us and we return "
            "to re-treat at no charge.")

LINES = [
    ("Helvetica-Bold", 16, "KAVACH PEST MANAGEMENT"),
    ("Helvetica", 10, "Every visit, on record.  |  WhatsApp +977 981-8499308  |  kavachpest.com"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 13, "SAMPLE SERVICE RECORD - BLANK TEMPLATE"),
    ("Helvetica", 9, "This is a blank example of the record we leave after every visit. It contains no client data."),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "VISIT"),
    ("Helvetica", 10, "Client / site: ______________________   Programme: ______________   Visit no.: _____"),
    ("Helvetica", 10, "Date: ____________   Time in: _______   Time out: _______   Technician: ______________"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "AREAS INSPECTED"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "FINDINGS  (pest | location | activity: none / low / medium / high)"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "WORK DONE"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "PRODUCTS USED"),
    ("Helvetica", 9, "Product | Active ingredient | Batch no. | Quantity | Area can be used again from"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "BAIT STATIONS CHECKED"),
    ("Helvetica", 9, "Station no. | Condition | Activity | Action taken"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "RECOMMENDATIONS FOR THE SITE  (proofing, hygiene, storage)"),
    ("Helvetica", 10, "__________________________________________________________________________"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "NEXT VISIT"),
    ("Helvetica", 10, "Date: ____________   Time: _______"),
    ("Helvetica", 10, ""),
    ("Helvetica-Bold", 11, "CALLBACK TERMS"),
    ("Helvetica", 9, CALLBACK),
    ("Helvetica", 10, ""),
    ("Helvetica", 10, "Technician signature: ______________        Client signature: ______________"),
    ("Helvetica", 10, ""),
    ("Helvetica", 8, "A Kavach service record or certificate is not a government approval."),
]

content = ["BT"]
y = 790
for font, size, text in LINES:
    fkey = "/F1" if font == "Helvetica" else "/F2"
    text = text.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
    content.append(f"{fkey} {size} Tf 1 0 0 1 50 {y} Tm ({text}) Tj")
    y -= size + 7
content.append("ET")
stream = "\n".join(content).encode("latin-1")

objs = [
    b"<< /Type /Catalog /Pages 2 0 R >>",
    b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
]

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

dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kavach-sample-service-record.pdf")
with open(dest, "wb") as f:
    f.write(out)
print("Wrote", dest, len(out), "bytes")
