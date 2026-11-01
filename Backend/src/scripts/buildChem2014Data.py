import zipfile
import xml.etree.ElementTree as ET
import re
import json
import base64
import os

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1792951858016_ad81a449.docx"

MASTER_KEY = {
    1:'A', 2:'C', 3:'D', 4:'B', 5:'C', 6:'D', 7:'A', 8:'D', 9:'C', 10:'C',
    11:'D', 12:'A', 13:'A', 14:'C', 15:'A', 16:'C', 17:'D', 18:'A', 19:'B', 20:'B',
    21:'D', 22:'A', 23:'B', 24:'D', 25:'A', 26:'B', 27:'D', 28:'C', 29:'D', 30:'B',
    31:'B', 32:'C', 33:'D', 34:'A', 35:'B', 36:'D', 37:'A', 38:'A', 39:'B', 40:'D',
    41:'D', 42:'A', 43:'B', 44:'B', 45:'C', 46:'A', 47:'D', 48:'D', 49:'A', 50:'A',
    51:'A', 52:'B', 53:'A', 54:'A', 55:'C', 56:'D', 57:'D', 58:'B', 59:'B', 60:'C',
    61:'C', 62:'D', 63:'D', 64:'C', 65:'B', 66:'C', 67:'B', 68:'D', 69:'C', 70:'A',
    71:'B', 72:'D', 73:'A', 74:'A', 75:'A', 76:'A', 77:'A', 78:'D', 79:'C', 80:'D'
}

def build_chem_2014():
    print("Reading Chemistry 2014 docx from:", DOCX_PATH)
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

    pattern = r"^QUESTION\s+(\d+)\s+\|\s+(.*?)\s+•\s+(.*?)\s+•\s+\[(.*?)\]\s*$"
    matches = list(re.finditer(pattern, full_text, re.MULTILINE))

    if len(matches) != 80:
        raise ValueError(f"Expected 80 questions, found {len(matches)}")

    items = []
    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        grade = m.group(2).strip()
        unit = m.group(3).strip()
        diff = m.group(4).strip().lower()

        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()

        lines = [l.strip() for l in block.split("\n") if l.strip()]

        topic = unit
        if lines[0].startswith("Topic / Sub-topic:"):
            topic = lines[0].replace("Topic / Sub-topic:", "").strip()
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
            elif "Correct Answer:" in l and ans_idx is None:
                ans_idx = i

        if None in (optA_idx, optB_idx, optC_idx, optD_idx, ans_idx):
            raise ValueError(f"Q{qnum}: missing options or answer in lines: {lines}")

        prompt = "\n".join(lines[:optA_idx]).strip()

        def clean_opt(raw):
            s = re.sub(r"^[A-D]\.\s*", "", raw).strip()
            s = re.sub(r"\s*\[[✓✔]?\s*CORRECT(?:\s*ANSWER)?\]", "", s, flags=re.I).strip()
            return s

        optA = clean_opt("\n".join(lines[optA_idx:optB_idx]))
        optB = clean_opt("\n".join(lines[optB_idx:optC_idx]))
        optC = clean_opt("\n".join(lines[optC_idx:optD_idx]))
        optD = clean_opt("\n".join(lines[optD_idx:ans_idx]))

        if qnum == 49:
            correct_ans = "A"
        else:
            ans_line = lines[ans_idx]
            m_ans = re.search(r"Correct Answer:\s*([A-D])\b", ans_line)
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
        if qnum == 10:
            image_url = images[1]
        elif qnum == 15:
            image_url = images[2]
        elif qnum == 35:
            image_url = images[3]
        elif qnum == 62:
            image_url = images[4]
        elif qnum == 75:
            image_url = images[5]

        item = {
            "questionNumber": qnum,
            "grade": grade,
            "unit": unit,
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
    out_path = os.path.join(out_dir, "chemistry_esslce_2014_booklet125.json")

    with open(out_path, "w", encoding="utf-8") as out_f:
        json.dump(items, out_f, indent=2, ensure_ascii=False)

    print(f"SUCCESS: Generated {out_path} with {len(items)} questions.")

if __name__ == "__main__":
    build_chem_2014()
