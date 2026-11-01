import sys
import zipfile
import xml.etree.ElementTree as ET
import json
import base64
import os
import re

sys.stdout.reconfigure(encoding="utf-8")

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793143634729_b3dff7dc.docx"
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "../seeds/data/mathematics_esslce_2017_booklet291.json")

def clean_option(opt_str):
    s = re.sub(r'^[A-D]\.\s*', '', opt_str).strip()
    s = re.sub(r'[\u2713\u2714]?\s*\[Correct\]\s*', '', s, flags=re.IGNORECASE).strip()
    return s

def build_math_2017():
    print(f"Reading Mathematics 2017 DOCX: {DOCX_PATH}")
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

        children = list(body)

        # 1. Read Master Index from Table 1
        tbls = [child for child in body if child.tag.endswith("tbl")]
        tbl1 = tbls[1]
        t1_rows = tbl1.findall(w + "tr")
        meta_by_qnum = {}
        for row in t1_rows[1:]:
            cells = row.findall(w + "tc")
            qnum = int("".join([n.text for n in cells[0].iter(w + "t") if n.text]).strip())
            grade = "".join([n.text for n in cells[1].iter(w + "t") if n.text]).strip()
            topic = "".join([n.text for n in cells[2].iter(w + "t") if n.text]).strip()
            difficulty = "".join([n.text for n in cells[3].iter(w + "t") if n.text]).strip().lower()
            ans_raw = "".join([n.text for n in cells[4].iter(w + "t") if n.text]).strip()
            ans = ans_raw[0].upper()
            meta_by_qnum[qnum] = {
                "grade": grade,
                "topic": topic,
                "difficulty": difficulty if difficulty in ["easy", "medium", "hard"] else "medium",
                "master_ans": ans,
                "master_ans_raw": ans_raw
            }

        print(f"Loaded metadata for {len(meta_by_qnum)} questions from Master Index Table.")

        # 2. Extract Question Blocks
        q_blocks = []
        current_q = None

        for child in children:
            tag = child.tag.split("}")[-1]
            if tag == "tbl":
                txt = "".join([n.text for n in child.iter(w + "t") if n.text]).strip()
                if txt.startswith("QUESTION "):
                    m = re.match(r"QUESTION\s+(\d+)", txt)
                    if m:
                        qnum = int(m.group(1))
                        if current_q:
                            q_blocks.append(current_q)
                        current_q = {
                            "qnum": qnum,
                            "header_table": child,
                            "elements": [],
                            "expl_table": None
                        }
                        continue
                elif "Correct Answer:" in txt:
                    if current_q:
                        current_q["expl_table"] = child
                        continue

            if current_q and current_q["expl_table"] is None:
                current_q["elements"].append(child)

        if current_q:
            q_blocks.append(current_q)

        if len(q_blocks) != 60:
            raise ValueError(f"Expected 60 question blocks, found {len(q_blocks)}")

        questions = []
        for q in q_blocks:
            qnum = q["qnum"]
            meta = meta_by_qnum[qnum]

            prompt_parts = []
            options_raw = []
            image_url = None

            for el in q["elements"]:
                txt = "".join([n.text for n in el.iter(w + "t") if n.text]).strip()
                blips = el.findall(f".//{{{a.strip('{}')}}}blip")
                embeds = [b.attrib.get(f"{{{r.strip('{}')}}}embed") for b in blips]
                targets = [rel_map.get(e) for e in embeds if e in rel_map]
                if targets:
                    target_path = "word/" + targets[0]
                    img_bytes = z.read(target_path)
                    image_url = "data:image/png;base64," + base64.b64encode(img_bytes).decode("utf-8")

                if not txt:
                    continue

                if re.match(r"^[A-D]\.\s+", txt):
                    options_raw.append(txt)
                else:
                    if not options_raw:
                        prompt_parts.append(txt)

            if len(options_raw) != 4:
                raise ValueError(f"Q{qnum}: Expected 4 options, found {len(options_raw)}")

            clean_options = [clean_option(opt) for opt in options_raw]
            full_prompt = "\n\n".join(prompt_parts).strip()
            # Clean excessive spacing
            full_prompt = re.sub(r"[ \t]+", " ", full_prompt)

            # Parse Explanation table
            expl_txt = "".join([n.text for n in q["expl_table"].iter(w + "t") if n.text]).strip()
            ans_m = re.match(r"Correct\s*Answer:\s*([A-D])", expl_txt, re.IGNORECASE)
            if not ans_m:
                raise ValueError(f"Q{qnum}: Failed to match Correct Answer in: {expl_txt[:60]}")
            parsed_ans = ans_m.group(1).upper()

            expl_m = re.search(r"Explanation:\s*(.*)", expl_txt, re.DOTALL | re.IGNORECASE)
            explanation = expl_m.group(1).strip() if expl_m else expl_txt

            # For Q6: Note in explanation covers both B (exact mathematically) and C (source key)
            # Default to parsed_ans (which aligns with master_ans)
            correct_ans = parsed_ans

            question_obj = {
                "questionNumber": qnum,
                "grade": meta["grade"],
                "topic": meta["topic"],
                "difficulty": meta["difficulty"],
                "prompt": full_prompt,
                "options": clean_options,
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
    build_math_2017()
