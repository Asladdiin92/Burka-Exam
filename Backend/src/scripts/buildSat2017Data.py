import sys
import zipfile
import xml.etree.ElementTree as ET
import json
import base64
import os
import re

sys.stdout.reconfigure(encoding="utf-8")

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793146397204_9fa70921.docx"
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "../seeds/data/sat_esslce_2017_master.json")

PASSAGE_1 = (
    "**[Reading Comprehension — Passage I]**\n"
    "What is the matter with our reading is casualness, languor, preoccupation. We don't give the book a chance. "
    "We don't put ourselves at the disposal of the book. It is impossible to read properly without using all one's engine power. "
    "If we are not tired after reading, common sense is not in us. How one should grapple with a superior and not be out of breath?\n\n"
    "But even if we read with the whole force of our brain, and do nothing else, common sense is still not in us, while sublime conceit is. "
    "For we are assuming that, without further trouble, we can possess, co-ordinate, and assimilate all the ideas and sensations rapidly "
    "offered to us by a mind greater than our own. The assumption has only to be stated in order to appear in its monstrous absurdity. "
    "Hence, it follows that something remains to be done; This something is the act of reflection. "
    "Reading without subsequent reflection is ridiculous; it is equally a proof of folly and vanity.\n"
    "*(Source: Warriner, J. E. et al. 1958. English Grammar & Composition. P420)*\n\n"
)

PASSAGE_2 = (
    "**[Reading Comprehension — Passage II]**\n"
    "If you want transition from being an employee to an employer, the first step is to serve your current employer as you would wish to be served. "
    "Most successful employers today have risen through the ranks, relying on their ability to manage and direct others effectively by suppressing the vices of employers. "
    "They started with no more opportunities than you have now.\n\n"
    "There are people in your community who could benefit from your skills and vice versa. For example, Mr. John Smith wants to sell his grocery store and start a movie theater, "
    "while someone else with a movie theater might want to trade for a grocery store. If you can connect these two individuals, you will serve both and earn a commission in the process.\n"
    "*(Source: Hill, N. 2003. The Law of Success: The 21st Century Edition. pp. 633-634)*\n\n"
)

STUDY_GRAPH_STIMULUS = (
    "**[Data Interpretation — Student Study Pattern for 32 Days]**\n"
    "The bar graph displays the distribution of daily study hours recorded over 32 days:\n"
    "• 2 hours: 10 days\n"
    "• 4 hours: 7 days\n"
    "• 6 hours: 7 days\n"
    "• 8 hours: 5 days\n"
    "• 10 hours: 3 days\n\n"
)

def clean_option(opt_str):
    s = re.sub(r'^[A-D]\.\s*', '', opt_str).strip()
    s = re.sub(r'[\u2713\u2714]?\s*\[Correct\]\s*', '', s, flags=re.IGNORECASE).strip()
    return s

def build_sat_2017():
    print(f"Reading SAT 2017 DOCX: {DOCX_PATH}")
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

        # Table 2 is Master Key
        t2_rows = tbls[2].findall(w + "tr")
        meta_by_qnum = {}
        for row in t2_rows[1:]:
            cells = row.findall(w + "tc")
            qnum = int("".join([n.text for n in cells[0].iter(w + "t") if n.text]).strip())
            ans_raw = "".join([n.text for n in cells[1].iter(w + "t") if n.text]).strip()
            grade = "".join([n.text for n in cells[2].iter(w + "t") if n.text]).strip()
            topic = "".join([n.text for n in cells[3].iter(w + "t") if n.text]).strip()
            diff = "".join([n.text for n in cells[4].iter(w + "t") if n.text]).strip().lower()
            ans = ans_raw[0].upper()
            meta_by_qnum[qnum] = {
                "grade": grade,
                "topic": topic,
                "difficulty": diff if diff in ["easy", "medium", "hard"] else "medium",
                "master_ans": ans
            }

        print(f"Loaded metadata for {len(meta_by_qnum)} questions from Table 2.")

        # Filter question tables
        q_tables = []
        for tbl in tbls:
            first_txt = "".join([n.text for n in tbl.iter(w + "t") if n.text]).strip()
            if first_txt.startswith("QUESTION "):
                q_tables.append(tbl)

        if len(q_tables) != 60:
            raise ValueError(f"Expected 60 question tables, found {len(q_tables)}")

        questions = []
        for q_idx, tbl in enumerate(q_tables, start=1):
            rows = tbl.findall(w + "tr")
            if len(rows) != 4:
                raise ValueError(f"Q{q_idx}: Expected 4 rows, found {len(rows)}")

            meta = meta_by_qnum[q_idx]

            # Row 1: Prompt
            prompt_text = "".join([n.text for n in rows[1].iter(w + "t") if n.text]).strip()
            # Clean prompt
            prompt_text = re.sub(r"[ \t]+", " ", prompt_text).strip()

            # Prepend Reading Passages or graph stimulus
            if 7 <= q_idx <= 10:
                prompt_text = PASSAGE_1 + prompt_text
            elif 29 <= q_idx <= 32:
                prompt_text = PASSAGE_2 + prompt_text
            elif 47 <= q_idx <= 48:
                prompt_text = STUDY_GRAPH_STIMULUS + prompt_text

            # Check for images in table
            blips = tbl.findall(f".//{{{a.strip('{}')}}}blip")
            image_url = None
            if blips:
                # For Q36 use image1.png (vector diagram), for Q46 use image3.png (vector bar chart)
                embed_id = blips[0].attrib.get(f"{{{r.strip('{}')}}}embed")
                if embed_id and embed_id in rel_map:
                    target_path = "word/" + rel_map[embed_id]
                    img_bytes = z.read(target_path)
                    image_url = "data:image/png;base64," + base64.b64encode(img_bytes).decode("utf-8")

            # Row 2: Options
            opt_text = "".join([n.text for n in rows[2].iter(w + "t") if n.text]).strip()
            parts = re.split(r"(?=[A-D]\.\s+)", opt_text)
            parts = [p.strip() for p in parts if p.strip()]
            if len(parts) != 4:
                raise ValueError(f"Q{q_idx}: Expected 4 options, found {len(parts)} in '{opt_text}'")

            clean_opts = [clean_option(p) for p in parts]

            # Row 3: Correct Answer + Explanation
            ans_text = "".join([n.text for n in rows[3].iter(w + "t") if n.text]).strip()
            ans_m = re.search(r"Correct\s*Answer:\s*([A-D])", ans_text, re.IGNORECASE)
            if not ans_m:
                raise ValueError(f"Q{q_idx}: Could not match Correct Answer in '{ans_text[:60]}'")
            correct_ans = ans_m.group(1).upper()

            expl_m = re.search(r"Explanation:\s*(.*)", ans_text, re.DOTALL | re.IGNORECASE)
            explanation = expl_m.group(1).strip() if expl_m else ans_text
            explanation = re.sub(r"[ \t]+", " ", explanation).strip()

            # Assign curriculum Unit
            if 1 <= q_idx <= 6:
                unit_title = "Unit 2: Analytical & Logical Reasoning (Puzzles, Deductions & Critical Thinking)"
            elif (7 <= q_idx <= 10) or (29 <= q_idx <= 32):
                unit_title = "Unit 3: Reading Comprehension (Informational & Scientific Texts)"
            elif (11 <= q_idx <= 18) or (23 <= q_idx <= 28) or (33 <= q_idx <= 35):
                unit_title = "Unit 1: Verbal Classification & Vocabulary (Synonyms & Antonyms)"
            elif 19 <= q_idx <= 22:
                unit_title = "Unit 4: Verbal Analogies"
            elif 46 <= q_idx <= 48:
                unit_title = "Unit 5: Data Interpretation & Statistical Analysis"
            else:
                unit_title = "Unit 6: Quantitative Reasoning & Mathematical Problem Solving"

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

        print(f"Successfully processed {len(questions)} SAT questions.")
        with_images = sum(1 for q in questions if q["imageUrl"])
        print(f"Questions with embedded diagrams: {with_images}")

        os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)

        file_size = os.path.getsize(OUTPUT_JSON)
        print(f"Saved master JSON to: {OUTPUT_JSON} ({file_size:,} bytes)")
        return questions

if __name__ == "__main__":
    build_sat_2017()
