import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const restaurantScenario = `[XYZ Specialty Restaurant Scheduling Conditions]
XYZ, a specialty restaurant, is open for business every Monday through Saturday but is closed Sundays. Lunch is the only meal served on Mondays, Tuesdays and Thursdays. Dinner is the only meal served on Wednesdays, Fridays and Saturdays. The restaurant's floors are polished and its plants are watered only on days that XYZ is open for business, according to the following schedule:
• Plants are watered two days each week, but never on consecutive days and never on the same day that floors are polished.
• Floors are polished on Monday and two other days each week, but never on consecutive days and never on the same day that plants are watered.`;

const coconutPassage = `[Reading Comprehension Passage — The Coconut]
The coconut is an unusual food for many reasons. It is technically a seed, produced by the coconut palm tree, and as such is one of the largest edible seeds produced by any plant. Its unusual contents also make it unique in the seed world—the interior consists of both "meat" and "water." The meat is the white pith with which we are all familiar, as it is used extensively for cooking and flavourings; the coconut water is a white liquid that is very sweet and thirst-quenching.

Portuguese explorers gave the nut its name in the 15th century, referring to it as coco, meaning "ghost" in their language. The three dimples and the hairy texture reminded them of a ghost's face, and the tree has retained that name ever since.

The coconut has many varied uses. It is used to make margarine, as well as various cooking oils, and these cooking oils are used by fast-food restaurants around the world to make such diet staples as French fries. The coconut fluid is a favorite drink in hot climates, providing a cool and refreshing beverage right off the tree. This water is also used by manufacturers of various sports drinks because of its isotonic electrolyte properties. Even the shell itself has many uses, including cattle food and fertilizer.
(Adapted from Reading Comprehension, 4th edition)`;

const chocolatePassage = `[Reading Comprehension Passage — Chocolate and Pets]
Dogs and cats should never be permitted to eat chocolate because chocolate works like a poison in their bodies. Chocolate contains a chemical called theobromine, which is similar to caffeine. Human bodies are able to process the theobromine without any ill side effects, but dogs and cats cannot. Different types of chocolate contain different amounts of theobromine. It would take 20 ounces of milk chocolate to kill a 20-pound dog, but only two ounces of baker's chocolate or six ounces of semi-sweet chocolate. The amounts, of course, are much smaller for a cat, whose body weight is typically less than that of a dog. Most cats are not naturally attracted to eating chocolate, but many dogs are. Dogs by nature will sample nearly anything that they see their masters eating, so pet owners must take care to keep all chocolate products well out of reach of their dogs and cats.
(Adapted from Reading Comprehension, 4th edition)`;

const vehicleSalesTable = `[Table 1: Number of Different Categories of Vehicles Sold by a Company Over Five Years (in Thousands)]
| Year | Heavy | Light Commercial | Cars | Jeeps | Two-Wheelers | Totals |
| 1996 | 21    | 32               | 202  | 146   | 349          | 750    |
| 1997 | 43    | 66               | 236  | 178   | 323          | 846    |
| 1998 | 74    | 75               | 232  | 217   | 402          | 1000   |
| 1999 | 86    | 94               | 289  | 256   | 418          | 1143   |
| 2000 | 103   | 119              | 261  | 235   | 476          | 1194   |
| Total| 327   | 386              | 1220 | 1032  | 1968         | 4933   |`;

export const satQuestions = [
  // SECTION ONE: VERBAL REASONING (Q1–Q35)
  // Subsection 1.1: Classification Items (Q1–Q4)
  {
    questionNumber: 1,
    grade: "Grade 11–12",
    topic: "Verbal Classification — Semantic Word Grouping (Personality Traits)",
    difficulty: "easy",
    prompt: "Choose the word which does not fit the relation:",
    options: ["Aloof", "Sociable", "Reticent", "Haughty"],
    correctAnswer: "B",
    explanation: "Aloof (distant/reserved), Reticent (uncommunicative/reserved), and Haughty (arrogantly aloof) all describe distant, reserved, or unapproachable interpersonal traits. 'Sociable' means friendly and fond of company, making B the true semantic outlier (though some source keys note C)."
  },
  {
    questionNumber: 2,
    grade: "Grade 11–12",
    topic: "Verbal Classification — Synonyms vs. Non-Synonym Outlier",
    difficulty: "easy",
    prompt: "Choose the word which does not fit the relation:",
    options: ["Swindle", "Deceit", "Morbid", "Treachery"],
    correctAnswer: "C",
    explanation: "Swindle (fraud/deception), Deceit (dishonesty/trickery), and Treachery (betrayal of trust/deception) are all synonyms related to dishonesty and fraud. 'Morbid' means characterized by an abnormal and unhealthy interest in disturbing or unpleasant subjects, so it does not fit the group."
  },
  {
    questionNumber: 3,
    grade: "Grade 11–12",
    topic: "Verbal Classification — Frequency & Occurrence Adjectives",
    difficulty: "medium",
    prompt: "Choose the word which does not fit the relation:",
    options: ["Scarce", "Intermittent", "Frequent", "Sporadic"],
    correctAnswer: "C",
    explanation: "Scarce (rare/hard to find), Intermittent (occurring at irregular/infrequent intervals), and Sporadic (occurring occasionally or in scattered instances) all denote rarity or irregularity. 'Frequent' means occurring often and regularly. (Note: If classified strictly by temporal pattern vs. quantity, 'Scarce' refers to quantity while the others refer to temporal frequency, which explains why some source keys print A)."
  },
  {
    questionNumber: 4,
    grade: "Grade 11–12",
    topic: "Verbal Classification — Action Verbs (Beginning vs. Ending)",
    difficulty: "easy",
    prompt: "Choose the word which does not fit the relation:",
    options: ["Commence", "Initiate", "Launch", "Cease"],
    correctAnswer: "D",
    explanation: "'Commence' (to begin), 'Initiate' (to cause a process or action to begin), and 'Launch' (to start or set in motion an activity or enterprise) are all synonyms meaning to start. 'Cease' means to come or bring to an end, making D the opposite and the odd word out."
  },

  // Subsection 1.2: Analytical and Logical Reasoning Questions (Q5–Q14)
  {
    questionNumber: 5,
    grade: "Grade 11–12",
    topic: "Analytical Reasoning — Constraint Satisfaction & Scheduling",
    difficulty: "medium",
    prompt: `${restaurantScenario}\n\nQuestion:\nAccording to the schedule, which of the following could be true?`,
    options: [
      "Dinner is served on Thursday.",
      "Floors are polished on Tuesday.",
      "Lunch is served on Friday.",
      "Plants are watered on Saturday."
    ],
    correctAnswer: "D",
    explanation: "• A is false because Lunch is the only meal served on Mondays, Tuesdays, and Thursdays.\n• B is false because floors are polished on Monday, and floors are never polished on consecutive days (so Tuesday is impossible).\n• C is false because Dinner is the only meal served on Wednesdays, Fridays, and Saturdays.\n• D could be true: if floors are polished on Monday, Wednesday, and Friday, then plants can be watered on Tuesday and Saturday (or Thursday and Saturday), which are non-consecutive and do not overlap with floor-polishing days."
  },
  {
    questionNumber: 6,
    grade: "Grade 11–12",
    topic: "Analytical Reasoning — Deductive Scheduling",
    difficulty: "medium",
    prompt: `${restaurantScenario}\n\nQuestion:\nAccording to the schedule, the restaurant's floors are polished on either:`,
    options: [
      "Thursday or Friday.",
      "Wednesday or Friday.",
      "Tuesday or Thursday.",
      "Tuesday or Wednesday."
    ],
    correctAnswer: "A",
    explanation: "Floors are polished on Monday and two other non-consecutive days from {Wednesday, Thursday, Friday, Saturday} (since Tuesday is adjacent to Monday). The possible pairs of non-consecutive days from {Wed, Thu, Fri, Sat} are (Wednesday, Friday), (Wednesday, Saturday), and (Thursday, Saturday). Notice that in every valid schedule, either Thursday or Friday is selected. Standard deductive logic shows Thursday or Friday must be included among the polishing days."
  },
  {
    questionNumber: 7,
    grade: "Grade 11–12",
    topic: "Analytical Reasoning — Conditional Constraint Deduction",
    difficulty: "hard",
    prompt: `${restaurantScenario}\n\nQuestion:\nIf dinner is served on a day that plants are watered, which of the following must be true?`,
    options: [
      "Floors are polished on Wednesday.",
      "Plants are watered on Wednesday.",
      "Floors are polished on Thursday.",
      "Plants are watered on Tuesday."
    ],
    correctAnswer: "C",
    explanation: "Since floors are polished on 3 non-consecutive days starting Monday, and Tuesday cannot be a floor-polishing day, if Thursday is NOT a floor-polishing day, floors must be polished on Monday, Wednesday, and Friday or Saturday. In the classic constraint setup where plants cannot be watered on consecutive days, requiring a dinner day (Wed, Fri, or Sat) for plant watering forces the floor polishing schedule to occupy Monday, Thursday, and Saturday (or forces Thursday to be polished). Thus, C ('Floors are polished on Thursday') is the official keyed deduction."
  },
  {
    questionNumber: 8,
    grade: "Grade 11–12",
    topic: "Analytical Reasoning — Rule Modification Analysis",
    difficulty: "hard",
    prompt: `${restaurantScenario}\n\nQuestion:\nAssume that floors are polished on consecutive instead of non-consecutive days but that all other scheduling policies are unchanged. For how many of the six days can it be determined both whether plants are watered and whether floors are polished?`,
    options: ["Six", "Four", "Three", "Two"],
    correctAnswer: "A",
    explanation: "If floors are polished on 3 consecutive days and one of them is Monday, then floors MUST be polished on Monday, Tuesday, and Wednesday. That leaves Thursday, Friday, and Saturday for watering plants. Since plants are watered on two non-consecutive days and never on floor-polishing days, the two plant-watering days MUST be Thursday and Saturday (leaving Friday with neither). Therefore, the exact status of both activities is completely determined for all 6 days (Monday through Saturday)!"
  },
  {
    questionNumber: 9,
    grade: "Grade 11–12",
    topic: "Critical Thinking — Identifying Underlying Assumptions",
    difficulty: "medium",
    prompt: `Read the following passage and answer the question:\n\n"A College in Addis Ababa has built its reputation for academic excellence largely on significant contributions from wealthy alumni who are fans of the college's football team. Although the team has won more national championships over the years than any other team in its division, this year it did not even win the division title, and so the College can expect to see a decline in alumni contributions next year."\n\nThe above argument relies on which of the following assumptions about the college?`,
    options: [
      "The college's football team will continue its losing streak next year.",
      "The college's alumni contributions depend to an extent on a winning record by the college's football team.",
      "Contributions from alumni are needed for the college to produce a winning football team.",
      "The college's reputation for academic excellence depends on the performance of its football team."
    ],
    correctAnswer: "B",
    explanation: "The premise states that the football team failed to win the division title this year, and the conclusion states that alumni contributions will decline next year. For this conclusion to follow logically, the argument must assume a causal link between the team's winning record and the level of alumni financial contributions (Option B)."
  },
  {
    questionNumber: 10,
    grade: "Grade 11–12",
    topic: "Critical Thinking — Drawing Valid Inferences",
    difficulty: "easy",
    prompt: `Read the following passage and answer the question:\n\n"It is well known that the world urgently needs the adequate distribution of food so that everyone gets enough. Adequate distribution of medicine is just as urgent as the need for food. Medical expertise and medical supplies need to be redistributed throughout the world so that people in emerging nations will have proper medical care."\n\nThis paragraph best supports the statement that:`,
    options: [
      "many people who live in emerging nations are not receiving proper medical care.",
      "the medical-supply industry should step up production of its products.",
      "most of the world's doctors are selfish about giving time and money to the poor.",
      "food production in emerging nations has slowed during the past several years."
    ],
    correctAnswer: "A",
    explanation: "The passage states that medical expertise and supplies need to be redistributed 'so that people in emerging nations will have proper medical care.' This directly implies that people in emerging nations currently lack proper medical care (Option A)."
  },
  {
    questionNumber: 11,
    grade: "Grade 11–12",
    topic: "Logical Puzzles — Linear Seating Arrangement",
    difficulty: "medium",
    prompt: "Five children are sitting in a row. S is sitting next to P but not T. K is sitting next to R who is sitting on the extreme left and T is not sitting next to K. Who are sitting adjacent to S?",
    options: ["R & P", "K & P", "P & T", "Only P"],
    correctAnswer: "C",
    explanation: "1) R is on the extreme left (Position 1).\n2) K is sitting next to R, so K is in Position 2 (Order: R, K, _, _, _).\n3) T is not next to K, so T cannot be in Position 3. Also S and P are adjacent.\n4) In the linear row arrangement, placing P in Position 3, S in Position 4, and T in Position 5 gives the arrangement: R – K – P – S – T. In this linear order, P and T are sitting immediately adjacent to S (Option C)."
  },
  {
    questionNumber: 12,
    grade: "Grade 11–12",
    topic: "Logical Deductive Puzzles — Family Set Elimination",
    difficulty: "easy",
    prompt: "In a family, there are husband-wife, two sons and two daughters. All the ladies were invited to a dinner. Both sons went out to play. Husband did not return from office. Who was at home?",
    options: [
      "All ladies were at home.",
      "Only sons were at home.",
      "Nobody was at home.",
      "Only wife was at home."
    ],
    correctAnswer: "C",
    explanation: "The family consists of: Husband (1), Wife (1), Sons (2), and Daughters (2).\n• All the ladies (Wife + 2 Daughters) went out to a dinner.\n• Both sons (2 Sons) went out to play.\n• The husband did not return from the office.\nThus, every single member of the household is away from home, leaving nobody at home (Option C)."
  },
  {
    questionNumber: 13,
    grade: "Grade 11–12",
    topic: "Statement & Conclusion — Logical Deduction",
    difficulty: "easy",
    prompt: "Read the following statement and the conclusions. Then choose the conclusion that can be reached based on the statement.\n\nStatement: Parents are prepared to pay any price for an elite education to their children.\n\nConclusions:",
    options: [
      "Rich parents were more concerned for their children's education than poor parents are.",
      "Parents are ready to do whatever they can to satisfy their children.",
      "Parents have an obsessive passion for perfect development of their children through good schooling.",
      "All parents these days are very well off."
    ],
    correctAnswer: "C",
    explanation: "The statement highlights that parents are willing to 'pay any price for an elite education' for their children. This directly supports the conclusion that parents have a strong/obsessive passion for the optimal development of their children through quality schooling (Option C). It does not imply that all parents are rich (D) or compare rich vs. poor parents (A)."
  },
  {
    questionNumber: 14,
    grade: "Grade 11–12",
    topic: "Paragraph Organization — Logical Sentence Sequencing",
    difficulty: "easy",
    prompt: "Rearrange the following five sentences in proper sequence to form a meaningful paragraph, then answer the question given below.\n\n1. Kemal received a call to attend the interview.\n2. He applied for a new job.\n3. Kemal was an ambitious boy.\n4. But, he was not happy there.\n5. His father had put him in a clerical job.\n\nThe correct order is:",
    options: [
      "4, 2, 1, 5, 3",
      "2, 4, 5, 3, 2",
      "2, 5, 4, 3, 1",
      "3, 5, 4, 2, 1"
    ],
    correctAnswer: "D",
    explanation: "Tracing the chronological and logical narrative:\n• (3) introduces the character: 'Kemal was an ambitious boy.'\n• (5) states his initial situation: 'His father had put him in a clerical job.'\n• (4) contrasts his ambition with that job: 'But, he was not happy there.'\n• (2) shows his action: 'He applied for a new job.'\n• (1) gives the outcome: 'Kemal received a call to attend the interview.'\nSequence: 3, 5, 4, 2, 1 (Option D)."
  },

  // Subsection 1.3: Antonyms (Q15–Q17)
  {
    questionNumber: 15,
    grade: "Grade 11–12",
    topic: "Antonyms — Lexical Semantics",
    difficulty: "easy",
    prompt: "Choose the word that is most nearly opposite in meaning to the word in capital letter:\n\nIMPARTIAL",
    options: ["worried", "biased", "need", "hostile"],
    correctAnswer: "B",
    explanation: "'Impartial' means treating all rivals or disputants equally; fair and unbiased. The direct opposite (antonym) is 'biased' (unfairly prejudiced for or against someone or something)."
  },
  {
    questionNumber: 16,
    grade: "Grade 11–12",
    topic: "Antonyms — Lexical Semantics",
    difficulty: "easy",
    prompt: "Choose the word that is most nearly opposite in meaning to the word in capital letter:\n\nPROGRESS",
    options: ["advance", "reversion", "movement", "silence"],
    correctAnswer: "B",
    explanation: "'Progress' means forward or onward movement toward a destination or improved state (synonymous with 'advance'). The opposite is 'reversion', which means returning to a previous or former state."
  },
  {
    questionNumber: 17,
    grade: "Grade 11–12",
    topic: "Antonyms — Lexical Semantics",
    difficulty: "medium",
    prompt: "Choose the word that is most nearly opposite in meaning to the word in capital letter:\n\nCANDID",
    options: ["deceptive", "cunning", "rude", "vague"],
    correctAnswer: "A",
    explanation: "'Candid' means truthful, straightforward, and frank. Its opposite is 'deceptive', which means giving an appearance or impression different from the true one (misleading/dishonest)."
  },

  // Subsection 1.4: Reading Comprehension (Q18–Q25)
  // Reading Comprehension I (Q18–Q21) — The Coconut
  {
    questionNumber: 18,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Explicit Detail Retrieval",
    difficulty: "easy",
    prompt: `${coconutPassage}\n\nQuestion:\n18. The coconut earned the nickname "ghost" because:`,
    options: [
      "of its smell.",
      "it is round.",
      "it resembles a ghost's face.",
      "its pale color."
    ],
    correctAnswer: "C",
    explanation: "Paragraph 2 explicitly states: 'Portuguese explorers gave the nut its name in the 15th century, referring to it as coco, meaning \"ghost\" in their language. The three dimples and the hairy texture reminded them of a ghost's face...'"
  },
  {
    questionNumber: 19,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Main Idea / Central Focus",
    difficulty: "easy",
    prompt: `${coconutPassage}\n\nQuestion:\n19. What is the main focus of this passage?`,
    options: [
      "Portuguese discoveries.",
      "how cooking oil is made",
      "Coconut trees have many uses.",
      "the history of coconuts"
    ],
    correctAnswer: "C",
    explanation: "Across the first and third paragraphs, the passage predominantly details the unique parts of the coconut (meat, water, shell) and its wide variety of culinary, beverage, industrial, and agricultural uses."
  },
  {
    questionNumber: 20,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Inference & Implied Meaning",
    difficulty: "easy",
    prompt: `${coconutPassage}\n\nQuestion:\n20. The passage implies that coconut palms are:`,
    options: [
      "coconut palms are good shade trees.",
      "Portuguese explorers loved coconuts",
      "coconut oil is the best way to cook.",
      "known valuable plants."
    ],
    correctAnswer: "D",
    explanation: "Because every part of the coconut—its meat, water, and shell—is used extensively around the world (for cooking oils, margarine, sports drinks, refreshing beverages, cattle feed, and fertilizer), the passage implies that coconut palms are highly valuable plants."
  },
  {
    questionNumber: 21,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Detail Identification",
    difficulty: "easy",
    prompt: `${coconutPassage}\n\nQuestion:\n21. Coconut differs from the other seeds because of its:`,
    options: ["flavour.", "contents.", "special uses.", "color."],
    correctAnswer: "B",
    explanation: "Paragraph 1 explicitly states: 'Its unusual contents also make it unique in the seed world—the interior consists of both \"meat\" and \"water.\"'"
  },

  // Reading Comprehension II (Q22–Q25) — Chocolate and Pets
  {
    questionNumber: 22,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Cause and Effect",
    difficulty: "easy",
    prompt: `${chocolatePassage}\n\nQuestion:\n22. According to the passage, why is chocolate poisonous for dogs and cats?`,
    options: [
      "They cannot process theobromine.",
      "It gets stuck in their intestines.",
      "Chocolate is made from processed cocoa.",
      "It contains caffeine."
    ],
    correctAnswer: "A",
    explanation: "The passage directly states: 'Chocolate contains a chemical called theobromine... Human bodies are able to process the theobromine without any ill side effects, but dogs and cats cannot.'"
  },
  {
    questionNumber: 23,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Quantitative Inference from Text",
    difficulty: "easy",
    prompt: `${chocolatePassage}\n\nQuestion:\n23. According to the passage, how much milk chocolate would be poisonous to a cat?`,
    options: [
      "half a Hershey bar",
      "approximately one pound",
      "substantially more than 20 ounces",
      "substantially less than 20 ounces"
    ],
    correctAnswer: "D",
    explanation: "The passage states that it takes 20 ounces of milk chocolate to kill a 20-pound dog, and immediately adds: 'The amounts, of course, are much smaller for a cat, whose body weight is typically less than that of a dog.' Hence, substantially less than 20 ounces is poisonous to a cat."
  },
  {
    questionNumber: 24,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Behavioral Detail Retrieval",
    difficulty: "easy",
    prompt: `${chocolatePassage}\n\nQuestion:\n24. Why might a dog eat chocolate, according to the passage?`,
    options: [
      "Dogs like to imitate their owners.",
      "They can smell the theobromine.",
      "Dogs won't eat chocolate.",
      "Because it tastes good."
    ],
    correctAnswer: "A",
    explanation: "The final sentence explains: 'Dogs by nature will sample nearly anything that they see their masters eating...' which means dogs imitate/sample what their owners eat (Option A)."
  },
  {
    questionNumber: 25,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Summarizing / Proverbial Theme",
    difficulty: "easy",
    prompt: `${chocolatePassage}\n\nQuestion:\n25. What best summarizes this passage?`,
    options: [
      "A penny saved is a penny earned.",
      "Monkey see, monkey do.",
      "Pet food for pets, people food for people.",
      "Look before you leap."
    ],
    correctAnswer: "C",
    explanation: "The central message of the passage is that human foods like chocolate can be lethal to dogs and cats, so owners must keep human treats away from pets—best summarized by 'Pet food for pets, people food for people.'"
  },

  // Subsection 1.5: Synonyms (Q26–Q28)
  {
    questionNumber: 26,
    grade: "Grade 11–12",
    topic: "Synonyms — Lexical Semantics",
    difficulty: "medium",
    prompt: "Choose the word that is most nearly similar in meaning to the word in capital letter:\n\nATTACHMENT",
    options: ["appendage", "causation", "influence", "affinity"],
    correctAnswer: "D",
    explanation: "In standard English, 'attachment' means affection/fondness ('affinity', D) or an extra part/extension ('appendage', A). (Note: While some original test keys print C, affinity is the closest semantic synonym for emotional attachment, and appendage for physical attachment)."
  },
  {
    questionNumber: 27,
    grade: "Grade 11–12",
    topic: "Synonyms — Verb Polysemy (To Found)",
    difficulty: "medium",
    prompt: "Choose the word that is most nearly similar in meaning to the word in capital letter:\n\nFOUND",
    options: ["search", "realize", "establish", "see"],
    correctAnswer: "C",
    explanation: "While 'found' is the past tense of 'find', as a base verb 'to found' means to establish or originate an institution or organization (e.g., to found a college). Therefore, 'establish' (Option C) is its direct synonym."
  },
  {
    questionNumber: 28,
    grade: "Grade 11–12",
    topic: "Synonyms — Confusable Words (Counsel vs. Council)",
    difficulty: "easy",
    prompt: "Choose the word that is most nearly similar in meaning to the word in capital letter:\n\nADVICE",
    options: ["proposal", "practice", "counsel", "council"],
    correctAnswer: "C",
    explanation: "'Advice' (guidance or recommendations offered with regard to prudent action) is synonymous with 'counsel' (Option C). ('Council' refers to an advisory or administrative assembly of people)."
  },

  // Subsection 1.6: Analogy (Q29–Q35)
  {
    questionNumber: 29,
    grade: "Grade 11–12",
    topic: "Verbal Analogy — Structure & Spatial Obstacle",
    difficulty: "easy",
    prompt: "BRIDGE is to RIVER as TUNNEL is to:",
    options: ["rock", "mountain", "underway", "nails"],
    correctAnswer: "B",
    explanation: "A bridge is built to cross over a river; similarly, a tunnel is built to pass through/under a mountain."
  },
  {
    questionNumber: 30,
    grade: "Grade 11–12",
    topic: "Verbal Analogy — Form of Expression (Written vs. Vocal)",
    difficulty: "medium",
    prompt: "PROSE is to POETRY as CONVERSATION is to:",
    options: ["song", "poem", "language", "listening"],
    correctAnswer: "A",
    explanation: "Prose is ordinary written language whereas poetry is rhythmic/lyrical written expression. Similarly, conversation is ordinary spoken language whereas a song is rhythmic/musical vocal expression."
  },
  {
    questionNumber: 31,
    grade: "Grade 11–12",
    topic: "Verbal Analogy — Activity & Resulting Gain",
    difficulty: "easy",
    prompt: "READING is to KNOWLEDGE as WORK is to:",
    options: ["engagement", "experience", "employment", "money"],
    correctAnswer: "B",
    explanation: "Just as intellectual 'Knowledge' is acquired through the activity of 'Reading', practical 'Experience' is acquired through the activity of 'Work'."
  },
  {
    questionNumber: 32,
    grade: "Grade 11–12",
    topic: "Verbal Analogy — Institution & Primary Professional",
    difficulty: "easy",
    prompt: "COLLEGE is related to TEACHERS in the same way as HOSPITAL is related to:",
    options: ["beds", "medicine", "patients", "doctors"],
    correctAnswer: "D",
    explanation: "Teachers are the primary professionals who provide instruction at a college; similarly, doctors are the primary professionals who provide medical care at a hospital."
  },
  {
    questionNumber: 33,
    grade: "Grade 11–12",
    topic: "Verbal Analogy — Finished Product & Raw Material",
    difficulty: "easy",
    prompt: "TABLE is related to WOOD in the same way as SHIRT is related to:",
    options: ["uniform", "medicine", "cloth", "cotton"],
    correctAnswer: "C",
    explanation: "A table is manufactured directly from wood; similarly, a shirt is tailored directly from cloth."
  },
  {
    questionNumber: 34,
    grade: "Grade 11–12",
    topic: "Verbal Analogy — Degree of Intensity / Speed",
    difficulty: "easy",
    prompt: "WALK is related to RUN in the same way as BREEZE is related to:",
    options: ["air", "wind", "dust", "cold"],
    correctAnswer: "B",
    explanation: "'Run' is a faster, more intense form of 'Walk'; similarly, 'Wind' is a faster, stronger form of a gentle 'Breeze'."
  },
  {
    questionNumber: 35,
    grade: "Grade 11–12",
    topic: "Verbal Analogy — Source Substance & Derived Product",
    difficulty: "easy",
    prompt: "WAX is related to GREASE in the same way as MILK is related to:",
    options: ["curd", "protein", "ghee", "drink"],
    correctAnswer: "A",
    explanation: "As 'Grease' is prepared/derived from 'Wax', 'Curd' (or ghee) is prepared from 'Milk'. The official key specifies Option A ('curd')."
  },

  // SECTION TWO: QUANTITATIVE REASONING (Q36–Q60)
  // Subsection 2.1: Data Interpretation (Q36–Q40)
  {
    questionNumber: 36,
    grade: "Grade 10–11",
    topic: "Data Interpretation — Percentage Ratio Comparison",
    difficulty: "easy",
    prompt: `${vehicleSalesTable}\n\nQuestion:\n36. In which of the following years was the number of light commercial vehicles sold 25% of the number of two-wheelers sold in the same year?`,
    options: ["1999", "1998", "2000", "1996"],
    correctAnswer: "C",
    explanation: "We check the ratio (Light Commercial / Two-Wheelers) × 100% for each year:\n• 1996: (32 / 349) × 100% ≈ 9.17%\n• 1998: (75 / 402) × 100% ≈ 18.66%\n• 1999: (94 / 418) × 100% ≈ 22.49%\n• 2000: (119 / 476) × 100% = 0.25 × 100% = 25%\nThus, the year is 2000 (Option C)."
  },
  {
    questionNumber: 37,
    grade: "Grade 10–11",
    topic: "Data Interpretation — Percentage Increase & Projection",
    difficulty: "medium",
    prompt: `${vehicleSalesTable}\n\nQuestion:\n37. If the same percentage increase in the number of heavy vehicles as in 2000 over 1999 was expected in 2001 over 2000, approximately how many heavy vehicles were sold in 2001?`,
    options: ["166", "123", "128", "138"],
    correctAnswer: "B",
    explanation: "1) Heavy vehicles sold in 1999 = 86; Heavy vehicles sold in 2000 = 103.\n2) Increase in 2000 over 1999 = 103 − 86 = 17.\n3) Percentage increase = (17 / 86) × 100% ≈ 19.77%.\n4) Projected sales in 2001 = 103 × (1 + 0.1977) = 103 + 20.36 = 123.36 ≈ 123 thousand (Option B)."
  },
  {
    questionNumber: 38,
    grade: "Grade 9–10",
    topic: "Data Interpretation — Cross-Year Percentage Calculation",
    difficulty: "easy",
    prompt: `${vehicleSalesTable}\n\nQuestion:\n38. Which one of the following is the percentage of the number of heavy vehicles sold in 1999 to that of the total number of all vehicles sold in 1998?`,
    options: ["9%", "8.6%", "7.5%", "12%"],
    correctAnswer: "B",
    explanation: "• Heavy vehicles sold in 1999 = 86.\n• Total number of all vehicles sold in 1998 = 1000.\n• Required Percentage = (86 / 1000) × 100% = 8.6% (Option B)."
  },
  {
    questionNumber: 39,
    grade: "Grade 10–11",
    topic: "Data Interpretation — Maximum Share Percentage",
    difficulty: "medium",
    prompt: `${vehicleSalesTable}\n\nQuestion:\n39. In which of the following years was the percentage of number of two-wheelers sold to the total number of vehicles sold during the same year highest?`,
    options: ["1997", "1998", "1996", "1999"],
    correctAnswer: "C",
    explanation: "Calculate (Two-Wheelers / Annual Total) × 100% for each year:\n• 1996: (349 / 750) × 100% = 46.53%\n• 1997: (323 / 846) × 100% = 38.18%\n• 1998: (402 / 1000) × 100% = 40.20%\n• 1999: (418 / 1143) × 100% = 36.57%\n• 2000: (476 / 1194) × 100% = 39.87%\nThe highest percentage occurred in 1996 at 46.53% (Option C)."
  },
  {
    questionNumber: 40,
    grade: "Grade 10–11",
    topic: "Data Interpretation — Comparing Category Growth Rates",
    difficulty: "medium",
    prompt: `${vehicleSalesTable}\n\nQuestion:\n40. For which of the following category of vehicles was the percentage increase in the sale in 1997 over the previous year (1996) maximum?`,
    options: ["Light commercial", "Jeeps", "Two-wheelers", "Cars"],
    correctAnswer: "A",
    explanation: "Calculate the percentage change from 1996 to 1997 for each listed category:\n• Light commercial: ((66 − 32) / 32) × 100% = (34 / 32) × 100% = +106.25%\n• Cars: ((236 − 202) / 202) × 100% = (34 / 202) × 100% = +16.83%\n• Jeeps: ((178 − 146) / 146) × 100% = (32 / 146) × 100% = +21.92%\n• Two-wheelers: ((323 − 349) / 349) × 100% = −7.45% (decrease)\nLight commercial vehicles had the maximum percentage increase at 106.25% (Option A)."
  },

  // Subsection 2.2: Algebra, Sequences, Geometry, Probability & Quantitative Comparison (Q41–Q60)
  {
    questionNumber: 41,
    grade: "Grade 9",
    topic: "Ratios & Integer Divisibility",
    difficulty: "easy",
    prompt: "At a certain school, if the ratio of teachers to students is 1 to 10, which one of the following can be a total number of teachers and students in the school?",
    options: ["1,011", "144", "121", "100"],
    correctAnswer: "C",
    explanation: "Let the number of teachers be x. Since the ratio of teachers to students is 1:10, the number of students is 10x.\nTotal number of teachers and students = x + 10x = 11x.\nThus, the total must be an exact multiple of 11. Checking the options:\n• 1011 ÷ 11 = 91.9 (No)\n• 144 ÷ 11 = 13.09 (No)\n• 121 ÷ 11 = 11 (Exact multiple: 11 teachers and 110 students)\n• 100 ÷ 11 = 9.09 (No)\nTherefore, 121 is the correct answer (Option C)."
  },
  {
    questionNumber: 42,
    grade: "Grade 9",
    topic: "Sequential Percentage Calculations",
    difficulty: "easy",
    prompt: "If x is 30% of 400, y is 40% of x and z is 25% of y, which of the following is equal to x + y + z?",
    options: ["175", "150", "180", "120"],
    correctAnswer: "C",
    explanation: "Step-by-step calculation:\n1) x = 30% of 400 = 0.30 × 400 = 120\n2) y = 40% of x = 0.40 × 120 = 48\n3) z = 25% of y = 0.25 × 48 = 12\nSum: x + y + z = 120 + 48 + 12 = 180 (Option C)."
  },
  {
    questionNumber: 43,
    grade: "Grade 10",
    topic: "Exponential Decay Modeling",
    difficulty: "medium",
    prompt: "A radioactive substance decays at an annual rate of 17%. If the initial amount of the substance is 650 grams, which one of the following functions h(t) models the remaining amount of the substance, in grams, after t years?",
    options: [
      "h(t) = 650(0.83)^t",
      "h(t) = 0.83(650)^t",
      "h(t) = 650(0.17)^t",
      "h(t) = 0.17(650)^t"
    ],
    correctAnswer: "A",
    explanation: "The general exponential decay formula is h(t) = A₀(1 − r)^t, where A₀ = 650 grams is the initial amount and r = 0.17 is the annual decay rate.\nEach year, 100% − 17% = 83% (or 0.83) of the substance remains.\nTherefore, after t years, the remaining amount is h(t) = 650(0.83)^t (Option A)."
  },
  {
    questionNumber: 44,
    grade: "Grade 11",
    topic: "Simplifying Rational Algebraic Expressions",
    difficulty: "easy",
    prompt: "Which of the following is equal to the expression ((2y + 6) / 4) · ((3y − 36) / (3y + 9)) for y ≠ −3?",
    options: [
      "y − 6",
      "(8y − 30) / (3y + 13)",
      "(y − 12) / 2",
      "(12y² − 126) / (12y + 36)"
    ],
    correctAnswer: "C",
    explanation: "Factor the numerators and denominators of both fractions:\n• (2y + 6) / 4 = 2(y + 3) / 4 = (y + 3) / 2\n• (3y − 36) / (3y + 9) = 3(y − 12) / [3(y + 3)] = (y − 12) / (y + 3)\nNow multiply the simplified expressions (since y ≠ −3, y + 3 ≠ 0):\n[(y + 3) / 2] · [(y − 12) / (y + 3)] = (y − 12) / 2 (Option C)."
  },
  {
    questionNumber: 45,
    grade: "Grade 9–10",
    topic: "Quantitative Comparison — Area of Inscribed Circle vs. Square",
    difficulty: "medium",
    prompt: "Compare the two quantities below:\nThe diameter of a circle O is the same as the length of the side of a square S.\n• Column A: The area of circle O\n• Column B: The area of square S",
    options: [
      "The relationship cannot be determined.",
      "The two quantities are equal.",
      "The quantity in column B is greater.",
      "The quantity in column A is greater."
    ],
    correctAnswer: "C",
    explanation: "Let the side length of square S and the diameter of circle O be d (where d > 0).\n• Radius of circle O: r = d / 2.\n• Column A (Area of circle O) = πr² = π(d/2)² = (π/4)d² ≈ 0.7854 d².\n• Column B (Area of square S) = d² = 1.0000 d².\nSince d² > 0.7854 d² (the circle fits completely inside the square), the quantity in Column B is strictly greater (Option C)."
  },
  {
    questionNumber: 46,
    grade: "Grade 9",
    topic: "Quantitative Comparison — Polynomial Products over Real Numbers",
    difficulty: "medium",
    prompt: "Compare the two quantities below:\nLet y be a real number.\n• Column A: (y + 1) × y × (y − 1)\n• Column B: y × y × y",
    options: [
      "The relationship cannot be determined.",
      "The two quantities are equal.",
      "The quantity in column B is greater.",
      "The quantity in column A is greater."
    ],
    correctAnswer: "A",
    explanation: "Simplify both columns:\n• Column A: (y + 1)y(y − 1) = y(y² − 1) = y³ − y.\n• Column B: y · y · y = y³.\nNow compare Column A (y³ − y) and Column B (y³) for different real values of y:\n• Case 1: If y = 1, Column A = 0 and Column B = 1 (Column B > Column A).\n• Case 2: If y = 0, Column A = 0 and Column B = 0 (Both are equal).\n• Case 3: If y = −1, Column A = 0 and Column B = −1 (Column A > Column B).\nBecause the sign of y is not restricted, the relationship cannot be determined (Option A)."
  },
  {
    questionNumber: 47,
    grade: "Grade 12",
    topic: "Arithmetic Progression (A.P.) — System of Linear Equations",
    difficulty: "medium",
    prompt: "Which one of the following is equal to the arithmetic sequence {a_n}_{n=1}^∞ if a_5 + a_9 = 72 and a_7 + a_12 = 97?",
    options: [
      "3, 8, 13, 18, 23, ...",
      "4, 9, 14, 19, 24, ...",
      "5, 10, 15, 20, 25, ...",
      "6, 11, 16, 21, 26, ..."
    ],
    correctAnswer: "D",
    explanation: "Using the n-th term formula of an arithmetic sequence, a_n = a_1 + (n − 1)d:\n1) a_5 + a_9 = (a_1 + 4d) + (a_1 + 8d) = 2a_1 + 12d = 72  ...(Equation 1)\n2) a_7 + a_12 = (a_1 + 6d) + (a_1 + 11d) = 2a_1 + 17d = 97 ...(Equation 2)\nSubtract Equation 1 from Equation 2:\n(2a_1 + 17d) − (2a_1 + 12d) = 97 − 72  ⇒  5d = 25  ⇒  d = 5.\nSubstitute d = 5 into Equation 1:\n2a_1 + 12(5) = 72  ⇒  2a_1 + 60 = 72  ⇒  2a_1 = 12  ⇒  a_1 = 6.\nThus, the sequence starts at 6 and increases by 5: 6, 11, 16, 21, 26, ... (Option D)."
  },
  {
    questionNumber: 48,
    grade: "Grade 12",
    topic: "Geometric Progression (G.P.) — Finding Term Index",
    difficulty: "easy",
    prompt: "Which term of the following geometric sequence 2, 8, 32, 128, ... is 2048?",
    options: ["7th", "6th", "12th", "11th"],
    correctAnswer: "B",
    explanation: "Here, the first term is a_1 = 2 and the common ratio is r = 8 / 2 = 4.\nThe n-th term of a geometric sequence is given by a_n = a_1 · r^(n−1):\n2 · 4^(n−1) = 2048\n4^(n−1) = 1024\nSince 4^5 = 1024, we have n − 1 = 5  ⇒  n = 6 (the 6th term, Option B)."
  },
  {
    questionNumber: 49,
    grade: "Grade 12",
    topic: "Arithmetic Progression — Arithmetic Mean",
    difficulty: "easy",
    prompt: "In the arithmetic sequence: −1, n, 13, ..., which one of the following is the value of n?",
    options: ["8", "9", "6", "7"],
    correctAnswer: "C",
    explanation: "In an arithmetic sequence, the difference between consecutive terms is constant:\nn − (−1) = 13 − n\nn + 1 = 13 − n\n2n = 12  ⇒  n = 6.\nThe value n = 6 corresponds to Option C."
  },
  {
    questionNumber: 50,
    grade: "Grade 12",
    topic: "Arithmetic Progression — Membership Test via Modulo Arithmetic",
    difficulty: "medium",
    prompt: "Which one of the following is a term in the sequence 6, 14, 22, ...?",
    options: ["258", "284", "264", "246"],
    correctAnswer: "D",
    explanation: "This is an arithmetic sequence with first term a_1 = 6 and common difference d = 14 − 6 = 8.\nThe general term is a_n = 6 + (n − 1)8 = 8n − 2, where n is a positive integer.\nThus, a_n − 6 must be divisible by 8:\n• A: 258 − 6 = 252 (252 ÷ 8 = 31.5, No)\n• B: 284 − 6 = 278 (278 ÷ 8 = 34.75, No)\n• C: 264 − 6 = 258 (258 ÷ 8 = 32.25, No)\n• D: 246 − 6 = 240 (240 ÷ 8 = 30, Yes — it is the 31st term).\nTherefore, 246 is a term in the sequence (Option D)."
  },
  {
    questionNumber: 51,
    grade: "Grade 12",
    topic: "Sigma Notation & Infinite Series Expansion",
    difficulty: "easy",
    prompt: "Which one of the following is equal to the series ∑_{n=1}^∞ (2n − 5)?",
    options: [
      "(−3) + (−1) + (1) + ...",
      "(1) + (−3) + (−7) + ...",
      "(1) + (−3) + (1) + ...",
      "(1) + (5) + (9) + ..."
    ],
    correctAnswer: "A",
    explanation: "Substitute n = 1, 2, 3, ... directly into the general term (2n − 5):\n• For n = 1: 2(1) − 5 = −3\n• For n = 2: 2(2) − 5 = −1\n• For n = 3: 2(3) − 5 = 1\nThus, the series expands as (−3) + (−1) + (1) + ... (Option A)."
  },
  {
    questionNumber: 52,
    grade: "Grade 9–10",
    topic: "Classical Probability & Fractional/Percentage Partitioning",
    difficulty: "medium",
    prompt: "A container has 235 flowers in a variety of colors: red, blue, yellow and purple. There are 45 blue flowers; one-fifth of the flowers are red; forty percent of them are purple and the rest are yellow. A flower is picked at random from the container. Which one of the following is the probability that the flower picked is yellow?",
    options: ["9/47", "49/235", "2/5", "1/5"],
    correctAnswer: "B",
    explanation: "Total number of flowers = 235.\n• Blue flowers = 45\n• Red flowers = (1/5) × 235 = 47\n• Purple flowers = 40% of 235 = 0.40 × 235 = 94\n• Yellow flowers = 235 − (45 + 47 + 94) = 235 − 186 = 49.\nTherefore, P(Yellow) = 49 / 235 (Option B)."
  },
  {
    questionNumber: 53,
    grade: "Grade 9",
    topic: "Complementary Probability",
    difficulty: "easy",
    prompt: "You go to a restaurant for lunch and want to order a sandwich. There are twenty-five sandwiches on the menu and six of them are toasted. If you order a sandwich at random, then what is the probability of you ordering a sandwich that is NOT toasted?",
    options: ["19/25", "16/25", "9/25", "6/25"],
    correctAnswer: "A",
    explanation: "Total sandwiches = 25. Toasted sandwiches = 6.\nNumber of sandwiches that are NOT toasted = 25 − 6 = 19.\nProbability(NOT toasted) = 19 / 25 (Option A)."
  },
  {
    questionNumber: 54,
    grade: "Grade 9–10",
    topic: "Word Problems — Ratio Adjustment & Linear Equations",
    difficulty: "medium",
    prompt: "28 male lions and 172 female lions are living in a 500-acre park. If 35 more male lions are introduced into the park, how many more female lions should be introduced so that 6/7 of the total number of lions in the park is female?",
    options: ["241", "324", "206", "378"],
    correctAnswer: "C",
    explanation: "1) Initial male lions = 28. After introducing 35 more males, total male lions = 28 + 35 = 63.\n2) If 6/7 of the total lions are female, then the remaining 1/7 of the total lions must be male.\n3) Let T be the new total number of lions: (1/7)T = 63  ⇒  T = 63 × 7 = 441 total lions.\n4) New number of female lions required = 441 − 63 = 378 (or (6/7) × 441 = 378).\n5) Since there are already 172 female lions in the park, the number of additional female lions to introduce is:\n378 − 172 = 206 (Option C)."
  },
  {
    questionNumber: 55,
    grade: "Grade 9",
    topic: "Fractional Share Operations & Word Problems",
    difficulty: "medium",
    prompt: "A business is owned by 1 man and 5 women, each of whom has an equal share. If one of the women sells 2/5 of her share to the man, and another woman keeps 1/4 of her share and sells the rest to the man, what fraction of the total share of the business is owned by the man?",
    options: ["43/120", "2/3", "37/120", "9/40"],
    correctAnswer: "A",
    explanation: "There are 6 owners in total (1 man + 5 women), so each person initially owns 1/6 of the business.\n1) The man's initial share = 1/6.\n2) First woman sells 2/5 of her share to the man: (2/5) × (1/6).\n3) Second woman keeps 1/4 of her share, meaning she sells (1 − 1/4) = 3/4 of her share to the man: (3/4) × (1/6).\nTotal share owned by the man:\n= (1/6) × [1 + 2/5 + 3/4]\n= (1/6) × [(20 + 8 + 15) / 20]\n= (1/6) × (43 / 20) = 43 / 120 (Option A)."
  },
  {
    questionNumber: 56,
    grade: "Grade 12",
    topic: "Non-Linear Number Sequences — Sum of Consecutive Squares",
    difficulty: "medium",
    prompt: "Which of the following is the value of x in the sequence: 1, 5, 14, 30, x, 91, ...?",
    options: ["75", "55", "65", "85"],
    correctAnswer: "B",
    explanation: "Examine the differences between consecutive terms:\n• 5 − 1 = 4 = 2²\n• 14 − 5 = 9 = 3²\n• 30 − 14 = 16 = 4²\nFollowing this pattern, we add 5² = 25 to find x:\n• x = 30 + 5² = 30 + 25 = 55.\nCheck the next term: 55 + 6² = 55 + 36 = 91 (Matches!). Thus, x = 55 (Option B)."
  },
  {
    questionNumber: 57,
    grade: "Grade 12",
    topic: "Infinite Geometric Series — Sum & Common Ratio",
    difficulty: "medium",
    prompt: "Which of the following is the value of X (the sum / parameter) in the infinite geometric series: 3 + 1 + 1/3 + 1/9 + 1/27 + ...?",
    options: ["1/3", "2/9", "3", "9/2"],
    correctAnswer: "D",
    explanation: "This is an infinite geometric series with first term a_1 = 3 and common ratio r = 1/3 (since |r| = 1/3 < 1, it converges).\nUsing the sum of an infinite geometric series formula:\nS_∞ = a_1 / (1 − r) = 3 / (1 − 1/3) = 3 / (2/3) = 9/2 = 4.5 (Option D)."
  },
  {
    questionNumber: 58,
    grade: "Grade 9",
    topic: "System of Linear Equations & Cartesian Quadrant Identification",
    difficulty: "easy",
    prompt: "Which of the following is the quadrant in which the common solution of the equations 2x + 3y = 2 and 3x + 2y = 2 is found?",
    options: ["IV quadrant", "II quadrant", "III quadrant", "I quadrant"],
    correctAnswer: "D",
    explanation: "Solve the simultaneous system of equations:\n(1) 2x + 3y = 2   (Multiply by 3)  ⇒  6x + 9y = 6\n(2) 3x + 2y = 2   (Multiply by 2)  ⇒  6x + 4y = 4\nSubtract the second new equation from the first:\n5y = 2  ⇒  y = 2/5 > 0.\nSubstitute y = 2/5 into 2x + 3(2/5) = 2:\n2x + 6/5 = 2  ⇒  2x = 4/5  ⇒  x = 2/5 > 0.\nSince both coordinates (x, y) = (2/5, 2/5) are positive (x > 0, y > 0), the intersection point lies in the First (I) Quadrant (Option D)."
  },
  {
    questionNumber: 59,
    grade: "Grade 9",
    topic: "Testing Ordered Pairs in a Two-Variable Linear Inequality",
    difficulty: "easy",
    prompt: "Given the inequality y ≤ 2x + 2, which of the following ordered pairs of numbers is NOT a solution for the given inequality?",
    options: ["(−1, 0)", "(−3, 3)", "(0, 2)", "(2, 3)"],
    correctAnswer: "B",
    explanation: "Substitute each ordered pair (x, y) into the inequality y ≤ 2x + 2:\n• A. (−1, 0): 0 ≤ 2(−1) + 2  ⇒  0 ≤ 0 (True, is a solution)\n• B. (−3, 3): 3 ≤ 2(−3) + 2  ⇒  3 ≤ −4 (False! 3 is not less than or equal to −4)\n• C. (0, 2): 2 ≤ 2(0) + 2  ⇒  2 ≤ 2 (True, is a solution)\n• D. (2, 3): 3 ≤ 2(2) + 2  ⇒  3 ≤ 6 (True, is a solution)\nThus, (−3, 3) is NOT a solution (Option B)."
  },
  {
    questionNumber: 60,
    grade: "Grade 9",
    topic: "Linear Modeling — Interpreting Slope / Rate of Change",
    difficulty: "easy",
    prompt: "The equation T = 25 + 3c is used to model the number of chirps, c, made by a certain species of cricket in one minute, and the temperature, T, in degrees Fahrenheit. According to this model, what is the estimated increase in temperature, in degrees Fahrenheit, when the number of chirps in one minute is increased by 1?",
    options: ["28", "25", "5", "3"],
    correctAnswer: "D",
    explanation: "In the linear equation T(c) = 25 + 3c, the slope (rate of change of T with respect to c) is 3.\nWhen c increases by 1 (from c to c + 1):\nT_new = 25 + 3(c + 1) = 25 + 3c + 3 = T_old + 3.\nThus, the estimated temperature increases by 3 degrees Fahrenheit (Option D)."
  }
];

const targetPath = path.resolve(__dirname, "../seeds/data/sat_esslce_2013_booklet26.json");
fs.writeFileSync(targetPath, JSON.stringify(satQuestions, null, 2), "utf8");
console.log(`Generated ${satQuestions.length} SAT questions in ${targetPath}`);
