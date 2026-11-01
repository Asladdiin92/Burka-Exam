import zipfile
import xml.etree.ElementTree as ET
import re
import json
import base64
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1792959058376_2f8fc980.docx"

MASTER_KEY = {
    1:'B', 2:'A', 3:'C', 4:'D', 5:'D', 6:'B', 7:'D', 8:'A', 9:'D', 10:'B',
    11:'B', 12:'C', 13:'B', 14:'C', 15:'A', 16:'C', 17:'B', 18:'D', 19:'A', 20:'B',
    21:'B', 22:'A', 23:'C', 24:'D', 25:'A', 26:'C', 27:'B', 28:'C', 29:'B', 30:'A',
    31:'B', 32:'D', 33:'C', 34:'A', 35:'C', 36:'B', 37:'C', 38:'D', 39:'B', 40:'A',
    41:'A', 42:'D', 43:'C', 44:'B', 45:'D', 46:'D', 47:'C', 48:'B', 49:'D', 50:'C',
    51:'A', 52:'B', 53:'A', 54:'D', 55:'B', 56:'A', 57:'A', 58:'B', 59:'C', 60:'D',
    61:'C', 62:'C', 63:'A', 64:'B', 65:'C', 66:'C', 67:'A', 68:'C', 69:'D', 70:'B',
    71:'B', 72:'A', 73:'D', 74:'C', 75:'A', 76:'D', 77:'D', 78:'C', 79:'D', 80:'A'
}

QUESTION_CHAPTER_MAP = {
    1: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    2: "Unit 2: Important Inorganic Compounds (Grade 10)",
    3: "Unit 3: Energy Changes & Electrochemistry (Grade 10)",
    4: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    5: "Unit 1: Fundamental Concepts in Chemistry (Grade 11)",
    6: "Unit 4: Chemical Kinetics (Grade 11)",
    7: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    8: "Unit 4: Electrochemistry (Grade 12)",
    9: "Unit 1: Solutions (Grade 12)",
    10: "Unit 4: Electrochemistry (Grade 12)",
    11: "Unit 1: Structure of the Atom (Grade 9)",
    12: "Unit 2: Atomic Structure & Periodic Table (Grade 11)",
    13: "Unit 1: Structure of the Atom (Grade 9)",
    14: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)",
    15: "Unit 2: Periodic Classification of the Elements (Grade 9)",
    16: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    17: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    18: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    19: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    20: "Unit 4: Chemistry of Metals & Metallurgy (Grade 10)",
    21: "Unit 4: Electrochemistry (Grade 12)",
    22: "Unit 5: Chemistry in Industry & Elements (Grade 12)",
    23: "Unit 4: Chemistry of Metals & Metallurgy (Grade 10)",
    24: "Unit 6: Chemistry of Polymers (Grade 12)",
    25: "Unit 4: Electrochemistry (Grade 12)",
    26: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    27: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    28: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    29: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    30: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    31: "Unit 4: Chemical Kinetics (Grade 11)",
    32: "Unit 6: Carboxylic Acids, Esters, Fats and Oils (Grade 11)",
    33: "Unit 4: Chemical Kinetics (Grade 11)",
    34: "Unit 1: Solutions (Grade 12)",
    35: "Unit 1: Solutions (Grade 12)",
    36: "Unit 5: Physical States of Matter (Grade 9)",
    37: "Unit 5: Physical States of Matter (Grade 9)",
    38: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    39: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    40: "Unit 1: Introduction to Organic Chemistry (Grade 10)",
    41: "Unit 2: Atomic Structure & Periodic Table (Grade 11)",
    42: "Unit 1: Fundamental Concepts in Chemistry (Grade 11)",
    43: "Unit 2: Atomic Structure & Periodic Table (Grade 11)",
    44: "Unit 2: Atomic Structure & Periodic Table (Grade 11)",
    45: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    46: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    47: "Unit 2: Atomic Structure & Periodic Table (Grade 11)",
    48: "Unit 5: Chemical Equilibrium (Grade 11)",
    49: "Unit 4: Chemical Kinetics (Grade 11)",
    50: "Unit 5: Physical States of Matter (Grade 9)",
    51: "Unit 1: Solutions (Grade 12)",
    52: "Unit 1: Solutions (Grade 12)",
    53: "Unit 1: Solutions (Grade 12)",
    54: "Unit 1: Fundamental Concepts in Chemistry (Grade 11)",
    55: "Unit 2: Acid-Base Equilibria (Grade 12)",
    56: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    57: "Unit 4: Chemical Kinetics (Grade 11)",
    58: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    59: "Unit 4: Chemical Kinetics (Grade 11)",
    60: "Unit 5: Chemical Equilibrium (Grade 11)",
    61: "Unit 2: Acid-Base Equilibria (Grade 12)",
    62: "Unit 3: Chemical Thermodynamics (Grade 12)",
    63: "Unit 3: Chemical Thermodynamics (Grade 12)",
    64: "Unit 3: Chemical Thermodynamics (Grade 12)",
    65: "Unit 3: Chemical Thermodynamics (Grade 12)",
    66: "Unit 2: Important Inorganic Compounds (Grade 10)",
    67: "Unit 2: Important Inorganic Compounds (Grade 10)",
    68: "Unit 2: Important Inorganic Compounds (Grade 10)",
    69: "Unit 4: Electrochemistry (Grade 12)",
    70: "Unit 3: Energy Changes & Electrochemistry (Grade 10)",
    71: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)",
    72: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)",
    73: "Unit 3: Chemical Bonding & Intermolecular Forces (Grade 9)",
    74: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    75: "Unit 4: Chemical Reactions & Stoichiometry (Grade 9)",
    76: "Unit 4: Chemical Kinetics (Grade 11)",
    77: "Unit 5: Physical States of Matter (Grade 9)",
    78: "Unit 5: Chemical Equilibrium (Grade 11)",
    79: "Unit 3: Chemical Bonding and Structure (Grade 11)",
    80: "Unit 6: Carboxylic Acids, Esters, Fats and Oils (Grade 11)",
}

def build_chem_2015():
    print(f"Reading Chemistry 2015 docx from: {DOCX_PATH}")
    images = {}
    with zipfile.ZipFile(DOCX_PATH) as z:
        for i in range(1, 6):
            data = z.read(f"word/media/image{i}.png")
            images[i] = "data:image/png;base64," + base64.b64encode(data).decode("utf-8")
        xml_content = z.read("word/document.xml")

    tree = ET.fromstring(xml_content)
    paras = [
        "".join([n.text for n in node.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text])
        for node in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
    ]
    full_text = "\n".join([p.strip() for p in paras if p.strip()])

    pattern = r"^QUESTION\s+(\d+)\s*\|\s*Grade Level:\s*(.*?)\s*\|\s*Difficulty:\s*(.*?)\s*$"
    matches = list(re.finditer(pattern, full_text, re.MULTILINE))

    if len(matches) != 80:
        raise ValueError(f"Expected 80 questions, found {len(matches)}")

    items = []
    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        grade = m.group(2).strip()
        diff = m.group(3).strip().lower()

        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()

        lines = [l.strip() for l in block.split("\n") if l.strip()]

        topic = ""
        if lines and "Chapter / Topic Classification:" in lines[0]:
            topic = lines[0].replace("Chapter / Topic Classification:", "").strip()
            lines = lines[1:]

        optA_idx = None
        optB_idx = None
        optC_idx = None
        optD_idx = None
        ans_idx = None

        for i, l in enumerate(lines):
            if re.match(r"^A\.\s+", l) and optA_idx is None:
                optA_idx = i
            elif re.match(r"^B\.\s+", l) and optB_idx is None and optA_idx is not None:
                optB_idx = i
            elif re.match(r"^C\.\s+", l) and optC_idx is None and optB_idx is not None:
                optC_idx = i
            elif re.match(r"^D\.\s+", l) and optD_idx is None and optC_idx is not None:
                optD_idx = i
            elif ("Correct Answer:" in l or "✔ Correct Answer:" in l) and ans_idx is None:
                ans_idx = i

        if None in (optA_idx, optB_idx, optC_idx, optD_idx, ans_idx):
            raise ValueError(f"Q{qnum}: missing options or answer in lines: {lines}")

        prompt = "\n".join(lines[:optA_idx]).strip()

        def clean_opt(raw):
            s = re.sub(r"^[A-D]\.\s*", "", raw).strip()
            s = re.sub(r"\s*[✓✔]?\s*\[Correct Option\]", "", s, flags=re.I).strip()
            s = re.sub(r"\s*[✓✔]?\s*\[[✓✔]?\s*CORRECT(?:\s*ANSWER)?\]", "", s, flags=re.I).strip()
            return s

        optA = clean_opt("\n".join(lines[optA_idx:optB_idx]))
        optB = clean_opt("\n".join(lines[optB_idx:optC_idx]))
        optC = clean_opt("\n".join(lines[optC_idx:optD_idx]))
        optD = clean_opt("\n".join(lines[optD_idx:ans_idx]))

        ans_line = lines[ans_idx]
        m_ans = re.search(r"Correct Answer:\s*(?:Option\s*)?([A-D])\b", ans_line)
        if not m_ans:
            raise ValueError(f"Q{qnum}: cannot parse answer from '{ans_line}'")
        correct_ans = m_ans.group(1)

        expected_ans = MASTER_KEY[qnum]
        if correct_ans != expected_ans:
            raise ValueError(f"Q{qnum}: Answer mismatch. Got {correct_ans}, expected {expected_ans}")

        explanation = ""
        if ans_idx + 1 < len(lines):
            raw_expl = "\n".join(lines[ans_idx + 1:]).replace("Explanation:", "").strip()
            explanation = re.split(r"\n+(?:QUESTION\s+|Section\s+|PART\s+)", raw_expl)[0].strip()

        # Image mapping
        image_url = None
        if qnum == 13:
            image_url = images[1]
        elif qnum == 17:
            image_url = images[2]
        elif qnum == 32:
            image_url = images[3]
        elif qnum == 49:
            image_url = images[4]
        elif qnum == 58:
            image_url = images[5]

        unit_title = QUESTION_CHAPTER_MAP.get(qnum, topic)

        item = {
            "questionNumber": qnum,
            "grade": grade,
            "unit": unit_title,
            "topic": topic,
            "difficulty": diff,
            "prompt": prompt,
            "options": [optA, optB, optC, optD],
            "correctAnswer": correct_ans,
            "explanation": explanation
        }
        if image_url:
            item["imageUrl"] = image_url

        assert len(item["options"]) == 4, f"Q{qnum}: options length is {len(item['options'])}"
        for i, opt in enumerate(item["options"]):
            assert opt, f"Q{qnum}: option {i} is empty"
        assert item["prompt"], f"Q{qnum}: empty prompt"
        assert item["explanation"], f"Q{qnum}: empty explanation"

        items.append(item)

    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "chemistry_esslce_2015_booklet495.json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated {len(items)} questions at: {out_path}")
    print("Embedded images for questions: Q13, Q17, Q32, Q49, Q58.")

if __name__ == "__main__":
    build_chem_2015()
