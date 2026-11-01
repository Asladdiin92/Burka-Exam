"""
Build Biology ESSLCE 2016 E.C. (Booklet 153) exam data JSON from the uploaded Word document.
Parses all 100 questions with prompts, options, correct answers, explanations, difficulty,
topic/grade mappings, embedded reference tables, and base64 biological diagrams (Eye Anatomy, Biomass Pyramid).
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import os
import re
import base64
from zipfile import ZipFile
import xml.etree.ElementTree as ET

DOCX_PATH = r'C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793119166948_9d880371.docx'

TABLE_Q76 = (
    "A student made an experiment to observe the effect of temperature on catalase of mashed potato. "
    "After three parallel trials, he obtained the following results:\n\n"
    "[Experimental Data Table: Effect of Temperature on Catalase Activity]\n"
    "| Temperature / °C | Trial 1 (s) | Trial 2 (s) | Trial 3 (s) | Mean Time (s) | Rate (cm³/sec) |\n"
    "| :---: | :---: | :---: | :---: | :---: | :---: |\n"
    "| 10 | 54 | 47 | 43 | 48 | 0.69 |\n"
    "| 20 | 12 | 14 | 16 | 14 | 2.36 |\n"
    "| 30 | 5 | 5 | 5 | 5 | 6.6 |\n"
    "| 45 | 14 | 11 | 11 | 12 | 2.75 |\n"
    "| 50 | 73 | 71 | 57 | 67 | 0.5 |\n"
    "| 55 | 119 | 109 | 132 | 120 | 0.27 |\n\n"
    "At which temperature was the reaction fastest?"
)

TABLE_Q85 = (
    "A student conducted a food test on three unknown food samples and obtained results as presented in the table below:\n\n"
    "[Biochemical Food Test Results]\n"
    "| No | Procedures used | Food sample 1 | Food sample 2 | Food sample 3 |\n"
    "| :---: | :--- | :---: | :---: | :---: |\n"
    "| 1. | Mixed with Benedict's reagent and heated | Blue | Red | Yellow |\n"
    "| 2. | Mixed with ethanol and poured into water | Colourless | Colourless | Colourless |\n"
    "| 3. | Mixed with Biuret's reagent | Mauve | Mauve | Mauve |\n"
    "| 4. | Iodine solution | Brown | Brown | Brown |\n\n"
    "What do you conclude from the result of the above experiment?"
)

TABLE_Q98 = (
    "This item is based on the following table about the function of cellular organelles:\n\n"
    "[Cellular Organelle Function Reference Table]\n"
    "| No | Features | Mitochondria | Golgi body | Lysosomes | Ribosomes |\n"
    "| :---: | :--- | :---: | :---: | :---: | :---: |\n"
    "| 1 | The site of protein synthesis | NO | YES | NO | YES |\n"
    "| 2 | Modifies and distributes molecules | NO | YES | NO | NO |\n"
    "| 3 | Site of aerobic respiration | YES | NO | NO | NO |\n"
    "| 4 | Digest foreign cells | NO | NO | YES | YES |\n\n"
    "Which numbers in the above table show the correct function of the given organelles?"
)


def resolve_chapter(qnum, grade_str, topic_str):
    """Map question to exact curriculum chapter title."""
    t_lower = topic_str.lower()
    g_lower = grade_str.lower()

    # Grade 12 units
    if "evolution" in t_lower:
        return "Unit 4: Evolution (Grade 12)"
    if "microorganism" in t_lower and ("grade 12" in g_lower or "unit 1" in t_lower or "conjugation" in t_lower or "fungi" in t_lower or "viruses" in t_lower):
        return "Unit 1: Microorganisms (Grade 12)"
    if "ecology" in t_lower or "pyramid" in t_lower or "trophic" in t_lower or "carbon cycle" in t_lower or "climate change" in t_lower or "greenhouse" in t_lower or "unfccc" in t_lower:
        if "grade 12" in g_lower or "grade 10 & grade 12" in g_lower or "grade 9 & grade 12" in g_lower:
            return "Unit 2: Ecology (Grade 12)"
    if "conservation" in t_lower or "national park" in t_lower or "endemic" in t_lower:
        return "Unit 5: Conservation of Natural Resources (Grade 10)"
    if "biotechnology" in t_lower:
        if "grade 12" in g_lower:
            return "Unit 1: Microorganisms (Grade 12)"
        return "Unit 1: Biotechnology (Grade 10)"
    if "heredity" in t_lower or "mendel" in t_lower or "chromosome" in t_lower or "meiosis" in t_lower or "selective breeding" in t_lower:
        return "Unit 2: Heredity (Grade 10)"
    if "plants" in t_lower or "seed germination" in t_lower or "apical dominance" in t_lower or "root hair" in t_lower:
        return "Unit 4: Food Making and Growth in Plants (Grade 10)"

    # Grade 11 units
    if "enzyme" in t_lower or "catalase" in t_lower or "allosteric" in t_lower or "lock-and-key" in t_lower:
        return "Unit 3: Enzymes (Grade 11)"
    if "energy transformation" in t_lower or "respiration" in t_lower or "photosynthesis" in t_lower or "glycolysis" in t_lower or "atp" in t_lower or "photophosphorylation" in t_lower:
        return "Unit 5: Energy Transformation (Grade 11)"
    if "biochemical molecules" in t_lower or "properties of water" in t_lower or "organic molecules" in t_lower or "lipids" in t_lower or "hemoglobin" in t_lower or "carbohydrates" in t_lower or "food test" in t_lower:
        return "Unit 2: Biochemical Molecules (Grade 11)"
    if "the science of biology" in t_lower or "scientific method" in t_lower or "tools of a biologist" in t_lower or "scientific report" in t_lower:
        return "Unit 1: The Science of Biology (Grade 11)"
    if "cell biology" in t_lower and ("centrifugation" in t_lower or "eukaryotic" in t_lower or "fluid mosaic" in t_lower or "organelles" in t_lower or "osmosis" in t_lower or "grade 11" in g_lower):
        return "Unit 4: Cell Biology (Grade 11)"

    # Grade 10 Human Biology
    if "grade 10" in g_lower and "human biology" in t_lower:
        return "Unit 3: Human Biology and Health (Grade 10)"

    # Grade 9 units
    if "classification" in t_lower or "binomial" in t_lower or "monera" in t_lower or "mollusca" in t_lower:
        return "Unit 5: Classification (Grade 9)"
    if "grade 9" in g_lower and "human biology" in t_lower:
        return "Unit 3: Human Biology and Health (Grade 9)"
    if "hiv" in t_lower:
        return "Unit 3: Human Biology and Health (Grade 9)"
    if "research institute" in t_lower:
        return "Unit 1: Biology and Technology (Grade 9)"
    if "environment" in t_lower or "adaptation" in t_lower:
        return "Unit 6: Environment (Grade 9)"

    # Default based on grade
    if "grade 12" in g_lower:
        return "Unit 1: Microorganisms (Grade 12)"
    if "grade 11" in g_lower:
        return "Unit 4: Cell Biology (Grade 11)"
    if "grade 10" in g_lower:
        return "Unit 3: Human Biology and Health (Grade 10)"
    return "Unit 3: Human Biology and Health (Grade 9)"


def extract_images(docx_path):
    """Extract diagrams as base64 data URIs."""
    z = ZipFile(docx_path)
    images = {}
    for name, qnum in [('word/media/image2.png', 32), ('word/media/image3.png', 52)]:
        if name in z.namelist():
            data = z.read(name)
            b64 = base64.b64encode(data).decode('utf-8')
            images[qnum] = f"data:image/png;base64,{b64}"
            print(f"Extracted {name} for Q{qnum} (Data URI len: {len(images[qnum])})")
    return images


def parse_bio_exam(docx_path):
    images = extract_images(docx_path)

    z = ZipFile(docx_path)
    tree = ET.parse(z.open('word/document.xml'))
    root = tree.getroot()
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body = root.find('.//w:body', ns)

    q_tables = []
    for child in body:
        if child.tag.endswith('tbl'):
            txt = ' '.join(child.itertext()).strip()
            m = re.search(r'QUESTION\s+(\d+)', txt, re.IGNORECASE)
            if m:
                q_tables.append((int(m.group(1)), txt))

    q_tables.sort(key=lambda x: x[0])
    print(f"Found {len(q_tables)} question tables in docx.")

    items = []

    for qnum, txt in q_tables:
        # Grade mapping
        grade_m = re.search(r'Grade Mapping:\s*(.*?)(?=\s*\|\s*Topic:)', txt)
        grade_str = grade_m.group(1).strip() if grade_m else "Grade 12"

        # Topic
        topic_m = re.search(r'Topic:\s*(.*?)(?=\s*\|\s*Difficulty:)', txt)
        topic_str = topic_m.group(1).strip() if topic_m else "Biology"

        # Difficulty
        diff_m = re.search(r'Difficulty:\s*(\w+)', txt)
        difficulty = diff_m.group(1).lower() if diff_m else "medium"
        if difficulty not in ("easy", "medium", "hard"):
            difficulty = "medium"

        # Options - use \b[A-D]\.\s{2,} to prevent premature splitting on text ending with 'B.' etc.
        opt_match = re.search(r'\bA\.\s{2,}(.*?)\bB\.\s{2,}(.*?)\bC\.\s{2,}(.*?)\bD\.\s{2,}(.*?)(?=\s*Correct Answer:)', txt)
        if not opt_match:
            raise ValueError(f"Could not parse options for Question {qnum}")

        raw_opts = [
            opt_match.group(1).strip(),
            opt_match.group(2).strip(),
            opt_match.group(3).strip(),
            opt_match.group(4).strip()
        ]
        clean_opts = [re.sub(r'\s*✓\s*\[Correct Answer\]\s*', '', o).strip() for o in raw_opts]

        # Correct Answer
        ans_m = re.search(r'Correct Answer:\s*([A-D])', txt)
        if not ans_m:
            raise ValueError(f"Could not parse correct answer for Question {qnum}")
        correct_ans = ans_m.group(1)

        # Explanation
        expl_m = re.search(r'Explanation:\s*(.*)$', txt)
        explanation = expl_m.group(1).strip() if expl_m else ""

        # Prompt
        if qnum == 76:
            prompt = TABLE_Q76
        elif qnum == 85:
            prompt = TABLE_Q85
        elif qnum == 98:
            prompt = TABLE_Q98
        else:
            diff_end = diff_m.end() if diff_m else 0
            raw_prompt = txt[diff_end:opt_match.start()].strip()
            prompt = re.sub(r'^\s*\|\s*', '', raw_prompt).strip()

        chapter_title = resolve_chapter(qnum, grade_str, topic_str)

        item = {
            "questionNumber": qnum,
            "grade": grade_str,
            "unit": chapter_title,
            "topic": topic_str,
            "difficulty": difficulty,
            "prompt": prompt,
            "options": clean_opts,
            "correctAnswer": correct_ans,
            "explanation": explanation
        }

        if qnum in images:
            item["imageUrl"] = images[qnum]

        items.append(item)

    items.sort(key=lambda x: x["questionNumber"])
    return items


def main():
    print("=" * 60)
    print("Building Biology ESSLCE 2016 E.C. (Booklet 153) Exam Data")
    print("=" * 60)

    items = parse_bio_exam(DOCX_PATH)
    print(f"\nParsed {len(items)} questions.")

    if len(items) != 100:
        raise ValueError(f"Expected 100 questions, got {len(items)}")

    errors = []
    for item in items:
        qn = item["questionNumber"]
        if len(item["options"]) != 4:
            errors.append(f"Q{qn}: has {len(item['options'])} options")
        if item["correctAnswer"] not in ("A", "B", "C", "D"):
            errors.append(f"Q{qn}: invalid answer '{item['correctAnswer']}'")
        if not item["prompt"]:
            errors.append(f"Q{qn}: empty prompt")
        if not item["explanation"]:
            errors.append(f"Q{qn}: empty explanation")
        for oi, opt in enumerate(item["options"]):
            if re.match(r'^[A-D]\.\s', opt):
                errors.append(f"Q{qn}: option {oi} has letter prefix '{opt[:20]}'")

    if errors:
        print(f"Validation ERRORS ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("All 100 questions passed strict validation!\n")

    # Master key comparison
    master_key = [
        'C', 'B', 'D', 'B', 'A', 'D', 'C', 'A', 'B', 'C',
        'A', 'A', 'D', 'D', 'D', 'A', 'B', 'B', 'A', 'C',
        'D', 'A', 'B', 'D', 'C', 'D', 'D', 'C', 'C', 'C',
        'D', 'A', 'C', 'A', 'B', 'C', 'D', 'C', 'D', 'C',
        'D', 'B', 'D', 'B', 'C', 'C', 'B', 'D', 'C', 'A',
        'D', 'A', 'D', 'B', 'C', 'B', 'C', 'B', 'C', 'A',
        'D', 'A', 'B', 'D', 'A', 'C', 'B', 'D', 'C', 'C',
        'A', 'D', 'B', 'D', 'B', 'A', 'D', 'D', 'A', 'B',
        'B', 'A', 'A', 'D', 'D', 'C', 'D', 'D', 'C', 'B',
        'A', 'D', 'D', 'A', 'C', 'D', 'A', 'A', 'A', 'A'
    ]
    mismatches = []
    for i, item in enumerate(items):
        if item["correctAnswer"] != master_key[i]:
            mismatches.append(f"Q{i+1}: parsed {item['correctAnswer']} vs master {master_key[i]}")

    if mismatches:
        print(f"Key MISMATCHES ({len(mismatches)}):")
        for m in mismatches:
            print(f"  - {m}")
        sys.exit(1)
    else:
        print("100% Master Answer Key match (100/100 verified)!\n")

    # Chapter distribution
    print("Chapter Distribution:")
    chapter_counts = {}
    for it in items:
        u = it["unit"]
        chapter_counts[u] = chapter_counts.get(u, 0) + 1
    for u, cnt in sorted(chapter_counts.items()):
        print(f"  {u}: {cnt} questions")

    # Diagram check
    diagram_items = [it for it in items if "imageUrl" in it]
    print(f"\nDiagram Items ({len(diagram_items)}):")
    for di in diagram_items:
        print(f"  - Q{di['questionNumber']}: imageUrl length {len(di['imageUrl'])}")

    # Write output
    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "biology_esslce_2016_booklet153.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"\nSaved JSON: {out_path} ({os.path.getsize(out_path):,} bytes)")
    print("DONE!")


if __name__ == "__main__":
    main()
