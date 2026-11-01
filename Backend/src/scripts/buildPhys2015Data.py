import zipfile
import xml.etree.ElementTree as ET
import re
import json
import base64
import os

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1792957545734_0087b6b2.docx"

MASTER_KEY = {
    1:'B', 2:'C', 3:'C', 4:'D', 5:'C', 6:'B', 7:'D', 8:'A', 9:'C', 10:'B',
    11:'A', 12:'B', 13:'C', 14:'B', 15:'D', 16:'A', 17:'B', 18:'C', 19:'A', 20:'B',
    21:'B', 22:'D', 23:'C', 24:'A', 25:'B', 26:'D', 27:'C', 28:'B', 29:'C', 30:'C',
    31:'B', 32:'C', 33:'A', 34:'B', 35:'D', 36:'C', 37:'A', 38:'B', 39:'D', 40:'A',
    41:'B', 42:'D', 43:'A', 44:'B', 45:'D', 46:'B', 47:'C', 48:'A', 49:'D', 50:'C'
}

def build_phys_2015():
    print("Reading Physics 2015 docx from:", DOCX_PATH)
    images = {}
    with zipfile.ZipFile(DOCX_PATH) as z:
        for i in range(1, 8):
            data = z.read(f"word/media/image{i}.png")
            images[i] = "data:image/png;base64," + base64.b64encode(data).decode("utf-8")
        xml_content = z.read("word/document.xml")

    tree = ET.fromstring(xml_content)
    paras = [
        "".join([n.text for n in node.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text])
        for node in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
    ]
    full_text = "\n".join([p.strip() for p in paras if p.strip()])

    pattern = r"^QUESTION\s+(\d+)\s+\[(.*?)\]\s*$"
    matches = list(re.finditer(pattern, full_text, re.MULTILINE))

    if len(matches) != 50:
        raise ValueError(f"Expected 50 questions, found {len(matches)}")

    items = []
    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        grade = m.group(2).strip()

        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()

        lines = [l.strip() for l in block.split("\n") if l.strip()]

        topic = "Physics"
        diff = "medium"

        content_start = 0
        for i, l in enumerate(lines[:4]):
            if l.startswith("Topic:"):
                topic = l.replace("Topic:", "").strip()
                content_start = max(content_start, i + 1)
            elif l.startswith("Difficulty:"):
                diff = l.replace("Difficulty:", "").strip().lower()
                content_start = max(content_start, i + 1)

        ans_idx = None
        for i in range(len(lines) - 1, 0, -1):
            if "CORRECT ANSWER:" in lines[i]:
                ans_idx = i
                break

        if ans_idx is None:
            raise ValueError(f"Q{qnum}: ans_idx not found")

        ans_line = lines[ans_idx]
        m_ans = re.search(r"CORRECT ANSWER:\s*Option\s*([A-D])\b", ans_line)
        if not m_ans:
            raise ValueError(f"Q{qnum}: cannot parse answer from '{ans_line}'")
        correct_ans = m_ans.group(1)

        expected_ans = MASTER_KEY[qnum]
        if correct_ans != expected_ans:
            raise ValueError(f"Q{qnum}: Answer mismatch. Got {correct_ans}, expected {expected_ans}")

        explanation = ""
        if ans_idx + 1 < len(lines):
            raw_expl = "\n".join(lines[ans_idx + 1:]).replace("Explanation & Derivation:", "").strip()
            explanation = re.split(r"\n+(?:QUESTION\s+|Section\s+|PART\s+)", raw_expl)[0].strip()

        body_lines = lines[content_start:ans_idx]

        optA_idx = None
        optB_idx = None
        optC_idx = None
        optD_idx = None

        for i, l in enumerate(body_lines):
            if re.match(r"^A\.\s+", l) and optA_idx is None:
                optA_idx = i
            elif re.match(r"^B\.\s+", l) and optB_idx is None and optA_idx is not None:
                optB_idx = i
            elif re.match(r"^C\.\s+", l) and optC_idx is None and optB_idx is not None:
                optC_idx = i
            elif re.match(r"^D\.\s+", l) and optD_idx is None and optC_idx is not None:
                optD_idx = i

        if None in (optA_idx, optB_idx, optC_idx, optD_idx):
            raise ValueError(f"Q{qnum}: missing options in body lines: {body_lines}")

        prompt = "\n".join(body_lines[:optA_idx]).strip()
        # Clean figure captions if any
        prompt = re.sub(r"\n*Figure for Question \d+.*$", "", prompt).strip()

        def clean_opt(raw):
            s = re.sub(r"^[A-D]\.\s*", "", raw).strip()
            s = re.sub(r"\s*[✓✔]?\s*\[Correct Option\]", "", s, flags=re.I)
            s = re.sub(r"[✓✔]", "", s).strip()
            return s

        optA = clean_opt("\n".join(body_lines[optA_idx:optB_idx]))
        optB = clean_opt("\n".join(body_lines[optB_idx:optC_idx]))
        optC = clean_opt("\n".join(body_lines[optC_idx:optD_idx]))
        optD = clean_opt("\n".join(body_lines[optD_idx:]))

        image_url = None
        if qnum == 5:
            image_url = images[1]
        elif qnum == 7:
            image_url = images[2]
        elif qnum == 15:
            image_url = images[3]
        elif qnum == 18:
            image_url = images[4]
        elif qnum == 25:
            image_url = images[5]
        elif qnum == 36:
            image_url = images[6]
        elif qnum == 49:
            image_url = images[7]

        item = {
            "questionNumber": qnum,
            "grade": grade,
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
    out_path = os.path.join(out_dir, "physics_esslce_2015_booklet527.json")

    with open(out_path, "w", encoding="utf-8") as out_f:
        json.dump(items, out_f, indent=2, ensure_ascii=False)

    print(f"SUCCESS: Generated {out_path} with {len(items)} questions.")

if __name__ == "__main__":
    build_phys_2015()
