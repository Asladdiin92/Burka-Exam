import sys
import zipfile
import xml.etree.ElementTree as ET
import json
import base64
import os
import re

sys.stdout.reconfigure(encoding="utf-8")

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793137583530_c8d769f0.docx"
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "../seeds/data/physics_esslce_2016_booklet177.json")

MASTER_KEY = {
    1:'A', 2:'C', 3:'A', 4:'D', 5:'A', 6:'C', 7:'D', 8:'A', 9:'B', 10:'D',
    11:'A', 12:'C', 13:'D', 14:'A', 15:'C', 16:'B', 17:'C', 18:'A', 19:'B', 20:'D',
    21:'A', 22:'C', 23:'B', 24:'D', 25:'C', 26:'A', 27:'C', 28:'D', 29:'B', 30:'B',
    31:'D', 32:'A', 33:'C', 34:'B', 35:'C', 36:'A', 37:'D', 38:'B', 39:'D', 40:'D',
    41:'A', 42:'A', 43:'B', 44:'A', 45:'A', 46:'D', 47:'B', 48:'A', 49:'C', 50:'B',
    51:'C', 52:'B', 53:'C', 54:'B', 55:'D', 56:'B', 57:'C', 58:'C', 59:'B', 60:'A'
}

def clean_option(opt_str):
    # Strip leading option label (A., B., C., D.)
    s = re.sub(r'^[A-D]\.\s*', '', opt_str).strip()
    # Strip checkmark or [Correct] marker
    s = re.sub(r'[\u2713\u2714]?\s*\[Correct\]\s*', '', s, flags=re.IGNORECASE).strip()
    return s

def build_physics_2016():
    print(f"Reading Physics 2016 DOCX: {DOCX_PATH}")
    if not os.path.exists(DOCX_PATH):
        raise FileNotFoundError(f"DOCX file not found at {DOCX_PATH}")

    with zipfile.ZipFile(DOCX_PATH) as z:
        xml_content = z.read("word/document.xml")
        rels_content = z.read("word/_rels/document.xml.rels")

        rels_tree = ET.fromstring(rels_content)
        rel_map = {rel.attrib["Id"]: rel.attrib.get("Target") for rel in rels_tree}

        tree = ET.fromstring(xml_content)
        body = tree.find("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}body")
        w = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
        a = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
        r = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

        tbls = [child for child in body if child.tag.endswith("tbl")]
        if len(tbls) < 63:
            raise ValueError(f"Expected at least 63 tables, found {len(tbls)}")

        q_tables = tbls[3:63]
        print(f"Extracted {len(q_tables)} question tables.")

        questions = []
        for idx, tbl in enumerate(q_tables, start=1):
            rows = tbl.findall(w + "tr")
            if len(rows) != 4:
                raise ValueError(f"Q{idx}: Expected 4 rows, got {len(rows)}")

            # Row 0: Metadata Header
            header_text = "".join([n.text for n in rows[0].iter(w + "t") if n.text]).strip()
            h_match = re.match(
                r"QUESTION\s+(\d+)\s*\|\s*Grade:\s*([^|]+)\s*\|\s*Topic:\s*([^|]+)\s*\|\s*Difficulty:\s*(.*)",
                header_text,
                re.IGNORECASE
            )
            if not h_match:
                raise ValueError(f"Q{idx}: Header format unexpected: '{header_text}'")

            qnum = int(h_match.group(1))
            grade = h_match.group(2).strip()
            topic = h_match.group(3).strip()
            difficulty = h_match.group(4).strip().lower()

            # Row 1: Prompt
            prompt_text = "".join([n.text for n in rows[1].iter(w + "t") if n.text]).strip()
            # Clean prompt if it has strange spacing or table dumps
            prompt_text = re.sub(r"\s+", " ", prompt_text).strip()

            if qnum == 27:
                prompt_text = (
                    "The following table shows the density of different objects at 20°C:\n\n"
                    "| Substance | Density (kg/m³) | Substance | Density (kg/m³) |\n"
                    "|---|---|---|---|\n"
                    "| Water | 1000 | Gold | 19300 |\n"
                    "| Seawater | 1025 | Bone | 1800 |\n"
                    "| Blood | 1060 | Air | 1.29 |\n"
                    "| Gasoline | 680 | Copper | 8920 |\n"
                    "| Ice (0°C) | 916 | Iron | 7860 |\n\n"
                    "Based on the information given in the table, if we identify substances that sink and float with respect to other substances, which one of the following is correct?"
                )

            # Check if there is an embedded image in the table
            blips = tbl.findall(f".//{{{a.strip('{}')}}}blip")
            image_url = None
            if blips:
                embed_id = blips[0].attrib.get(f"{{{r.strip('{}')}}}embed")
                if embed_id and embed_id in rel_map:
                    target_path = "word/" + rel_map[embed_id]
                    img_bytes = z.read(target_path)
                    image_url = "data:image/png;base64," + base64.b64encode(img_bytes).decode("utf-8")

            # Row 2: Options
            opt_row_text = "".join([n.text for n in rows[2].iter(w + "t") if n.text]).strip()
            parts = re.split(r"(?=[A-D]\.\s+)", opt_row_text)
            parts = [p.strip() for p in parts if p.strip()]
            if len(parts) != 4:
                raise ValueError(f"Q{idx}: Expected 4 option parts, got {len(parts)}: '{opt_row_text}'")

            clean_opts = [clean_option(p) for p in parts]
            for o_i, opt in enumerate(clean_opts):
                if not opt:
                    raise ValueError(f"Q{idx}: Option {chr(65+o_i)} is empty!")

            # Row 3: Correct Answer + Explanation
            ans_row_text = "".join([n.text for n in rows[3].iter(w + "t") if n.text]).strip()
            ans_match = re.match(
                r"Correct\s*Answer:\s*([A-D])\s*Explanation:\s*(.*)",
                ans_row_text,
                re.DOTALL | re.IGNORECASE
            )
            if not ans_match:
                raise ValueError(f"Q{idx}: Failed to parse answer row: '{ans_row_text}'")

            correct_ans = ans_match.group(1).upper()
            explanation = re.sub(r"\s+", " ", ans_match.group(2)).strip()

            # Cross-verify with Master Key
            expected_ans = MASTER_KEY[qnum]
            if correct_ans != expected_ans:
                raise ValueError(f"Q{qnum}: Answer mismatch! Parsed '{correct_ans}', Master Key expects '{expected_ans}'")

            question_obj = {
                "questionNumber": qnum,
                "grade": grade,
                "topic": topic,
                "difficulty": difficulty if difficulty in ["easy", "medium", "hard"] else "medium",
                "prompt": prompt_text,
                "options": clean_opts,
                "correctAnswer": correct_ans,
                "explanation": explanation,
                "imageUrl": image_url
            }
            questions.append(question_obj)

        print(f"Successfully processed {len(questions)} questions.")
        with_images = sum(1 for q in questions if q["imageUrl"])
        print(f"Questions with embedded diagrams: {with_images}")

        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)

        file_size = os.path.getsize(OUTPUT_JSON)
        print(f"Saved master JSON to: {OUTPUT_JSON} ({file_size:,} bytes)")
        return questions

if __name__ == "__main__":
    build_physics_2016()
