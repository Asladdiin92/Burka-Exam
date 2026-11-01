"""
Build Chemistry ESSLCE 2016 E.C. (Booklet 195) exam data JSON from the uploaded Word document.
Parses all 77 available questions (Q1–Q55 and Q59–Q80) with prompts, options, correct answers,
explanations, difficulty, topic/grade mappings, and embedded base64 chemical diagrams.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import os
import re
import base64
from zipfile import ZipFile
import xml.etree.ElementTree as ET

DOCX_PATH = r'C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793124561603_e83b8de7.docx'

CHAPTER_MAP_BY_Q = {
    1: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    2: "Unit 1: Fundamental Concepts in Chemistry (Grade 11)",
    3: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    4: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    5: "Unit 5: Chemical Equilibrium (Grade 11)",
    6: "Unit 5: Physical States of Matter (Grade 9)",
    7: "Unit 5: Physical States of Matter (Grade 9)",
    8: "Unit 1: Structure of the Atom (Grade 9)",
    9: "Unit 2: Periodic Classification of the Elements (Grade 9)",
    10: "Unit 2: Periodic Classification of the Elements (Grade 9)",
    11: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    12: "Unit 4: Electrochemistry (Grade 12)",
    13: "Unit 4: Electrochemistry (Grade 12)",
    14: "Unit 4: Electrochemistry (Grade 12)",
    15: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    16: "Unit 5: Chemical Equilibrium (Grade 11)",
    17: "Unit 6: Carboxylic Acids, Esters, Fats and Oils (Grade 11)",
    18: "Unit 1: Fundamental Concepts in Chemistry (Grade 11)",
    19: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    20: "Unit 2: Acid-Base Equilibria (Grade 12)",
    21: "Unit 2: Atomic Structure & Periodic Table (Grade 11)",
    22: "Unit 2: Periodic Classification of the Elements (Grade 9)",
    23: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)",
    24: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    25: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    26: "Unit 2: Acid-Base Equilibria (Grade 12)",
    27: "Unit 2: Acid-Base Equilibria (Grade 12)",
    28: "Unit 2: Acid-Base Equilibria (Grade 12)",
    29: "Unit 2: Acid-Base Equilibria (Grade 12)",
    30: "Unit 1: Solutions (Grade 12)",
    31: "Unit 6: Chemistry of Polymers (Grade 12)",
    32: "Unit 6: Chemistry of Polymers (Grade 12)",
    33: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    34: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    35: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    36: "Unit 4: Chemical Kinetics (Grade 11)",
    37: "Unit 5: Chemical Equilibrium (Grade 11)",
    38: "Unit 5: Chemical Equilibrium (Grade 11)",
    39: "Unit 6: Carboxylic Acids, Esters, Fats and Oils (Grade 11)",
    40: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    41: "Unit 3: Energy Changes & Electrochemistry (Grade 10)",
    42: "Unit 2: Important Inorganic Compounds (Grade 10)",
    43: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    44: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    45: "Unit 6: Chemistry of Polymers (Grade 12)",
    46: "Unit 2: Important Inorganic Compounds (Grade 10)",
    47: "Unit 2: Important Inorganic Compounds (Grade 10)",
    48: "Unit 2: Important Inorganic Compounds (Grade 10)",
    49: "Unit 4: Chemistry of Metals & Metallurgy (Grade 10)",
    50: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    51: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    52: "Unit 3: Energy Changes & Electrochemistry (Grade 10)",
    53: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    54: "Unit 5: Physical States of Matter (Grade 9)",
    55: "Unit 4: Chemical Kinetics (Grade 11)",
    59: "Unit 2: Atomic Structure & Periodic Table (Grade 11)",
    60: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    61: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    62: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    63: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    64: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    65: "Unit 6: Carboxylic Acids, Esters, Fats and Oils (Grade 11)",
    66: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)",
    67: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)",
    68: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    69: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    70: "Unit 4: Chemical Kinetics (Grade 11)",
    71: "Unit 2: Important Inorganic Compounds (Grade 10)",
    72: "Unit 2: Important Inorganic Compounds (Grade 10)",
    73: "Unit 2: Important Inorganic Compounds (Grade 10)",
    74: "Unit 2: Acid-Base Equilibria (Grade 12)",
    75: "Unit 2: Acid-Base Equilibria (Grade 12)",
    76: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    77: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    78: "Unit 5: Physical States of Matter (Grade 9)",
    79: "Unit 5: Physical States of Matter (Grade 9)",
    80: "Unit 1: Introduction to Organic Chemistry (Grade 10)"
}


def extract_images(docx_path):
    """Extract media/image*.png files as base64 Data URIs."""
    z = ZipFile(docx_path)
    images = {}
    img_map = {
        1: 1,  # image1 -> Q1
        2: 3,  # image2 -> Q3
        3: 12, # image3 -> Q12
        4: 22, # image4 -> Q22
        5: 39, # image5 -> Q39
        6: 63  # image6 -> Q63
    }
    for img_idx, qnum in img_map.items():
        fname = f"word/media/image{img_idx}.png"
        if fname in z.namelist():
            data = z.read(fname)
            b64 = base64.b64encode(data).decode('utf-8')
            images[qnum] = f"data:image/png;base64,{b64}"
            print(f"Extracted image{img_idx}.png for Q{qnum} (Data URI len: {len(images[qnum])})")
    return images


def parse_chem_exam(docx_path):
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
            m = re.search(r'Question\s+(\d+)', txt, re.IGNORECASE)
            if m:
                q_tables.append((int(m.group(1)), txt))

    q_tables.sort(key=lambda x: x[0])
    print(f"Found {len(q_tables)} question tables in docx.")

    items = []

    for qnum, txt in q_tables:
        # Grade mapping
        grade_m = re.search(r'Grade\s*(\d+)', txt[:120])
        grade_str = f"Grade {grade_m.group(1)}" if grade_m else "Grade 12"

        # Difficulty
        diff_m = re.search(r'Difficulty:\s*(\w+)', txt[:150])
        difficulty = diff_m.group(1).lower() if diff_m else "medium"
        if difficulty not in ("easy", "medium", "hard"):
            difficulty = "medium"

        # Header & Topic extraction using pipes: Question N | Grade X | Difficulty: Diff | Unit Y (...)
        pipes = [i for i, c in enumerate(txt) if c == '|']
        if len(pipes) >= 3:
            after_3rd_pipe = txt[pipes[2] + 1:]
            paren_pos = after_3rd_pipe.find(')')
            if paren_pos != -1:
                topic_str = after_3rd_pipe[:paren_pos + 1].strip()
                prompt_start_idx = pipes[2] + 1 + paren_pos + 1
            else:
                topic_str = after_3rd_pipe.strip()
                prompt_start_idx = pipes[2] + 1
        else:
            topic_str = "Chemistry"
            prompt_start_idx = 0

        # Options
        opt_m = re.search(r'\bA\.\s+(.*?)\bB\.\s+(.*?)\bC\.\s+(.*?)\bD\.\s+(.*?)(?=\s*[✔✓]\s*Correct Answer:)', txt)
        if not opt_m:
            raise ValueError(f"Could not parse options for Question {qnum}")

        clean_opts = [
            opt_m.group(1).strip(),
            opt_m.group(2).strip(),
            opt_m.group(3).strip(),
            opt_m.group(4).strip()
        ]

        # Correct Answer
        ans_m = re.search(r'[✔✓]\s*Correct Answer:\s*([A-D])', txt)
        if not ans_m:
            raise ValueError(f"Could not parse answer for Question {qnum}")
        correct_ans = ans_m.group(1)

        # Explanation
        expl_m = re.search(r'Explanation:\s*(.*)$', txt)
        explanation = expl_m.group(1).strip() if expl_m else ""

        # Prompt
        raw_prompt = txt[prompt_start_idx:opt_m.start()].strip()
        prompt = re.sub(r'^[|\s]+', '', raw_prompt).strip()

        chapter_title = CHAPTER_MAP_BY_Q.get(qnum, "Unit 1: Introduction to Organic Chemistry (Grade 10)")

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
    print("Building Chemistry ESSLCE 2016 E.C. (Booklet 195) Exam Data")
    print("=" * 60)

    items = parse_chem_exam(DOCX_PATH)
    print(f"\nParsed {len(items)} questions.")

    if len(items) != 77:
        raise ValueError(f"Expected 77 questions, got {len(items)}")

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
        print("All 77 questions passed strict validation!\n")

    # Master key comparison
    master_key = {
        1: 'A', 2: 'C', 3: 'D', 4: 'D', 5: 'C', 6: 'D', 7: 'D', 8: 'C', 9: 'B', 10: 'B',
        11: 'B', 12: 'A', 13: 'B', 14: 'A', 15: 'C', 16: 'A', 17: 'C', 18: 'B', 19: 'D', 20: 'D',
        21: 'C', 22: 'D', 23: 'C', 24: 'D', 25: 'B', 26: 'C', 27: 'B', 28: 'A', 29: 'D', 30: 'B',
        31: 'B', 32: 'B', 33: 'D', 34: 'A', 35: 'D', 36: 'B', 37: 'C', 38: 'B', 39: 'B', 40: 'D',
        41: 'A', 42: 'C', 43: 'A', 44: 'C', 45: 'D', 46: 'B', 47: 'C', 48: 'A', 49: 'A', 50: 'B',
        51: 'B', 52: 'C', 53: 'A', 54: 'B', 55: 'A', 59: 'A', 60: 'C', 61: 'A', 62: 'D', 63: 'C',
        64: 'D', 65: 'C', 66: 'A', 67: 'B', 68: 'B', 69: 'B', 70: 'A', 71: 'B', 72: 'A', 73: 'B',
        74: 'A', 75: 'B', 76: 'C', 77: 'B', 78: 'D', 79: 'C', 80: 'B'
    }

    mismatches = []
    for it in items:
        qn = it["questionNumber"]
        if it["correctAnswer"] != master_key[qn]:
            mismatches.append(f"Q{qn}: parsed {it['correctAnswer']} vs master {master_key[qn]}")

    if mismatches:
        print(f"Key MISMATCHES ({len(mismatches)}):", mismatches)
        sys.exit(1)
    else:
        print("100% Master Answer Key match (77/77 verified)!\n")

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
    out_path = os.path.join(out_dir, "chemistry_esslce_2016_booklet195.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"\nSaved JSON: {out_path} ({os.path.getsize(out_path):,} bytes)")
    print("DONE!")


if __name__ == "__main__":
    main()
