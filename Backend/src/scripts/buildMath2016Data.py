"""
Build Mathematics ESSLCE 2016 E.C. (Booklet 112) exam data JSON from the uploaded Word document.
Parses all 60 questions with prompts, options, correct answers, explanations, difficulty,
topic/grade mappings, and embedded base64 coordinate/geometry diagrams.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import os
import re
import base64
from zipfile import ZipFile
import xml.etree.ElementTree as ET

DOCX_PATH = r'C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793118445245_35cfa3ac.docx'

CHAPTER_MAPPING = {
    # Question Number to Chapter Mapping
    1: "Unit 5: Statistics and Probability (Grade 11)",
    2: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    3: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    4: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    5: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    6: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    7: "Unit 1: Further on Relations & Functions (Grade 11)",
    8: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    9: "Unit 9: Further on Trigonometric Functions (Grade 11)",
    10: "Unit 4: Mathematical Reasoning (Grade 11)",
    11: "Unit 1: Sequences and Series (Grade 12)",
    12: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    13: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    14: "Unit 1: Sequences and Series (Grade 12)",
    15: "Unit 3: Coordinate Geometry (Grade 11)",
    16: "Unit 9: Further on Trigonometric Functions (Grade 11)",
    17: "Unit 8: Vectors & Transformations (Grade 11)",
    18: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    19: "Unit 5: Statistics and Probability (Grade 11)",
    20: "Unit 6: Matrices and Determinants (Grade 11)",
    21: "Unit 1: Further on Relations & Functions (Grade 11)",
    22: "Unit 3: Coordinate Geometry (Grade 11)",
    23: "Unit 5: Statistics and Probability (Grade 11)",
    24: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    25: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    26: "Unit 1: Further on Relations & Functions (Grade 11)",
    27: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    28: "Unit 5: Statistics and Probability (Grade 11)",
    29: "Unit 5: Integral Calculus (Grade 12)",
    30: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    31: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    32: "Unit 1: Sequences and Series (Grade 12)",
    33: "Unit 3: Coordinate Geometry (Grade 11)",
    34: "Unit 9: Further on Trigonometric Functions (Grade 11)",
    35: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    36: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    37: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    38: "Unit 5: Statistics and Probability (Grade 11)",
    39: "Unit 3: Coordinate Geometry (Grade 11)",
    40: "Unit 2: Rational Expressions & Functions (Grade 11)",
    41: "Unit 7: The Set of Complex Numbers (Grade 11)",
    42: "Unit 5: Statistics and Probability (Grade 11)",
    43: "Unit 5: Statistics and Probability (Grade 11)",
    44: "Unit 6: Matrices and Determinants (Grade 11)",
    45: "Unit 1: Further on Relations & Functions (Grade 11)",
    46: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    47: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    48: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    49: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    50: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    51: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)",
    52: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    53: "Unit 5: Statistics and Probability (Grade 11)",
    54: "Unit 5: Integral Calculus (Grade 12)",
    55: "Unit 1: Further on Relations & Functions (Grade 11)",
    56: "Unit 1: Further on Relations & Functions (Grade 11)",
    57: "Foundations: Plane Geometry, Solids & Measurement (Grades 9–10)",
    58: "Unit 4: Mathematical Reasoning (Grade 11)",
    59: "Unit 3: Differential Calculus (Grade 12)",
    60: "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)"
}


def extract_images(docx_path):
    """Extract media/image*.png files as base64 Data URIs."""
    z = ZipFile(docx_path)
    images = {}
    for i in range(1, 7):
        fname = f"word/media/image{i}.png"
        if fname in z.namelist():
            data = z.read(fname)
            b64 = base64.b64encode(data).decode('utf-8')
            images[i] = f"data:image/png;base64,{b64}"
            print(f"Extracted image{i}.png (Size: {len(data)} bytes, Data URI len: {len(images[i])})")
    return images


def parse_math_exam(docx_path):
    images = extract_images(docx_path)
    # Image to Question mapping:
    # image1 -> Q7
    # image2 -> Q13
    # image3 -> Q26
    # image4 -> Q46
    # image5 -> Q50
    # image6 -> Q57
    q_image_map = {
        7: images.get(1),
        13: images.get(2),
        26: images.get(3),
        46: images.get(4),
        50: images.get(5),
        57: images.get(6)
    }

    z = ZipFile(docx_path)
    tree = ET.parse(z.open('word/document.xml'))
    root = tree.getroot()
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body = root.find('.//w:body', ns)

    items = []

    for child in body:
        if not child.tag.endswith('tbl'):
            continue
        txt = ' '.join(child.itertext()).strip()
        m = re.search(r'QUESTION\s+(\d+)', txt, re.IGNORECASE)
        if not m:
            continue
        qnum = int(m.group(1))

        # Grade & Topic & Difficulty extraction
        # e.g.: QUESTION 1 | Grade: Grade 11 • Topic: Statistics & Data Analysis • Difficulty: Easy
        grade_m = re.search(r'Grade:\s*(Grade\s*\d+)', txt)
        grade = grade_m.group(1).strip() if grade_m else "Grade 12"

        topic_m = re.search(r'Topic:\s*(.*?)(?=\s*•\s*Difficulty|\s*Difficulty|$)', txt)
        topic = topic_m.group(1).strip() if topic_m else "Mathematics"

        diff_m = re.search(r'Difficulty:\s*(\w+)', txt)
        difficulty = diff_m.group(1).lower() if diff_m else "medium"
        if difficulty not in ("easy", "medium", "hard"):
            difficulty = "medium"

        # Options extraction: A. ... B. ... C. ... D. ... ✓ Correct Answer:
        opt_match = re.search(r'\s+A\.\s+(.*?)\s+B\.\s+(.*?)\s+C\.\s+(.*?)\s+D\.\s+(.*?)(?=\s*✓\s*Correct Answer:)', txt)
        if not opt_match:
            raise ValueError(f"Could not parse options for Question {qnum} in:\n{txt[:200]}")

        opt_a = opt_match.group(1).strip()
        opt_b = opt_match.group(2).strip()
        opt_c = opt_match.group(3).strip()
        opt_d = opt_match.group(4).strip()
        options = [opt_a, opt_b, opt_c, opt_d]

        # Extract prompt
        # Prompt starts after Difficulty: ... and ends before A.
        prompt_end = opt_match.start()
        header_end_m = re.search(r'Difficulty:\s*\w+\s*', txt[:prompt_end])
        if header_end_m:
            raw_prompt = txt[header_end_m.end():prompt_end].strip()
        else:
            # Fallback
            raw_prompt = txt[:prompt_end].strip()

        # Clean prompt
        prompt = re.sub(r'^\s*\|\s*', '', raw_prompt).strip()

        # Extract Correct Answer
        ans_m = re.search(r'✓\s*Correct Answer:\s*([A-D])\.', txt)
        if not ans_m:
            raise ValueError(f"Could not parse answer for Question {qnum}")
        correct_answer = ans_m.group(1)

        # Extract Explanation
        expl_m = re.search(r'Explanation & Step-by-Step Solution:\s*(.*)$', txt)
        explanation = expl_m.group(1).strip() if expl_m else ""

        # Unit chapter
        unit_chapter = CHAPTER_MAPPING.get(qnum, "Foundations: Algebra, Number Systems & Logarithms (Grades 9–10)")

        item = {
            "questionNumber": qnum,
            "grade": grade,
            "unit": unit_chapter,
            "topic": topic,
            "difficulty": difficulty,
            "prompt": prompt,
            "options": options,
            "correctAnswer": correct_answer,
            "explanation": explanation
        }

        # Attach image if present
        if qnum in q_image_map and q_image_map[qnum]:
            item["imageUrl"] = q_image_map[qnum]

        items.append(item)

    items.sort(key=lambda x: x["questionNumber"])
    return items


def main():
    print("=" * 60)
    print("Building Mathematics ESSLCE 2016 E.C. (Booklet 112) Exam Data")
    print("=" * 60)

    items = parse_math_exam(DOCX_PATH)
    print(f"\nParsed {len(items)} questions.")

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
    print("\nChapter Distribution:")
    unit_counts = {}
    for it in items:
        u = it["unit"]
        unit_counts[u] = unit_counts.get(u, 0) + 1
    for u, cnt in sorted(unit_counts.items()):
        print(f"  {u}: {cnt} questions")

    # Diagram check
    diagram_items = [it for it in items if "imageUrl" in it]
    print(f"\nDiagram Items ({len(diagram_items)}):")
    for di in diagram_items:
        print(f"  - Q{di['questionNumber']}: imageUrl length {len(di['imageUrl'])}")

    # Write output
    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "mathematics_esslce_2016_booklet112.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"\nSaved JSON: {out_path} ({os.path.getsize(out_path):,} bytes)")
    print("DONE!")


if __name__ == "__main__":
    main()
