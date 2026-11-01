import zipfile
import xml.etree.ElementTree as ET
import re
import json
import base64
import os
import sys

# Ensure UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793041404552_25061f75.docx"

MASTER_KEY = {
    1:'A', 2:'B', 3:'B', 4:'B', 5:'A', 6:'D', 7:'C', 8:'B', 9:'D', 10:'B',
    11:'B', 12:'C', 13:'C', 14:'D', 15:'B', 16:'B', 17:'A', 18:'A', 19:'C', 20:'D',
    21:'D', 22:'D', 23:'C', 24:'D', 25:'A', 26:'D', 27:'C', 28:'A', 29:'C', 30:'B',
    31:'D', 32:'A', 33:'C', 34:'B', 35:'D', 36:'D', 37:'A', 38:'B', 39:'B', 40:'D',
    41:'A', 42:'B', 43:'D', 44:'A', 45:'B', 46:'A', 47:'D', 48:'D', 49:'B', 50:'D',
    51:'A', 52:'A', 53:'B', 54:'D', 55:'D', 56:'C', 57:'D', 58:'A', 59:'B', 60:'A',
    61:'D', 62:'B', 63:'D', 64:'A', 65:'D', 66:'B', 67:'D', 68:'B', 69:'A', 70:'B',
    71:'D', 72:'B', 73:'C', 74:'A', 75:'B', 76:'D', 77:'A', 78:'D', 79:'A', 80:'D',
    81:'A', 82:'B', 83:'C', 84:'B', 85:'A', 86:'D', 87:'A', 88:'B', 89:'B', 90:'A',
    91:'C', 92:'D', 93:'C', 94:'B', 95:'B', 96:'D', 97:'A', 98:'B', 99:'D', 100:'C'
}

QUESTION_CHAPTER_MAP = {
    1: "Unit 3: Human Biology and Health (Grade 9)",
    2: "Unit 4: Microorganisms and Disease (Grade 9)",
    3: "Unit 4: Microorganisms and Disease (Grade 9)",
    4: "Unit 4: Microorganisms and Disease (Grade 9)",
    5: "Unit 5: Classification (Grade 9)",
    6: "Unit 2: Heredity (Grade 10)",
    7: "Unit 3: Genetics (Grade 12)",
    8: "Unit 3: Genetics (Grade 12)",
    9: "Unit 3: Genetics (Grade 12)",
    10: "Unit 3: Genetics (Grade 12)",
    11: "Unit 1: Biotechnology (Grade 10)",
    12: "Unit 2: Ecology (Grade 12)",
    13: "Unit 2: Heredity (Grade 10)",
    14: "Unit 2: Heredity (Grade 10)",
    15: "Unit 2: Heredity (Grade 10)",
    16: "Unit 5: Classification (Grade 9)",
    17: "Unit 5: Classification (Grade 9)",
    18: "Unit 6: Environment (Grade 9)",
    19: "Unit 3: Human Biology and Health (Grade 10)",
    20: "Unit 5: Classification (Grade 9)",
    21: "Unit 3: Human Biology and Health (Grade 10)",
    22: "Unit 3: Human Biology and Health (Grade 10)",
    23: "Unit 3: Human Biology and Health (Grade 10)",
    24: "Unit 3: Human Biology and Health (Grade 10)",
    25: "Unit 3: Human Biology and Health (Grade 10)",
    26: "Unit 3: Human Biology and Health (Grade 10)",
    27: "Unit 3: Enzymes (Grade 11)",
    28: "Unit 3: Enzymes (Grade 11)",
    29: "Unit 3: Enzymes (Grade 11)",
    30: "Unit 3: Enzymes (Grade 11)",
    31: "Unit 3: Enzymes (Grade 11)",
    32: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    33: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    34: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    35: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    36: "Unit 2: Biochemical Molecules (Grade 11)",
    37: "Unit 2: Biochemical Molecules (Grade 11)",
    38: "Unit 2: Biochemical Molecules (Grade 11)",
    39: "Unit 3: Enzymes (Grade 11)",
    40: "Unit 2: Biochemical Molecules (Grade 11)",
    41: "Unit 5: Conservation of Natural Resources (Grade 10)",
    42: "Unit 1: The Science of Biology (Grade 11)",
    43: "Unit 5: Conservation of Natural Resources (Grade 10)",
    44: "Unit 5: Conservation of Natural Resources (Grade 10)",
    45: "Unit 2: Biochemical Molecules (Grade 11)",
    46: "Unit 3: Human Biology and Health (Grade 9)",
    47: "Unit 3: Human Biology and Health (Grade 9)",
    48: "Unit 3: Human Biology and Health (Grade 9)",
    49: "Unit 3: Human Biology and Health (Grade 9)",
    50: "Unit 5: Energy Transformation (Grade 11)",
    51: "Unit 3: Human Biology and Health (Grade 9)",
    52: "Unit 4: Cell Biology (Grade 11)",
    53: "Unit 2: Cell Biology (Grade 9)",
    54: "Unit 5: Behavior (Grade 12)",
    55: "Unit 4: Cell Biology (Grade 11)",
    56: "Unit 5: Energy Transformation (Grade 11)",
    57: "Unit 4: Evolution (Grade 12)",
    58: "Unit 5: Behavior (Grade 12)",
    59: "Unit 5: Behavior (Grade 12)",
    60: "Unit 5: Behavior (Grade 12)",
    61: "Unit 1: Biology and Technology (Grade 9)",
    62: "Unit 2: Cell Biology (Grade 9)",
    63: "Unit 2: Cell Biology (Grade 9)",
    64: "Unit 2: Cell Biology (Grade 9)",
    65: "Unit 3: Human Biology and Health (Grade 9)",
    66: "Unit 3: Genetics (Grade 12)",
    67: "Unit 4: Evolution (Grade 12)",
    68: "Unit 4: Evolution (Grade 12)",
    69: "Unit 4: Evolution (Grade 12)",
    70: "Unit 4: Evolution (Grade 12)",
    71: "Unit 3: Enzymes (Grade 11)",
    72: "Unit 3: Enzymes (Grade 11)",
    73: "Unit 4: Cell Biology (Grade 11)",
    74: "Unit 4: Cell Biology (Grade 11)",
    75: "Unit 4: Cell Biology (Grade 11)",
    76: "Unit 1: Microorganisms (Grade 12)",
    77: "Unit 1: Microorganisms (Grade 12)",
    78: "Unit 1: Microorganisms (Grade 12)",
    79: "Unit 2: Ecology (Grade 12)",
    80: "Unit 2: Ecology (Grade 12)",
    81: "Unit 2: Ecology (Grade 12)",
    82: "Unit 2: Ecology (Grade 12)",
    83: "Unit 2: Ecology (Grade 12)",
    84: "Unit 2: Heredity (Grade 10)",
    85: "Unit 3: Genetics (Grade 12)",
    86: "Unit 5: Energy Transformation (Grade 11)",
    87: "Unit 5: Energy Transformation (Grade 11)",
    88: "Unit 5: Energy Transformation (Grade 11)",
    89: "Unit 5: Energy Transformation (Grade 11)",
    90: "Unit 5: Energy Transformation (Grade 11)",
    91: "Unit 2: Heredity (Grade 10)",
    92: "Unit 5: Conservation of Natural Resources (Grade 10)",
    93: "Unit 3: Human Biology and Health (Grade 10)",
    94: "Unit 3: Human Biology and Health (Grade 10)",
    95: "Unit 3: Human Biology and Health (Grade 10)",
    96: "Unit 5: Energy Transformation (Grade 11)",
    97: "Unit 1: Microorganisms (Grade 12)",
    98: "Unit 1: Microorganisms (Grade 12)",
    99: "Unit 1: Microorganisms (Grade 12)",
    100: "Unit 1: Microorganisms (Grade 12)"
}

def build_bio_2015():
    print(f"Reading Biology 2015 docx from: {DOCX_PATH}")
    images = {}
    with zipfile.ZipFile(DOCX_PATH) as z:
        img_idx = 1
        for name in sorted(z.namelist()):
            if "word/media/image" in name:
                data = z.read(name)
                ext = name.split(".")[-1]
                images[img_idx] = f"data:image/{ext};base64," + base64.b64encode(data).decode("utf-8")
                img_idx += 1
        xml_content = z.read("word/document.xml")

    print(f"Found {len(images)} embedded media images.")

    tree = ET.fromstring(xml_content)
    paras = [
        "".join([n.text for n in node.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text])
        for node in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
    ]
    full_text = "\n".join([p.strip() for p in paras if p.strip()])

    pattern = r"^QUESTION\s+(\d+)\s*\|\s*Grade\s*(\d+)\s*•\s*(.*?)\s*\|\s*Difficulty:\s*(.*?)\s*\|\s*Correct Answer:\s*([A-D])\s*$"
    matches = list(re.finditer(pattern, full_text, re.MULTILINE))

    # If table pipe syntax format from markdown/word table
    if len(matches) != 100:
        # Fallback regex for flexible separator or non-table lines
        pattern = r"QUESTION\s+(\d+)\s*\|\s*Grade\s*(\d+)\s*•\s*(.*?)\s*\|\s*Difficulty:\s*(.*?)\s*\|\s*Correct Answer:\s*([A-D])"
        matches = list(re.finditer(pattern, full_text))

    print(f"Matched {len(matches)} questions.")

    items = []
    # Map images: Q9->1, Q12->2, Q40->3, Q48->4, Q51->5, Q72->6, Q79->7
    image_q_map = {9: 1, 12: 2, 40: 3, 48: 4, 51: 5, 72: 6, 79: 7}

    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        grade_num = m.group(2).strip()
        topic = m.group(3).strip()
        diff = m.group(4).strip().lower()
        key_ans = m.group(5).strip()

        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()

        lines = [l.strip() for l in block.split("\n") if l.strip()]

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
            elif "Correct Answer:" in l and ans_idx is None:
                ans_idx = i

        if None in (optA_idx, optB_idx, optC_idx, optD_idx, ans_idx):
            # Parse table format if in pipe-delimited lines
            prompt_lines = []
            cur_mode = "prompt"
            optA_lines, optB_lines, optC_lines, optD_lines, expl_lines = [], [], [], [], []
            for l in lines:
                if "Correct Answer: Option" in l:
                    cur_mode = "ans"
                    expl_lines.append(l)
                elif re.match(r"^A\.\s+", l):
                    cur_mode = "A"
                    optA_lines.append(l)
                elif re.match(r"^B\.\s+", l):
                    cur_mode = "B"
                    optB_lines.append(l)
                elif re.match(r"^C\.\s+", l):
                    cur_mode = "C"
                    optC_lines.append(l)
                elif re.match(r"^D\.\s+", l):
                    cur_mode = "D"
                    optD_lines.append(l)
                elif cur_mode == "prompt":
                    prompt_lines.append(l)
                elif cur_mode == "A":
                    optA_lines.append(l)
                elif cur_mode == "B":
                    optB_lines.append(l)
                elif cur_mode == "C":
                    optC_lines.append(l)
                elif cur_mode == "D":
                    optD_lines.append(l)
                elif cur_mode == "ans":
                    expl_lines.append(l)

            prompt = "\n".join(prompt_lines).strip()
            optA = "\n".join(optA_lines).strip()
            optB = "\n".join(optB_lines).strip()
            optC = "\n".join(optC_lines).strip()
            optD = "\n".join(optD_lines).strip()
            explanation = "\n".join(expl_lines).strip()
        else:
            prompt = "\n".join(lines[:optA_idx]).strip()
            optA = "\n".join(lines[optA_idx:optB_idx]).strip()
            optB = "\n".join(lines[optB_idx:optC_idx]).strip()
            optC = "\n".join(lines[optC_idx:optD_idx]).strip()
            optD = "\n".join(lines[optD_idx:ans_idx]).strip()
            explanation = "\n".join(lines[ans_idx:]).strip()

        def clean_opt(raw):
            s = re.sub(r"^[A-D]\.\s*", "", raw).strip()
            s = re.sub(r"\s*[✓✔]?\s*\[Correct Answer\]", "", s, flags=re.I).strip()
            s = re.sub(r"\s*[✓✔]?\s*\[Correct Option\]", "", s, flags=re.I).strip()
            s = re.sub(r"\s*\|\s*$", "", s).strip()
            return s

        clean_optA = clean_opt(optA)
        clean_optB = clean_opt(optB)
        clean_optC = clean_opt(optC)
        clean_optD = clean_opt(optD)

        # Clean explanation
        m_expl = re.search(r"Explanation:\s*(.*)", explanation, re.DOTALL)
        if m_expl:
            explanation_clean = m_expl.group(1).strip()
        else:
            explanation_clean = explanation

        explanation_clean = re.sub(r"\s*\|\s*$", "", explanation_clean).strip()
        prompt_clean = re.sub(r"\s*\|\s*$", "", prompt).strip()

        correct_ans = MASTER_KEY[qnum]

        item = {
            "questionNumber": qnum,
            "grade": f"Grade {grade_num}",
            "unit": QUESTION_CHAPTER_MAP.get(qnum, topic),
            "topic": topic,
            "difficulty": diff,
            "prompt": prompt_clean,
            "options": [clean_optA, clean_optB, clean_optC, clean_optD],
            "correctAnswer": correct_ans,
            "explanation": explanation_clean
        }

        if qnum in image_q_map and image_q_map[qnum] in images:
            item["imageUrl"] = images[image_q_map[qnum]]

        items.append(item)

    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "biology_esslce_2015_booklet480.json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated {len(items)} questions at: {out_path}")
    print(f"Embedded images for {len([x for x in items if 'imageUrl' in x])} questions.")

if __name__ == "__main__":
    build_bio_2015()
