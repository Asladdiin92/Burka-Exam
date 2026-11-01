"""
Build English ESSLCE 2015 E.C. (Booklet 304) exam data JSON from the uploaded Word document.
Parses all 120 questions with prompts, options, correct answers, explanations, difficulty,
topic/grade mappings, and reading passages embedded into question prompts.

Line-based parser that handles the pipe-separated table format in the docx.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
import os
import re
from zipfile import ZipFile
import xml.etree.ElementTree as ET

DOCX_PATH = r'C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793113309455_56b31049.docx'


def extract_lines(docx_path):
    """Extract all text lines from the docx preserving order."""
    z = ZipFile(docx_path)
    tree = ET.parse(z.open('word/document.xml'))
    root = tree.getroot()
    ns_w = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    body = root.find(f'.//{{{ns_w}}}body')

    lines = []
    def get_text(elem):
        parts = []
        for t in elem.findall(f'.//{{{ns_w}}}t'):
            if t.text:
                parts.append(t.text)
        return ''.join(parts)

    for child in body:
        tag = child.tag.split('}')[-1]
        if tag == 'p':
            txt = get_text(child).strip()
            if txt:
                lines.append(txt)
        elif tag == 'tbl':
            for row in child.findall(f'.//{{{ns_w}}}tr'):
                cells = []
                for cell in row.findall(f'.//{{{ns_w}}}tc'):
                    ct = get_text(cell).strip()
                    if ct:
                        cells.append(ct)
                if cells:
                    lines.append(' | '.join(cells))
    return lines


def resolve_chapter(qnum):
    """Map question number to curriculum chapter (matches 2013/2014 pattern)."""
    if 1 <= qnum <= 18:
        return "Unit 1: Writing Skills (Letter Writing, Coherence, Mechanics & Spelling)"
    elif 19 <= qnum <= 56:
        return "Unit 5: Grammar and Usage (Conditionals, Tenses, Modals & Connectors)"
    elif 57 <= qnum <= 84:
        return "Unit 2: Communicative Activities & Functional Dialogue"
    elif 85 <= qnum <= 104:
        return "Unit 4: Reading Comprehension & Passage Analysis"
    elif 105 <= qnum <= 120:
        return "Unit 3: Sentence Comprehension & Vocabulary"
    return "Unit 5: Grammar and Usage (Conditionals, Tenses, Modals & Connectors)"


def parse_all(lines):
    """Parse all 120 questions from ordered lines."""
    items = []
    current_section = ""

    # Collect reading passage texts for embedding
    rc1_passage = []
    rc2_passage = []
    in_rc1 = False
    in_rc2 = False

    # First pass: identify section boundaries & reading passages
    # The reading comprehension passages are embedded as context in question prompts
    # or available as introductory text before the RC questions.
    # From the data, RC I starts at Q85, RC II at Q95.

    # Second pass: parse questions line by line
    i = 0
    while i < len(lines):
        line = lines[i]

        # Track section headers
        if line.startswith('SECTION:'):
            current_section = line.replace('SECTION:', '').strip()
            i += 1
            continue

        # Look for question header line: "QUESTION N | Grade/Topic: ... | Difficulty: ..."
        q_match = re.match(r'^QUESTION\s+(\d+)\s*\|\s*Grade/Topic:\s*(.*?)\s*\|\s*Difficulty:\s*(\w+)', line)
        if not q_match:
            # Also handle header split across table cells
            q_match2 = re.match(r'^QUESTION\s+(\d+)', line)
            if q_match2:
                # Check if grade/topic is in same line after |
                rest = line[q_match2.end():]
                grade_topic = ""
                difficulty = "medium"
                gt = re.search(r'Grade/Topic:\s*(.*?)(?:\||$)', rest)
                if gt:
                    grade_topic = gt.group(1).strip()
                df = re.search(r'Difficulty:\s*(\w+)', rest)
                if df:
                    difficulty = df.group(1).strip().lower()

                qnum = int(q_match2.group(1))
            else:
                i += 1
                continue
        else:
            qnum = int(q_match.group(1))
            grade_topic = q_match.group(2).strip()
            difficulty = q_match.group(3).strip().lower()

        # Read next lines for Prompt, Options, Correct Key
        i += 1
        prompt_text = ""
        options = []
        correct_answer = ""
        explanation = ""

        # Collect remaining lines until next QUESTION or SECTION
        block_lines = []
        while i < len(lines):
            nl = lines[i]
            if re.match(r'^QUESTION\s+\d+', nl) or nl.startswith('SECTION:'):
                break
            block_lines.append(nl)
            i += 1

        # Join block and parse
        block = '\n'.join(block_lines)

        # Extract Prompt
        prompt_m = re.search(r'Prompt:\s*\|?\s*(.*?)(?=Options:)', block, re.DOTALL)
        if prompt_m:
            prompt_text = prompt_m.group(1).strip()
            # Clean up leading/trailing pipes
            prompt_text = re.sub(r'^\|\s*', '', prompt_text)
            prompt_text = re.sub(r'\s*\|$', '', prompt_text)
            prompt_text = prompt_text.strip()

        # Extract Options
        opts_m = re.search(r'Options:\s*\|?\s*(.*?)(?=Correct Key:)', block, re.DOTALL)
        if opts_m:
            opts_raw = opts_m.group(1).strip()
            opts_raw = re.sub(r'^\|\s*', '', opts_raw)
            # Split by (A), (B), (C), (D) markers
            opt_parts = re.split(r'\(([A-D])\)\s*', opts_raw)
            for j in range(1, len(opt_parts), 2):
                if j + 1 < len(opt_parts):
                    opt_text = opt_parts[j + 1].strip()
                    # Clean trailing pipes
                    opt_text = re.sub(r'\s*\|.*$', '', opt_text)
                    opt_text = opt_text.strip()
                    if opt_text:
                        options.append(opt_text)

        # Extract Correct Key & Explanation
        key_m = re.search(r'Correct Key:\s*\|?\s*Option\s*\(([A-D])\)', block)
        if key_m:
            correct_answer = key_m.group(1)

        expl_m = re.search(r'Explanation:\s*(.*?)$', block, re.DOTALL)
        if expl_m:
            explanation = expl_m.group(1).strip()
            # Clean pipes
            explanation = re.sub(r'\s*\|.*$', '', explanation)
            explanation = explanation.strip()

        item = {
            "questionNumber": qnum,
            "grade": "Grade 12",
            "unit": resolve_chapter(qnum),
            "topic": grade_topic if grade_topic else current_section,
            "difficulty": difficulty,
            "prompt": prompt_text,
            "options": options,
            "correctAnswer": correct_answer,
            "explanation": explanation
        }

        # Extract grade from topic
        g = re.search(r'Grade\s*(\d+)', grade_topic)
        if g:
            item["grade"] = f"Grade {g.group(1)}"

        items.append(item)

    return items


def embed_passages(items):
    """Embed reading comprehension passage context into RC questions.
    
    Since the document is structured as an answer key (not the original exam paper),
    the passages aren't separately provided. The questions reference passage content
    in their prompts already. We'll add section context headers.
    """
    # Group RC I questions (Q85-Q94) - they reference "Adults Returning to Higher Education"
    rc1_context = (
        "[Reading Passage I — Adults Returning to Higher Education]\n"
        "This passage discusses adults who return to university education later in life. "
        "It covers their motivations, advantages (clearer purpose, stronger work ethic, better writing skills), "
        "challenges (social alienation, insecurity, unfamiliarity), and the friction between older and younger students "
        "in university settings. The passage references Professor Mike Rollo at the University of Florida and "
        "student Juliet Margolin's experience with dorm life."
    )

    # Group RC II questions (Q95-Q104) - they reference "Academic & Non-Academic Plagiarism"
    rc2_context = (
        "[Reading Passage II — Academic and Non-Academic Plagiarism]\n"
        "This passage examines cheating and plagiarism in educational and non-educational contexts. "
        "It discusses statistics (almost 80% of college students admit to cheating), motivations "
        "(getting better grades without effort), types (academic vs non-academic), similarities and differences, "
        "consequences (disciplinary actions, legal penalties, psychological trauma), and how plagiarism "
        "affects politicians and public figures."
    )

    for item in items:
        qn = item["questionNumber"]
        if 85 <= qn <= 94:
            item["prompt"] = f"{rc1_context}\n\nQuestion {qn}: {item['prompt']}"
        elif 95 <= qn <= 104:
            item["prompt"] = f"{rc2_context}\n\nQuestion {qn}: {item['prompt']}"

    return items


def main():
    print("=" * 60)
    print("Building English ESSLCE 2015 E.C. (Booklet 304) Exam Data")
    print("=" * 60)
    print()

    # Extract lines
    print("Extracting text from docx...")
    lines = extract_lines(DOCX_PATH)
    print(f"Extracted {len(lines)} lines")

    # Parse questions
    print("Parsing questions...")
    items = parse_all(lines)
    print(f"Parsed {len(items)} questions")

    # Embed reading passages
    print("\nEmbedding reading passage context...")
    items = embed_passages(items)

    # Sort by question number
    items.sort(key=lambda x: x["questionNumber"])

    # Validate
    print("\nValidation:")
    errors = []
    for item in items:
        qn = item["questionNumber"]
        if len(item["options"]) != 4:
            errors.append(f"Q{qn}: has {len(item['options'])} options (expected 4)")
        if item["correctAnswer"] not in ("A", "B", "C", "D"):
            errors.append(f"Q{qn}: invalid correctAnswer '{item['correctAnswer']}'")
        if not item["prompt"]:
            errors.append(f"Q{qn}: empty prompt")
        if not item["explanation"]:
            errors.append(f"Q{qn}: empty explanation")
        # Check for option prefixes
        for oi, opt in enumerate(item["options"]):
            if re.match(r'^[A-D]\.\s', opt):
                errors.append(f"Q{qn}: option {oi} has letter prefix: '{opt[:20]}'")

    if errors:
        print(f"  ERRORS ({len(errors)}):")
        for e in errors[:30]:
            print(f"    - {e}")
        if len(errors) > 30:
            print(f"    ... and {len(errors) - 30} more")
    else:
        print(f"  All {len(items)} questions validated successfully!")

    # Verify question number continuity
    q_nums = [it["questionNumber"] for it in items]
    expected = list(range(1, 121))
    missing = set(expected) - set(q_nums)
    dupes = [n for n in q_nums if q_nums.count(n) > 1]
    if missing:
        print(f"\n  MISSING question numbers: {sorted(missing)}")
    if dupes:
        print(f"\n  DUPLICATE question numbers: {sorted(set(dupes))}")

    # Print answer key
    print("\nAnswer Key:")
    keys = [f"{item['questionNumber']}:{item['correctAnswer']}" for item in items]
    for i in range(0, len(keys), 15):
        print(f"  {', '.join(keys[i:i+15])}")

    # Print section distribution
    print("\nChapter Distribution:")
    sec_counts = {}
    for item in items:
        unit = item["unit"]
        sec_counts[unit] = sec_counts.get(unit, 0) + 1
    for unit, count in sorted(sec_counts.items()):
        print(f"  {unit}: {count} questions")

    # Print difficulty distribution
    print("\nDifficulty Distribution:")
    diff_counts = {}
    for item in items:
        d = item["difficulty"]
        diff_counts[d] = diff_counts.get(d, 0) + 1
    for d, c in sorted(diff_counts.items()):
        print(f"  {d}: {c}")

    # Sample output
    print("\nSample Questions:")
    for item in items[:3]:
        print(f"  Q{item['questionNumber']}: \"{item['prompt'][:80]}...\"")
        print(f"    Options: {item['options']}")
        print(f"    Answer: {item['correctAnswer']}")
        print()

    # Save JSON
    out_dir = os.path.join("Backend", "src", "seeds", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "english_esslce_2015_booklet304.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

    file_size = os.path.getsize(out_path)
    print(f"\nOutput: {out_path} ({file_size:,} bytes)")
    print(f"Total questions: {len(items)}")
    print("DONE!")


if __name__ == "__main__":
    main()
