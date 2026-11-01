import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";

export const grade12SubjectsData = [
  // ==========================================
  // COMMON SUBJECTS (BOTH STREAMS)
  // ==========================================
  {
    gradeLevel: "grade-12",
    code: "MATH_12",
    name: "Grade 12 Mathematics",
    stream: "both",
    description: "Grade 12 Mathematics curriculum covering sequences and series, introduction to calculus, statistics and variability, linear programming, and business mathematical applications.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Sequences and Series",
        description: "Introduces arithmetic and geometric progressions, calculating the nth term, and inserting arithmetic means."
      },
      {
        order: 2,
        title: "Chapter 2: Introduction to Calculus",
        description: "Covers the geometric meaning of rates of change, limits, and the foundations of differential calculus."
      },
      {
        order: 3,
        title: "Chapter 3: Statistics",
        description: "Explores data dispersion (absolute vs. relative), measures of variability (range, standard deviation), and probability rules for mutually exclusive events."
      },
      {
        order: 4,
        title: "Chapter 4: Introduction to Linear Programming",
        description: "Introduces graphing linear inequalities and optimizing objective functions for real-world constraints."
      },
      {
        order: 5,
        title: "Chapter 5: Mathematical Applications in Business",
        description: "Applies mathematics to finance, exploring topics like interest, annuities, and cost-profit analysis."
      }
    ]
  },
  {
    gradeLevel: "grade-12",
    code: "ENG_12",
    name: "Grade 12 English",
    stream: "both",
    description: "Grade 12 English for Ethiopia curriculum covering sustainable development, time management, road safety, natural resource management, mechanized farming, green economies, patriotism, telemedicine, conflict management, and robotics.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Sustainable Development",
        description: "Explores global economic and human development goals."
      },
      {
        order: 2,
        title: "Chapter 2: Time Management",
        description: "Focuses on the importance of routines, punctuality, and related vocabulary."
      },
      {
        order: 3,
        title: "Chapter 3: Evidence on Road Traffic Accidents",
        description: "Discusses the causes of traffic accidents and analytical reading."
      },
      {
        order: 4,
        title: "Chapter 4: Natural Resource Management",
        description: "Covers environmental conservation and human interaction with nature."
      },
      {
        order: 5,
        title: "Chapter 5: Mechanized Farming",
        description: "Introduces the transition to modern agricultural technology and its impacts."
      },
      {
        order: 6,
        title: "Chapter 6: Green Economies",
        description: "Explores sustainable economic systems that reduce environmental risks."
      },
      {
        order: 7,
        title: "Chapter 7: National Pride",
        description: "Discusses patriotism, cultural identity, and heroism in Ethiopia."
      },
      {
        order: 8,
        title: "Chapter 8: Telemedicine",
        description: "Focuses on the intersection of healthcare and digital technology."
      },
      {
        order: 9,
        title: "Chapter 9: Conflict Management",
        description: "Examines methods and communication strategies for resolving disputes."
      },
      {
        order: 10,
        title: "Chapter 10: Robotics",
        description: "Introduces modern technological advancements in AI and robotics, alongside technical writing."
      }
    ]
  },

  // ==========================================
  // NATURAL SCIENCE STREAM
  // ==========================================
  {
    gradeLevel: "grade-12",
    code: "PHYS_12",
    name: "Grade 12 Physics",
    stream: "natural",
    description: "Grade 12 Physics curriculum covering physics applications across other fields, two-dimensional motion and gravitation, fluid mechanics, electromagnetism and induction, and solid-state basic electronics.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Application of Physics in Other Fields",
        description: "Demonstrates the relevance of physics across disciplines like engineering, medicine, defense, and communication."
      },
      {
        order: 2,
        title: "Chapter 2: Two-Dimensional Motion",
        description: "Provides structured approaches to projectile motion, rotational kinematics, planetary orbits, and Newtonian gravitation."
      },
      {
        order: 3,
        title: "Chapter 3: Fluid Mechanics",
        description: "Covers absolute and gauge pressure, buoyancy, fluid dynamics, and Bernoulli's principle."
      },
      {
        order: 4,
        title: "Chapter 4: Electromagnetism",
        description: "Explores Faraday's Law of Induction, magnetic flux, transformers, and real-life electromagnetic applications."
      },
      {
        order: 5,
        title: "Chapter 5: Basic Electronics",
        description: "Introduces solid-state physics, focusing on semiconductors, diodes, transistors, and fundamental logic circuits."
      }
    ]
  },
  {
    gradeLevel: "grade-12",
    code: "CHEM_12",
    name: "Grade 12 Chemistry",
    stream: "natural",
    description: "Grade 12 Chemistry curriculum covering acid-base equilibrium and buffer solutions, electrochemistry and redox reactions, industrial chemistry production, polymers, and environmental green chemistry.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Acid-Base Equilibrium",
        description: "Covers Arrhenius, Brønsted-Lowry, and Lewis acid-base concepts, pH/pOH, buffer solutions, and salt hydrolysis."
      },
      {
        order: 2,
        title: "Chapter 2: Electrochemistry",
        description: "Introduces oxidation-reduction reactions, galvanic cells, electrolysis, and Faraday's laws of electrolysis."
      },
      {
        order: 3,
        title: "Chapter 3: Industrial Chemistry",
        description: "Discusses raw materials and the large-scale production of chemicals like ammonia, nitric acid, and sodium compounds."
      },
      {
        order: 4,
        title: "Chapter 4: Polymers",
        description: "Introduces polymerization reactions and classifies different types of synthetic and natural polymers."
      },
      {
        order: 5,
        title: "Chapter 5: Introduction to Environmental Chemistry",
        description: "Examines natural environmental cycles, pollution issues, green chemistry, and cleaner production principles."
      }
    ]
  },
  {
    gradeLevel: "grade-12",
    code: "BIO_12",
    name: "Grade 12 Biology",
    stream: "natural",
    description: "Grade 12 Biology curriculum covering societal applications of biology, microorganism diversity and ecology, cellular respiration and photosynthesis energy transformations, evolution and speciation, human organ systems and homeostasis, and greenhouse gas climate change.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Application of Biology",
        description: "Explores how biological principles solve societal challenges in agriculture (like GMOs vs. transgenic organisms), medicine, and nutrition security."
      },
      {
        order: 2,
        title: "Chapter 2: Microorganisms",
        description: "Introduces the structure, diversity, and ecological roles of bacteria, viruses, and fungi."
      },
      {
        order: 3,
        title: "Chapter 3: Energy Transformation",
        description: "Covers cellular respiration, photosynthesis, and how energy flows through biological ecosystems."
      },
      {
        order: 4,
        title: "Chapter 4: Evolution",
        description: "Explores natural selection, speciation (allopatric/sympatric), and patterns of divergent/convergent evolution."
      },
      {
        order: 5,
        title: "Chapter 5: Human Body System",
        description: "Details the structure and homeostatic control mechanisms of major organs, including the cerebrum, hypothalamus, and brainstem."
      },
      {
        order: 6,
        title: "Chapter 6: Climate Change",
        description: "Focuses on the causes of greenhouse gas emissions (like methane and nitrous oxide) and strategies for environmental adaptation."
      }
    ]
  },

  // ==========================================
  // SOCIAL SCIENCE STREAM
  // ==========================================
  {
    gradeLevel: "grade-12",
    code: "GEOG_12",
    name: "Grade 12 Geography",
    stream: "social",
    description: "Grade 12 Geography curriculum covering plate tectonics processes, climate change dynamics, conflict management over natural resources, demographic policies, development challenges, environmental solutions, global concerns, and GIS map-making.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Major Geological Processes Associated with Plate Tectonics",
        description: "Explains the continental drift theory, types of plate boundaries, and their resulting geological processes like folding, faulting, and earthquakes."
      },
      {
        order: 2,
        title: "Chapter 2: Climate Change",
        description: "Analyzes the causes, global trends, consequences, and response strategies related to changing climate patterns."
      },
      {
        order: 3,
        title: "Chapter 3: Management of Conflict Over Resources",
        description: "Introduces the governance of natural resources, resource use policies, and indigenous conflict resolution practices."
      },
      {
        order: 4,
        title: "Chapter 4: Population Policies, Programs and the Environment",
        description: "Explores theories on population growth, policies to curb rapid growth, and their links to socio-economic development."
      },
      {
        order: 5,
        title: "Chapter 5: Challenges of Economic Development",
        description: "Discusses the multiple faces of global poverty, globalization, and growing imbalances between countries."
      },
      {
        order: 6,
        title: "Chapter 6: Solutions to Environmental and Sustainability Problems",
        description: "Identifies key global environmental problems and highlights the role of environmental education and indigenous practices."
      },
      {
        order: 7,
        title: "Chapter 7: Contemporary Global Geographic Issues and Public Concerns",
        description: "Focuses on critical issues like desertification, drought, and famine alongside policy responses."
      },
      {
        order: 8,
        title: "Chapter 8: Geographical Enquiry and Map Making",
        description: "Introduces geospatial research techniques, data collection, and practical map-making using Geographic Information Systems (GIS)."
      }
    ]
  },
  {
    gradeLevel: "grade-12",
    code: "HIST_12",
    name: "Grade 12 History",
    stream: "social",
    description: "Grade 12 History curriculum covering capitalism & nationalism (1815-1914), colonial Africa & resistance, modern Ethiopian state-building & trade, World Wars era, post-1945 global developments, Ethiopian modern revolution (1941-1991), independent Africa, post-1991 Ethiopia, and Ethiopian indigenous knowledge systems.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: Development of Capitalism and Nationalism from 1815 to 1914",
        description: "Explores the Industrial Revolution, the rise of capitalism, and 19th-century nationalist movements."
      },
      {
        order: 2,
        title: "Chapter 2: Africa and the Colonial Experience (1880s – 1960s)",
        description: "Examines the Scramble for Africa, systems of European colonial administration, and African resistance."
      },
      {
        order: 3,
        title: "Chapter 3: Social, Economic and Political Developments in Ethiopia (Mid 19th C. to 1941)",
        description: "Focuses on modern state-building, territorial expansion, long-distance trade, and external relations."
      },
      {
        order: 4,
        title: "Chapter 4: Society and Politics in the Age of World Wars (1914 - 1945)",
        description: "Covers the causes and consequences of WWI, the Russian Revolution, WWII, and the rise of fascism."
      },
      {
        order: 5,
        title: "Chapter 5: Global and Regional Developments Since 1945",
        description: "Examines the post-WWII socio-economic recovery, the United Nations, and the dynamics of the Cold War."
      },
      {
        order: 6,
        title: "Chapter 6: Ethiopia: Internal Developments and External Influences from 1941 to 1991",
        description: "Covers the restoration of Imperial rule, the 1974 revolution, and the eventual decline of the Derg regime."
      },
      {
        order: 7,
        title: "Chapter 7: Africa since the 1960s",
        description: "Explores the road to independence for African states, post-colonial political development, and pan-Africanism."
      },
      {
        order: 8,
        title: "Chapter 8: Post-1991 Developments in Ethiopia",
        description: "Examines the Transitional Government of Ethiopia, the 1995 constitution, and recent socio-economic issues."
      },
      {
        order: 9,
        title: "Chapter 9: Indigenous Knowledge Systems and Heritages of Ethiopia",
        description: "Contextualizes how indigenous traditions have influenced the country's historical development and present trajectories."
      }
    ]
  },
  {
    gradeLevel: "grade-12",
    code: "ECON_12",
    name: "Grade 12 Economics",
    stream: "social",
    description: "Grade 12 Economics curriculum covering macroeconomic fundamentals (Classical vs. Keynesian), aggregate demand & supply, market failures & consumer protection, policy instruments, tax theory & practice in Ethiopia, poverty & inequality, Ethiopian macroeconomic reforms, and green economy sustainability.",
    chapters: [
      {
        order: 1,
        title: "Chapter 1: The Fundamental Concepts of Macroeconomics",
        description: "Defines macroeconomics, its focus areas, and differentiates between Classical and Keynesian economic schools of thought."
      },
      {
        order: 2,
        title: "Chapter 2: Aggregate Demand and Aggregate Supply Analysis",
        description: "Introduces macroeconomic equilibrium and factors that shift aggregate demand and supply curves."
      },
      {
        order: 3,
        title: "Chapter 3: Market Failure and Consumer Protection",
        description: "Discusses types of market failures (like externalities and public goods) and the role of consumer protection laws."
      },
      {
        order: 4,
        title: "Chapter 4: Macroeconomic Policy Instruments",
        description: "Examines the tools and impacts of fiscal, monetary, income, and foreign exchange policies."
      },
      {
        order: 5,
        title: "Chapter 5: Tax Theory and Practice",
        description: "Defines the principles and classifications of taxes, alongside a deep dive into the tax structure in Ethiopia."
      },
      {
        order: 6,
        title: "Chapter 6: Poverty and Inequality",
        description: "Explores the concepts of poverty and income inequality, their measurement, and global vs. regional trends."
      },
      {
        order: 7,
        title: "Chapter 7: Macroeconomic Reforms in Ethiopia",
        description: "Reviews historical national development objectives and recent home-grown economic reforms and decentralization."
      },
      {
        order: 8,
        title: "Chapter 8: Economy, Environment and Climate Change",
        description: "Examines the linkages between economic growth, green economy concepts, and environmental sustainability in Ethiopia."
      }
    ]
  }
];

export async function seedGrade12Subjects() {
  console.log("===============================================================");
  console.log("EthioPrep: Seeding Grade 12 Subjects and Chapters...");
  console.log("===============================================================\n");

  let totalSubjectsCreated = 0;
  let totalSubjectsUpdated = 0;
  let totalChaptersCreated = 0;
  let totalChaptersUpdated = 0;

  for (const sData of grade12SubjectsData) {
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
  console.log("SUMMARY OF GRADE 12 SEEDING OPERATION:");
  console.log(`Subjects: ${totalSubjectsCreated} created, ${totalSubjectsUpdated} updated (Total: ${grade12SubjectsData.length})`);
  console.log(`Chapters: ${totalChaptersCreated} created, ${totalChaptersUpdated} updated (Total: ${totalChaptersCreated + totalChaptersUpdated})`);
  console.log("===============================================================\n");
}

async function runStandalone() {
  await connectDatabase();
  try {
    await seedGrade12Subjects();
  } catch (err) {
    console.error("Error during Grade 12 seeding:", err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

if (process.argv[1] && process.argv[1].includes("seedGrade12Subjects")) {
  runStandalone();
}
