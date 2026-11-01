import sys
import re
import json
import os

def build_math_2014():
    txt_path = "extracted_math_2014.txt"
    if not os.path.exists(txt_path):
        raise FileNotFoundError(f"Source file {txt_path} not found")

    with open(txt_path, "r", encoding="utf-8") as f:
        full_text = f.read()

    pattern = r"QUESTION\s+(\d+)\s+OF\s+65\s+\|\s+Grade:\s+(.*?)\s+\|\s+Topic:\s+(.*?)\s+\|\s+Difficulty:\s+(.*?)\n"
    matches = list(re.finditer(pattern, full_text))

    if len(matches) != 65:
        raise ValueError(f"Expected 65 questions, found {len(matches)}")

    items = []
    for idx, m in enumerate(matches):
        qnum = int(m.group(1))
        grade = m.group(2).strip()
        topic = m.group(3).strip()
        diff = m.group(4).strip().lower()

        start_pos = m.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()

        ans_match = re.search(r"[✔\s]*Correct Answer:\s*Option\s*([A-D])\s*Explanation:\s*(.*)", block, re.DOTALL)
        if not ans_match:
            raise ValueError(f"Q{qnum}: Failed to match Correct Answer and Explanation")

        correct_ans = ans_match.group(1).strip()
        explanation = ans_match.group(2).strip()

        before_ans = block[:ans_match.start()].strip()
        lines = [l.strip() for l in before_ans.split("\n") if l.strip()]

        optA_idx = next(i for i, l in enumerate(lines) if l.startswith("A."))
        optB_idx = next(i for i, l in enumerate(lines) if l.startswith("B."))
        optC_idx = next(i for i, l in enumerate(lines) if l.startswith("C."))
        optD_idx = next(i for i, l in enumerate(lines) if l.startswith("D."))

        prompt = "\n".join(lines[:optA_idx]).strip()
        optA = "\n".join(lines[optA_idx:optB_idx]).replace("A.", "", 1).strip()
        optB = "\n".join(lines[optB_idx:optC_idx]).replace("B.", "", 1).strip()
        optC = "\n".join(lines[optC_idx:optD_idx]).replace("C.", "", 1).strip()
        optD = "\n".join(lines[optD_idx:]).replace("D.", "", 1).strip()

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

        # Validation
        assert len(item["options"]) == 4, f"Q{qnum}: options length is {len(item['options'])}"
        for i, opt in enumerate(item["options"]):
            assert opt, f"Q{qnum}: option index {i} is empty"
        assert item["correctAnswer"] in ["A", "B", "C", "D"], f"Q{qnum}: invalid correctAnswer {item['correctAnswer']}"
        assert item["prompt"], f"Q{qnum}: empty prompt"
        assert item["explanation"], f"Q{qnum}: empty explanation"

        items.append(item)

    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "mathematics_esslce_2014_booklet058.json")

    with open(out_path, "w", encoding="utf-8") as out_f:
        json.dump(items, out_f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {out_path} with {len(items)} questions.")

if __name__ == "__main__":
    build_math_2014()
