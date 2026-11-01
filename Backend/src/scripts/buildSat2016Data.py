"""
Build SAT ESSLCE 2016 E.C. (Booklet 094) exam data JSON from the uploaded Word document.
Parses all 60 questions with prompts, options, correct answers, explanations, difficulty,
topic/grade mappings, embedded reference tables, reading contexts, and the exponential graph diagram.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import os
import re
import base64
from zipfile import ZipFile
import xml.etree.ElementTree as ET

DOCX_PATH = r'C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793116908258_5f2f6a43.docx'

READING_CONTEXT_I = (
    '[Reading Context I: Air Pollution & Global Environmental Concerns]\n'
    '"Air pollution, one of the most pressing environmental concerns, is posing significant risks to '
    'human health and the planet\'s well-being. By collectively addressing the root causes of air pollution '
    'from the source, implementing strict emissions standards, and encouraging green initiatives, we can create '
    'a healthier and sustainable environment for current and future generations. It is imperative that governments, '
    'industries, and communities work hand-in-hand to curb harmful pollutants such as particulate matter, ground-level '
    'ozone, and toxic smog."'
)

READING_CONTEXT_II = (
    '[Reading Context II: Population Dynamics & Resource Allocation]\n'
    '"Population, which means the total number of people living in a certain geographical area, fundamentally influences '
    'socioeconomic development and environmental sustainability. To manage population growth, governments and communities '
    'implement diverse policy interventions. Striking a balance between resource availability, economic capacity, and '
    'demographic trends is essential. Decision-makers must make informed decisions grounded in reliable data, as unbalanced '
    'growth can produce far-reaching consequences across healthcare, education, and ecological systems."'
)

DATA_TABLE_CONTEXT = (
    '[Reference Data Table: Annual School Income (in Thousands Birr)]\n'
    '| School | Tuition Fees | Term Fees | Donations | Grants | Miscellaneous | Total Income |\n'
    '| :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n'
    '| P | 120 | 24 | 54 | 60 | 12 | 270 |\n'
    '| Q | 0 | 12 | 21 | 54 | 3 | 90 |\n'
    '| R | 210 | 45 | 60 | 120 | 15 | 450 |\n'
    '| S | 90 | 24 | 51 | 42 | 3 | 210 |\n'
    '| T | 120 | 30 | 60 | 55 | 15 | 280 |'
)


def resolve_chapter_title(qnum):
    """Map question number to standard SAT curriculum chapters."""
    if qnum in (5, 6, 7, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31):
        return "Unit 1: Verbal Classification & Vocabulary (Synonyms & Antonyms)"
    elif 12 <= qnum <= 17:
        return "Unit 2: Analytical & Logical Reasoning (Puzzles, Deductions & Critical Thinking)"
    elif (1 <= qnum <= 4) or (8 <= qnum <= 11):
        return "Unit 3: Reading Comprehension (Informational & Scientific Texts)"
    elif 32 <= qnum <= 35:
        return "Unit 4: Verbal Analogies"
    elif 56 <= qnum <= 60:
        return "Unit 5: Data Interpretation & Statistical Analysis"
    else:
        # 36 to 55
        return "Unit 6: Quantitative Reasoning & Mathematical Problem Solving"


def extract_image_base64(docx_path):
    """Extract image1.png from docx as base64 Data URI."""
    z = ZipFile(docx_path)
    if 'word/media/image1.png' in z.namelist():
        data = z.read('word/media/image1.png')
        b64 = base64.b64encode(data).decode('utf-8')
        return f"data:image/png;base64,{b64}"
    return None


def parse_doc(docx_path):
    z = ZipFile(docx_path)
    tree = ET.parse(z.open('word/document.xml'))
    root = tree.getroot()
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body = root.find('.//w:body', ns)

    img_b64 = extract_image_base64(docx_path)
    print(f"Extracted image1.png (Data URI length: {len(img_b64) if img_b64 else 0})")

    items = []

    for child in body:
        if not child.tag.endswith('tbl'):
            continue
        txt = ' '.join(child.itertext()).strip()
        m = re.search(r'Question\s+(\d+):', txt)
        if not m:
            continue
        qnum = int(m.group(1))

        # Prompt & Options extraction
        # Look for pattern: Question N: (prompt text) A. (opt A) B. (opt B) C. (opt C) D. (opt D) ✓ Correct Answer:
        # Note: in questions with multi-line statements like Q12, Q14, Q16, Q36, options start at A.
        opt_match = re.search(r'\s+A\.\s+(.*?)\s+B\.\s+(.*?)\s+C\.\s+(.*?)\s+D\.\s+(.*?)(?=\s*✓\s*Correct Answer:)', txt)
        if not opt_match:
            raise ValueError(f"Could not parse options for Question {qnum} in:\n{txt[:200]}")

        opt_a = opt_match.group(1).strip()
        opt_b = opt_match.group(2).strip()
        opt_c = opt_match.group(3).strip()
        opt_d = opt_match.group(4).strip()
        options = [opt_a, opt_b, opt_c, opt_d]

        # Extract prompt
        prompt_end_pos = opt_match.start()
        q_start = re.search(rf'Question\s+{qnum}:\s*', txt)
        raw_prompt = txt[q_start.end():prompt_end_pos].strip()

        # Extract Correct Answer letter
        ans_m = re.search(r'✓\s*Correct Answer:\s*([A-D])\.', txt)
        if not ans_m:
            raise ValueError(f"Could not parse correct answer for Question {qnum}")
        correct_answer = ans_m.group(1)

        # Extract Difficulty
        diff_m = re.search(r'Difficulty:\s*(\w+)', txt)
        difficulty = diff_m.group(1).lower() if diff_m else 'medium'
        if difficulty not in ('easy', 'medium', 'hard'):
            difficulty = 'medium'

        # Extract Classification / Topic
        class_m = re.search(r'Classification:\s*(.*?)(?=\s*Explanation|\s*$)', txt)
        classification = class_m.group(1).strip() if class_m else 'Scholastic Aptitude'

        # Extract Explanation
        expl_m = re.search(r'Explanation & Analysis:\s*(.*)$', txt)
        explanation = expl_m.group(1).strip() if expl_m else ''

        # Context enrichment
        if 1 <= qnum <= 4:
            prompt = f"{READING_CONTEXT_I}\n\nQuestion {qnum}: {raw_prompt}"
        elif 8 <= qnum <= 11:
            prompt = f"{READING_CONTEXT_II}\n\nQuestion {qnum}: {raw_prompt}"
        elif 56 <= qnum <= 60:
            prompt = f"{DATA_TABLE_CONTEXT}\n\nQuestion {qnum}: {raw_prompt}"
        else:
            prompt = raw_prompt

        item = {
            "questionNumber": qnum,
            "grade": "Grade 11-12",
            "unit": resolve_chapter_title(qnum),
            "topic": classification,
            "difficulty": difficulty,
            "prompt": prompt,
            "options": options,
            "correctAnswer": correct_answer,
            "explanation": explanation
        }

        if qnum == 48 and img_b64:
            item["imageUrl"] = img_b64

        items.append(item)

    items.sort(key=lambda x: x["questionNumber"])
    return items


def main():
    print("=" * 60)
    print("Building SAT ESSLCE 2016 E.C. (Booklet 094) Exam Data")
    print("=" * 60)

    items = parse_doc(DOCX_PATH)
    print(f"\nParsed {len(items)} questions.")

    # Validation
    if len(items) != 60:
        raise ValueError(f"Expected 60 questions, got {len(items)}")

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
        print("All 60 questions passed strict validation!\n")

    # Print answer key
    print("Answer Key:")
    keys = [f"{it['questionNumber']}:{it['correctAnswer']}" for it in items]
    for i in range(0, len(keys), 10):
        print(f"  {', '.join(keys[i:i+10])}")

    # Unit distribution
    print("\nUnit Distribution:")
    unit_counts = {}
    for it in items:
        u = it["unit"]
        unit_counts[u] = unit_counts.get(u, 0) + 1
    for u, cnt in sorted(unit_counts.items()):
        print(f"  {u}: {cnt} questions")

    # Difficulty distribution
    print("\nDifficulty Distribution:")
    diff_counts = {}
    for it in items:
        d = it["difficulty"]
        diff_counts[d] = diff_counts.get(d, 0) + 1
    for d, cnt in sorted(diff_counts.items()):
        print(f"  {d}: {cnt} questions")

    # Diagram check
    diagram_items = [it for it in items if "imageUrl" in it]
    print(f"\nDiagram Items: {len(diagram_items)}")
    for di in diagram_items:
        print(f"  - Q{di['questionNumber']}: imageUrl length {len(di['imageUrl'])}")

    # Write output
    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "sat_esslce_2016_booklet094.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"\nSaved JSON: {out_path} ({os.path.getsize(out_path):,} bytes)")
    print("DONE!")


if __name__ == "__main__":
    main()
