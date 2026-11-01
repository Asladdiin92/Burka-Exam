import sys
import zipfile
import xml.etree.ElementTree as ET
import json
import base64
import os
import re

sys.stdout.reconfigure(encoding="utf-8")

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793147678019_23063ca0.docx"
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "../seeds/data/physics_esslce_2017_booklet321.json")

def clean_option(opt_str):
    s = re.sub(r'^[A-D]\.\s*', '', opt_str).strip()
    s = re.sub(r'[\u2713\u2714\u2718\u2714\u2713]?\s*\[Correct\]\s*', '', s, flags=re.IGNORECASE).strip()
    return s

def build_physics_2017():
    print(f"Reading Physics 2017 DOCX: {DOCX_PATH}")
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

        # Table 3 is Master Key
        t3_rows = tbls[3].findall(w + "tr")
        meta_by_qnum = {}
        for row in t3_rows[1:]:
            cells = row.findall(w + "tc")
            qnum_txt = "".join([n.text for n in cells[0].iter(w + "t") if n.text]).strip()
            qnum = int(re.sub(r"[^\d]", "", qnum_txt))
            grade = "".join([n.text for n in cells[1].iter(w + "t") if n.text]).strip()
            topic = "".join([n.text for n in cells[2].iter(w + "t") if n.text]).strip()
            diff = "".join([n.text for n in cells[3].iter(w + "t") if n.text]).strip().lower()
            ans_raw = "".join([n.text for n in cells[4].iter(w + "t") if n.text]).strip()
            ans_m = re.search(r"Option\s*([A-D])|([A-D])", ans_raw, re.IGNORECASE)
            ans = (ans_m.group(1) or ans_m.group(2)).upper() if ans_m else "A"
            meta_by_qnum[qnum] = {
                "grade": grade,
                "topic": topic,
                "difficulty": diff if diff in ["easy", "medium", "hard"] else "medium",
                "master_ans": ans
            }

        print(f"Loaded metadata for {len(meta_by_qnum)} questions from Table 3.")

        q_tables = tbls[4:]
        if len(q_tables) != 60:
            raise ValueError(f"Expected 60 question tables, found {len(q_tables)}")

        questions = []
        for q_idx, tbl in enumerate(q_tables, start=1):
            rows = tbl.findall(w + "tr")
            if len(rows) != 4:
                raise ValueError(f"Q{q_idx}: Expected 4 rows, found {len(rows)}")

            meta = meta_by_qnum[q_idx]

            # Row 1: Prompt + Options
            r1_txt = "".join([n.text for n in rows[1].iter(w + "t") if n.text]).strip()
            parts = re.split(r"(?=[A-D]\.\s{2,})", r1_txt)
            if len(parts) != 5:
                raise ValueError(f"Q{q_idx}: Expected 5 parts (1 prompt + 4 options), got {len(parts)}: {parts}")

            prompt_text = re.sub(r"^Q\d+\.\s*", "", parts[0]).strip()
            prompt_text = re.sub(r"[ \t]+", " ", prompt_text).strip()

            options_raw = [p.strip() for p in parts[1:]]
            clean_opts = [clean_option(p) for p in options_raw]

            # Check for images in table
            blips = tbl.findall(f".//{{{a.strip('{}')}}}blip")
            image_url = None
            if blips:
                embed_id = blips[0].attrib.get(f"{{{r.strip('{}')}}}embed")
                if embed_id and embed_id in rel_map:
                    target_path = "word/" + rel_map[embed_id]
                    img_bytes = z.read(target_path)
                    image_url = "data:image/png;base64," + base64.b64encode(img_bytes).decode("utf-8")

            # Row 2: Correct Answer
            r2_txt = "".join([n.text for n in rows[2].iter(w + "t") if n.text]).strip()
            ans_m = re.search(r"Correct\s*Answer:\s*([A-D])", r2_txt, re.IGNORECASE)
            if not ans_m:
                raise ValueError(f"Q{q_idx}: Could not parse answer from '{r2_txt}'")
            correct_ans = ans_m.group(1).upper()

            # Row 3: Explanation
            r3_txt = "".join([n.text for n in rows[3].iter(w + "t") if n.text]).strip()
            explanation = re.sub(r"^Explanation\s*(&\s*Step-by-Step\s*Solution)?:\s*", "", r3_txt).strip()
            explanation = re.sub(r"[ \t]+", " ", explanation).strip()

            # Map to Curriculum Chapter
            if q_idx in [43, 44]:
                unit_title = "Chapter 1: Application of Physics in Other Fields"
            elif q_idx in [1, 3, 4, 5, 6, 31, 33, 35, 36, 40, 46, 47]:
                unit_title = "Unit 1: Measurement, Vectors & Kinematics"
            elif q_idx in [2, 7, 8, 9, 10, 11, 12, 13, 16, 17, 18, 37, 38, 39, 41, 42]:
                unit_title = "Unit 2: Dynamics, Work, Energy & Momentum"
            elif q_idx in [48, 52, 53]:
                unit_title = "Unit 3: Rotational Motion & Equilibrium"
            elif q_idx in [15, 22, 23, 49, 50, 54]:
                unit_title = "Unit 4: Properties of Matter & Fluid Mechanics"
            elif q_idx in [19, 21, 24, 45]:
                unit_title = "Unit 5: Thermal Physics & Thermodynamics"
            elif q_idx in [14, 20, 26, 32, 34]:
                unit_title = "Unit 6: Oscillations, Waves & Optics"
            else:
                unit_title = "Unit 7: Electricity, Magnetism & Electromagnetism"

            question_obj = {
                "questionNumber": q_idx,
                "grade": meta["grade"],
                "topic": meta["topic"],
                "unit": unit_title,
                "difficulty": meta["difficulty"],
                "prompt": prompt_text,
                "options": clean_opts,
                "correctAnswer": correct_ans,
                "explanation": explanation,
                "imageUrl": image_url
            }
            questions.append(question_obj)

        print(f"Successfully processed {len(questions)} Physics questions.")
        with_images = sum(1 for q in questions if q["imageUrl"])
        print(f"Questions with embedded diagrams: {with_images}")

        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)

        file_size = os.path.getsize(OUTPUT_JSON)
        print(f"Saved master JSON to: {OUTPUT_JSON} ({file_size:,} bytes)")
        return questions

if __name__ == "__main__":
    build_physics_2017()
