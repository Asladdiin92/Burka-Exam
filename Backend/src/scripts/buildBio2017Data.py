import sys
import zipfile
import xml.etree.ElementTree as ET
import json
import os
import re

sys.stdout.reconfigure(encoding="utf-8")

DOCX_PATH = r"C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793146927482_96f087b7.docx"
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "../seeds/data/biology_esslce_2017_booklet351.json")

def clean_option(opt_str):
    s = re.sub(r'^[A-D]\.\s*', '', opt_str).strip()
    s = re.sub(r'[\u2713\u2714]?\s*\[Correct\]\s*', '', s, flags=re.IGNORECASE).strip()
    return s

def assign_unit(qnum, grade_str, topic_str):
    t_lower = topic_str.lower()
    g_lower = grade_str.lower()

    # Climate change & environmental action
    if "climate change" in t_lower or "green legacy" in t_lower or qnum in [98, 99, 100]:
        return "Chapter 6: Climate Change"

    # Human Body Systems & Endocrine / Nervous / Excretory
    if qnum in [86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97]:
        return "Chapter 5: Human Body System"

    # Evolution
    if "evolution" in t_lower or "origin of life" in t_lower or "speciation" in t_lower or "population genetics" in t_lower or qnum in [77, 78, 79, 80, 83, 84, 85]:
        return "Chapter 4: Evolution"

    # Cellular Respiration & Photosynthesis (Energy Transformation)
    if "respiration" in t_lower or "photosynthesis" in t_lower or "calvin" in t_lower or "photophosphorylation" in t_lower or "glycolysis" in t_lower or "fermentation" in t_lower or qnum in range(65, 77):
        return "Unit 5: Energy Transformation (Grade 11)"

    # Microbiology & Infectious Diseases
    if "microbiology" in t_lower or "archaea" in t_lower or "fungal" in t_lower or "protozoa" in t_lower or "sleeping sickness" in t_lower or "virology" in t_lower or "bacteria" in t_lower or qnum in range(55, 65):
        return "Unit 1: Microorganisms (Grade 12)"

    # Biotechnology & Applied Biology
    if "biotechnology" in t_lower or "transgenic" in t_lower or "forensic" in t_lower or "washing powder" in t_lower or "biological warfare" in t_lower or qnum in range(51, 55):
        return "Chapter 1: Application of Biology"

    # Environmental Science & Ecology (Grade 12)
    if qnum in [47, 48, 49, 50]:
        return "Unit 2: Ecology (Grade 12)"

    # Human Reproduction & Health (Grade 12)
    if "reproduction" in t_lower or "contracept" in t_lower or "sti" in t_lower or "hiv" in t_lower or "traditional" in t_lower or qnum in range(41, 47):
        return "Unit 3: Human Biology and Health (Grade 10)"

    # Genetics & Molecular Biology (Grade 11/12)
    if "genetic" in t_lower or "chromosome" in t_lower or "dna" in t_lower or "meiosis" in t_lower or "mendel" in t_lower or "breeding" in t_lower or "mutation" in t_lower or qnum in range(33, 41) or qnum in [81, 82]:
        return "Unit 3: Genetics (Grade 12)"

    # Enzymes & Metabolism (Grade 11)
    if "enzym" in t_lower or qnum in range(26, 33):
        return "Unit 3: Enzymes (Grade 11)"

    # Biochemistry (Grade 11)
    if "biochem" in t_lower or "protein structure" in t_lower or qnum == 27:
        return "Unit 2: Biochemical Molecules (Grade 11)"

    # Animal Biology & Diversity (Grade 10/11)
    if "animal" in t_lower or "poikilothermic" in t_lower or qnum in [23, 24, 25]:
        return "Unit 5: Classification (Grade 9)"

    # Plant Biology (Grade 10)
    if "plant" in t_lower or qnum in [20, 21, 22]:
        return "Unit 4: Food Making and Growth in Plants (Grade 10)"

    # Cell Division (Grade 10)
    if "cell division" in t_lower or "mitosis" in t_lower or qnum in [18, 19]:
        return "Unit 4: Cell Biology (Grade 11)"

    # Ecology & Ecosystems (Grade 9)
    if "ecosystem" in t_lower or "ecology" in t_lower or qnum in [15, 16, 17]:
        return "Unit 6: Environment (Grade 9)"

    # Classification & Plant Diversity (Grade 9)
    if "classification" in t_lower or "plant diversity" in t_lower or "monocot" in t_lower or "gymnosperm" in t_lower or qnum in [12, 13, 14]:
        return "Unit 5: Classification (Grade 9)"

    # Human Nutrition, Respiration & Transport (Grade 9)
    if "nutrition" in t_lower or "respiration" in t_lower or "transport" in t_lower or qnum in range(5, 12):
        return "Unit 3: Human Biology and Health (Grade 9)"

    # Cell Biology (Grade 9)
    if "cell biology" in t_lower or "microscop" in t_lower or "osmosis" in t_lower or qnum in [2, 3, 4]:
        return "Unit 2: Cell Biology (Grade 9)"

    # Introduction to Biology (Grade 9)
    return "Unit 1: Biology and Technology (Grade 9)"

def build_bio_2017():
    print(f"Reading Biology 2017 DOCX: {DOCX_PATH}")
    if not os.path.exists(DOCX_PATH):
        raise FileNotFoundError(f"DOCX file not found at {DOCX_PATH}")

    with zipfile.ZipFile(DOCX_PATH) as z:
        xml_content = z.read("word/document.xml")

    tree = ET.fromstring(xml_content)
    body = tree.find("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}body")
    w = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

    children = list(body)

    questions = []
    current_q = None

    for child in children:
        tag = child.tag.split("}")[-1]
        txt = "".join([n.text for n in child.iter(w + "t") if n.text]).strip()

        if tag == "p" and re.match(r"^Question\s+(\d+)\s*\|", txt, re.IGNORECASE):
            m = re.match(r"^Question\s+(\d+)\s*\|\s*Grade:\s*([^|]+)\s*\|\s*Topic:\s*([^|]+)\s*\|\s*Difficulty:\s*(.*)", txt, re.IGNORECASE)
            if not m:
                continue
            qnum = int(m.group(1))
            grade = m.group(2).strip()
            topic = m.group(3).strip()
            diff = m.group(4).strip().lower()

            if current_q:
                questions.append(current_q)

            current_q = {
                "questionNumber": qnum,
                "grade": grade,
                "topic": topic,
                "difficulty": diff if diff in ["easy", "medium", "hard"] else "medium",
                "prompt_parts": [],
                "options_raw": [],
                "expl_table": None
            }
            continue

        if current_q and current_q["expl_table"] is None:
            if tag == "tbl":
                current_q["expl_table"] = txt
            elif tag == "p":
                if not txt:
                    continue
                if re.match(r"^[A-D]\.\s+", txt):
                    current_q["options_raw"].append(txt)
                else:
                    if not current_q["options_raw"]:
                        current_q["prompt_parts"].append(txt)

    if current_q:
        questions.append(current_q)

    if len(questions) != 100:
        raise ValueError(f"Expected 100 questions, found {len(questions)}")

    processed_questions = []
    for q in questions:
        qnum = q["questionNumber"]
        if len(q["options_raw"]) != 4:
            raise ValueError(f"Q{qnum}: Expected 4 options, found {len(q['options_raw'])}")

        clean_options = [clean_option(opt) for opt in q["options_raw"]]
        full_prompt = "\n\n".join(q["prompt_parts"]).strip()
        full_prompt = re.sub(r"[ \t]+", " ", full_prompt)

        # Parse explanation table
        expl_txt = q["expl_table"] or ""
        ans_m = re.search(r"Correct\s*Answer:\s*([A-D])", expl_txt, re.IGNORECASE)
        if not ans_m:
            raise ValueError(f"Q{qnum}: Failed to match Correct Answer in: {expl_txt[:60]}")
        correct_ans = ans_m.group(1).upper()

        expl_m = re.search(r"Explanation:\s*(.*)", expl_txt, re.DOTALL | re.IGNORECASE)
        explanation = expl_m.group(1).strip() if expl_m else expl_txt
        explanation = re.sub(r"[ \t]+", " ", explanation).strip()

        unit = assign_unit(qnum, q["grade"], q["topic"])

        question_obj = {
            "questionNumber": qnum,
            "grade": q["grade"],
            "topic": q["topic"],
            "unit": unit,
            "difficulty": q["difficulty"],
            "prompt": full_prompt,
            "options": clean_options,
            "correctAnswer": correct_ans,
            "explanation": explanation,
            "imageUrl": None
        }
        processed_questions.append(question_obj)

    print(f"Successfully processed {len(processed_questions)} questions.")

    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(processed_questions, f, ensure_ascii=False, indent=2)

    file_size = os.path.getsize(OUTPUT_JSON)
    print(f"Saved master JSON to: {OUTPUT_JSON} ({file_size:,} bytes)")
    return processed_questions

if __name__ == "__main__":
    build_bio_2017()
