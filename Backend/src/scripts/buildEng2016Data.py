"""
Build English EUEE / ESSLCE 2016 E.C. (2024 G.C.) exam data JSON from the uploaded Word document.
Parses all 120 questions with prompts, options, verified answers, detailed explanations,
difficulty, topic/grade mappings, and embedded reading passages / letter stimulus.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import os
import re
from zipfile import ZipFile
import xml.etree.ElementTree as ET

DOCX_PATH = r'C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793126494264_5b132db0.docx'


def resolve_chapter_title(qnum):
    """Map question number to curriculum chapter."""
    if 1 <= qnum <= 20:
        return "Unit 4: Reading Comprehension & Passage Analysis"
    elif 21 <= qnum <= 38:
        return "Unit 3: Sentence Comprehension & Vocabulary"
    elif 39 <= qnum <= 76:
        return "Unit 5: Grammar and Usage (Conditionals, Tenses, Modals & Connectors)"
    elif 77 <= qnum <= 102:
        return "Unit 2: Communicative Activities & Functional Dialogue"
    else:
        # 103 <= qnum <= 120
        return "Unit 1: Writing Skills (Letter Writing, Coherence, Mechanics & Spelling)"


def parse_doc(docx_path):
    z = ZipFile(docx_path)
    tree = ET.parse(z.open('word/document.xml'))
    root = tree.getroot()
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    body = root.find('.//w:body', ns)

    elements = []
    for child in body:
        tag = child.tag.split('}')[-1]
        txt = ' '.join(child.itertext()).strip()
        if txt:
            elements.append((tag, txt))

    # Extract reading passages and letter stimulus
    passage_1 = ""
    passage_2 = ""
    letter_stimulus = ""

    for tag, txt in elements:
        if 'Political Correctness and Free Speech' in txt and len(txt) > 200:
            passage_1 = txt.strip()
        elif 'The Aftermath of COVID-19' in txt and len(txt) > 200:
            passage_2 = txt.strip()
        elif 'Sample Letter Stimulus' in txt and len(txt) > 50:
            letter_stimulus = txt.strip()

    # Group elements into question blocks
    q_blocks = []
    current_block = []
    for elem in elements:
        if re.match(r'^Question\s+\d+\s+\[', elem[1], re.IGNORECASE):
            if current_block:
                q_blocks.append(current_block)
            current_block = [elem]
        elif current_block:
            current_block.append(elem)
    if current_block:
        q_blocks.append(current_block)

    items = []

    for b_idx, block in enumerate(q_blocks):
        header_txt = block[0][1]
        m_head = re.match(r'^Question\s+(\d+)\s+\[(.*?)\]', header_txt, re.IGNORECASE)
        if not m_head:
            raise ValueError(f"Block {b_idx}: header format error: {header_txt[:60]}")
        qnum = int(m_head.group(1))
        meta_str = m_head.group(2)

        # Grade
        grade_m = re.search(r'Grade:\s*(.*?)(?=\s*\|)', meta_str)
        grade = grade_m.group(1).strip() if grade_m else "Grade 11–12"

        # Topic
        topic_m = re.search(r'Topic:\s*(.*?)(?=\s*\|)', meta_str)
        topic = topic_m.group(1).strip() if topic_m else "English"

        # Difficulty
        diff_m = re.search(r'Difficulty:\s*(\w+)', meta_str)
        difficulty = diff_m.group(1).lower() if diff_m else "medium"
        if difficulty not in ("easy", "medium", "hard"):
            difficulty = "medium"

        # Prompt, options, and answer/explanation
        prompt_lines = []
        opt_a, opt_b, opt_c, opt_d = None, None, None, None
        correct_ans = None
        explanation = ""

        for elem in block[1:]:
            t_type, txt = elem[0], elem[1]
            if re.match(r'^A\.\s+', txt):
                opt_a = re.sub(r'^A\.\s+', '', txt).strip()
            elif re.match(r'^B\.\s+', txt):
                opt_b = re.sub(r'^B\.\s+', '', txt).strip()
            elif re.match(r'^C\.\s+', txt):
                opt_c = re.sub(r'^C\.\s+', '', txt).strip()
            elif re.match(r'^D\.\s+', txt):
                opt_d = re.sub(r'^D\.\s+', '', txt).strip()
            elif re.search(r'[✔✓]\s*Correct Answer:\s*([A-D])', txt):
                ans_m = re.search(r'[✔✓]\s*Correct Answer:\s*([A-D])', txt)
                correct_ans = ans_m.group(1)
                expl_m = re.search(r'Explanation:\s*(.*)$', txt)
                explanation = expl_m.group(1).strip() if expl_m else ""
            elif not opt_a:
                prompt_lines.append(txt)

        raw_prompt = "\n".join(prompt_lines).strip()

        # Context enrichment
        if 1 <= qnum <= 10:
            prompt = f"[Reading Passage I — Political Correctness and Free Speech]\n{passage_1}\n\nQuestion {qnum}: {raw_prompt}"
        elif 11 <= qnum <= 20:
            prompt = f"[Reading Passage II — The Aftermath of COVID-19]\n{passage_2}\n\nQuestion {qnum}: {raw_prompt}"
        elif 114 <= qnum <= 116:
            prompt = f"[{letter_stimulus}]\n\nQuestion {qnum}: {raw_prompt}"
        else:
            prompt = raw_prompt

        clean_options = [opt_a, opt_b, opt_c, opt_d]

        item = {
            "questionNumber": qnum,
            "grade": grade,
            "unit": resolve_chapter_title(qnum),
            "topic": topic,
            "difficulty": difficulty,
            "prompt": prompt,
            "options": clean_options,
            "correctAnswer": correct_ans,
            "explanation": explanation
        }

        items.append(item)

    items.sort(key=lambda x: x["questionNumber"])
    return items


def main():
    print("=" * 60)
    print("Building English EUEE / ESSLCE 2016 E.C. Exam Data")
    print("=" * 60)

    items = parse_doc(DOCX_PATH)
    print(f"\nParsed {len(items)} questions.")

    if len(items) != 120:
        raise ValueError(f"Expected 120 questions, got {len(items)}")

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
        print("All 120 questions passed strict validation!\n")

    # Chapter distribution
    print("Chapter Distribution:")
    chapter_counts = {}
    for it in items:
        u = it["unit"]
        chapter_counts[u] = chapter_counts.get(u, 0) + 1
    for u, cnt in sorted(chapter_counts.items()):
        print(f"  {u}: {cnt} questions")

    # Difficulty distribution
    print("\nDifficulty Distribution:")
    diff_counts = {}
    for it in items:
        d = it["difficulty"]
        diff_counts[d] = diff_counts.get(d, 0) + 1
    for d, cnt in sorted(diff_counts.items()):
        print(f"  {d}: {cnt} questions")

    # Write output
    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "english_esslce_2016_master.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    print(f"\nSaved JSON: {out_path} ({os.path.getsize(out_path):,} bytes)")
    print("DONE!")


if __name__ == "__main__":
    main()
