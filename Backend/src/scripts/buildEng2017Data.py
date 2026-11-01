"""
Build ESSLCE English 2017 Master Data JSON
Parses media_1793256059145_eb2e9a47.docx and outputs
Backend/src/seeds/data/english_esslce_2017_master.json
"""

import json
import os
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

DOCX_PATH = r"C:\Users\BURKA\.gemini\antigravity\brain\2521200a-ca40-43f9-88e7-cea27c09466a\.user_uploaded\media_1793256059145_eb2e9a47.docx"
OUTPUT_JSON = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "seeds",
    "data",
    "english_esslce_2017_master.json"
)

PASSAGE_1 = (
    "[Reading Passage I — Homelessness and Personal Responsibility]\n"
    "1. Homeless people are everywhere—on the street, in public buildings, on the evening news and at the corner parking lot. "
    "You can hardly step out of your house these days without meeting some haggard character who asks you for a cigarette or begs for 'a little change'. "
    "The homeless are not just constant symbols of wasted lives and social programs—they have become a danger to public safety.\n"
    "2. What is the root of the homeless problem? Everyone seems to have a scapegoat. Advocates of the homeless blame government policy; "
    "politicians blame the legal system; the courts blame the bureaucratic infrastructure; the Democrats blame the Republicans and the Republicans blame the Democrats. "
    "The public also blames the economy, drugs, the 'poverty cycle', and 'the breakdown of society'. With all this finger-pointing, the group most responsible for "
    "the homeless being the way they are received the least blame. That group is the homeless themselves.\n"
    "3. How can I say this? For the past two years I have worked with the homeless, volunteering at the Salvation Army and at a soup kitchen in Austin, Texas. "
    "I have led a weekly chapel service, served food, listened, counseled, given time and money, and shared their struggles. I have seen their response to troubles, "
    "and though I would rather report otherwise, many of them seem to have chosen the lifestyles they lead. They are unwilling to do the things necessary to overcome "
    "their circumstances. They must bear the greatest part of the blame for their manifold troubles.\n"
    "4. Let me qualify what I just said. Not everyone who finds himself out of a job and in the street is there because he/she wants to be. "
    "Some are victims of tragic circumstances. I met many exhausted, sensible people during my time working with Austin's homeless: the single father struggling "
    "to earn his bread and be a role model for his children; the woman who fled a good job in another city to escape an abusive husband; the well-educated young man "
    "who had his world turned upside down by divorce and a layoff. These people deserve every effort to help them back on their feet.\n"
    "5. But they are not the real problem. They are usually off the streets and resuming normal lives within a period of weeks or months. "
    "Even while 'down on their luck', they are responsible citizens, working in the shelters and applying for jobs. They are homeless, true, but only temporarily, "
    "because they are eager to reorganize their lives.\n"
    "6. For every person temporarily homeless, though, there are many who are chronically so. Whether because of mental illness, alcoholism, poor education, "
    "drug addiction, or simply laziness, these homeless are content to remain as they are. In many cases they choose the streets. They enjoy the freedom and "
    "consider begging a minor inconvenience. They know they can always get a job for a day or two for food, cigarettes and alcohol. The sophisticated among them "
    "have learned to use the system for what it is worth and figure out that a trip through the welfare line is less trouble than a steady job. In a society that "
    "has mastered dodging responsibility, these homeless prefer a life of no responsibility at all.\n"
    "Source: Critical Thinking, Thoughtful Writing: A Rhetoric with Readings by Chaffee, J. U.S.A. (1999), pp. 374–375."
)

PASSAGE_2 = (
    "[Reading Passage II — Environmental Protection]\n"
    "1. The preservation of forest areas, wildlife and soil should be of a vital concern to all Ethiopians, since its neglect means a destruction of replaceable "
    "natural resources, a serious loss of revenue and then gradual desolation of the land until it becomes unfit for cultivation. According to a UNESCO survey in 1963, "
    "the consequences will be disastrous unless drastic measures are adopted. An example of this neglect is the present and past treatments of forests. In the good old days, "
    "the Ethiopian highlands were covered with virgin forests, which have since been largely used for construction and fuel. Along with the introduction of the eucalyptus tree, "
    "this has prevented the country from becoming a desert; however, the few remaining forest areas are not being preserved. The Ethiopian custom grants a man ownership of any "
    "land he clears off trees, and he is presented with forested tracts as a reward for his service to the government. The next twenty or thirty years will see the last remnants "
    "of virgin forests destroyed unless strong measures are taken.\n"
    "2. Soil degradation has been aggravated by poor agricultural practices. These include improper terracing, the cultivation of steep and easily eroded hillsides, failure to "
    "rotate crops (with the consequent loss of valuable nutrients), and the burning of manure instead of returning it to the soil as fertilizer. The destruction of trees and "
    "the lack of modern farming methods are not themselves as bad as the erosion of the soil which may follow them. Several generations may be able to live off the land, "
    "but gradually the soil is washed away to Egypt, making the land increasingly poor in quality and yielding less and less. Unfortunately, it is almost impossible to reclaim "
    "land that has deteriorated beyond a certain point. Trees cannot be planted to suck up water and hold the soil, because the earth is no longer deep enough to support long roots.\n"
    "Source: College Writing Skills: A Reference and Practice Book (2019), pp. 61–63."
)

LETTER_STIMULUS = (
    "[Formal Job Application Letter]\n"
    "(1) Dear sir,\n"
    "(2) I am a polytechnic graduate. I have a Diploma in Auto mechanics from Bahir Dar Polytechnic College. I have worked as a mechanic in Bahir Dar Textile Factory "
    "for two years. I am now applying for the post of mechanic advertised in your company. For your reference, I have attached my CV with this application.\n"
    "(3) I am looking forward to hearing from you.\n"
    "Sincerely, Dewit Hibru"
)


def get_unit_for_question(q_num):
    if 1 <= q_num <= 18:
        return "Unit 4: Reading Comprehension & Passage Analysis"
    elif 19 <= q_num <= 34:
        return "Unit 3: Sentence Comprehension & Vocabulary"
    elif 35 <= q_num <= 62:
        return "Unit 5: Grammar and Usage (Conditionals, Tenses, Modals & Connectors)"
    elif 63 <= q_num <= 80:
        return "Unit 1: Writing Skills (Letter Writing, Coherence, Mechanics & Spelling)"
    elif 81 <= q_num <= 100:
        return "Unit 2: Communicative Activities & Functional Dialogue"
    return "Unit 1: Writing Skills"


def get_section_for_question(q_num):
    if 1 <= q_num <= 9:
        return "I. Comprehension – Section One: Reading Passage I"
    elif 10 <= q_num <= 18:
        return "I. Comprehension – Section Two: Reading Passage II"
    elif 19 <= q_num <= 24:
        return "I. Comprehension – Section Three: Vocabulary – A. Completion"
    elif 25 <= q_num <= 30:
        return "I. Comprehension – Section Three: Vocabulary – B. Substitution"
    elif 31 <= q_num <= 32:
        return "I. Comprehension – Section Three: Vocabulary – C. Analogy"
    elif 33 <= q_num <= 34:
        return "I. Comprehension – Section Four: Sentence Comprehension"
    elif 35 <= q_num <= 62:
        return "II. Language Focus / Grammar"
    elif 63 <= q_num <= 64:
        return "III. Writing – Section One: Word Spelling"
    elif 65 <= q_num <= 67:
        return "III. Writing – Section Two: Punctuation and Capitalization"
    elif 68 <= q_num <= 70:
        return "III. Writing – Section Three: Jumbled Words"
    elif 71 <= q_num <= 74:
        return "III. Writing – Section Four: Paragraph Coherence"
    elif 75 <= q_num <= 77:
        return "III. Writing – Section Five: Types of Paragraph Writing"
    elif 78 <= q_num <= 80:
        return "III. Writing – Section Six: Letter Writing"
    elif 81 <= q_num <= 100:
        return "IV. Communicative Activities"
    return "General English"


def build_data():
    print(f"Reading docx from {DOCX_PATH}...")
    with zipfile.ZipFile(DOCX_PATH) as z:
        raw_xml = z.read("word/document.xml")

    tree = ET.fromstring(raw_xml)
    texts = [
        ("".join(n.text for n in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if n.text)).strip()
        for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p")
    ]
    texts = [t for t in texts if t]

    # Find question positions
    q_indices = []
    for i, t in enumerate(texts):
        m = re.match(r"^QUESTION\s+(\d+)\b", t, re.IGNORECASE)
        if m:
            q_indices.append((int(m.group(1)), i))

    q_indices.sort()

    app_idx = len(texts)
    for i, t in enumerate(texts):
        if "APPENDIX: MASTER QUICK-REFERENCE" in t:
            app_idx = i
            break

    # Parse Appendix Table for verification
    appendix_data = {}
    idx = app_idx + 1
    while idx < len(texts):
        if re.match(r"^\d+$", texts[idx]):
            q_num = int(texts[idx])
            if 1 <= q_num <= 100 and idx + 4 < len(texts):
                appendix_data[q_num] = {
                    "answer": texts[idx + 1].strip(),
                    "grade": texts[idx + 2].strip(),
                    "topic": texts[idx + 3].strip(),
                    "difficulty": texts[idx + 4].strip().lower(),
                }
                idx += 5
                continue
        idx += 1

    questions = []

    for pos, (q_num, start_idx) in enumerate(q_indices):
        end_idx = q_indices[pos + 1][1] if pos + 1 < len(q_indices) else app_idx
        block = texts[start_idx:end_idx]

        header_line = block[0]
        grade_match = re.search(r"Grade:\s*(.*)", header_line)
        grade_level = grade_match.group(1).strip() if grade_match else "Grade 11 – 12"

        topic = ""
        difficulty = "medium"
        raw_question = ""
        opt_a, opt_b, opt_c, opt_d = "", "", "", ""
        correct_answer = ""
        explanation = ""

        i = 1
        while i < len(block):
            line = block[i]
            if line.startswith("Chapter / Topic:"):
                topic = line.replace("Chapter / Topic:", "").strip()
            elif line.startswith("Difficulty:"):
                difficulty = line.replace("Difficulty:", "").strip().lower()
            elif re.match(r"^Q\d+\.", line):
                raw_question = re.sub(r"^Q\d+\.\s*", "", line).strip()
            elif re.match(r"^A\.\s*", line):
                opt_a = re.sub(r"^A\.\s*", "", line).strip()
            elif re.match(r"^B\.\s*", line):
                opt_b = re.sub(r"^B\.\s*", "", line).strip()
            elif re.match(r"^C\.\s*", line):
                opt_c = re.sub(r"^C\.\s*", "", line).strip()
            elif re.match(r"^D\.\s*", line):
                opt_d = re.sub(r"^D\.\s*", "", line).strip()
            elif line.startswith("Correct Answer:"):
                ans_match = re.search(r"Correct Answer:\s*([A-D])", line)
                if ans_match:
                    correct_answer = ans_match.group(1)
            elif line.startswith("Explanation:"):
                explanation = line.replace("Explanation:", "").strip()
                j = i + 1
                while j < len(block) and not any(
                    block[j].startswith(k)
                    for k in ["QUESTION", "I.", "II.", "III.", "IV.", "Directions:", "Instructions:"]
                ):
                    explanation += " " + block[j]
                    j += 1
                i = j - 1
            i += 1

        # Format question prompt according to section & stimuli
        if 1 <= q_num <= 9:
            prompt = f"{PASSAGE_1}\n\nQuestion {q_num}: {raw_question}"
        elif 10 <= q_num <= 18:
            prompt = f"{PASSAGE_2}\n\nQuestion {q_num}: {raw_question}"
        elif 78 <= q_num <= 80:
            if q_num == 78:
                clean_q = "The part indicated by number 3 is:"
            elif q_num == 79:
                clean_q = "In the application letter above, the part indicated by number 2 is:"
            else:
                clean_q = "In the application letter above, the part indicated by number 1 is:"
            prompt = f"{LETTER_STIMULUS}\n\nQuestion {q_num}: {clean_q}"
        elif 71 <= q_num <= 74:
            # Paragraph coherence with (a)-(d) or (A)-(D)
            formatted_q = re.sub(r"(\([a-dA-D]\))", r"\n\1", raw_question)
            prompt = f"Question {q_num}: {formatted_q}"
        elif 81 <= q_num <= 100:
            # Format dialogue turns cleanly
            formatted_dialogue = re.sub(r"([?.!_])([A-Z][a-zA-Z0-9\s/]{1,20}:)", r"\1\n\2", raw_question)
            prompt = f"Question {q_num}:\n{formatted_dialogue}"
        else:
            prompt = f"Question {q_num}: {raw_question}"

        # Clean options
        if q_num == 71 and opt_d.startswith("d a c b"):
            opt_d = "d a c b"
        if q_num == 73 and opt_b.startswith("a c b d"):
            opt_b = "a c b d"

        options = [opt_a, opt_b, opt_c, opt_d]

        # Verify against appendix
        if q_num in appendix_data:
            app_ans = appendix_data[q_num]["answer"]
            if correct_answer != app_ans:
                print(f"Warning: Q{q_num} mismatch! Block={correct_answer}, Appendix={app_ans}")

        questions.append({
            "questionNumber": q_num,
            "section": get_section_for_question(q_num),
            "topic": topic or (appendix_data.get(q_num, {}).get("topic", "")),
            "difficulty": difficulty,
            "gradeLevel": grade_level,
            "unit": get_unit_for_question(q_num),
            "prompt": prompt,
            "options": options,
            "correctAnswer": correct_answer,
            "explanation": explanation
        })

    print(f"Total parsed questions: {len(questions)}")

    # Verify integrity
    assert len(questions) == 100, f"Expected 100 questions, got {len(questions)}"
    for q in questions:
        n = q["questionNumber"]
        assert len(q["options"]) == 4, f"Q{n} options count != 4"
        assert all(len(opt) > 0 for opt in q["options"]), f"Q{n} has empty option"
        assert q["correctAnswer"] in ["A", "B", "C", "D"], f"Q{n} invalid answer {q['correctAnswer']}"
        assert len(q["explanation"]) > 0, f"Q{n} has empty explanation"

    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    print(f"Successfully wrote {len(questions)} items to {OUTPUT_JSON}")


if __name__ == "__main__":
    build_data()
