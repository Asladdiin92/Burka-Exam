import zipfile
import xml.etree.ElementTree as ET
import re
import json
import base64
import os

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1792956890574_27561c82.docx"

MASTER_KEY = {
    1:'A', 2:'D', 3:'B', 4:'C', 5:'D', 6:'B', 7:'B', 8:'D', 9:'B', 10:'C',
    11:'D', 12:'B', 13:'C', 14:'B', 15:'A', 16:'C', 17:'B', 18:'B', 19:'B', 20:'D',
    21:'C', 22:'A', 23:'A', 24:'A', 25:'B', 26:'B', 27:'A', 28:'A', 29:'D', 30:'B',
    31:'B', 32:'D', 33:'D', 34:'A', 35:'B', 36:'D', 37:'B', 38:'A', 39:'A', 40:'C',
    41:'D', 42:'B', 43:'B', 44:'A', 45:'B', 46:'D', 47:'A', 48:'B', 49:'D', 50:'B',
    51:'C', 52:'A', 53:'C', 54:'B', 55:'D', 56:'C', 57:'A', 58:'B', 59:'C', 60:'B',
    61:'A', 62:'A', 63:'C', 64:'C', 65:'A'
}

def build_math_2015():
    print("Reading Math 2015 docx from:", DOCX_PATH)
    images = {}
    with zipfile.ZipFile(DOCX_PATH) as z:
        for i in range(1, 7):
            data = z.read(f"word/media/image{i}.png")
            images[i] = "data:image/png;base64," + base64.b64encode(data).decode("utf-8")
        xml_content = z.read("word/document.xml")

    tree = ET.fromstring(xml_content)
    paras = [
        "".join([n.text for n in node.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text])
        for node in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
    ]
    full_text = "\n".join([p.strip() for p in paras if p.strip()])

    matches = list(re.finditer(r"^QUESTION\s+(\d+)\s*$", full_text, re.MULTILINE))

    if len(matches) != 65:
        raise ValueError(f"Expected 65 questions, found {len(matches)}")

    items = []
    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()

        lines = [l.strip() for l in block.split("\n") if l.strip()]

        grade = "Grade 11"
        diff = "medium"
        topic = "Mathematics"

        content_start = 0
        for i, l in enumerate(lines[:6]):
            if l.startswith("Grade Mapping:"):
                grade = l.replace("Grade Mapping:", "").strip()
                content_start = max(content_start, i + 1)
            elif l.startswith("Difficulty:"):
                diff = l.replace("Difficulty:", "").strip().lower()
                content_start = max(content_start, i + 1)
            elif l.startswith("Chapter / Topic Classification:"):
                topic = l.replace("Chapter / Topic Classification:", "").strip()
                content_start = max(content_start, i + 1)

        ans_idx = None
        for i in range(len(lines) - 1, 0, -1):
            if "Correct Answer:" in lines[i]:
                ans_idx = i
                break

        if ans_idx is None:
            raise ValueError(f"Q{qnum}: ans_idx not found")

        ans_line = lines[ans_idx]
        m_ans = re.search(r"Correct Answer:\s*([A-D])\b.*?Step-by-Step Explanation:\s*(.*)", ans_line, re.DOTALL)
        if not m_ans:
            m_ans2 = re.search(r"Correct Answer:\s*([A-D])\b", ans_line)
            if not m_ans2:
                raise ValueError(f"Q{qnum}: ans match failed on '{ans_line}'")
            correct_ans = m_ans2.group(1)
            expl_start = ans_line.find("Step-by-Step Explanation:")
            explanation = ans_line[expl_start + len("Step-by-Step Explanation:"):].strip() if expl_start != -1 else ""
        else:
            correct_ans = m_ans.group(1)
            explanation = m_ans.group(2).strip()

        if ans_idx + 1 < len(lines):
            explanation += " " + " ".join(lines[ans_idx + 1:])

        # Clean trailing section headers from explanation
        explanation = re.split(r"\n+(?:QUESTION\s+|Section\s+|PART\s+)", explanation)[0].strip()

        expected_ans = MASTER_KEY[qnum]
        if correct_ans != expected_ans:
            raise ValueError(f"Q{qnum}: Answer mismatch. Got {correct_ans}, expected {expected_ans}")

        body_lines = lines[content_start:ans_idx]

        opts = {}
        opt_line_indices = []
        for i, l in enumerate(body_lines):
            m_opt = re.match(r"^([A-D])\.\s+(.*)", l)
            if m_opt:
                letter = m_opt.group(1)
                val = m_opt.group(2).strip()
                val = re.sub(r"\s*[✓✔]\s*", "", val).strip()
                opts[letter] = val
                opt_line_indices.append(i)

        if len(opts) != 4:
            raise ValueError(f"Q{qnum}: expected 4 options, found {len(opts)}: {list(opts.keys())}")

        first_opt_idx = opt_line_indices[0]
        prompt_lines = body_lines[:first_opt_idx]
        prompt = "\n".join(prompt_lines).strip()
        prompt = re.sub(r"^\d+\.\s*", "", prompt)

        image_url = None
        if qnum == 3:
            image_url = images[1]
        elif qnum == 5:
            image_url = images[2]
        elif qnum == 9:
            image_url = images[3]
        elif qnum == 15:
            image_url = images[4]
        elif qnum == 46:
            image_url = images[5]
        elif qnum == 58:
            image_url = images[6]

        item = {
            "questionNumber": qnum,
            "grade": grade,
            "topic": topic,
            "difficulty": diff,
            "prompt": prompt,
            "options": [opts["A"], opts["B"], opts["C"], opts["D"]],
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
    out_path = os.path.join(out_dir, "mathematics_esslce_2015_booklet339.json")

    with open(out_path, "w", encoding="utf-8") as out_f:
        json.dump(items, out_f, indent=2, ensure_ascii=False)

    print(f"SUCCESS: Generated {out_path} with {len(items)} questions.")

if __name__ == "__main__":
    build_math_2015()
