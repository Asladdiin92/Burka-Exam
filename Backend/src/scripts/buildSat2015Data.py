import zipfile
import xml.etree.ElementTree as ET
import re
import json
import base64
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793111039636_76d28321.docx"

MASTER_KEY = {
    1:'B', 2:'A', 3:'A', 4:'B', 5:'A', 6:'B', 7:'A', 8:'C', 9:'A', 10:'B',
    11:'A', 12:'C', 13:'B', 14:'B', 15:'C', 16:'B', 17:'C', 18:'C', 19:'B', 20:'B',
    21:'B', 22:'B', 23:'B', 24:'C', 25:'C', 26:'C', 27:'C', 28:'B', 29:'C', 30:'B',
    31:'D', 32:'C', 33:'C', 34:'A', 35:'D', 36:'A', 37:'B', 38:'D', 39:'D', 40:'A',
    41:'C', 42:'D', 43:'A', 44:'C', 45:'C', 46:'D', 47:'B', 48:'B', 49:'A', 50:'B',
    51:'D', 52:'B', 53:'A', 54:'B', 55:'C', 56:'B', 57:'D', 58:'C', 59:'A', 60:'D'
}

PASSAGE_I = """[Reading Passage I]
Historically, British adventurism, expansionism, as well as the slave trade and Christian evangelism led to the global spread of the English language and its diverse forms. It was commanded to become the medium of international communication as a legacy of the British colonialism and was chauvinistically described as 'a window on the world', if not the chosen tongue.
As the influence of the British Empire recedes, however, English speakers around the globe are now left to their discretion. In the past, there was a great fascination among Indians for 'pure language'. Several generations of Head Masters have spent their lives instilling in the minds of students that speaking the 'Queen's English' was the ultimate in educational attainment. Nowadays, English is becoming more and more monolithic. In this scenario, the international standard variety of English will be the common factor that allows for mutual intelligibility among its Afro-Asian varieties."""

PASSAGE_II = """[Reading Passage II — Cloze Context]
Word Bank: [ anonymous | exposes | homogenous | cosmopolitan | specialization ]

One of the major decisions which preparatory school leavers face is the dilemma of joining a large university or a small college. The large university provides a wide range of academic departments as well as numerous courses within such departments. The small college, however, generally offers a limited number of courses and (1. ________) opportunities with a better student-faculty ratio, thus permitting individualized attention to students.
Because of its large, (2. ________) student body (often exceeding 20,000), the university (3. ________) its students to various cultural, social, and extracurricular activities. On the other hand, the (4. ________) student body of the small college affords greater opportunities for direct involvement and individual participation in such activities and intercultural clubs. All the more, the university closely approximates the real world since it provides a relaxed, impersonal and sometimes (5. ________) existence.
In contrast, the intimate atmosphere of the small college allows the students three-to-four years of structured living in which they contemplate and prepare for the real world."""

DATA_TABLES = """[Reference Data: Student Enrollment in a College (Total Enrollment = 4,800)]
Table 1: Distribution of Enrollment by Class and Gender
• Freshman (1st Year):  Male = 1,000 | Female = 800 | Total = 1,800
• Sophomore (2nd Year): Male = 750   | Female = 450 | Total = 1,200
• Junior (3rd Year):    Male = 620   | Female = 380 | Total = 1,000
• Senior (4th Year):    Male = 480   | Female = 320 | Total = 800
• Total:                Male = 2,850 | Female = 1,950 | Grand Total = 4,800

Table 2: Percent of Total Enrollment Majoring in Selected Academic Areas
• Social Science = 30%  |  Natural Science = 50%  |  Other Science = 20%"""

def resolve_chapter_title(qnum):
    if (1 <= qnum <= 7) or (31 <= qnum <= 35):
        return "Unit 1: Verbal Classification & Vocabulary (Synonyms & Antonyms)"
    elif 8 <= qnum <= 12:
        return "Unit 4: Verbal Analogies"
    elif 13 <= qnum <= 22:
        return "Unit 3: Reading Comprehension (Informational & Scientific Texts)"
    elif 23 <= qnum <= 30:
        return "Unit 2: Analytical & Logical Reasoning (Puzzles, Deductions & Critical Thinking)"
    elif 37 <= qnum <= 41:
        return "Unit 5: Data Interpretation & Statistical Analysis"
    else:
        return "Unit 6: Quantitative Reasoning (Arithmetic, Algebra, Geometry & Word Problems)"

def build_sat_2015():
    print(f"Reading SAT 2015 docx from: {DOCX_PATH}")
    images = {}
    with zipfile.ZipFile(DOCX_PATH) as z:
        for i in range(1, 8):
            name = f"word/media/image{i}.png"
            if name in z.namelist():
                data = z.read(name)
                images[i] = "data:image/png;base64," + base64.b64encode(data).decode("utf-8")
        xml_content = z.read("word/document.xml")

    print(f"Extracted {len(images)} images.")

    tree = ET.fromstring(xml_content)
    tables = list(tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tbl"))

    items = []

    for tbl in tables:
        rows = list(tbl.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tr"))
        row_texts = []
        for r in rows:
            row_str = " ".join(["".join(tc.itertext()).strip() for tc in r.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tc") if "".join(tc.itertext()).strip()])
            if row_str:
                row_texts.append(row_str)

        header_idx = -1
        for i, rt in enumerate(row_texts):
            if re.search(r"QUESTION\s+\d+\b", rt):
                header_idx = i
                break

        if header_idx == -1:
            continue

        header_str = row_texts[header_idx]
        m_head = re.search(r"QUESTION\s+(\d+)\s*\|\s*Grade:\s*(.*?)\s*•\s*Topic:\s*(.*?)\s*•\s*Difficulty:\s*(.*?)$", header_str)
        if not m_head:
            continue

        qnum = int(m_head.group(1))
        grade = m_head.group(2).strip()
        topic = m_head.group(3).strip()
        diff = m_head.group(4).strip().lower()

        subsequent = row_texts[header_idx + 1:]

        ans_idx = -1
        for i, s in enumerate(subsequent):
            if "Correct Answer:" in s:
                ans_idx = i
                break

        if ans_idx == -1:
            raise ValueError(f"Q{qnum}: missing Correct Answer row")

        ans_row = subsequent[ans_idx]
        opt_rows = subsequent[:ans_idx]

        prompt_parts = []
        opts_parts = []
        found_opt = False
        for r in opt_rows:
            if re.search(r"\bA\.\s+", r) or found_opt:
                found_opt = True
                opts_parts.append(r)
            else:
                prompt_parts.append(r)

        raw_prompt = " ".join(prompt_parts).strip()
        opts_str = " ".join(opts_parts).strip()

        opt_matches = re.findall(r"([A-D]\.\s+.*?)(?=[A-D]\.\s+|$)", opts_str)
        if len(opt_matches) != 4:
            raise ValueError(f"Q{qnum}: could not parse 4 options from '{opts_str}'")

        def clean_opt(raw):
            s = re.sub(r"^[A-D]\.\s*", "", raw).strip()
            s = re.sub(r"\s*[✓✔]?\s*\[Correct Answer\]", "", s, flags=re.I).strip()
            return s

        options = [clean_opt(o) for o in opt_matches]

        m_ans = re.search(r"Correct Answer:\s*([A-D])\b", ans_row)
        if not m_ans:
            raise ValueError(f"Q{qnum}: cannot parse correct answer from '{ans_row}'")
        correct_ans = m_ans.group(1)

        expected_ans = MASTER_KEY[qnum]
        if correct_ans != expected_ans:
            raise ValueError(f"Q{qnum}: Key mismatch! Got {correct_ans}, expected {expected_ans}")

        m_expl = re.search(r"Explanation:\s*(.*)", ans_row)
        explanation = m_expl.group(1).strip() if m_expl else ans_row

        # Enrich prompts with context
        if 13 <= qnum <= 17:
            prompt = f"{PASSAGE_I}\n\nQuestion {qnum}: {raw_prompt}"
        elif 18 <= qnum <= 22:
            prompt = f"{PASSAGE_II}\n\nQuestion {qnum}: {raw_prompt}"
        elif 37 <= qnum <= 41:
            prompt = f"{DATA_TABLES}\n\nQuestion {qnum}: {raw_prompt}"
        else:
            prompt = raw_prompt

        # Image mapping
        image_url = None
        if qnum == 18:
            image_url = images.get(1)  # Figure 1: Passage II Framework
        elif qnum in (37, 38, 40, 41):
            image_url = images.get(2)  # Figure 2: Enrollment Distribution Chart
        elif qnum == 39:
            image_url = images.get(3)  # Figure 3: Venn Diagram Q39
        elif qnum == 43:
            image_url = images.get(4)  # Figure 4: Rectangular Farm & Quadratic Area
        elif qnum in (47, 49, 50):
            image_url = images.get(5)  # Figure 5: Sequences & Series Plots
        elif qnum in (56, 57):
            image_url = images.get(6)  # Figure 6: Linear Systems & Inequalities Plots
        elif qnum == 60:
            image_url = images.get(7)  # Figure 7: Similar Right Triangles & Shadow

        chapter_title = resolve_chapter_title(qnum)

        item = {
            "questionNumber": qnum,
            "grade": grade,
            "unit": chapter_title,
            "topic": topic,
            "difficulty": diff,
            "prompt": prompt,
            "options": options,
            "correctAnswer": correct_ans,
            "explanation": explanation
        }
        if image_url:
            item["imageUrl"] = image_url

        items.append(item)

    items.sort(key=lambda x: x["questionNumber"])
    if len(items) != 60:
        raise ValueError(f"Expected 60 questions, got {len(items)}")

    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "sat_esslce_2015_booklet432.json")

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated {len(items)} questions in: {out_path}")
    print(f"Embedded diagrams attached to {len([x for x in items if 'imageUrl' in x])} questions.")

if __name__ == "__main__":
    build_sat_2015()
