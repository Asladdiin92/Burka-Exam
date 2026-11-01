import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os

DOCX1_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1792950659128_dd5e3130.docx"
DOCX2_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1792950659128_164d5e23.docx"

MASTER_KEY = {
    1:'A', 2:'B', 3:'D', 4:'C', 5:'A', 6:'B', 7:'D', 8:'C', 9:'D', 10:'D',
    11:'A', 12:'C', 13:'B', 14:'B', 15:'C', 16:'B', 17:'A', 18:'D', 19:'B', 20:'A',
    21:'C', 22:'A', 23:'B', 24:'B', 25:'D', 26:'A', 27:'C', 28:'B', 29:'D', 30:'C',
    31:'B', 32:'D', 33:'C', 34:'C', 35:'D', 36:'C', 37:'B', 38:'A', 39:'D', 40:'A',
    41:'B', 42:'B', 43:'D', 44:'C', 45:'C', 46:'C', 47:'C', 48:'B', 49:'D', 50:'A',
    51:'C', 52:'C', 53:'A', 54:'A', 55:'C', 56:'B', 57:'B', 58:'C', 59:'C', 60:'B',
    61:'C', 62:'B', 63:'B', 64:'C', 65:'A', 66:'A', 67:'D', 68:'D', 69:'D', 70:'C',
    71:'D', 72:'A', 73:'A', 74:'C', 75:'A', 76:'B',
    77:'A', 78:'C', 79:'D', 80:'B', 81:'C', 82:'C', 83:'A', 84:'B', 85:'D', 86:'C',
    87:'A', 88:'D', 89:'C', 90:'A', 91:'B', 92:'A', 93:'C', 94:'A', 95:'A', 96:'C',
    97:'B', 98:'A', 99:'A', 100:'C', 101:'C', 102:'D', 103:'A', 104:'D', 105:'D',
    106:'B', 107:'D', 108:'A', 109:'A', 110:'C', 111:'C', 112:'B', 113:'C', 114:'A',
    115:'A', 116:'D', 117:'B', 118:'C', 119:'B', 120:'C'
}

def extract_docx_text(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    tree = ET.fromstring(xml)
    paras = [
        "".join([n.text for n in node.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text])
        for node in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
    ]
    return "\n".join([p.strip() for p in paras if p.strip()])

def clean_passage(txt):
    lines = [l.strip() for l in txt.split("\n") if l.strip()]
    cleaned = []
    for l in lines:
        if l.startswith("Reading Passage") or l.startswith("DIRECTIONS:"):
            continue
        cleaned.append(l)
    return "\n\n".join(cleaned)

def parse_part1():
    text = extract_docx_text(DOCX1_PATH)

    p1_start = text.find("Reading Passage I Text:")
    p1_end = text.find("Question 41")
    raw_p1 = text[p1_start:p1_end].strip()
    passage1 = clean_passage(raw_p1)

    p2_start = text.find("Reading Passage II Text:")
    p2_end = text.find("Question 51")
    raw_p2 = text[p2_start:p2_end].strip()
    passage2 = clean_passage(raw_p2)

    matches = list(re.finditer(r"^Question\s+(\d+)\s*$", text, re.MULTILINE))
    items = []

    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        block = text[start_pos:end_pos].strip()

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
            elif l.startswith("Correct Answer:") and ans_idx is None:
                ans_idx = i

        raw_prompt = "\n".join(lines[:optA_idx]).replace("Question:", "").strip()

        optA = "\n".join(lines[optA_idx:optB_idx]).replace("A.", "", 1).strip()
        optB = "\n".join(lines[optB_idx:optC_idx]).replace("B.", "", 1).strip()
        optC = "\n".join(lines[optC_idx:optD_idx]).replace("C.", "", 1).strip()
        optD = "\n".join(lines[optD_idx:ans_idx]).replace("D.", "", 1).strip()

        ans_line = lines[ans_idx]
        m_ans = re.search(r"Correct Answer:\s*([A-D])\b", ans_line)
        correct_ans = m_ans.group(1)

        meta_lines = lines[ans_idx:]
        grade = "Grade 12"
        topic = "Grammar"
        diff = "medium"
        raw_expl = ""

        for i, ml in enumerate(meta_lines):
            if ml.startswith("Grade Mapping:"):
                grade = ml.replace("Grade Mapping:", "").strip()
            elif ml.startswith("Chapter/Topic Classification:"):
                topic = ml.replace("Chapter/Topic Classification:", "").strip()
            elif ml.startswith("Difficulty Level:"):
                diff = ml.replace("Difficulty Level:", "").strip().lower()
            elif ml.startswith("Explanation:"):
                raw_expl = "\n".join(meta_lines[i:]).replace("Explanation:", "").strip()
                break

        # Crucial fix: strip out any trailing section headers/passages from explanation
        explanation = re.split(r"\n+(?:Section\s+|PART\s+|DIRECTIONS:|Reading\s+Passage)", raw_expl)[0].strip()

        # Section-specific prompt enrichment
        if 1 <= qnum <= 38:
            section = "Part I: Grammar"
            prompt = raw_prompt
        elif 39 <= qnum <= 40:
            section = "Part II: Sentence Comprehension"
            prompt = f"Choose the sentence that is closest in meaning to the sentence given:\n\n\"{raw_prompt}\""
        elif 41 <= qnum <= 50:
            section = "Part II: Reading Comprehension (Passage I)"
            prompt = f"[Reading Passage I — Air Pollution]\n\n{passage1}\n\nQuestion:\n{raw_prompt}"
        elif 51 <= qnum <= 60:
            section = "Part II: Reading Comprehension (Passage II)"
            prompt = f"[Reading Passage II — What Makes People Happier]\n\n{passage2}\n\nQuestion:\n{raw_prompt}"
        elif 61 <= qnum <= 68:
            section = "Part III: Vocabulary (Substitution)"
            prompt = f"Choose the alternative that best substitutes the underlined or italicized word in the sentence:\n\n{raw_prompt}"
        elif 69 <= qnum <= 76:
            section = "Part III: Vocabulary (Completion)"
            prompt = f"Choose the word or phrase that best completes the sentence:\n\n{raw_prompt}"
        else:
            section = "English"
            prompt = raw_prompt

        items.append({
            "questionNumber": qnum,
            "section": section,
            "grade": grade,
            "topic": topic,
            "difficulty": diff,
            "prompt": prompt,
            "options": [optA, optB, optC, optD],
            "correctAnswer": correct_ans,
            "explanation": explanation
        })

    return items

def parse_part2():
    text = extract_docx_text(DOCX2_PATH)

    matches = list(re.finditer(r"^QUESTION\s+(\d+)\s*$", text, re.MULTILINE))
    items = []

    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        block = text[start_pos:end_pos].strip()

        lines = [l.strip() for l in block.split("\n") if l.strip()]

        opt_line = None
        for l in lines:
            if l.startswith("Options:"):
                opt_line = l
                break

        m_opt = re.search(r"Options:\s*A\.\s*(.*?)\s*B\.\s*(.*?)\s*C\.\s*(.*?)\s*D\.\s*(.*)", opt_line)
        opts = [m_opt.group(i).strip() for i in range(1, 5)]
        cleaned_opts = [re.sub(r"\s*\[[✓✔]?\s*CORRECT\]", "", o, flags=re.I).strip() for o in opts]

        opt_idx = lines.index(opt_line)
        raw_prompt = "\n".join(lines[1:opt_idx]).replace("Question Text:", "").strip()

        # Grade, diff, ans from header line (lines[0])
        header = lines[0]
        m_head = re.search(r"Grade:\s*(.*?)\s*\|\s*Difficulty:\s*(.*?)\s*\|\s*Correct Answer:\s*([A-D])", header)
        grade = m_head.group(1).strip() if m_head else "Grade 11 & Grade 12"
        diff = m_head.group(2).strip().lower() if m_head else "easy"
        correct_ans = m_head.group(3).strip() if m_head else MASTER_KEY[qnum]

        # Topic & Explanation
        topic = "Writing & Grammar"
        explanation = ""
        for l in lines[opt_idx:]:
            if "Chapter / Topic Classification:" in l:
                topic = l.split("Chapter / Topic Classification:")[-1].strip()
            elif l.startswith("Detailed Explanation:"):
                explanation = l.replace("Detailed Explanation:", "").strip()

        # Strip any extraneous headers from explanation
        explanation = re.split(r"\n+(?:Section\s+|PART\s+|DIRECTIONS:|QUICK-REFERENCE)", explanation)[0].strip()

        if 77 <= qnum <= 79:
            section = "Part III: Writing (Word Order)"
            prompt = f"The words below are given in the wrong order. When put in the right order, they form a correct sentence. Choose the alternative with the correct order:\n\n{raw_prompt}"
        elif 80 <= qnum <= 81:
            section = "Part III: Writing (Spelling)"
            prompt = raw_prompt
        elif 82 <= qnum <= 85:
            section = "Part III: Writing (Punctuation & Capitalization)"
            prompt = raw_prompt
        elif 86 <= qnum <= 87:
            section = "Part III: Writing (Topic Sentence)"
            prompt = f"Read the paragraph carefully and choose the correct topic sentence:\n\n{raw_prompt}"
        elif 88 <= qnum <= 90:
            section = "Part III: Writing (Letter Writing)"
            prompt = raw_prompt
        elif 91 <= qnum <= 94:
            section = "Part III: Writing (Paragraph Coherence)"
            prompt = f"When put in the correct order, the sentences make a complete and coherent paragraph. Choose the alternative that shows the correct order:\n\n{raw_prompt}"
        elif 95 <= qnum <= 120:
            section = "Part IV: Communicative Activities"
            prompt = f"Complete the dialogue with the most appropriate alternative:\n\n{raw_prompt}"
        else:
            section = "English"
            prompt = raw_prompt

        items.append({
            "questionNumber": qnum,
            "section": section,
            "grade": grade,
            "topic": topic,
            "difficulty": diff,
            "prompt": prompt,
            "options": cleaned_opts,
            "correctAnswer": correct_ans,
            "explanation": explanation
        })

    return items

def build_all():
    items1 = parse_part1()
    items2 = parse_part2()
    all_items = items1 + items2

    print(f"Parsed Part 1: {len(items1)} items")
    print(f"Parsed Part 2: {len(items2)} items")
    print(f"Total items: {len(all_items)}")

    assert len(all_items) == 120, f"Expected 120 items, got {len(all_items)}"

    mismatches = 0
    max_expl_len = 0
    for item in all_items:
        qnum = item["questionNumber"]
        exp = MASTER_KEY[qnum]
        if item["correctAnswer"] != exp:
            print(f"Mismatch Q{qnum}: got {item['correctAnswer']}, expected {exp}")
            mismatches += 1

        assert len(item["options"]) == 4, f"Q{qnum}: option count != 4"
        for i, o in enumerate(item["options"]):
            assert o, f"Q{qnum}: option {i} is empty"
        assert item["prompt"], f"Q{qnum}: empty prompt"
        assert item["explanation"], f"Q{qnum}: empty explanation"
        if len(item["explanation"]) > max_expl_len:
            max_expl_len = len(item["explanation"])

    print(f"Validation complete. Answer mismatches: {mismatches}, Max explanation length: {max_expl_len}")
    assert mismatches == 0
    assert max_expl_len <= 3000, f"Explanation exceeds 3000 chars: {max_expl_len}"

    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "english_esslce_2014_booklet028.json")

    with open(out_path, "w", encoding="utf-8") as out_f:
        json.dump(all_items, out_f, indent=2, ensure_ascii=False)

    print(f"SUCCESS: Saved {out_path} with {len(all_items)} questions.")

if __name__ == "__main__":
    build_all()
