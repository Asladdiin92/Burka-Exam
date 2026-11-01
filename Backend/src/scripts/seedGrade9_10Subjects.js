import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";

export const grade9And10SubjectsData = [
  // ==========================================
  // GRADE 9 SUBJECTS
  // ==========================================
  {
    gradeLevel: "grade-9",
    code: "MATH_9",
    name: "Grade 9 Mathematics",
    stream: "both",
    description: "Grade 9 Mathematics curriculum covering sets, real number systems, equations, inequalities, trigonometry, polygons, similarity, vectors, and statistics.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Further on Sets",
        description: "Introduction to set definitions, descriptions, elements, and operations using Venn diagrams."
      },
      {
        order: 2,
        title: "Chapter 2: The Number System",
        description: "Introduction to natural numbers, integers, rational, irrational, and real numbers."
      },
      {
        order: 3,
        title: "Chapter 3: Solving Equations",
        description: "Introduction to solving linear equations in one and two variables, as well as non-linear equations."
      },
      {
        order: 4,
        title: "Chapter 4: Solving Inequalities",
        description: "Introduction to linear inequalities, systems of inequalities, and their applications."
      },
      {
        order: 5,
        title: "Chapter 5: Introduction to Trigonometry",
        description: "Introduction to right-angled triangles and basic trigonometric ratios (sine, cosine, tangent)."
      },
      {
        order: 6,
        title: "Chapter 6: Regular Polygons",
        description: "Introduction to the properties, interior angles, and exterior angles of convex and regular polygons."
      },
      {
        order: 7,
        title: "Chapter 7: Congruency and Similarity",
        description: "Introduction to the theorems of similar plane figures, ratios of perimeters, and areas."
      },
      {
        order: 8,
        title: "Chapter 8: Vectors in Two Dimensions",
        description: "Introduction to vector and scalar quantities, representation, and basic vector operations."
      },
      {
        order: 9,
        title: "Chapter 9: Statistics and Probability",
        description: "Introduction to collecting statistical data and calculating basic probabilities."
      }
    ]
  },
  {
    gradeLevel: "grade-9",
    code: "BIO_9",
    name: "Grade 9 Biology",
    stream: "natural",
    description: "Grade 9 Biology curriculum covering introduction to biology, classification of organisms, cell biology, reproduction, human health, nutrition, and disease.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Introduction to Biology",
        description: "Introduction to the definition of biology, the scientific method, and laboratory/field tools."
      },
      {
        order: 2,
        title: "Chapter 2: Characteristics and Classification of Organisms",
        description: "Introduction to the taxonomy of living things and the five-kingdom system of classification."
      },
      {
        order: 3,
        title: "Chapter 3: Cells",
        description: "Introduction to cell theory, observing cells under a microscope, cell organelles, and the cellular environment."
      },
      {
        order: 4,
        title: "Chapter 4: Reproduction",
        description: "Introduction to asexual and sexual reproduction, including human reproduction, fertilization, and birth control."
      },
      {
        order: 5,
        title: "Chapter 5: Human Health, Nutrition, and Disease",
        description: "Introduction to dietary needs, infectious diseases, and the human immune system."
      }
    ]
  },
  {
    gradeLevel: "grade-9",
    code: "PHYS_9",
    name: "Grade 9 Physics",
    stream: "natural",
    description: "Grade 9 Physics curriculum covering physics in human society, physical quantities, linear motion, force, work, energy, simple machines, oscillations, and heat.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Physics and Human Society",
        description: "Introduction to the branches of physics and how the subject relates to fields like engineering, geology, and medicine."
      },
      {
        order: 2,
        title: "Chapter 2: Physical Quantities",
        description: "Introduction to different types of scales, measurements, and unit conversions."
      },
      {
        order: 3,
        title: "Chapter 3: Motion in a Straight Line",
        description: "Introduction to one-dimensional kinematics, uniform motion, and acceleration."
      },
      {
        order: 4,
        title: "Chapter 4: Force, Work, Energy, and Power",
        description: "Introduction to Newton's laws of motion, mechanical work, and the conservation of energy."
      },
      {
        order: 5,
        title: "Chapter 5: Simple Machines",
        description: "Introduction to mechanical advantage, efficiency, and how basic tools multiply force."
      },
      {
        order: 6,
        title: "Chapter 6: Mechanical Oscillation and Sound Wave",
        description: "Introduction to the properties of waves, vibrations, and acoustics."
      },
      {
        order: 7,
        title: "Chapter 7: Temperature and Thermometer",
        description: "Introduction to heat energy, temperature scales, and the thermal expansion of matter."
      }
    ]
  },
  {
    gradeLevel: "grade-9",
    code: "CHEM_9",
    name: "Grade 9 Chemistry",
    stream: "natural",
    description: "Grade 9 Chemistry curriculum covering importance of chemistry, atomic structure, periodic classification, chemical bonding, and states of matter.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Chemistry and its Importance",
        description: "Introduction to the foundational concepts of chemistry and its real-world applications."
      },
      {
        order: 2,
        title: "Chapter 2: Structure of the Atom",
        description: "Introduction to subatomic particles (protons, neutrons, electrons) and atomic models."
      },
      {
        order: 3,
        title: "Chapter 3: Periodic Classification of Elements",
        description: "Introduction to the periodic table, element groups, and periodic trends."
      },
      {
        order: 4,
        title: "Chapter 4: Chemical Bonding",
        description: "Introduction to how atoms combine through ionic, covalent, and metallic bonds."
      },
      {
        order: 5,
        title: "Chapter 5: Physical States of Matter",
        description: "Introduction to the properties and behaviors of solids, liquids, and gases."
      }
    ]
  },
  {
    gradeLevel: "grade-9",
    code: "GEOG_9",
    name: "Grade 9 Geography",
    stream: "social",
    description: "Grade 9 Geography curriculum covering geological history, climate, natural resources, population, economic activities, environmental interactions, and inquiry skills of Ethiopia.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Geological History and Topography of Ethiopia",
        description: "Introduces the meaning and scope of geography, alongside Ethiopia's absolute location, geological formation processes, and major landforms."
      },
      {
        order: 2,
        title: "Chapter 2: Climate of Ethiopia",
        description: "Discusses the difference between weather and climate, and explores the major climatic regions and seasonal variations across Ethiopia."
      },
      {
        order: 3,
        title: "Chapter 3: Natural Resource Base of Ethiopia",
        description: "Introduces the major soil types, biotic resources (flora and fauna), and the distribution of water and mineral resources."
      },
      {
        order: 4,
        title: "Chapter 4: Population and Demographic Characteristics of Ethiopia",
        description: "Analyzes population structure, urban and rural settlement patterns, and the impacts of rapid population growth."
      },
      {
        order: 5,
        title: "Chapter 5: Major Economic and Cultural Activities in Ethiopia",
        description: "Explores primary economic activities, the role of subsistence and cash crop farming, and natural resource management."
      },
      {
        order: 6,
        title: "Chapter 6: Human-Natural Environment Interactions in Ethiopia",
        description: "Discusses the relationship between human activities and the physical environment, focusing on optimum population and resource use."
      },
      {
        order: 7,
        title: "Chapter 7: Contemporary Geographic Issues and Public Concerns in Ethiopia",
        description: "Highlights sustainable development, natural resource degradation, and integrated approaches to environmental challenges."
      },
      {
        order: 8,
        title: "Chapter 8: Geography Inquiry Skills and Techniques",
        description: "Introduces basic map reading, map sketching, and geospatial data concepts (like GIS and remote sensing)."
      }
    ]
  },
  {
    gradeLevel: "grade-9",
    code: "HIST_9",
    name: "Grade 9 History",
    stream: "social",
    description: "Grade 9 History curriculum covering human evolution, ancient civilizations, Ethiopian states through the 19th century, African history, and world revolutions.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: The Discipline of History and Human Evolution",
        description: "Defines historiography, historical sources, theories of human evolution, and the emergence of early states."
      },
      {
        order: 2,
        title: "Chapter 2: Ancient World Civilizations up to c. 500 AD",
        description: "Examines ancient civilizations in Africa (Egypt, Nubia), Asia (Mesopotamia, China), Latin America, and Europe."
      },
      {
        order: 3,
        title: "Chapter 3: Peoples and States in Ethiopia and the Horn to the end of 13th Century",
        description: "Explores linguistic and settlement patterns, pre-Aksumite states, the Aksumite Kingdom, and the Zagwe Dynasty."
      },
      {
        order: 4,
        title: "Chapter 4: The Middle Ages and Early Modern World, C. 500 to 1750s",
        description: "Covers the rise of Islam, early capitalism, the Renaissance, the Reformation, and the Age of Exploration."
      },
      {
        order: 5,
        title: "Chapter 5: Peoples and States of Africa to 1500",
        description: "Discusses state formations in North and West Africa, the spread of Islam, and trans-Saharan trade."
      },
      {
        order: 6,
        title: "Chapter 6: Africa and the Outside World 1500- 1880s",
        description: "Examines the transatlantic slave trade, European explorers, and the early contact between Africa and the outside world."
      },
      {
        order: 7,
        title: "Chapter 7: States, Principalities, Population Movements & Interactions in Ethiopia 13th to Mid-16th C",
        description: "Covers the Gadaa system, population movements, and the political integration of southern and central states."
      },
      {
        order: 8,
        title: "Chapter 8: Political, Social and Economic Processes in Ethiopia Mid-16th to Mid-19th C",
        description: "Discusses the Gondarine Period, the Zemene-Mesafint (Era of Warlords), and the Kingdom of Shewa."
      },
      {
        order: 9,
        title: "Chapter 9: The Age of Revolutions 1750s to 1815",
        description: "Examines the Industrial Revolution, the French Revolution, and the American War of Independence."
      }
    ]
  },
  {
    gradeLevel: "grade-9",
    code: "ECON_9",
    name: "Grade 9 Economics",
    stream: "social",
    description: "Grade 9 Economics curriculum covering economic fundamentals, systems, resources, supply and demand, production, money, macroeconomics, and entrepreneurship.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Introducing Economics",
        description: "Distinguishes between microeconomics and macroeconomics, and introduces decision-making units (households, firms, government)."
      },
      {
        order: 2,
        title: "Chapter 2: The Basic Economic Problems and Economic Systems",
        description: "Explores scarcity, opportunity cost, and how traditional, command, and market economies solve central economic problems."
      },
      {
        order: 3,
        title: "Chapter 3: Economic Resources and Markets",
        description: "Categorizes renewable and non-renewable resources, factor payments, and the circular flow of economic activities."
      },
      {
        order: 4,
        title: "Chapter 4: Introduction to Demand and Supply",
        description: "Defines the laws of demand and supply, market equilibrium, and the factors that cause shifts."
      },
      {
        order: 5,
        title: "Chapter 5: Introduction to Production and Cost",
        description: "Discusses inputs, outputs, production functions, and the different periods of production."
      },
      {
        order: 6,
        title: "Chapter 6: Introduction to Money",
        description: "Traces the evolution of money, its core functions, and introduces the concept of electronic money."
      },
      {
        order: 7,
        title: "Chapter 7: Introduction to Macroeconomics",
        description: "Defines macroeconomic variables such as GDP, inflation, unemployment, and economic growth."
      },
      {
        order: 8,
        title: "Chapter 8: Basic Entrepreneurship",
        description: "Explores the entrepreneurial mindset, innovation, and identifying business opportunities."
      }
    ]
  },
  {
    gradeLevel: "grade-9",
    code: "ENG_9",
    name: "Grade 9 English",
    stream: "both",
    description: "Grade 9 English (English for Ethiopia) curriculum focusing on communication skills, vocabulary, reading comprehension, grammar, and contextual writing.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Living in Urban Areas",
        description: "Explores urban life experiences, comparing rural and urban dynamics while developing vocabulary and speaking tasks centered on city challenges."
      },
      {
        order: 2,
        title: "Chapter 2: Study Skills",
        description: "Focuses on improving academic habits such as note-taking, scanning texts, organizing ideas, and applying effective learning strategies."
      },
      {
        order: 3,
        title: "Chapter 3: Traffic Accidents",
        description: "Raises awareness about road safety while using the theme to enhance reading comprehension, listening skills, and contextual grammar."
      },
      {
        order: 4,
        title: "Chapter 4: National Parks",
        description: "Engages students with texts and discussions about Ethiopia’s national parks (like Gambella), integrating nature vocabulary and informative writing."
      },
      {
        order: 5,
        title: "Chapter 5: Horticulture",
        description: "Introduces gardening and agriculture-related vocabulary, using it as a theme for practicing conditional sentences and reading fluency."
      },
      {
        order: 6,
        title: "Chapter 6: Poverty in Ethiopia",
        description: "Guides discussions on the socio-economic impacts of poverty, building vocabulary and helping students express complex ideas clearly through writing."
      },
      {
        order: 7,
        title: "Chapter 7: Community Services",
        description: "Explores the role and value of giving back to the community, enhancing contextual grammar and collaborative speaking tasks."
      },
      {
        order: 8,
        title: "Chapter 8: Communicable Diseases",
        description: "Leads lessons on common infectious diseases and health practices, helping students understand and apply health-related vocabulary."
      },
      {
        order: 9,
        title: "Chapter 9: Fairness and Equity",
        description: "Facilitates conversations on fairness, justice, and human rights while teaching past and present perfect tenses."
      },
      {
        order: 10,
        title: "Chapter 10: The Internet",
        description: "Explores the role and impact of computers and the internet in modern life, focusing on digital vocabulary and modern communication."
      }
    ]
  },

  // ==========================================
  // GRADE 10 SUBJECTS
  // ==========================================
  {
    gradeLevel: "grade-10",
    code: "MATH_10",
    name: "Grade 10 Mathematics",
    stream: "both",
    description: "Grade 10 Mathematics curriculum covering polynomial functions, exponential & logarithmic functions, inequalities, coordinate geometry, trigonometry, plane geometry, and measurement.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Polynomial Functions",
        description: "Introduction to theorems on polynomials, zeros of a function, and sketching polynomial graphs."
      },
      {
        order: 2,
        title: "Chapter 2: Exponential and Logarithmic Functions",
        description: "Introduction to the laws of exponents, logarithms, and graphing these functions."
      },
      {
        order: 3,
        title: "Chapter 3: Solving Inequalities",
        description: "Introduction to linear inequalities involving absolute value and quadratic inequalities."
      },
      {
        order: 4,
        title: "Chapter 4: Coordinate Geometry",
        description: "Introduction to the distance formula, division of line segments, and equations of parallel/perpendicular lines."
      },
      {
        order: 5,
        title: "Chapter 5: Trigonometric Functions",
        description: "Introduction to sine, cosine, tangent functions, reciprocal functions, and simple identities."
      },
      {
        order: 6,
        title: "Chapter 6: Plane Geometry",
        description: "Introduction to advanced theorems on triangles, special quadrilaterals, and circles."
      },
      {
        order: 7,
        title: "Chapter 7: Measurement",
        description: "Introduction to calculating the surface areas and volumes of prisms, cylinders, pyramids, cones, and spheres."
      }
    ]
  },
  {
    gradeLevel: "grade-10",
    code: "BIO_10",
    name: "Grade 10 Biology",
    stream: "natural",
    description: "Grade 10 Biology curriculum covering biotechnology, plant anatomy & transport, enzymes & proteins, cell cycle & division, nervous & endocrine systems, and ecological interactions.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Sub-fields of Biology",
        description: "Introduction to biotechnology, its traditional uses, and modern applications."
      },
      {
        order: 2,
        title: "Chapter 2: Plants",
        description: "Introduction to the internal structure of leaves, photosynthesis mechanisms, and plant transport systems."
      },
      {
        order: 3,
        title: "Chapter 3: Biochemical Molecules",
        description: "Introduction to the structure, properties, and functions of enzymes and proteins."
      },
      {
        order: 4,
        title: "Chapter 4: Cell Reproduction",
        description: "Introduction to the cell cycle and the detailed processes of mitosis and meiosis."
      },
      {
        order: 5,
        title: "Chapter 5: Human Biology",
        description: "Introduction to the nervous system, sense organs, endocrine glands, and maintaining homeostasis."
      },
      {
        order: 6,
        title: "Chapter 6: Ecological Interaction",
        description: "Introduction to ecosystems, biodiversity conservation, and human impacts on the environment."
      }
    ]
  },
  {
    gradeLevel: "grade-10",
    code: "PHYS_10",
    name: "Grade 10 Physics",
    stream: "natural",
    description: "Grade 10 Physics curriculum covering 2D kinematics, electrostatics, current electricity, electromagnetism, electronics, and electromagnetic waves & geometrical optics.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Motion in 2D",
        description: "Introduction to projectile motion, rotational dynamics, and Newton's law of universal gravitation."
      },
      {
        order: 2,
        title: "Chapter 2: Electrostatics",
        description: "Introduction to electric charges, electric forces, fields, and electric potential."
      },
      {
        order: 3,
        title: "Chapter 3: Current Electricity",
        description: "Introduction to Ohm's law, combinations of resistors, internal resistance, and safety rules."
      },
      {
        order: 4,
        title: "Chapter 4: Electromagnetism",
        description: "Introduction to magnetism, concepts of magnetic fields, and magnetic force."
      },
      {
        order: 5,
        title: "Chapter 5: Electronics",
        description: "Introduction to vacuum tube devices, conductors, insulators, semiconductors, and transistors."
      },
      {
        order: 6,
        title: "Chapter 6: Electromagnetic Waves and Geometrical Optics",
        description: "Introduction to the electromagnetic spectrum, reflection, and refraction of light."
      }
    ]
  },
  {
    gradeLevel: "grade-10",
    code: "CHEM_10",
    name: "Grade 10 Chemistry",
    stream: "natural",
    description: "Grade 10 Chemistry curriculum covering chemical equations & stoichiometry, solutions, acids, bases & salts, electrochemistry, metals & nonmetals, and organic hydrocarbons.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Chemical Reactions and Stoichiometry",
        description: "Introduction to balancing chemical equations and the mole concept."
      },
      {
        order: 2,
        title: "Chapter 2: Solutions",
        description: "Introduction to different types of solutions, concentration measurements, and solubility limits."
      },
      {
        order: 3,
        title: "Chapter 3: Important Inorganic Compounds",
        description: "Introduction to the properties and reactions of acids, bases, and salts."
      },
      {
        order: 4,
        title: "Chapter 4: Energy Changes and Electrochemistry",
        description: "Introduction to galvanic cells, electrolytic cells, and chemical energy."
      },
      {
        order: 5,
        title: "Chapter 5: Metals and Nonmetals",
        description: "Introduction to the extraction processes, properties, and uses of key metals and nonmetals."
      },
      {
        order: 6,
        title: "Chapter 6: Hydrocarbons and their Derivatives",
        description: "Introduction to the basics of organic chemistry and environmental impacts."
      }
    ]
  },
  {
    gradeLevel: "grade-10",
    code: "GEOG_10",
    name: "Grade 10 Geography",
    stream: "social",
    description: "Grade 10 Geography curriculum covering African landforms, climate zones, drainage & mineral resources, demographics, economic activities, and human-environment interactions.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Landforms of Africa",
        description: "Explores tectonic plate movements, external erosion processes, and the major physical landforms across the African continent."
      },
      {
        order: 2,
        title: "Chapter 2: Climate of Africa",
        description: "Discusses global climatic regions and the specific climate types and zones found throughout Africa."
      },
      {
        order: 3,
        title: "Chapter 3: Natural Resource Base of Africa",
        description: "Analyzes Africa's major drainage systems, water resources, soil types, minerals, vegetation, and wildlife."
      },
      {
        order: 4,
        title: "Chapter 4: Population of Africa",
        description: "Examines the demographic trends, spatial distribution, and settlement patterns of the African population."
      },
      {
        order: 5,
        title: "Chapter 5: Major Economic and Cultural Activities of Africa",
        description: "Explores the diverse economic sectors, agricultural practices, and cultural landscapes shaping the continent."
      },
      {
        order: 6,
        title: "Chapter 6: Human-Natural Environment Interactions",
        description: "Discusses global population change and how human societies in Africa interact with their natural surroundings."
      }
    ]
  },
  {
    gradeLevel: "grade-10",
    code: "HIST_10",
    name: "Grade 10 History",
    stream: "social",
    description: "Grade 10 History curriculum covering capitalism & nationalism, African colonialism, modern Ethiopian state-building & Battle of Adwa, World Wars, post-1945 developments, Ethiopian modern history, modern Africa, and Ethiopian heritage.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Development of Capitalism and Nationalism (1815 to 1914)",
        description: "Introduces the core features of capitalism, the impact of the Industrial Revolution, the rise of nationalist movements, the unification of Italy and Germany, and the American Civil War."
      },
      {
        order: 2,
        title: "Chapter 2: Africa and the Colonial Experience (1880s to 1960s)",
        description: "Explores the economic and political motives for European colonialism, the Scramble for Africa and the Berlin Conference, different colonial administrative policies, and early African resistance movements."
      },
      {
        order: 3,
        title: "Chapter 3: Social, Economic and Political Developments in Ethiopia (Mid-19th Century to 1941)",
        description: "Discusses long-distance trade, the process of modern state-building under Emperors Tewodros II, Yohannes IV, and Menelik II, external aggressions (including the historic Battle of Adwa), and internal power struggles."
      },
      {
        order: 4,
        title: "Chapter 4: Society and Politics in the Age of World Wars (1914 to 1945)",
        description: "Covers the causes and consequences of the First World War, the 1917 Russian Revolution, the Great Depression, the League of Nations, and the rise of Fascism, Nazism, and Militarism."
      },
      {
        order: 5,
        title: "Chapter 5: Global and Regional Developments Since 1945",
        description: "Examines the formation and mission of the United Nations, the emergence of superpowers, the Cold War dynamics in Asia, the Non-Aligned Movement, and the Arab-Israeli conflict."
      },
      {
        order: 6,
        title: "Chapter 6: Ethiopia: Internal Developments and External Influences (1941 to 1991)",
        description: "Details the post-liberation period and administrative reforms, early opposition movements against Imperial rule, the 1974 Ethiopian Revolution, the Ethio-Somalia War, and the ultimate fall of the Derg regime."
      },
      {
        order: 7,
        title: "Chapter 7: Africa Since 1960",
        description: "Highlights the rise of independent African states, the struggle against Apartheid in South Africa, the Pan-Africanism movement, the formation of the OAU, and the ongoing struggle for economic independence."
      },
      {
        order: 8,
        title: "Chapter 8: Post-1991 Developments in Ethiopia",
        description: "Analyzes the political landscape after 1991, including the Transitional Government of Ethiopia, the drafting of the 1995 Constitution, and the hydro-political history of the Nile Basin."
      },
      {
        order: 9,
        title: "Chapter 9: Indigenous Knowledge and Heritages of Ethiopia",
        description: "Explores the value of traditional knowledge systems for problem-solving and examines the diverse tangible and intangible cultural heritages found throughout Ethiopia."
      }
    ]
  },
  {
    gradeLevel: "grade-10",
    code: "ECON_10",
    name: "Grade 10 Economics",
    stream: "social",
    description: "Grade 10 Economics curriculum covering consumer behaviour, demand and supply, production and cost, market structures, banking and finance, economic growth, the Ethiopian economy, and business startups.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Theory of Consumer Behaviour",
        description: "Introduces the principles of consumer choice, utility, and decision-making."
      },
      {
        order: 2,
        title: "Chapter 2: Theories of Demand and Supply",
        description: "Deepens the understanding of market forces, elasticity, and price mechanisms."
      },
      {
        order: 3,
        title: "Chapter 3: Theories of Production and Cost",
        description: "Analyzes the relationship between inputs, outputs, and the costs of production for firms."
      },
      {
        order: 4,
        title: "Chapter 4: Market Structure",
        description: "Examines different types of market environments, such as perfect competition, monopoly, and oligopoly."
      },
      {
        order: 5,
        title: "Chapter 5: Banking and Finance",
        description: "Explores the financial system, banking institutions, and monetary policy."
      },
      {
        order: 6,
        title: "Chapter 6: Economic Growth",
        description: "Discusses the drivers of economic growth, development, and measuring national prosperity."
      },
      {
        order: 7,
        title: "Chapter 7: The Ethiopian Economy",
        description: "Covers GDP components, the agricultural and industrial sectors, and the specific economic landscape of Ethiopia."
      },
      {
        order: 8,
        title: "Chapter 8: Business Startups and Innovation",
        description: "Examines business formation, feasibility analysis, types of business organizations, and innovation."
      }
    ]
  },
  {
    gradeLevel: "grade-10",
    code: "ENG_10",
    name: "Grade 10 English",
    stream: "both",
    description: "Grade 10 English (English for Ethiopia) curriculum developing communication skills, vocabulary, reading comprehension, debate, report writing, and media literacy.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Population Growth",
        description: "Explores the challenges of rapid population growth, environmental degradation, and their links to food insecurity and poverty."
      },
      {
        order: 2,
        title: "Chapter 2: Travel Behaviours",
        description: "Focuses on transportation, travel experiences, and tourist scenarios to build vocabulary and related communication strategies."
      },
      {
        order: 3,
        title: "Chapter 3: Punctuality",
        description: "Highlights the importance of time management, daily routines, and social norms in education and the workplace."
      },
      {
        order: 4,
        title: "Chapter 4: Tourist Attractions",
        description: "Covers global and Ethiopian tourist attractions, teaching students how to describe places, provide directions, and write brochures."
      },
      {
        order: 5,
        title: "Chapter 5: Honey Processing",
        description: "Explores the cultural, economic, and health aspects of traditional and modern honey production in agricultural contexts."
      },
      {
        order: 6,
        title: "Chapter 6: Migration",
        description: "Focuses on the causes and effects of internal and external migration, guiding debates, graph interpretation, and report writing."
      },
      {
        order: 7,
        title: "Chapter 7: Identity",
        description: "Explores cultural identity, self-expression, and national branding through socio-economic and historical lenses."
      },
      {
        order: 8,
        title: "Chapter 8: The Healing Power of Plants",
        description: "Discusses traditional medicine, Ethiopia's biodiversity, and the scientific and cultural use of medicinal plants like Moringa."
      },
      {
        order: 9,
        title: "Chapter 9: Multilingualism",
        description: "Examines the cognitive benefits of speaking multiple languages and discusses Ethiopia's diverse linguistic landscape."
      },
      {
        order: 10,
        title: "Chapter 10: Digital vs. Satellite Television",
        description: "Focuses on tech-focused informative writing, comparing digital and satellite media platforms and their societal impacts."
      }
    ]
  }
];

export async function seedGrade9And10Subjects() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding Grade 9 & Grade 10 Subjects and Chapters...");
  console.log("===============================================================\n");

  let totalSubjectsCreated = 0;
  let totalSubjectsUpdated = 0;
  let totalChaptersCreated = 0;
  let totalChaptersUpdated = 0;

  for (const sData of grade9And10SubjectsData) {
    let subject = await Subject.findOne({ code: sData.code });
    if (!subject) {
      subject = await Subject.create({
        name: sData.name,
        code: sData.code,
        gradeLevel: sData.gradeLevel,
        stream: sData.stream,
        description: sData.description,
        isActive: true
      });
      totalSubjectsCreated++;
      console.log(`[CREATED SUBJECT] ${subject.name} (${subject.code}) - ${subject.gradeLevel} [${subject.stream}]`);
    } else {
      subject.name = sData.name;
      subject.gradeLevel = sData.gradeLevel;
      subject.stream = sData.stream;
      subject.description = sData.description;
      subject.isActive = true;
      await subject.save();
      totalSubjectsUpdated++;
      console.log(`[UPDATED SUBJECT] ${subject.name} (${subject.code}) - ${subject.gradeLevel} [${subject.stream}]`);
    }

    // Process chapters for this subject
    for (const cData of sData.chapters) {
      let chapter = await Chapter.findOne({
        subjectId: subject._id,
        order: cData.order
      });

      if (!chapter) {
        chapter = await Chapter.create({
          subjectId: subject._id,
          title: cData.title,
          description: cData.description,
          order: cData.order,
          isActive: true
        });
        totalChaptersCreated++;
        console.log(`   + [CREATED CHAPTER] ${cData.title}`);
      } else {
        chapter.title = cData.title;
        chapter.description = cData.description;
        chapter.isActive = true;
        await chapter.save();
        totalChaptersUpdated++;
        console.log(`   * [UPDATED CHAPTER] ${cData.title}`);
      }
    }
    console.log("");
  }

  console.log("===============================================================");
  console.log("SUMMARY OF SEEDING OPERATION:");
  console.log(`Subjects: ${totalSubjectsCreated} created, ${totalSubjectsUpdated} updated (Total: ${grade9And10SubjectsData.length})`);
  console.log(`Chapters: ${totalChaptersCreated} created, ${totalChaptersUpdated} updated (Total: ${totalChaptersCreated + totalChaptersUpdated})`);
  console.log("===============================================================\n");
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedGrade9And10Subjects();
  } catch (err) {
    console.error("Error during Grade 9-10 seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedGrade9_10Subjects")) {
  runStandalone();
}
