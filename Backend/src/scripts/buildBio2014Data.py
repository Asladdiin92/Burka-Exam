import zipfile
import xml.etree.ElementTree as ET
import re
import json
import base64
import os

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1792941492545_2961ce32.docx"

MASTER_KEY = {
    1:'A', 2:'D', 3:'B', 4:'A', 5:'C', 6:'A', 7:'B', 8:'A', 9:'D', 10:'C',
    11:'A', 12:'D', 13:'C', 14:'D', 15:'B', 16:'D', 17:'A', 18:'D', 19:'C', 20:'A',
    21:'A', 22:'D', 23:'C', 24:'A', 25:'B', 26:'A', 27:'B', 28:'B', 29:'A', 30:'C',
    31:'B', 32:'A', 33:'D', 34:'D', 35:'A', 36:'C', 37:'B', 38:'D', 39:'C', 40:'C',
    41:'B', 42:'C', 43:'A', 44:'C', 45:'B', 46:'B', 47:'A', 48:'D', 49:'A', 50:'B',
    51:'A', 52:'A', 53:'B', 54:'D', 55:'D', 56:'D', 57:'A', 58:'D', 59:'D', 60:'B',
    61:'C', 62:'C', 63:'D', 64:'A', 65:'D', 66:'C', 67:'D', 68:'C', 69:'B', 70:'C',
    71:'C', 72:'B', 73:'C', 74:'A', 75:'A', 76:'C', 77:'C', 78:'C', 79:'B', 80:'A',
    81:'B', 82:'D', 83:'C', 84:'A', 85:'B', 86:'D', 87:'B', 88:'A', 89:'D', 90:'D',
    91:'A', 92:'D', 93:'B', 94:'C', 95:'A', 96:'A', 97:'D', 98:'B', 99:'C', 100:'A'
}

def build_bio_2014():
    print("Reading docx file from:", DOCX_PATH)
    with zipfile.ZipFile(DOCX_PATH) as z:
        img1_data = z.read("word/media/image1.png")
        img2_data = z.read("word/media/image2.png")
        xml_content = z.read("word/document.xml")

    img1_b64 = "data:image/png;base64," + base64.b64encode(img1_data).decode("utf-8")
    img2_b64 = "data:image/png;base64," + base64.b64encode(img2_data).decode("utf-8")

    tree = ET.fromstring(xml_content)
    paragraphs = []
    for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
        texts = [node.text for node in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if node.text]
        if texts:
            paragraphs.append("".join(texts))

    full_text = "\n".join(paragraphs)

    matches = list(re.finditer(r"^QUESTION\s+(\d+)\s*$", full_text, re.MULTILINE))
    if len(matches) != 100:
        raise ValueError(f"Expected 100 questions, found {len(matches)}")

    items = []
    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()

        lines = [l.strip() for l in block.split("\n") if l.strip()]

        grade_line = lines[0]
        diff_line = lines[1]
        topic_line = lines[2]

        grade_match = re.search(r"(Grade\s+\d+)\s+[•\-\|]\s+(.*)", grade_line)
        grade = grade_match.group(1).strip() if grade_match else "Grade 12"
        unit = grade_match.group(2).strip() if grade_match else ""

        diff_match = re.search(r"Difficulty:\s*(\w+)", diff_line, re.IGNORECASE)
        difficulty = diff_match.group(1).lower() if diff_match else "medium"

        topic_match = re.search(r"Topic Classification:\s*(.*)", topic_line)
        topic = topic_match.group(1).strip() if topic_match else unit

        # Find Correct Answer line
        ans_idx = None
        for i in range(len(lines) - 1, 2, -1):
            if "Correct Answer:" in lines[i]:
                ans_idx = i
                break

        if ans_idx is None:
            raise ValueError(f"Q{qnum}: No Correct Answer line found")

        ans_line = lines[ans_idx]
        ans_match = re.search(r"Correct Answer:\s*([A-D])\b.*?Explanation:\s*(.*)", ans_line, re.DOTALL)
        if not ans_match:
            raise ValueError(f"Q{qnum}: ans_match failed on '{ans_line}'")

        correct_ans = ans_match.group(1).strip()
        explanation = ans_match.group(2).strip()
        if ans_idx + 1 < len(lines):
            explanation += " " + " ".join(lines[ans_idx + 1:])

        # Validate against master key
        expected_ans = MASTER_KEY[qnum]
        if correct_ans != expected_ans:
            raise ValueError(f"Q{qnum}: Answer mismatch. Got {correct_ans}, expected {expected_ans}")

        content_lines = lines[3:ans_idx]

        optA_idx = None
        optB_idx = None
        optC_idx = None
        optD_idx = None

        for i, l in enumerate(content_lines):
            if re.match(r"^A\.\s+", l):
                optA_idx = i
            elif re.match(r"^B\.\s+", l) and optA_idx is not None:
                optB_idx = i
            elif re.match(r"^C\.\s+", l) and optB_idx is not None:
                optC_idx = i
            elif re.match(r"^D\.\s+", l) and optC_idx is not None:
                optD_idx = i

        if None in (optA_idx, optB_idx, optC_idx, optD_idx):
            raise ValueError(f"Q{qnum}: Options A-D not matched cleanly. Content lines: {content_lines}")

        prompt = "\n".join(content_lines[:optA_idx]).strip()
        prompt = re.sub(r"^\d+\.\s*", "", prompt)

        def clean_opt(raw):
            s = re.sub(r"^[A-D]\.\s*", "", raw).strip()
            s = re.sub(r"\s*[✓✔]\s*\[Correct Answer\]", "", s, flags=re.IGNORECASE).strip()
            return s

        optA = clean_opt("\n".join(content_lines[optA_idx:optB_idx]))
        optB = clean_opt("\n".join(content_lines[optB_idx:optC_idx]))
        optC = clean_opt("\n".join(content_lines[optC_idx:optD_idx]))
        optD = clean_opt("\n".join(content_lines[optD_idx:]))

        image_url = None
        if qnum == 65:
            image_url = img1_b64
        elif qnum == 70:
            image_url = img2_b64

        item = {
            "questionNumber": qnum,
            "grade": grade,
            "unit": unit,
            "topic": topic,
            "difficulty": difficulty,
            "prompt": prompt,
            "options": [optA, optB, optC, optD],
            "correctAnswer": correct_ans,
            "explanation": explanation
        }
        if image_url:
            item["imageUrl"] = image_url

        # Validation
        assert len(item["options"]) == 4, f"Q{qnum}: options length is {len(item['options'])}"
        for i, opt in enumerate(item["options"]):
            assert opt, f"Q{qnum}: option {i} is empty"
        assert item["prompt"], f"Q{qnum}: empty prompt"
        assert item["explanation"], f"Q{qnum}: empty explanation"

        items.append(item)

    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "biology_esslce_2014_booklet154.json")

    with open(out_path, "w", encoding="utf-8") as out_f:
        json.dump(items, out_f, indent=2, ensure_ascii=False)

    print(f"SUCCESS: Generated {out_path} with {len(items)} questions.")

if __name__ == "__main__":
    build_bio_2014()
