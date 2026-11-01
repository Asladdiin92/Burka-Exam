import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dangerPassage = `[Reading Comprehension Passage I — Confronting Sudden Danger]
If a person suddenly encounters any terrible danger, the change of nature one undergoes is equally great. Sometimes fear numbs our senses. Like animals, one stands still, powerless to move a step in fright or to lift a hand in defense of our lives, and sometimes one is seized with panic, and again, act more like the inferior animals than rational beings. On the other hand, frequently in cases of sudden extreme peril, which cannot be escaped by flight, and must be instantly faced, even the most timid men at once as if by miracle, become possessed of the necessary courage, sharp quick apprehension, and swift decision. This is a miracle very common in nature. Man and the inferior animals alike, when confronted with almost certain death 'gather resolution from despair' but there can really be no trace of so debilitating a feeling in the person fighting, or prepared to fight for dear life. At such times the mind is clearer than it has ever been; the nerves are steel, there is nothing felt but a wonderful strength and daring. Looking back at certain perilous moments in my own life, I remember them with a kind of joy, not that there was any joyful excitement then, but because they broadened my horizon, lifted me for a time above myself.
(Adapted from Reading Comprehension - Practice Questions)`;

const dayliliesPassage = `[Reading Comprehension Passage II — Daylilies]
Daylilies are beautiful perennial flowers that can brighten up any yard or landscape. They are tolerant of drought and flooding, immune to heat stress, and grow well in full sun or light shade. They are the perfect choice for just about any soil or climate condition.

Different varieties of daylilies can be in bloom from late spring until autumn. Individual flowers last only one day, but each plant produces many buds, and many varieties have more than one flowering period.

Daylilies grow best in soil that is slightly acidic, and they prefer either direct sunshine or light shade. The best time to plant them is in the early fall or early spring, but they are hardy enough to endure planting or transplanting at almost any time of year. They should be planted 18 to 24 inches apart, and the bulb should be no deeper than one inch below the soil's surface.
(Adapted from Reading Comprehension - Practice Questions)`;

const expenditureTable = `[Table: Annual Expenditure of a Firm (in Millions of Birr) (2006–2010)]
| Year | Salary | Fuel and Transport | Bonus | Interest on Loans | Taxes |
| 2006 | 314    | 92                 | 3     | 24                | 85    |
| 2007 | 258    | 110                | 2.5   | 33                | 71    |
| 2008 | 732    | 131                | 3.4   | 28                | 112   |
| 2009 | 450    | 104                | 2.6   | 31                | 98    |
| 2010 | 370    | 125                | 3.8   | 42                | 93    |`;

export const sat2014Questions = [
  // SECTION ONE: VERBAL REASONING (Q1–Q35)
  // Analytical & Logical Reasoning (Q1–Q8)
  {
    questionNumber: 1,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Deductive Inference",
    difficulty: "easy",
    prompt: "Tamrat's train never bothered him because there were always seats available on it, and he was able to spend his time on the train comfortably reading the newspaper or playing games on his mobile phone. Ever since the train schedule changed, the train has been extremely crowded, and by the time the doors open at his station, there isn't a seat to be found.\n\nWhich of the following can be inferred from the paragraph?",
    options: [
      "Tamrat's train is less comfortable since the train schedule changed.",
      "Tamrat would be better off taking the bus to work instead of the train.",
      "Tamrat will likely look for a new job closer to home.",
      "Any traveller who uses the train will complain about the new schedule."
    ],
    correctAnswer: "A",
    explanation: "The passage explicitly explains that Tamrat was able to ride the train 'comfortably' because seats were always available. Since the schedule change, the train is extremely crowded and no seats are to be found, which directly implies that the train ride is less comfortable since the schedule changed."
  },
  {
    questionNumber: 2,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Concept Application",
    difficulty: "easy",
    prompt: "It is called Restitution when you compensate someone for damaging his or her property in some way. Which of the following situations is the best example of Restitution?",
    options: [
      "Tom borrows his friend's camera. Tom fails to zipper the case, and the camera falls on the ground, and the lens shatters. When Tom returns the camera, he tells his friend that he will pay for the damage.",
      "Tom borrows his friend's car and returns the car with an empty petrol tank. He apologizes and tells his friend that he will fill the tank tomorrow.",
      "A pothole in the parking of Peter's company caused his flat tyre. He informs his boss and expects that the company should pay for the repair.",
      "Peter asks Tom to stay in his apartment when he is out of town. One day Tom arrives to stay and finds that pipe has burst and the apartment is filled with water. He calls the plumber to repair the pipe and pays for the repair."
    ],
    correctAnswer: "A",
    explanation: "Restitution involves two essential criteria: (1) causing damage to another person's property, and (2) compensating them for the damage. In Option A, Tom causes damage to his friend's camera and pledges to pay for the repair/replacement."
  },
  {
    questionNumber: 3,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Spatial Ordering & Tracking",
    difficulty: "easy",
    prompt: "A four-person crew is painting Mr. Omod's house. Michael is painting the front of the house. Roza is in the alley behind the house painting the back. Jemal is painting the window frames on the north side, Shawul is on the south. If Michael switches places with Jemal, and Jemal then switches places with Shawul, where is Shawul?",
    options: [
      "on the north side of the house",
      "in the alley behind the house",
      "on the south side of the house",
      "in front of the house"
    ],
    correctAnswer: "D",
    explanation: "Initial positions: Michael = Front, Roza = Back, Jemal = North, Shawul = South. Swap 1: Michael and Jemal switch places -> Michael goes to North, Jemal moves to Front. Swap 2: Jemal (now Front) switches with Shawul (South) -> Jemal moves to South and Shawul moves to the Front of the house."
  },
  {
    questionNumber: 4,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Linear Ordering / Age Comparison",
    difficulty: "easy",
    prompt: "Four friends in the sixth grade were sharing a pizza. They decided that the oldest friend would get the extra piece. Hawi is two months older than Geremew, who is three months younger than Nardos. Kemal is one month older than Geremew. Who should get the extra piece of pizza?",
    options: ["Nardos", "Hawi", "Kemal", "Geremew"],
    correctAnswer: "A",
    explanation: "Let Geremew's age be G. Then Hawi = G + 2. Geremew is 3 months younger than Nardos, so Nardos = G + 3. Kemal is 1 month older than Geremew, so Kemal = G + 1. Comparing relative ages: Nardos (G + 3) > Hawi (G + 2) > Kemal (G + 1) > Geremew (G). Therefore, Nardos is the oldest and gets the extra piece."
  },
  {
    questionNumber: 5,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Paragraph Support / Main Idea",
    difficulty: "easy",
    prompt: "If you are a fitness walker, you don't need to go to a health gym. You also don't need any fitness equipment for workouts. All you need is a pair of comfortable athletic shoes.\n\nWhich of the following statements does this paragraph support?",
    options: [
      "Walking outdoors provides more health benefits than walking indoor",
      "Fitness walking is better than weight lifting",
      "Poorly designed shoes can cause foot injuries",
      "Fitness walking is an effective and convenient form of exercise"
    ],
    correctAnswer: "D",
    explanation: "The paragraph emphasizes that fitness walking requires neither gym fees nor specialized workout apparatus—merely comfortable athletic shoes. This directly supports the idea that fitness walking is a convenient, accessible, and effective form of exercise."
  },
  {
    questionNumber: 6,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Direct Fact Deduction",
    difficulty: "easy",
    prompt: "Sara lives in Adama. Her younger cousin Martha lives in a small town in the eastern part of Ethiopia. Martha has visited Sara several times during the past five years. In the same period of time, Sara has visited Martha only once.\n\nWhich of the following must be true?",
    options: [
      "Sara thinks small towns are boring.",
      "Martha likes Sara better than Sara likes Martha.",
      "Martha wants to move to another town.",
      "Sara is older than Martha."
    ],
    correctAnswer: "D",
    explanation: "The second sentence explicitly describes Martha as Sara's 'younger cousin.' Therefore, Sara is definitively older than Martha."
  },
  {
    questionNumber: 7,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Blood Relations",
    difficulty: "easy",
    prompt: "Solomon introduced Sara as the mother of his sister's brother. How is Sara related to Solomon?",
    options: ["Niece", "Aunt", "Sister", "Mother"],
    correctAnswer: "D",
    explanation: "Solomon's 'sister's brother' refers to either Solomon himself or another brother in Solomon's immediate sibling group. The mother of Solomon's brother/sister is Solomon's own mother. Thus, Sara is Solomon's mother."
  },
  {
    questionNumber: 8,
    grade: "Grade 11–12",
    topic: "Analytical & Logical Reasoning — Scheduling & Constraint Satisfaction",
    difficulty: "hard",
    prompt: "Mrs. Genet wishes to renovate her cottage. She hires the services of a plumber, a carpenter, a painter, an electrician, and an interior decorator. The renovation is to be completed in a period of one week, i.e. Monday to Friday. Every worker will be taking one complete day to do this job. Mrs. Genet will allow just one person to work per day.\n• The painter can do this work only after the plumber and the carpenter have completed their jobs.\n• The interior decorator has to complete his job before that of the electrician.\n• The carpenter cannot work on Monday or Tuesday.\n\nIn case the painter works on Thursday, which among the following alternatives is possible?",
    options: [
      "The electrician works on Tuesday.",
      "The electrician works on Friday.",
      "The interior decorator does his work after the painter.",
      "The plumber and the painter work on consecutive days."
    ],
    correctAnswer: "B",
    explanation: "Painter is fixed on Thursday. Since the Painter must work after the Plumber and Carpenter, both must work on Mon, Tue, or Wed. But the Carpenter cannot work on Mon or Tue, which strictly forces the Carpenter to work on Wednesday. That leaves Monday and Tuesday for the Plumber and one other worker. Since the Interior Decorator must complete his job before the Electrician, the Decorator must take Monday or Tuesday, leaving Friday for the Electrician. Thus, 'The electrician works on Friday' (Option B) is guaranteed."
  },

  // Analogy (Q9–Q13)
  {
    questionNumber: 9,
    grade: "Grade 10–12",
    topic: "Verbal Analogy — Activity to Location",
    difficulty: "easy",
    prompt: "EXERCISE is to GYM as EATING is to: ____________",
    options: ["Dieting", "Food", "Restaurant", "Drink"],
    correctAnswer: "C",
    explanation: "A gym is a specific facility where one exercises; a restaurant is a specific establishment where one eats."
  },
  {
    questionNumber: 10,
    grade: "Grade 10–12",
    topic: "Verbal Analogy — Time of Day to Associated Meal",
    difficulty: "easy",
    prompt: "The EVENING is to MORNING as DINNER is to: ____________",
    options: ["Breakfast", "Supper", "Brunch", "Lunch"],
    correctAnswer: "A",
    explanation: "Evening contrasts with morning as dinner (the customary evening meal) contrasts with breakfast (the morning meal)."
  },
  {
    questionNumber: 11,
    grade: "Grade 10–12",
    topic: "Verbal Analogy — Weapon to Projectile",
    difficulty: "easy",
    prompt: "GUN is to BULLET as a BOW is to: ____________",
    options: ["Wood", "Arrow", "Sky", "Fly"],
    correctAnswer: "B",
    explanation: "A gun discharges a bullet as its projectile; similarly, a bow shoots an arrow."
  },
  {
    questionNumber: 12,
    grade: "Grade 10–12",
    topic: "Verbal Analogy — Tool to Profession",
    difficulty: "easy",
    prompt: "PEN is to POET as NEEDLE is to: ____________",
    options: ["Button", "Thread", "Tailor", "Sewing"],
    correctAnswer: "C",
    explanation: "A pen is the principal instrument of a poet; a needle is the principal instrument of a tailor."
  },
  {
    questionNumber: 13,
    grade: "Grade 10–12",
    topic: "Verbal Analogy — Performance Event to Performer",
    difficulty: "easy",
    prompt: "PLAY is to ACTOR as CONCERT is to: ____________",
    options: ["Musician", "Symphony", "Persuasion", "Piano"],
    correctAnswer: "A",
    explanation: "A play is staged and performed by an actor; a concert is performed by a musician."
  },

  // Classification Items (Q14–Q18)
  {
    questionNumber: 14,
    grade: "Grade 9–12",
    topic: "Verbal Classification — Biological / Semantic Grouping",
    difficulty: "easy",
    prompt: "Choose the word that does not fit the relation:",
    options: ["Elephant", "Lion", "Tiger", "Leopard"],
    correctAnswer: "A",
    explanation: "Lion, Tiger, and Leopard are all carnivorous big cats (Felidae), whereas an Elephant is a massive herbivorous mammal."
  },
  {
    questionNumber: 15,
    grade: "Grade 9–12",
    topic: "Verbal Classification — Functional Stationery Grouping",
    difficulty: "easy",
    prompt: "Choose the word that does not fit the relation:",
    options: ["Pencil", "Book", "Eraser", "Pen"],
    correctAnswer: "B",
    explanation: "Pencil, Pen, and Eraser are tools used for writing and erasing marks on paper, whereas a Book is reading material."
  },
  {
    questionNumber: 16,
    grade: "Grade 10–12",
    topic: "Verbal Classification — Part of Speech & Semantic Domain",
    difficulty: "medium",
    prompt: "Choose the word that does not fit the relation:",
    options: ["Confusion", "Chaos", "Order", "Legal"],
    correctAnswer: "D",
    explanation: "Confusion, Chaos, and Order are nouns describing states of arrangement or disorder, whereas 'Legal' is an adjective pertaining to the law."
  },
  {
    questionNumber: 17,
    grade: "Grade 9–12",
    topic: "Verbal Classification — Sensory vs. Internal Organs",
    difficulty: "easy",
    prompt: "Choose the word that does not fit the relation:",
    options: ["Heart", "Eye", "Ear", "Tongue"],
    correctAnswer: "A",
    explanation: "Eye, Ear, and Tongue are external sensory organs (responsible for sight, hearing, and taste), whereas the Heart is an internal circulatory organ."
  },
  {
    questionNumber: 18,
    grade: "Grade 10–12",
    topic: "Verbal Classification — Content Producers vs. Consumer",
    difficulty: "easy",
    prompt: "Choose the word that does not fit the relation:",
    options: ["Reader", "Writer", "Reporter", "Publisher"],
    correctAnswer: "A",
    explanation: "Writer, Reporter, and Publisher are all roles involved in producing and disseminating written media, whereas a Reader is the consumer of the published work."
  },

  // Synonyms (Q19–Q22)
  {
    questionNumber: 19,
    grade: "Grade 10–12",
    topic: "Vocabulary in Context — Synonyms",
    difficulty: "easy",
    prompt: "Choose the word that is most nearly similar in meaning to the bracketed word:\nThe special TV report [disrupted] regular programming due to the day's special events.",
    options: ["Complemented", "Satisfied", "Continued", "Interrupted"],
    correctAnswer: "D",
    explanation: "To 'disrupt' means to interrupt or disturb the normal continuity or flow of an event or program."
  },
  {
    questionNumber: 20,
    grade: "Grade 11–12",
    topic: "Vocabulary in Context — Synonyms",
    difficulty: "medium",
    prompt: "Choose the word that is most nearly similar in meaning to the bracketed word:\nHe [dissipated] his inheritance in less than six months and he is now back to where he was.",
    options: ["Accumulated", "Wasted", "Hoarded", "Saved"],
    correctAnswer: "B",
    explanation: "In financial contexts, to 'dissipate' means to squander, waste, or fritter away wealth foolishly."
  },
  {
    questionNumber: 21,
    grade: "Grade 11–12",
    topic: "Vocabulary in Context — Synonyms",
    difficulty: "medium",
    prompt: "Choose the word that is most nearly similar in meaning to the bracketed word:\nIf enough members of parliament [dissent], the new law will not be approved.",
    options: ["Support", "Agree", "Disagree", "Question"],
    correctAnswer: "C",
    explanation: "To 'dissent' means to express disagreement or opposition to an official policy, proposal, or majority viewpoint."
  },
  {
    questionNumber: 22,
    grade: "Grade 10–12",
    topic: "Vocabulary in Context — Synonyms",
    difficulty: "easy",
    prompt: "Choose the word that is most nearly similar in meaning to the bracketed word:\nDuring the riot, some of the demonstrators [looted] shops and supermarkets and took the goods to their home.",
    options: ["wasted", "robbed", "shot", "burned"],
    correctAnswer: "B",
    explanation: "To 'loot' means to steal goods from stores or buildings, especially during a riot, war, or catastrophe—synonymous with 'robbed'."
  },

  // Reading Comprehension I (Q23–Q27)
  {
    questionNumber: 23,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Main Idea & Title Selection",
    difficulty: "medium",
    prompt: `${dangerPassage}\n\nQuestion:\n23. The title that best suits the passage would be:`,
    options: [
      "The Miracle of Confronting Danger",
      "The Will to Fight",
      "The Change of Nature",
      "Courage and Panic"
    ],
    correctAnswer: "A",
    explanation: "The passage describes the extraordinary psychological and physiological transformation where facing inevitable danger converts even timid individuals into courageous fighters. 'The Miracle of Confronting Danger' best captures this central thesis."
  },
  {
    questionNumber: 24,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Vocabulary in Context",
    difficulty: "medium",
    prompt: `${dangerPassage}\n\nQuestion:\n24. What is the meaning of the word debilitating?`,
    options: ["Strengthen", "Fatten", "Enfeeble", "Debase"],
    correctAnswer: "C",
    explanation: "'Debilitating' means making someone weak, infirm, or lacking in energy, which is synonymous with 'Enfeeble'."
  },
  {
    questionNumber: 25,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Explicit Detail Retrieval",
    difficulty: "easy",
    prompt: `${dangerPassage}\n\nQuestion:\n25. The author feels happy in the recollection of dangers faced and overcome because`,
    options: [
      "they lifted him above himself for a time.",
      "they brought him a new experience.",
      "he felt elated as he was alive.",
      "these experiences boosted his confidence."
    ],
    correctAnswer: "A",
    explanation: "The author explicitly concludes: 'I remember them with a kind of joy... because they broadened my horizon, lifted me for a time above myself.'"
  },
  {
    questionNumber: 26,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Detail Synthesis",
    difficulty: "medium",
    prompt: `${dangerPassage}\n\nQuestion:\n26. A man may react to sudden danger in some different ways. Some of these are:`,
    options: [
      "He may be paralysed with fear, flee panic, seized with panic or act like an inferior animal.",
      "He may flee panic, or fight back, stand still or act like an inferior animal.",
      "He may be paralysed with fear, run away, or fight.",
      "He may be paralysed with fear, seized with panic, or act like an inferior animal."
    ],
    correctAnswer: "D",
    explanation: "The passage specifies: 'Sometimes fear numbs our senses... stands still, powerless to move a step in fright [paralysed with fear], and sometimes one is seized with panic, and again, act more like the inferior animals than rational beings.' Option D captures these three reactions directly."
  },
  {
    questionNumber: 27,
    grade: "Grade 11–12",
    topic: "Reading Comprehension — Figurative Phrase Interpretation",
    difficulty: "medium",
    prompt: `${dangerPassage}\n\nQuestion:\n27. Explain the phrase 'gather resolution from despair'.`,
    options: [
      "Find peace in times of difficulty.",
      "Hopelessness makes one determined to face the difficulty.",
      "Questions to be enthusiastic and brave the odds during difficulty",
      "To remain calm and not to lose hope when there is a difficulty"
    ],
    correctAnswer: "B",
    explanation: "'Gather resolution from despair' means that when all ordinary hope of flight is vanished (despair/hopelessness), one summons fierce determination (resolution) to stand and face the mortal danger."
  },

  // Antonyms (Q28–Q30)
  {
    questionNumber: 28,
    grade: "Grade 10–12",
    topic: "Vocabulary in Context — Antonyms",
    difficulty: "easy",
    prompt: "Choose the word that is most nearly opposite in meaning to the bracketed word:\nThe officer [exaggerated] the damage caused by the rowdies and thus made it look more serious.",
    options: ["Condemned", "Unreported", "Underestimated", "Ignored"],
    correctAnswer: "C",
    explanation: "'Exaggerate' means to overstate or amplify something beyond reality. Its exact antonym is 'Underestimated' (to minimize or rate below its true extent)."
  },
  {
    questionNumber: 29,
    grade: "Grade 11–12",
    topic: "Vocabulary in Context — Antonyms",
    difficulty: "medium",
    prompt: "Choose the word that is most nearly opposite in meaning to the bracketed word:\nThe speaker was unable to [pacify] the crowd.",
    options: ["Threaten", "Excite", "Challenge", "Antagonize"],
    correctAnswer: "B",
    explanation: "'Pacify' means to calm, quell agitation, or bring peace to an angry group. Its direct antonym is 'Excite' (to stir up, agitate, or provoke heightened emotional reaction)."
  },
  {
    questionNumber: 30,
    grade: "Grade 11–12",
    topic: "Vocabulary in Context — Antonyms",
    difficulty: "medium",
    prompt: "Choose the word that is most nearly opposite in meaning to the bracketed word:\nHis negative attitude to poor people is [deplorable].",
    options: ["Commendable", "Miserable", "Desirable", "Equitable"],
    correctAnswer: "A",
    explanation: "'Deplorable' describes conduct or attitudes that are disgraceful and worthy of severe condemnation. Its opposite is 'Commendable' (worthy of praise and respect)."
  },

  // Reading Comprehension II (Q31–Q35)
  {
    questionNumber: 31,
    grade: "Grade 9–11",
    topic: "Reading Comprehension — Explicit Fact Retrieval",
    difficulty: "easy",
    prompt: `${dayliliesPassage}\n\nQuestion:\n31. According to the passage, what soil is best for daylilies?`,
    options: [
      "Slightly acidic",
      "Slightly neutral",
      "Moist soil",
      "Any soil"
    ],
    correctAnswer: "A",
    explanation: "Paragraph 3 explicitly states: 'Daylilies grow best in soil that is slightly acidic...'"
  },
  {
    questionNumber: 32,
    grade: "Grade 9–11",
    topic: "Reading Comprehension — Logical Inference",
    difficulty: "easy",
    prompt: `${dayliliesPassage}\n\nQuestion:\n32. You could infer from this passage that these flowers are called day-lilies because`,
    options: [
      "they look like real lilies, but aren't.",
      "they only bloom in the daytime.",
      "Charles Day developed the hybrid.",
      "the blooms last for one day."
    ],
    correctAnswer: "D",
    explanation: "Paragraph 2 notes that 'Individual flowers last only one day,' which provides the botanical reason for their common name 'daylilies'."
  },
  {
    questionNumber: 33,
    grade: "Grade 9–11",
    topic: "Reading Comprehension — Detail Retrieval",
    difficulty: "easy",
    prompt: `${dayliliesPassage}\n\nQuestion:\n33. How deep should daylilies be planted, according to the passage?`,
    options: [
      "one inch or less (no deeper than one inch)",
      "one to 20 inches",
      "any depth work",
      "18 to 24 inches"
    ],
    correctAnswer: "A",
    explanation: "The passage specifies: 'the bulb should be no deeper than one inch below the soil's surface.' (Option A). (18 to 24 inches refers to the spacing between plants, not planting depth)."
  },
  {
    questionNumber: 34,
    grade: "Grade 9–11",
    topic: "Reading Comprehension — Explicit Fact Retrieval",
    difficulty: "easy",
    prompt: `${dayliliesPassage}\n\nQuestion:\n34. Daylilies grow best in`,
    options: ["the mornings", "darkness", "sunshine", "the evenings"],
    correctAnswer: "C",
    explanation: "The passage notes in Paragraph 1 ('grow well in full sun or light shade') and Paragraph 3 ('they prefer either direct sunshine or light shade') that daylilies flourish best in sunshine."
  },
  {
    questionNumber: 35,
    grade: "Grade 9–11",
    topic: "Reading Comprehension — True/False Statement Verification",
    difficulty: "easy",
    prompt: `${dayliliesPassage}\n\nQuestion:\n35. Which of the following is true according to the passage?`,
    options: [
      "Daylilies cannot stand drought.",
      "Daylilies can stand drought.",
      "Daylilies cannot grow in sunny weather.",
      "Heat can cause stress to daylilies."
    ],
    correctAnswer: "B",
    explanation: "Paragraph 1 states: 'They are tolerant of drought and flooding, immune to heat stress...' Being tolerant of drought means they can stand drought (Option B)."
  },

  // SECTION TWO: QUANTITATIVE REASONING (Q36–Q60)
  // Sequences, Series & Algebra (Q36–Q41)
  {
    questionNumber: 36,
    grade: "Grade 12",
    topic: "Geometric Progression — Sum of Finite Geometric Series",
    difficulty: "medium",
    prompt: "Suppose a chain letter is started by sending a letter to five people and the letter requires each person who receives the letter to send it on to five additional people. Assume that no person receives more than one letter. How many letters are sent all together if the chain reaches the eighth stage?",
    options: ["480,280", "488,280", "390,625", "490,625"],
    correctAnswer: "B",
    explanation: "This is a geometric progression with a₁ = 5, r = 5, and n = 8 stages. Total letters sent S₈ = a₁(r⁸ - 1)/(r - 1) = 5(5⁸ - 1)/4 = 5(390,625 - 1)/4 = 5(390,624)/4 = 5 × 97,656 = 488,280."
  },
  {
    questionNumber: 37,
    grade: "Grade 9–10",
    topic: "Coordinate Geometry — Slope of a Line & Simultaneous Linear Equations",
    difficulty: "medium",
    prompt: "If the line passing through (x, y) and (-1, 2) has a slope of 3 and the line passing through (x, y) and (2, -1) has a slope of 1, then (x, y) equals:",
    options: ["(4, -7)", "(-4, 7)", "(-4, -7)", "(4, 7)"],
    correctAnswer: "C",
    explanation: "Line 1: (y - 2)/(x - (-1)) = 3 => y - 2 = 3(x + 1) => y = 3x + 5. Line 2: (y - (-1))/(x - 2) = 1 => y + 1 = x - 2 => y = x - 3. Equating y: 3x + 5 = x - 3 => 2x = -8 => x = -4. Then y = -4 - 3 = -7. Thus, (x, y) = (-4, -7)."
  },
  {
    questionNumber: 38,
    grade: "Grade 9 & 12",
    topic: "Word Problems — Simple Interest & Mixture/Allocation Systems",
    difficulty: "medium",
    prompt: "Ali wants to invest a total of Birr 20,000 so that his yearly interest is Birr 1690. If he invests part of it in a bank yielding 8% profit and the other part in a stock at 9.5% profit, how much should he invest at each rate?",
    options: [
      "Birr 8000 at 9.5%; Birr 12000 at 8%",
      "Birr 6000 at 9.5%; Birr 14000 at 8%",
      "Birr 9000 at 9.5%; Birr 11000 at 8%",
      "Birr 7500 at 9.5%; Birr 12500 at 8%"
    ],
    correctAnswer: "B",
    explanation: "Let x be invested at 9.5% and (20,000 - x) at 8%. Total interest: 0.095x + 0.08(20,000 - x) = 1690 => 0.095x + 1600 - 0.08x = 1690 => 0.015x = 90 => x = 90 / 0.015 = 6,000 Birr at 9.5%, and 20,000 - 6,000 = 14,000 Birr at 8%."
  },
  {
    questionNumber: 39,
    grade: "Grade 12",
    topic: "Arithmetic Progression — Finding the n-th Term",
    difficulty: "easy",
    prompt: "Meseret begins a saving program in which she will save Birr 1000 the first year, and each subsequent year will save Birr 200 more than she did the previous year. How much will she save during the eighth year?",
    options: ["Birr 2400", "Birr 2200", "Birr 1360", "Birr 2600"],
    correctAnswer: "A",
    explanation: "This is an arithmetic progression with a₁ = 1000 and d = 200. During the 8th year: a₈ = a₁ + (8 - 1)d = 1000 + 7(200) = 1000 + 1400 = Birr 2400."
  },
  {
    questionNumber: 40,
    grade: "Grade 12",
    topic: "Geometric Progression — Applied Rebound Problem",
    difficulty: "easy",
    prompt: "A ball bounces one-half the distance from which it falls. How high does it bounce up on the fifth rebound if the ball is dropped from a height of 20m?",
    options: ["2.5m", "5m", "1.25m", "0.625m"],
    correctAnswer: "D",
    explanation: "Drop height H₀ = 20 m. Each bounce reaches half of the previous height: h_n = 20 × (1/2)^n. On the 5th rebound: h₅ = 20 × (1/2)⁵ = 20 / 32 = 0.625 m."
  },
  {
    questionNumber: 41,
    grade: "Grade 12",
    topic: "Arithmetic Progression — Sum of Finite Arithmetic Series",
    difficulty: "medium",
    prompt: "A contest offers a total of 18 prizes. The first prize is worth Birr 10,000, and each successive prize is worth Birr 500 less than the next higher prize. What is the total value of all the prizes?",
    options: ["Birr 113,500", "Birr 103,500", "Birr 105,000", "Birr 108,000"],
    correctAnswer: "B",
    explanation: "Arithmetic sequence with n = 18 prizes, a₁ = 10,000, and d = -500. Sum S₁₈ = (n/2)[2a₁ + (n - 1)d] = (18/2)[2(10,000) + 17(-500)] = 9[20,000 - 8,500] = 9 × 11,500 = Birr 103,500."
  },

  // Data Interpretation (Q42–Q46)
  {
    questionNumber: 42,
    grade: "Grade 9–11",
    topic: "Data Interpretation — Row Summation from Tabular Data",
    difficulty: "easy",
    prompt: `${expenditureTable}\n\nQuestion:\n42. The total expenditure of the firm over these items during the year 2007 is:`,
    options: ["474.5", "447.5", "476.5", "467.5"],
    correctAnswer: "A",
    explanation: "Summing 2007 expenditures from the table: 258 (Salary) + 110 (Fuel/Transport) + 2.5 (Bonus) + 33 (Interest) + 71 (Taxes) = 474.5 million Birr."
  },
  {
    questionNumber: 43,
    grade: "Grade 9–11",
    topic: "Data Interpretation — Arithmetic Mean (Average)",
    difficulty: "easy",
    prompt: `${expenditureTable}\n\nQuestion:\n43. What is the average amount of tax per year which the firm had to pay during the whole period?`,
    options: ["76.5", "114.75", "82.9", "91.8"],
    correctAnswer: "D",
    explanation: "Total taxes over the 5-year period (2006–2010): 85 + 71 + 112 + 98 + 93 = 459 million Birr. Average tax per year = 459 / 5 = 91.8 million Birr."
  },
  {
    questionNumber: 44,
    grade: "Grade 9–11",
    topic: "Data Interpretation — Percentage Comparison Across Years",
    difficulty: "medium",
    prompt: `${expenditureTable}\n\nQuestion:\n44. Total expenditure on all these items in the year 2006 was approximately what percent of the total expenditure in the year 2010?`,
    options: ["80.12", "78.25", "81.73", "83.71"],
    correctAnswer: "C",
    explanation: "Total in 2006 = 314 + 92 + 3 + 24 + 85 = 518 million Birr. Total in 2010 = 370 + 125 + 3.8 + 42 + 93 = 633.8 million Birr. Percentage = (518 / 633.8) × 100% ≈ 81.729% ≈ 81.73%."
  },
  {
    questionNumber: 45,
    grade: "Grade 9–11",
    topic: "Data Interpretation — Aggregate Percentage Calculation",
    difficulty: "medium",
    prompt: `${expenditureTable}\n\nQuestion:\n45. The total amount of bonus paid by the firm during the whole period is approximately what percent of the total amount of salary paid during this period?`,
    options: ["0.68", "0.72", "0.58", "0.62"],
    correctAnswer: "B",
    explanation: "Total Bonus (2006–2010) = 3 + 2.5 + 3.4 + 2.6 + 3.8 = 15.3 million Birr. Total Salary (2006–2010) = 314 + 258 + 732 + 450 + 370 = 2,124 million Birr. Percentage = (15.3 / 2124) × 100% ≈ 0.7203% ≈ 0.72%."
  },
  {
    questionNumber: 46,
    grade: "Grade 9–11",
    topic: "Data Interpretation — Ratio of Aggregate Expenditures",
    difficulty: "medium",
    prompt: `${expenditureTable}\n\nQuestion:\n46. What is the approximate ratio between the total expenditure on interest on loans for all the years and the total expenditure on fuel and transport for all the years?`,
    options: ["10:29", "10:26", "10:39", "10:36"],
    correctAnswer: "D",
    explanation: "Total Interest on Loans = 24 + 33 + 28 + 31 + 42 = 158 million Birr. Total Fuel & Transport = 92 + 110 + 131 + 104 + 125 = 562 million Birr. Ratio = 158 : 562 = 10 : (562 / 15.8) = 10 : 35.57 ≈ 10 : 36."
  },

  // Algebra, Quantitative Comparison, Probability & Modeling (Q47–Q60)
  {
    questionNumber: 47,
    grade: "Grade 11",
    topic: "Algebra — Simplification of Rational Expressions",
    difficulty: "medium",
    prompt: "Let x ≠ -2, x ≠ 3 and x ≠ -4/7. Then ( 2/(x + 2) + 5/(x - 3) ) ÷ ( (7x + 4)/(2x - 6) ) equals:",
    options: [
      "(7x - 1) / ((x + 2)(7x + 4))",
      "2 / (x + 2)",
      "(7x + 4) / (x + 2)",
      "3 / (x - 3)"
    ],
    correctAnswer: "B",
    explanation: "Combine the first terms: 2/(x + 2) + 5/(x - 3) = [2(x - 3) + 5(x + 2)] / [(x + 2)(x - 3)] = (7x + 4) / [(x + 2)(x - 3)]. Divide by (7x + 4)/[2(x - 3)]: [(7x + 4)/((x + 2)(x - 3))] × [2(x - 3)/(7x + 4)] = 2 / (x + 2)."
  },
  {
    questionNumber: 48,
    grade: "Grade 10",
    topic: "Algebra — Polynomial Long Division & Remainder Theorem",
    difficulty: "medium",
    prompt: "When the polynomial 5x⁴ - 2x³ + x² - x + 1 is divided by x² - 1, the remainder is:",
    options: [
      "-3x + 7",
      "(-3x + 7) / (x² - 1)",
      "(x² - 1) / (-3x + 7)",
      "5x² - 2x + 6"
    ],
    correctAnswer: "A",
    explanation: "Using polynomial remainder evaluation modulo x² - 1 = 0, substitute x² ≡ 1: P(x) ≡ 5(1)² - 2x(1) + (1) - x + 1 = 5 - 2x + 1 - x + 1 = -3x + 7."
  },
  {
    questionNumber: 49,
    grade: "Grade 9–11",
    topic: "Quantitative Comparison — Operations with Negative Numbers",
    difficulty: "easy",
    prompt: "Given that x and y are negative numbers.\n• Quantity A: x + y\n• Quantity B: x - y\nWhich of the following is true about the relationship between quantities A and B?",
    options: [
      "The relationship cannot be determined.",
      "The two quantities are equal.",
      "Quantity B is greater than quantity A.",
      "Quantity A is greater than quantity B."
    ],
    correctAnswer: "C",
    explanation: "Subtract Quantity A from Quantity B: (x - y) - (x + y) = -2y. Because y is negative (y < 0), -2y is strictly positive (-2y > 0). Therefore, Quantity B is strictly greater than Quantity A."
  },
  {
    questionNumber: 50,
    grade: "Grade 10",
    topic: "Quantitative Comparison — Exponential Estimation",
    difficulty: "hard",
    prompt: "Given that 2¹·⁵⁸⁹⁴ = 3.\n• Quantity A: 2⁴·³²⁷\n• Quantity B: 11\nHow are quantities A and B related?",
    options: [
      "The relationship cannot be determined.",
      "The two quantities are equal.",
      "Quantity B is greater than quantity A.",
      "Quantity A is greater than quantity B."
    ],
    correctAnswer: "D",
    explanation: "Since 2⁴ = 16, and the exponent 4.327 is greater than 4, Quantity A = 2⁴·³²⁷ > 2⁴ = 16 > 11. Specifically, 2⁴·³²⁷ ≈ 20.07 > 11. Therefore, Quantity A is greater than Quantity B."
  },
  {
    questionNumber: 51,
    grade: "Grade 9",
    topic: "Arithmetic — Part-to-Part Ratios",
    difficulty: "easy",
    prompt: "The red, green and black lollies in a packet are in the ratio 2:3:5. How many green and black lollies are there, if there are 10 red lollies?",
    options: [
      "15 green lollies and 25 black lollies",
      "6 green lollies and 15 black lollies",
      "30 green lollies and 50 black lollies",
      "25 green lollies and 15 black lollies"
    ],
    correctAnswer: "A",
    explanation: "Ratio Red : Green : Black = 2 : 3 : 5. If Red = 10, the common scaling factor is 10 / 2 = 5. Therefore, Green = 3 × 5 = 15, and Black = 5 × 5 = 25."
  },
  {
    questionNumber: 52,
    grade: "Grade 9",
    topic: "Percentages — Tip & Markup Calculation",
    difficulty: "easy",
    prompt: "At a restaurant the bill came to 82 birr. If you leave 119.72 birr, what percent tip is that?",
    options: ["38", "64", "46", "31.5"],
    correctAnswer: "C",
    explanation: "Tip amount = 119.72 - 82 = 37.72 Birr. Percent tip = (37.72 / 82) × 100% = 0.46 × 100% = 46%."
  },
  {
    questionNumber: 53,
    grade: "Grade 10",
    topic: "Exponential Modeling — Half-Life / Exponential Decay",
    difficulty: "easy",
    prompt: "Suppose the population of a town is given by the model P(t) = 17250(1/2)^(t/10), where t denotes the number of years since 2000. Which of the following statements is true?",
    options: [
      "The population doubles every ten years.",
      "The population in 2000 was 8625.",
      "The population is growing by 50% every ten years.",
      "The population is halved every ten years."
    ],
    correctAnswer: "D",
    explanation: "Every time t increases by 10 years, the exponent t/10 increases by 1, multiplying the town population by a factor of 1/2. Thus, the population halves every 10 years."
  },
  {
    questionNumber: 54,
    grade: "Grade 9 & 11",
    topic: "Probability — Sample Space of Two Fair Dice",
    difficulty: "easy",
    prompt: "Two six-sided dice are thrown together. What is the probability that the sum of the two numbers on top is 10?",
    options: ["1/2", "1/6", "1/12", "5/6"],
    correctAnswer: "C",
    explanation: "Total outcomes = 6 × 6 = 36. Favorable outcomes with sum 10 are (4,6), (5,5), and (6,4) (3 outcomes). Probability = 3 / 36 = 1 / 12."
  },
  {
    questionNumber: 55,
    grade: "Grade 9 & 11",
    topic: "Probability — Sampling with Replacement (Independent Events)",
    difficulty: "easy",
    prompt: "Nine identical balls numbered 1 through 9 are placed in a bag. A ball is randomly drawn and replaced. Then, a second ball is randomly drawn. What is the probability that the first ball drawn and the second ball drawn are both even numbered?",
    options: ["16/81", "8/81", "25/81", "20/81"],
    correctAnswer: "A",
    explanation: "Even numbers in {1, 2, ..., 9} are {2, 4, 6, 8} (4 numbers). Probability of drawing an even ball on any single draw is 4/9. Since the ball is replaced, the two draws are independent: P(both even) = (4/9) × (4/9) = 16/81."
  },
  {
    questionNumber: 56,
    grade: "Grade 9",
    topic: "Arithmetic — Fractional Decrease / Depreciation",
    difficulty: "easy",
    prompt: "Mesfin bought a laptop valued Birr 7700. One year later the value of the laptop is decreased by 2/7. What is the new value of the laptop?",
    options: ["4400 birr", "2200 birr", "9900 birr", "5500 birr"],
    correctAnswer: "D",
    explanation: "Decrease in value = (2/7) × 7700 = 2200 Birr. New value = 7700 - 2200 = 5500 Birr (or directly (1 - 2/7) × 7700 = (5/7) × 7700 = 5500 Birr)."
  },
  {
    questionNumber: 57,
    grade: "Grade 9",
    topic: "Percentages — Percentage Increase",
    difficulty: "easy",
    prompt: "Hamza spent 22 minutes on his English homework and 25.08 minutes on his Mathematics homework. What percent more time does Hamza spend on his Mathematics homework?",
    options: ["12", "14", "28", "87"],
    correctAnswer: "B",
    explanation: "Difference in time = 25.08 - 22 = 3.08 minutes. Percent more time = (3.08 / 22) × 100% = 0.14 × 100% = 14%."
  },
  {
    questionNumber: 58,
    grade: "Grade 11–12",
    topic: "Algebra — Modeling with Systems of Linear Inequalities",
    difficulty: "easy",
    prompt: "A student earns 13 birr per hour working for the computer center's help desk and 9.50 birr per hour working at the copy center. Because of her course load, she limits her work to 25 hours per week. She wants to earn at least 275 birr each week. Which of the following system of linear inequalities represents this information?",
    options: [
      "13x + 9.5y ≥ 275; x + y ≤ 25; x ≥ 0, y ≥ 0",
      "13x + 9.5y ≤ 275; x + y ≥ 25; x ≥ 0, y ≥ 0",
      "13x + 9.5y > 275; x + y ≤ 25; x ≥ 0, y ≥ 0",
      "13x + 9.5y < 275; x + y ≤ 25; x ≥ 0, y ≥ 0"
    ],
    correctAnswer: "A",
    explanation: "Let x = help desk hours (13 Birr/hr) and y = copy center hours (9.50 Birr/hr). Weekly hour limit: x + y ≤ 25. Minimum earnings requirement: 13x + 9.5y ≥ 275. Non-negative hours: x ≥ 0, y ≥ 0."
  },
  {
    questionNumber: 59,
    grade: "Grade 11–12",
    topic: "Algebra — Inconsistent Systems of Linear Inequalities",
    difficulty: "medium",
    prompt: "Consider the following system of linear inequalities:\nx - y ≤ 3\n3x - 3y ≥ d\nIf the solution set of the system is empty, which of the following numbers could be the value of d?",
    options: ["7", "5", "15", "8"],
    correctAnswer: "C",
    explanation: "Multiply the first inequality by 3: 3x - 3y ≤ 9. For the system 3x - 3y ≤ 9 and 3x - 3y ≥ d to be inconsistent (empty solution set), d must be strictly greater than 9. Among the options {7, 5, 15, 8}, only 15 is greater than 9."
  },
  {
    questionNumber: 60,
    grade: "Grade 9",
    topic: "Linear Modeling — Rate of Change (Slope) in Context",
    difficulty: "easy",
    prompt: "A Pediatrician uses the model h = 3.3a + 28.6 to estimate the height h of a boy, in inches, in terms of the boy's age a, in years, between the age of 2 and 5. Based on the model, what is the estimated increase, in inches, of the boy's height each year?",
    options: ["28.6", "14.3", "4.3", "3.3"],
    correctAnswer: "D",
    explanation: "In the linear relation h(a) = 3.3a + 28.6, the rate of change (slope) with respect to age a is 3.3. Thus, the boy's height increases by an estimated 3.3 inches each year."
  }
];

const targetPath = path.resolve(__dirname, "../seeds/data/sat_esslce_2014_booklet074.json");
fs.writeFileSync(targetPath, JSON.stringify(sat2014Questions, null, 2), "utf8");
console.log(`Generated ${sat2014Questions.length} SAT 2014 questions in ${targetPath}`);
