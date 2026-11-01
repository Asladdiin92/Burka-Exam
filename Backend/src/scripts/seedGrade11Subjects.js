import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";

export const grade11SubjectsData = [
  // ==========================================
  // COMMON SUBJECTS (BOTH STREAMS)
  // ==========================================
  {
    gradeLevel: "grade-11",
    code: "MATH_11",
    name: "Grade 11 Mathematics",
    stream: "both",
    description: "Grade 11 Mathematics curriculum covering relations & functions, rational functions, coordinate geometry, mathematical reasoning, statistics & probability, matrices & determinants, and vectors & transformations.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Relations and Functions",
        description: "Introduces the foundational concepts of mappings, domains, ranges, and the behavior of inverse and composite functions."
      },
      {
        order: 2,
        title: "Chapter 2: Rational Expressions and Rational Functions",
        description: "Covers the simplification of rational expressions, solving rational equations, and sketching rational function graphs."
      },
      {
        order: 3,
        title: "Chapter 3: Coordinate Geometry",
        description: "Explores the mathematics of straight lines, and conic sections (circles, parabolas, ellipses, and hyperbolas)."
      },
      {
        order: 4,
        title: "Chapter 4: Mathematical Reasoning",
        description: "Introduces mathematical logic, propositions, truth values, and logical connectives."
      },
      {
        order: 5,
        title: "Chapter 5: Statistics and Probability",
        description: "Covers data representation, measures of central tendency, dispersion, and basic probability theory."
      },
      {
        order: 6,
        title: "Chapter 6: Matrices and Determinants",
        description: "Introduces matrix operations (addition, multiplication), calculating determinants, and applying Cramer's rule to solve linear equations."
      },
      {
        order: 7,
        title: "Chapter 7: Vectors and Transformation of the Plane",
        description: "Discusses vector algebra, scalar products, and geometric transformations like reflections and rotations."
      }
    ]
  },
  {
    gradeLevel: "grade-11",
    code: "ENG_11",
    name: "Grade 11 English",
    stream: "both",
    description: "Grade 11 English for Ethiopia curriculum developing listening, reading comprehension, vocabulary inference, grammar, summarizing, debating, and academic writing.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Environmental Hazards",
        description: "Explores causes and impacts of environmental hazards while developing listening skills, vocabulary inference, and grammar (clauses of concession)."
      },
      {
        order: 2,
        title: "Chapter 2: Civilization",
        description: "Covers cultural development and ancient civilizations, teaching students how to summarize texts, express preferences, and use relative clauses."
      },
      {
        order: 3,
        title: "Chapter 3: Causes of Road Traffic Accidents",
        description: "Examines the reasons behind traffic accidents to build skimming/scanning skills, cause-and-effect writing, and adverbial clauses of reason."
      },
      {
        order: 4,
        title: "Chapter 4: People and Nature",
        description: "Explores human interaction with the environment, focusing on conservation, presentation skills, and expository paragraph writing."
      },
      {
        order: 5,
        title: "Chapter 5: Irrigation",
        description: "Focuses on agricultural irrigation systems to develop listening for detail, synthesizing texts, and understanding gerunds and infinitives."
      },
      {
        order: 6,
        title: "Chapter 6: Global Warming",
        description: "Addresses the effects of global warming, helping students write compare-and-contrast essays and use conditional clauses."
      },
      {
        order: 7,
        title: "Chapter 7: Patriotism",
        description: "Discusses national pride and heroism, guiding students in debating, writing narrative essays, and mastering reported speech."
      },
      {
        order: 8,
        title: "Chapter 8: Efficiency of Health Services",
        description: "Examines the role of healthcare systems, focusing on argumentative writing, panel discussions, and quantifiers."
      },
      {
        order: 9,
        title: "Chapter 9: Indigenous Conflict",
        description: "Explores traditional methods of resolving conflict, teaching summary writing, thesis identification, and phrasal verbs."
      },
      {
        order: 10,
        title: "Chapter 10: Artificial Intelligence",
        description: "Introduces AI concepts and implications, focusing on note-taking, descriptive essay writing, and present progressive tenses."
      }
    ]
  },

  // ==========================================
  // NATURAL SCIENCE STREAM
  // ==========================================
  {
    gradeLevel: "grade-11",
    code: "PHYS_11",
    name: "Grade 11 Physics",
    stream: "natural",
    description: "Grade 11 Physics curriculum covering human society and measurements, vectors, 1D and 2D kinematics, dynamics, heat conduction and calorimetry, electrostatics and DC circuits, and nuclear physics.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Physics and Human Society",
        description: "Introduces the role of physics in engineering, medicine, and other fields, alongside basic measurement principles."
      },
      {
        order: 2,
        title: "Chapter 2: Vectors",
        description: "Covers vector and scalar quantities, vector addition, and cross/dot products in physics applications."
      },
      {
        order: 3,
        title: "Chapter 3: Motion in One and Two Dimensions",
        description: "Explores kinematics, uniform acceleration, projectile motion, and circular motion."
      },
      {
        order: 4,
        title: "Chapter 4: Dynamics",
        description: "Introduces Newton's laws of motion, friction, conservation of momentum, and the relationship between work, energy, and power."
      },
      {
        order: 5,
        title: "Chapter 5: Heat Conduction and Calorimetry",
        description: "Discusses temperature scales, heat transfer (conduction, convection, radiation), specific heat capacity, and changes of state."
      },
      {
        order: 6,
        title: "Chapter 6: Electrostatics and Electric Circuit",
        description: "Explores Coulomb’s law, electric fields, potential difference, capacitance, and basic direct current (DC) circuits."
      },
      {
        order: 7,
        title: "Chapter 7: Nuclear Physics",
        description: "Introduces the structure of the nucleus, radioactivity, half-life, and the basic principles of nuclear fission and fusion."
      }
    ]
  },
  {
    gradeLevel: "grade-11",
    code: "CHEM_11",
    name: "Grade 11 Chemistry",
    stream: "natural",
    description: "Grade 11 Chemistry curriculum covering atomic structure & periodic properties, chemical bonding & geometry, physical states of matter, chemical kinetics, chemical equilibrium, and oxygen-containing organic compounds.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Atomic Structure and Periodic Properties of the Elements",
        description: "Introduces quantum mechanical models, electron configurations, and trends like ionization energy."
      },
      {
        order: 2,
        title: "Chapter 2: Chemical Bonding",
        description: "Explores ionic, covalent, and metallic bonds, molecular geometry (VSEPR theory), and intermolecular forces."
      },
      {
        order: 3,
        title: "Chapter 3: Physical States of Matter",
        description: "Discusses the kinetic molecular theory, gas laws (Boyle's, Charles's, Ideal Gas), and properties of liquids and solids."
      },
      {
        order: 4,
        title: "Chapter 4: Chemical Kinetics",
        description: "Explores reaction rates, collision theory, activation energy, and the factors that influence how fast a reaction occurs."
      },
      {
        order: 5,
        title: "Chapter 5: Chemical Equilibrium",
        description: "Covers reversible reactions, equilibrium constants, and Le Chatelier's Principle regarding shifts in pressure and temperature."
      },
      {
        order: 6,
        title: "Chapter 6: Some Important Oxygen-Containing Organic Compounds",
        description: "Introduces the nomenclature, structures, and reactions of alcohols, ethers, aldehydes, ketones, and carboxylic acids."
      }
    ]
  },
  {
    gradeLevel: "grade-11",
    code: "BIO_11",
    name: "Grade 11 Biology",
    stream: "natural",
    description: "Grade 11 Biology curriculum covering biology & technology, animal/plant reproduction & embryonic development, enzymes & proteins, Mendelian genetics, human body systems, and population & natural resources ecology.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Biology and Technology",
        description: "Introduces the practical applications of biology, such as medical testing (scans, diagnostics), tracking, and biotechnology."
      },
      {
        order: 2,
        title: "Chapter 2: Reproduction and Embryonic Development",
        description: "Explores animal and plant reproductive systems, early embryonic stages (like cleavage and gastrulation), and reproductive health."
      },
      {
        order: 3,
        title: "Chapter 3: Enzymes and Proteins",
        description: "Covers the primary, secondary, and tertiary structures of proteins, alongside the classification and mechanisms of biological catalysts."
      },
      {
        order: 4,
        title: "Chapter 4: Genetics",
        description: "Introduces Mendelian genetics, monohybrid/dihybrid crosses, codominance, and the genotypic/phenotypic ratios of inheritance."
      },
      {
        order: 5,
        title: "Chapter 5: The Human Body Systems",
        description: "Covers the anatomical structures of the human body, the skeletal system, and infectious diseases (including STIs)."
      },
      {
        order: 6,
        title: "Chapter 6: Population and Natural Resources",
        description: "Explores ecology, survivorship curves, population regulation factors (density-dependent and independent), and conservation."
      }
    ]
  },

  // ==========================================
  // SOCIAL SCIENCE STREAM
  // ==========================================
  {
    gradeLevel: "grade-11",
    code: "ECON_11",
    name: "Grade 11 Economics",
    stream: "social",
    description: "Grade 11 Economics curriculum covering consumer behavior & demand, firm decisions & market structures, national income accounting (GDP/GNP), consumption, saving & investment, international trade & finance, economic development metrics, and Ethiopian sectoral policies.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Theory of Consumer Behavior and Demand",
        description: "Introduces the fundamental principles of consumer choice, indifference curves, and the law of demand."
      },
      {
        order: 2,
        title: "Chapter 2: Market Structure and the Decision of Firms",
        description: "Explores different market environments, including perfect competition, monopoly, monopolistic competition, and oligopoly."
      },
      {
        order: 3,
        title: "Chapter 3: National Income Accounting",
        description: "Covers macroeconomic measurements, such as Gross Domestic Product (GDP), Gross National Product (GNP), and how to distinguish between real and nominal GDP."
      },
      {
        order: 4,
        title: "Chapter 4: Consumption, Saving, and Investment",
        description: "Introduces the economic relationships between household consumption, savings behaviors, and the macroeconomic role of investment."
      },
      {
        order: 5,
        title: "Chapter 5: Trade and Finance",
        description: "Discusses international trade theories (including absolute and comparative advantage), foreign exchange, and balance of payments."
      },
      {
        order: 6,
        title: "Chapter 6: Economic Development",
        description: "Explores the multidimensional aspects of economic growth versus economic development, utilizing metrics like the Human Development Index (HDI)."
      },
      {
        order: 7,
        title: "Chapter 7: Main Sectors, Sectorial Policies and Strategies of Ethiopia",
        description: "Examines Ethiopia's historical and contemporary economic strategies, such as ADLI (Agricultural Development-Led Industrialization) and the transition toward industrial parks."
      }
    ]
  },
  {
    gradeLevel: "grade-11",
    code: "GEOG_11",
    name: "Grade 11 Geography",
    stream: "social",
    description: "Grade 11 Geography curriculum covering continental formation, global climate classification (Köppen & indigenous), resource conflicts & Nile basin, global demographics, economic geography, global environmental changes, and geospatial information systems (GIS).",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Formation of Continents",
        description: "Introduces the geological timescale, the origin of the Earth, and the theory of continental drift (such as the splitting of Pangaea into Gondwanaland and Laurasia)."
      },
      {
        order: 2,
        title: "Chapter 2: Climate Classification and Climate Regions of Our World",
        description: "Explores global climate systems, Köppen's climate classification, and indigenous climate classification methods specific to Ethiopia."
      },
      {
        order: 3,
        title: "Chapter 3: Natural Resources and Conflicts Over Resources",
        description: "Discusses land management, resource depletion, and regional cooperation regarding transboundary rivers like the Nile."
      },
      {
        order: 4,
        title: "Chapter 4: Global Population Changes and Challenges",
        description: "Analyzes the drivers behind accelerated global population growth, international migrations, and demographic policies."
      },
      {
        order: 5,
        title: "Chapter 5: Geography and Economic Development",
        description: "Explores how geographic location impacts economic success, the specific disadvantages of landlocked countries, and intraregional trade within Africa."
      },
      {
        order: 6,
        title: "Chapter 6: Major Global Environmental Changes",
        description: "Focuses on persistent global environmental problems, sustainable development, and the nexus between poverty and environmental degradation."
      },
      {
        order: 7,
        title: "Chapter 7: Geographic Issues and Concerns",
        description: "Addresses contemporary socio-environmental challenges such as desertification, recurrent drought, deforestation, and the global digital divide."
      },
      {
        order: 8,
        title: "Chapter 8: Geo-spatial Information and Data Processing",
        description: "Introduces advanced map reading for representing relief features and the foundational tools of Geographical Information Systems (GIS)."
      }
    ]
  },
  {
    gradeLevel: "grade-11",
    code: "HIST_11",
    name: "Grade 11 History",
    stream: "social",
    description: "Grade 11 History curriculum covering historiography & human evolution, ancient civilizations, peoples and states of Ethiopia & Horn of Africa, medieval era, African kingdoms to 1500, trans-Saharan/transatlantic trade, Ethiopian history (13th-19th C), and world revolutions.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: History, Historiography, and Human Evolution",
        description: "Explains the discipline of history, the historian's craft, and scientific theories regarding the early development of human beings."
      },
      {
        order: 2,
        title: "Chapter 2: Major Spots of Ancient World Civilizations",
        description: "Examines the social, economic, and political structures of early global civilizations up to circa 500 AD."
      },
      {
        order: 3,
        title: "Chapter 3: Peoples and States in Ethiopia and the Horn",
        description: "Details the early linguistic patterns, demographic settlements, and ancient political formations in the Horn of Africa."
      },
      {
        order: 4,
        title: "Chapter 4: The Medieval Period or The Middle Ages",
        description: "Covers global dynamics during the Middle Ages, the rise of major world religions, and medieval societal structures."
      },
      {
        order: 5,
        title: "Chapter 5: Peoples and States of Africa to 1500",
        description: "Explores state formations, the spread of Islam, and complex trans-Saharan trade networks across the African continent prior to European colonial contact."
      },
      {
        order: 6,
        title: "Chapter 6: Africa and the Outside World (1500–1880s)",
        description: "Discusses the transatlantic slave trade, European exploration, and the changing socio-economic dynamics between Africa and the rest of the world."
      },
      {
        order: 7,
        title: "Chapter 7: States, Principalities, and Population Movements in Ethiopia (13th to Mid-16th Century)",
        description: "Details internal political shifts, territorial expansion, the Gadaa system, and key population movements in Ethiopian history."
      },
      {
        order: 8,
        title: "Chapter 8: Political, Social and Economic Processes in Ethiopia (Mid-16th to Mid-19th Century)",
        description: "Examines the Gondarine period, the Zemene-Mesafint (Era of Princes), and shifting regional power dynamics."
      },
      {
        order: 9,
        title: "Chapter 9: The Age of Revolutions (1750s to 1815)",
        description: "Concludes with a global look at the Industrial Revolution, the French Revolution, the American War of Independence, and the dawn of modern democratic ideals."
      }
    ]
  }
];

export async function seedGrade11Subjects() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding Grade 11 Subjects and Chapters...");
  console.log("===============================================================\n");

  let totalSubjectsCreated = 0;
  let totalSubjectsUpdated = 0;
  let totalChaptersCreated = 0;
  let totalChaptersUpdated = 0;

  for (const sData of grade11SubjectsData) {
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
  console.log("SUMMARY OF GRADE 11 SEEDING OPERATION:");
  console.log(`Subjects: ${totalSubjectsCreated} created, ${totalSubjectsUpdated} updated (Total: ${grade11SubjectsData.length})`);
  console.log(`Chapters: ${totalChaptersCreated} created, ${totalChaptersUpdated} updated (Total: ${totalChaptersCreated + totalChaptersUpdated})`);
  console.log("===============================================================\n");
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedGrade11Subjects();
  } catch (err) {
    console.error("Error during Grade 11 seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedGrade11Subjects")) {
  runStandalone();
}
