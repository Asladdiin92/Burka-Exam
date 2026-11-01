import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";

async function seedBiology9_11() {
  console.log("Connecting to MongoDB Atlas for Biology (Grades 9-11) seeding...");
  await connectDatabase();

  try {
    const authorUser = await User.findOne({
      role: { $in: ["teacher", "content_manager", "admin"] }
    });
    const authorId = authorUser?._id;

    const gradesBiology = [
      {
        gradeLevel: "grade-9",
        code: "BIO_9",
        name: "Biology Grade 9",
        description: "Grade 9 Ethiopian Biology: Scientific Method, Classification, Cell Structure, Human Nutrition & Digestion, and Natural Resource Ecology.",
        units: [
          {
            order: 1,
            title: "Unit 1: Introduction to Biology and the Scientific Method",
            noteTitle: "Unit 1: The Scientific Method & Tools of Biology",
            body: `# Unit 1: Introduction to Biology (Grade 9 Biology)

## 1. Scope and Branches of Biology
* **Biology:** The study of living organisms and their vital life processes.
* **Major Branches:**
  * Zoology (Animals), Botany (Plants), Microbiology (Microscopic organisms).
  * Ecology (Organisms & Environment), Genetics (Heredity), Physiology (Functioning of living systems).

---

## 2. The Scientific Method
1. **Observation:** Gathering information using senses.
2. **Question:** Formulating the inquiry.
3. **Hypothesis:** A testable, tentative explanation ("If... then...").
4. **Experiment:** Controlled testing isolating the independent variable.
   * *Independent Variable:* The factor manipulated by experimenter.
   * *Dependent Variable:* The factor measured.
   * *Control Group:* Benchmark group without the variable.
5. **Data Analysis & Conclusion:** Support or refute the hypothesis.`
          },
          {
            order: 2,
            title: "Unit 2: Characteristics and Classification of Living Organisms",
            noteTitle: "Unit 2: Taxonomy & The Five Kingdoms of Life",
            body: `# Unit 2: Classification of Living Things (Grade 9 Biology)

## 1. Characteristics of Life (MRS GREN)
* **M**ovement, **R**espiration, **S**ensitivity, **G**rowth, **R**eproduction, **E**xcretion, **N**utrition.

---

## 2. Taxonomic Hierarchy
From broadest to most specific:
$$\\text{Domain} \\to \\text{Kingdom} \\to \\text{Phylum} \\to \\text{Class} \\to \\text{Order} \\to \\text{Family} \\to \\text{Genus} \\to \\text{Species}$$
* **Binomial Nomenclature:** Devised by Carl Linnaeus.
  * Formatted as: *Genus species* (e.g., *Homo sapiens*, *Zea mays*).

---

## 3. The Five Kingdom System (Whittaker)
1. **Monera:** Prokaryotic, unicellular (Bacteria, Cyanobacteria).
2. **Protista:** Eukaryotic, mostly unicellular (Amoeba, Paramecium, Euglena, Algae).
3. **Fungi:** Eukaryotic, heterotrophic with chitin cell walls (Yeast, Molds, Mushrooms).
4. **Plantae:** Eukaryotic, multicellular, autotrophic (photosynthetic) with cellulose cell walls.
5. **Animalia:** Eukaryotic, multicellular, heterotrophic, no cell walls.`
          },
          {
            order: 3,
            title: "Unit 3: Cells and Cellular Organization",
            noteTitle: "Unit 3: Cell Ultrastructure & Membrane Transport",
            body: `# Unit 3: Cells and Cellular Organization (Grade 9 Biology)

## 1. Prokaryotes vs. Eukaryotes
* **Prokaryotes:** No membrane-bound nucleus (nucleoid), 70S ribosomes, circular DNA, no membrane-bound organelles (Bacteria).
* **Eukaryotes:** True nucleus with nuclear envelope, 80S ribosomes, linear chromosomes with histones, membrane-bound organelles (Plants, Animals, Fungi, Protists).

---

## 2. Key Organelles & Functions
* **Mitochondria:** Site of aerobic cellular respiration; generates ATP ("powerhouse").
* **Chloroplasts:** Site of photosynthesis in plants; contain chlorophyll.
* **Ribosomes:** Protein synthesis.
* **Endoplasmic Reticulum (ER):** Rough ER (protein folding & transport), Smooth ER (lipid synthesis & detoxification).
* **Golgi Apparatus:** Modifies, sorts, and packages proteins for secretion.
* **Lysosomes:** Contain digestive hydrolytic enzymes for intracellular digestion.

---

## 3. Membrane Transport Mechanisms
* **Passive Transport (No ATP required, down concentration gradient):**
  * *Simple Diffusion:* Movement of solutes from high to low concentration.
  * *Osmosis:* Diffusion of water molecules across a selectively permeable membrane.
  * *Facilitated Diffusion:* Transport via protein channels/carriers.
* **Active Transport (Requires ATP):** Movement against concentration gradient (low to high), e.g., $Na^+/K^+$ pump.`
          },
          {
            order: 4,
            title: "Unit 4: Human Nutrition and Digestion",
            noteTitle: "Unit 4: Human Nutrition, Enzymes & Digestive Physiology",
            body: `# Unit 4: Nutrition and Digestion (Grade 9 Biology)

## 1. Essential Nutrients
* **Carbohydrates:** Primary energy source ($4\\, \\text{kcal/g}$).
* **Lipids (Fats):** Long-term energy storage, insulation, cell membranes ($9\\, \\text{kcal/g}$).
* **Proteins:** Growth, repair, and enzymes ($4\\, \\text{kcal/g}$).
* **Vitamins & Minerals:**
  * Vitamin A (Vision $\\to$ deficiency: night blindness).
  * Vitamin C (Collagen/immunity $\\to$ deficiency: scurvy).
  * Vitamin D & Calcium (Bones $\\to$ deficiency: rickets).
  * Iron (Hemoglobin $\\to$ deficiency: anemia).

---

## 2. Human Digestive Enzymes
* **Mouth:** Salivary amylase (breaks starch into maltose, $pH \\approx 7$).
* **Stomach:** Pepsin (breaks proteins into peptides, acidic $pH \\approx 1.5 - 2$, $HCl$).
* **Small Intestine (Duodenum):**
  * Bile (produced in liver, stored in gallbladder): emulsifies fats (physical breakdown).
  * Pancreatic Amylase: starch $\\to$ maltose.
  * Trypsin: peptides $\\to$ amino acids.
  * Pancreatic Lipase: emulsified fats $\\to$ fatty acids and glycerol.`
          },
          {
            order: 5,
            title: "Unit 5: Conservation of Natural Resources & Ecology",
            noteTitle: "Unit 5: Ecosystem Dynamics & Resource Conservation",
            body: `# Unit 5: Conservation of Natural Resources (Grade 9 Biology)

## 1. Ecosystem Trophic Structure
* **Producers (Autotrophs):** Photosynthetic plants and phytoplankton.
* **Consumers (Heterotrophs):**
  * Primary consumers (Herbivores).
  * Secondary consumers (Carnivores eating herbivores).
  * Tertiary consumers (Apex predators).
* **Decomposers:** Bacteria and fungi recycling nutrients.
* **10% Rule of Energy Transfer:** Only about $10\\%$ of energy is transferred to the next trophic level; $90\\%$ is lost as heat and metabolic maintenance.`
          }
        ]
      },
      {
        gradeLevel: "grade-10",
        code: "BIO_10",
        name: "Biology Grade 10",
        description: "Grade 10 Ethiopian Biology: Biotechnology, Genetics & Heredity, Human Respiration, Circulatory System, and Nervous Coordination.",
        units: [
          {
            order: 1,
            title: "Unit 1: Biotechnology and Its Applications",
            noteTitle: "Unit 1: Biotechnology, Genetic Engineering & Ethics",
            body: `# Unit 1: Biotechnology (Grade 10 Biology)

## 1. Traditional vs. Modern Biotechnology
* **Traditional Biotechnology:** Fermentation using yeasts and bacteria to produce bread, beer, injera, cheese, and yogurt.
* **Modern Biotechnology:** Recombinant DNA technology, genetic modification (GMOs), gene therapy, and cloning.

---

## 2. Recombinant DNA Steps
1. Isolation of gene of interest (using **restriction endonucleases** as molecular scissors).
2. Insertion into vector (plasmid) using **DNA ligase** (molecular glue).
3. Transformation of host bacterium.
4. Culturing and extraction of recombinant protein (e.g., human insulin production).`
          },
          {
            order: 2,
            title: "Unit 2: Heredity and Classical Genetics",
            noteTitle: "Unit 2: Mendelian Genetics, Punnett Squares & Pedigrees",
            body: `# Unit 2: Heredity and Genetics (Grade 10 Biology)

## 1. Mendel's Laws of Inheritance
1. **Law of Segregation:** Alleles for a trait separate during gamete formation, so each gamete carries only one allele.
2. **Law of Independent Assortment:** Genes on different chromosomes assort independently of each other during meiosis.

---

## 2. Monohybrid Cross
* Cross between two heterozygotes ($Aa \\times Aa$):
  * **Genotypic Ratio:** $1\\, AA : 2\\, Aa : 1\\, aa$ ($1:2:1$).
  * **Phenotypic Ratio:** $3\\text{ Dominant} : 1\\text{ Recessive}$ ($3:1$).

---

## 3. Human Blood Groups (ABO & Rh)
* Three alleles: $I^A, I^B, i$.
  * $I^A$ and $I^B$ are **co-dominant**; $i$ is recessive.
  * Blood Type AB: $I^A I^B$ (Universal recipient for RBCs).
  * Blood Type O: $ii$ (Universal donor for RBCs).`
          },
          {
            order: 3,
            title: "Unit 3: Human Biology: Respiration & Gas Exchange",
            noteTitle: "Unit 3: Cellular Respiration & Human Gas Exchange",
            body: `# Unit 3: Respiration & Gas Exchange (Grade 10 Biology)

## 1. Cellular Respiration
* **Aerobic Respiration:**
  $$C_6H_{12}O_6 + 6O_2 \\to 6CO_2 + 6H_2O + 36-38\\, \\text{ATP}$$
* **Anaerobic Respiration (Fermentation):**
  * Lactic acid fermentation in muscles: Glucose $\\to$ Lactic acid + 2 ATP.
  * Alcoholic fermentation in yeast: Glucose $\\to$ Ethanol + $CO_2$ + 2 ATP.

---

## 2. Gas Exchange in Alveoli
* Thin walls (single-cell squamous epithelium), large surface area, moist lining, dense capillary network.
* $O_2$ binds to **hemoglobin** in RBCs to form **oxyhemoglobin** ($HbO_8$).`
          },
          {
            order: 4,
            title: "Unit 4: Human Biology: Circulatory System",
            noteTitle: "Unit 4: Heart Anatomy, Blood Vessels & Cardiac Cycle",
            body: `# Unit 4: The Circulatory System (Grade 10 Biology)

## 1. Components of Blood
* **Plasma ($55\\%$):** Water, proteins (albumin, antibodies, fibrinogen), nutrients, wastes.
* **Red Blood Cells (Erythrocytes):** Biconcave, anucleated, contain hemoglobin for $O_2$ transport.
* **White Blood Cells (Leukocytes):** Immune defense (phagocytes and lymphocytes).
* **Platelets (Thrombocytes):** Blood clotting.

---

## 2. The Human Heart & Double Circulation
* 4 Chambers: Right atrium, Right ventricle, Left atrium, Left ventricle.
* **Pulmonary Circulation:** Right ventricle $\\xrightarrow{\\text{pulmonary artery}}$ Lungs $\\xrightarrow{\\text{pulmonary vein}}$ Left atrium.
* **Systemic Circulation:** Left ventricle $\\xrightarrow{\\text{aorta}}$ Body tissues $\\xrightarrow{\\text{vena cava}}$ Right atrium.`
          },
          {
            order: 5,
            title: "Unit 5: Nervous Coordination and Homeostasis",
            noteTitle: "Unit 5: Nervous System, Reflex Arc & Homeostasis",
            body: `# Unit 5: Nervous System & Homeostasis (Grade 10 Biology)

## 1. Neurons & Nerve Transmission
* **Neuron Structure:** Dendrites (receive signals), Cell body (soma), Axon (conducts action potential), Myelin sheath (accelerates conduction via nodes of Ranvier).
* **Reflex Arc:**
  $$\\text{Receptor} \\to \\text{Sensory Neuron} \\to \\text{Interneuron (Spinal Cord)} \\to \\text{Motor Neuron} \\to \\text{Effector}$$

---

## 2. Homeostasis (Negative Feedback)
* **Thermoregulation:** Sweating and vasodilation (when hot); shivering and vasoconstriction (when cold).
* **Blood Glucose Regulation:**
  * High blood glucose $\\to$ Pancreatic $\\beta$-cells secrete **Insulin** $\\to$ Glucose converted to glycogen in liver.
  * Low blood glucose $\\to$ Pancreatic $\\alpha$-cells secrete **Glucagon** $\\to$ Glycogen broken into glucose.`
          }
        ]
      },
      {
        gradeLevel: "grade-11",
        code: "BIO_11",
        name: "Biology Grade 11",
        description: "Grade 11 Ethiopian Biology: Biochemical Molecules, Enzymes, Cell Ultrastructure & Bioenergetics, Microorganisms & Immunology, and Population Ecology.",
        units: [
          {
            order: 1,
            title: "Unit 1: The Science of Biology & Biological Research",
            noteTitle: "Unit 1: Biological Investigations, Microscopy & Research Ethics",
            body: `# Unit 1: The Science of Biology (Grade 11 Biology)

## 1. Microscopy Resolving Power
* **Magnification:** Image size divided by actual object size ($M = \\frac{I}{A}$).
* **Light Microscope:** Resolution limit $\\approx 200\\, nm$ (limited by wavelength of visible light).
* **Transmission Electron Microscope (TEM):** Highest resolution ($\\, < 0.2\\, nm$), views internal ultrastructure.
* **Scanning Electron Microscope (SEM):** Creates detailed 3D surface topography.`
          },
          {
            order: 2,
            title: "Unit 2: Biochemical Molecules and Enzymes",
            noteTitle: "Unit 2: Biomolecules (Proteins, Lipids, DNA) & Enzyme Kinetics",
            body: `# Unit 2: Biochemical Molecules and Enzymes (Grade 11 Biology)

## 1. The Four Biological Macromolecules
1. **Carbohydrates:** Monosaccharides (glucose, fructose), Disaccharides (sucrose, lactose, maltose), Polysaccharides (starch, glycogen for energy storage; cellulose, chitin for structure).
2. **Lipids:** Non-polar triglycerides (glycerol + 3 fatty acids) and phospholipids (amphipathic bilayers).
3. **Proteins:** Polymers of 20 amino acids joined by peptide bonds.
   * Primary (sequence), Secondary ($\\alpha$-helix, $\\beta$-pleated sheet), Tertiary (3D conformation), Quaternary (multiple subunits, e.g., hemoglobin).
4. **Nucleic Acids (DNA & RNA):** Polymers of nucleotides (pentose sugar, phosphate group, nitrogenous base: A, T, C, G in DNA; A, U, C, G in RNA).

---

## 2. Enzyme Kinetics & Inhibition
* Enzymes lower the **Activation Energy ($E_a$)** without changing $\\Delta G$.
* **Competitive Inhibition:** Inhibitor resembles substrate and binds to **active site** (can be overcome by increasing substrate concentration).
* **Non-Competitive Inhibition:** Inhibitor binds to **allosteric site**, altering active site shape (cannot be overcome by excess substrate).`
          },
          {
            order: 3,
            title: "Unit 3: Cell Biology and Bioenergetics",
            noteTitle: "Unit 3: Photosynthesis (Light & Dark Reactions) & Cellular Respiration",
            body: `# Unit 3: Bioenergetics (Grade 11 Biology)

## 1. Photosynthesis Mechanisms
1. **Light-Dependent Reactions (Thylakoid Membrane):**
   * Photolysis of water: $2H_2O \\to O_2 + 4H^+ + 4e^-$.
   * Photophosphorylation produces ATP and reduces $NADP^+$ to $NADPH$.
2. **Calvin Cycle / Light-Independent (Stroma):**
   * Carbon fixation catalyzed by **RuBisCO** ($CO_2 + \\text{RuBP} \\to \\text{PGA} \\to \\text{G3P} \\to \\text{Glucose}$).

---

## 2. Aerobic Cellular Respiration Stages
1. **Glycolysis (Cytoplasm):** Glucose $\\to$ 2 Pyruvate + 2 ATP (net) + 2 NADH.
2. **Link Reaction (Mitochondrial Matrix):** Pyruvate $\\to$ Acetyl-CoA + $CO_2$ + NADH.
3. **Krebs / Citric Acid Cycle (Matrix):** Generates 2 ATP, 6 NADH, 2 $FADH_2$, 4 $CO_2$.
4. **Oxidative Phosphorylation (Inner Mitochondrial Membrane):** Electron transport chain + Chemiosmosis via ATP synthase $\\to \\approx 32-34\\, \\text{ATP}$.`
          },
          {
            order: 4,
            title: "Unit 4: Microorganisms, Immunology & Pathology",
            noteTitle: "Unit 4: Microbial Diversity, Antigens & Immune Defenses",
            body: `# Unit 4: Microorganisms and Immunology (Grade 11 Biology)

## 1. Microbial Pathogens
* **Viruses:** Obligate intracellular parasites with DNA or RNA core and protein capsid.
* **Bacteria:** Gram-positive (thick peptidoglycan, purple) vs. Gram-negative (thin peptidoglycan with outer LPS membrane, pink).

---

## 2. Immune Defenses
* **Innate (Non-Specific) Immunity:** Skin, mucous membranes, lysozyme, phagocytes (macrophages, neutrophils), inflammation.
* **Adaptive (Specific) Immunity:**
  * **Humoral Immunity:** B-lymphocytes produce specific **antibodies (immunoglobulins)** targeting extracellular pathogens.
  * **Cell-Mediated Immunity:** Cytotoxic T-cells ($CD8^+$) destroy infected host cells; Helper T-cells ($CD4^+$) activate B and T cells.`
          },
          {
            order: 5,
            title: "Unit 5: Population Ecology and Biomes",
            noteTitle: "Unit 5: Population Growth Curves & Biogeochemical Cycles",
            body: `# Unit 5: Population Ecology (Grade 11 Biology)

## 1. Population Growth Models
* **Exponential Growth (J-curve):** Occurs in unlimited resource environments: $\\frac{dN}{dt} = rN$.
* **Logistic Growth (S-curve):** Density-dependent environmental resistance stabilizes population at **Carrying Capacity ($K$)**:
  $$\\frac{dN}{dt} = rN \\left( \\frac{K - N}{K} \\right)$$

---

## 2. Ecological Succession
* **Primary Succession:** Begins on bare lifeless rock/substrate (pioneer species: lichens and mosses).
* **Secondary Succession:** Follows disturbance where soil already exists (e.g., after forest fire, abandoned farmland).`
          }
        ]
      }
    ];

    for (const g of gradesBiology) {
      let subj = await Subject.findOne({ code: g.code });
      if (!subj) {
        subj = await Subject.create({
          code: g.code,
          name: g.name,
          gradeLevel: g.gradeLevel,
          stream: "natural",
          description: g.description,
          isActive: true
        });
        console.log(`Created Subject: ${subj.name} (${subj.code})`);
      } else {
        subj.name = g.name;
        subj.gradeLevel = g.gradeLevel;
        subj.stream = "natural";
        subj.description = g.description;
        subj.isActive = true;
        await subj.save();
        console.log(`Found/Updated Subject: ${subj.name} (${subj.code})`);
      }

      for (const u of g.units) {
        let ch = await Chapter.findOne({ subjectId: subj._id, order: u.order });
        if (!ch) {
          ch = await Chapter.create({
            subjectId: subj._id,
            order: u.order,
            title: u.title,
            description: u.title,
            isActive: true
          });
          console.log(`Created Chapter: ${subj.code} - ${ch.title}`);
        } else {
          ch.title = u.title;
          ch.isActive = true;
          await ch.save();
          console.log(`Updated Chapter: ${subj.code} - ${ch.title}`);
        }

        let note = await Note.findOne({ subjectId: subj._id, chapterId: ch._id });
        if (!note) {
          note = await Note.create({
            userId: authorId,
            uploadedBy: authorId,
            subjectId: subj._id,
            chapterId: ch._id,
            title: u.noteTitle,
            body: u.body,
            fileType: "text",
            isPublic: true,
            isPremium: false,
            status: "active"
          });
          console.log(`[CREATED NOTE] ${subj.code} - ${note.title}`);
        } else {
          note.title = u.noteTitle;
          note.body = u.body;
          note.status = "active";
          note.isPublic = true;
          await note.save();
          console.log(`[UPDATED NOTE] ${subj.code} - ${note.title}`);
        }
      }
    }

    console.log("\n=======================================================");
    console.log("SUCCESS: Biology Grades 9, 10, and 11 Seeded!");
    console.log("=======================================================");

  } catch (err) {
    console.error("Error in Biology seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Biology seeding connection closed.");
  }
}

seedBiology9_11();
