import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";

async function seedBiologyGrade12() {
  console.log("Connecting to MongoDB Atlas...");
  await connectDatabase();

  try {
    // 1. Find or create the Biology subject
    let biologySubject = await Subject.findOne({ code: "BIO" });
    if (!biologySubject) {
      biologySubject = await Subject.create({
        name: "Biology",
        code: "BIO",
        gradeLevel: "grade-12",
        stream: "natural",
        description: "Grade 12 Ethiopian Curriculum: Applications, Bioenergetics, Genetics, Evolution, and Animal Behavior.",
        isActive: true
      });
      console.log("Created Biology subject.");
    } else {
      console.log(`Found Biology subject: ${biologySubject.name} (${biologySubject._id})`);
    }

    // 2. Find author staff member (teacher or admin)
    const authorUser = await User.findOne({
      role: { $in: ["teacher", "content_manager", "admin"] }
    });
    const authorId = authorUser?._id;
    console.log(`Using Author: ${authorUser?.displayName || "System Teacher"} (${authorUser?.role})`);

    // 3. Define the 5 Grade 12 Biology Chapters
    const chaptersData = [
      {
        order: 1,
        title: "Unit 1: Application of Biology",
        description: "Biotechnology, Recombinant DNA Technology, Agricultural & Medical Applications, Bioremediation and Biosafety."
      },
      {
        order: 2,
        title: "Unit 2: Energy Transformation (Bioenergetics)",
        description: "Cellular Respiration (Glycolysis, Krebs Cycle, ETC) and Photosynthesis (Light & Dark Reactions, C3, C4 & CAM Pathways)."
      },
      {
        order: 3,
        title: "Unit 3: Genetics & Molecular Biology",
        description: "DNA Structure & Replication, Transcription & Translation, Mendelian & Non-Mendelian Genetics, Genetic Code and Mutations."
      },
      {
        order: 4,
        title: "Unit 4: Evolution",
        description: "Theories of Evolution (Lamarckism vs. Darwinism), Natural Selection, Evidence for Evolution, Speciation and Human Evolution in Ethiopia."
      },
      {
        order: 5,
        title: "Unit 5: Behavior (Ethology)",
        description: "Innate Behaviors (Reflexes, Kineses, Taxes, FAPs), Learned Behaviors (Habituation, Imprinting, Conditioning, Insight), and Social Behavior."
      }
    ];

    const seededChapters = [];
    for (const chData of chaptersData) {
      let chapter = await Chapter.findOne({
        subjectId: biologySubject._id,
        order: chData.order
      });

      if (!chapter) {
        chapter = await Chapter.create({
          subjectId: biologySubject._id,
          title: chData.title,
          description: chData.description,
          order: chData.order,
          isActive: true
        });
        console.log(`Created Chapter ${chData.order}: ${chData.title}`);
      } else {
        chapter.title = chData.title;
        chapter.description = chData.description;
        await chapter.save();
        console.log(`Updated Chapter ${chData.order}: ${chData.title}`);
      }
      seededChapters.push(chapter);
    }

    // 4. Comprehensive Study Notes for each Chapter
    const studyNotes = [
      {
        chapterOrder: 1,
        title: "Unit 1: Application of Biology & Biotechnology (Comprehensive Guide)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 BIOLOGY: UNIT 1 — APPLICATION OF BIOLOGY

## 1. Introduction to Biotechnology
Biotechnology is the use of living organisms, cells, or biological systems to produce goods, services, and technologies for human benefit.

### Traditional vs. Modern Biotechnology
* **Traditional Biotechnology:** Relies on natural biological processes without directly modifying DNA.
  - Examples: Fermentation in bread making (yeast *Saccharomyces cerevisiae*), brewing beer, fermenting Injera (*Eragrostis tef* batter), making cheese and yogurt using lactic acid bacteria (*Lactobacillus*).
* **Modern Biotechnology:** Involves genetic manipulation and molecular engineering (altering DNA sequences across species).
  - Examples: Recombinant DNA technology, gene cloning, stem cell therapy, and CRISPR gene editing.

---

## 2. Recombinant DNA Technology (Genetic Engineering)
Recombinant DNA is DNA formed by combining genetic material from two or more different organisms.

### Key Tools & Molecular Machinery:
1. **Restriction Endonucleases (Molecular Scissors):**
   - Enzymes that cut DNA at specific palindromic recognition sequences.
   - Example: *EcoRI* cuts at 5'-GAATTC-3', producing sticky single-stranded ends that easily pair with complementary bases.
2. **DNA Ligase (Molecular Glue):**
   - Catalyzes the formation of phosphodiester bonds to covalently seal the sugar-phosphate backbone between foreign DNA and the vector.
3. **Cloning Vectors (Vehicles):**
   - Plasmids: Small, circular, self-replicating extrachromosomal bacterial DNA molecules containing:
     - Origin of replication (ori)
     - Selectable marker (antibiotic resistance gene like *ampR*)
     - Multiple cloning site (MCS)
   - Bacteriophages and artificial chromosomes (BACs/YACs).
4. **Polymerase Chain Reaction (PCR):**
   - Technique developed by Kary Mullis to amplify millions of copies of a target DNA sequence in vitro.
   - **Three Steps:**
     1. *Denaturation* (94–96°C): Breaks hydrogen bonds between double-stranded DNA.
     2. *Annealing* (50–65°C): Primers bind to complementary target sequences.
     3. *Extension* (72°C): Thermostable *Taq polymerase* synthesizes new DNA strands.

---

## 3. Major Applications of Biotechnology

### A. Medical Applications
* **Recombinant Human Insulin (Humulin):** Synthesized by inserting human insulin genes into *E. coli*, replacing traditional animal insulin extraction.
* **Vaccines:** Subunit and recombinant vaccines (e.g., Hepatitis B vaccine) made by expressing viral surface antigens without risk of infection.
* **Gene Therapy:** Inserting functional genes into patient cells to correct genetic defects (e.g., treating SCID - Severe Combined Immunodeficiency).
* **Monoclonal Antibodies:** Identical antibodies produced by hybridoma cells (fused B-lymphocytes and myeloma tumor cells) used for targeted cancer therapy and diagnostic tests.

### B. Agricultural Applications
* **Bt Crops:** Crops engineered with the *cry* gene from the soil bacterium *Bacillus thuringiensis*, producing a crystal protein toxic to insect pests (e.g., bollworms in cotton) while safe for humans.
* **Herbicide-Resistant Crops:** Plants engineered to tolerate glyphosate (Roundup Ready crops), allowing weed control without damaging crops.
* **Biofortification:** Enhancing nutritional quality (e.g., Golden Rice enriched with beta-carotene/provitamin A to prevent childhood blindness).

### C. Environmental Applications (Bioremediation)
* **Bioremediation:** Using microorganisms to break down pollutants and toxic waste into harmless substances.
  - Cleaning petroleum oil spills using hydrocarbon-degrading bacteria (*Pseudomonas*).
  - Sewage and wastewater treatment through aerobic and anaerobic digestion.
* **Biofuels:** Renewable fuels produced from biomass:
  - *Bioethanol* from sugar cane and corn fermentation.
  - *Biogas* (methane, CH4) produced from anaerobic digestion of animal manure and organic waste.

---

## 4. Biosafety and Bioethics
* **Biosafety Levels (BSL 1 to 4):** Standardized containment protocols to prevent accidental release of pathogens.
* **Ethical Considerations:** Potential allergic reactions to novel proteins in GMO foods, gene flow from GM crops to wild relatives (superweeds), and the ethics of human germline genetic modifications.

---
### 💡 High-Yield Exam Tip:
*EcoRI* produces sticky ends with overhangs; *SmaI* produces blunt ends.
Humulin was the first commercially available recombinant DNA drug approved in 1982.`
      },
      {
        chapterOrder: 2,
        title: "Unit 2: Energy Transformation — Photosynthesis & Respiration Guide",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 BIOLOGY: UNIT 2 — ENERGY TRANSFORMATION (BIOENERGETICS)

## 1. ATP and Bioenergetics
Adenosine Triphosphate (ATP) is the universal energy currency of living cells.
* **Structure:** Adenine nitrogenous base + Ribose sugar + 3 Phosphate groups.
* **Energy Release:** Hydrolysis of the terminal phosphoanhydride bond releases ~30.5 kJ/mol:
  $$\\text{ATP} + \\text{H}_2\\text{O} \\rightarrow \\text{ADP} + \\text{P}_i + \\text{Energy}$$
* **Role of Coenzymes:** Electron carriers that facilitate redox reactions:
  - $\\text{NAD}^+ / \\text{NADH}$ (used primarily in catabolic respiration)
  - $\\text{FAD} / \\text{FADH}_2$ (used in the Krebs Cycle)
  - $\\text{NADP}^+ / \\text{NADPH}$ (used in anabolic photosynthesis)

---

## 2. Photosynthesis
Equation:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light} \\xrightarrow{\\text{Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

### A. Chloroplast Structure:
* **Thylakoids:** Flattened disc-like membranes where light reactions occur.
* **Grana:** Stacks of thylakoid discs containing chlorophyll pigments and photosystems.
* **Stroma:** Fluid-filled interior where dark reactions (Calvin cycle) take place.

### B. Light-Dependent Reactions (Thylakoid Membrane):
1. **Photoactivation:** Chlorophyll in Photosystem II (P680) absorbs photons, exciting electrons to a higher energy level.
2. **Photolysis of Water:**
   $$2\\text{H}_2\\text{O} \\rightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2$$
   *Water is the electron donor; Oxygen gas is released as a byproduct.*
3. **Electron Transport Chain & Photophosphorylation:**
   - Electrons pass from PS II to Cytochrome complex to Photosystem I (P700).
   - Proton pump creates a high $\\text{H}^+$ concentration in the thylakoid lumen.
   - Protons diffuse back to the stroma through **ATP Synthase** (chemiosmosis) producing ATP.
   - Ferredoxin transfers electrons to $\\text{NADP}^+$ Reductase, forming **NADPH**.
4. **Cyclic Photophosphorylation:** Only uses PS I; produces ATP only (no NADPH and no $\\text{O}_2$).

### C. Light-Independent Reactions / Calvin Cycle (Stroma):
1. **Carbon Fixation:** Carbon dioxide reacts with Ribulose 1,5-bisphosphate (**RuBP**, 5C) catalyzed by the enzyme **RuBisCO** to produce two molecules of 3-PGA (3-phosphoglycerate, 3C).
2. **Reduction:** 3-PGA is phosphorylated by ATP and reduced by NADPH to form **G3P (GAP)**.
3. **Regeneration:** Five G3P molecules are rearranged using ATP to regenerate three RuBP molecules, allowing the cycle to continue.
*To make 1 molecule of glucose, the Calvin cycle requires: 6 $\\text{CO}_2$, 18 ATP, and 12 NADPH.*

### D. Comparison of C3, C4, and CAM Plants:
| Feature | C3 Plants | C4 Plants | CAM Plants |
| :--- | :--- | :--- | :--- |
| **First product** | 3-PGA (3-Carbon) | Oxaloacetate (4-Carbon) | Malic acid (stored in vacuole) |
| **Primary enzyme** | RuBisCO | PEP carboxylase | PEP carboxylase |
| **Anatomy** | Normal mesophyll | Kranz anatomy (bundle sheath) | Succulent leaves/stems |
| **Stomata opening** | Day | Day | Night (conserves water) |
| **Examples** | Wheat, rice, teff, barley | Maize, sugarcane, sorghum | Cactus, pineapple, jade plant |

---

## 3. Cellular Respiration
Equation:
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 36-38\\text{ ATP}$$

### The Four Stages of Aerobic Respiration:
1. **Glycolysis (Cytoplasm — Anaerobic):**
   - 1 Glucose (6C) converted into 2 Pyruvate (3C).
   - Net yield: **2 ATP** (substrate-level phosphorylation) + **2 NADH**.
2. **Link Reaction / Pyruvate Decarboxylation (Mitochondrial Matrix):**
   - 2 Pyruvate oxidized to 2 Acetyl-CoA (2C) + 2 $\\text{CO}_2$.
   - Yield: **2 NADH**.
3. **Krebs Cycle / Citric Acid Cycle (Mitochondrial Matrix):**
   - Acetyl-CoA (2C) joins Oxaloacetate (4C) to form Citrate (6C).
   - For 2 turns (per glucose molecule):
     - Yield: **2 ATP**, **6 NADH**, **2 $\\text{FADH}_2$**, **4 $\\text{CO}_2$**.
4. **Oxidative Phosphorylation & Electron Transport Chain (Cristae):**
   - NADH and $\\text{FADH}_2$ donate high-energy electrons to complexes I–IV.
   - Protons pumped into the intermembrane space generate a proton motive force.
   - Protons return via ATP synthase (chemiosmosis) generating ~32-34 ATP.
   - **Oxygen is the final electron acceptor**, combining with protons to form $\\text{H}_2\\text{O}$:
     $$\\frac{1}{2}\\text{O}_2 + 2e^- + 2\\text{H}^+ \\rightarrow \\text{H}_2\\text{O}$$

### Anaerobic Respiration (Fermentation in Cytoplasm):
* **Alcoholic Fermentation (Yeast):**
  $$\\text{Pyruvate} \\rightarrow \\text{Acetaldehyde} + \\text{CO}_2 \\rightarrow \\text{Ethanol} + \\text{NAD}^+$$
* **Lactic Acid Fermentation (Human muscles & yogurt bacteria):**
  $$\\text{Pyruvate} + \\text{NADH} \\rightarrow \\text{Lactate} + \\text{NAD}^+$$
  - Purpose of fermentation: Regenerates $\\text{NAD}^+$ so glycolysis can keep producing 2 ATP in the absence of oxygen.`
      },
      {
        chapterOrder: 3,
        title: "Unit 3: Genetics & Molecular Biology (Master Summary)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 BIOLOGY: UNIT 3 — GENETICS AND MOLECULAR BIOLOGY

## 1. DNA Structure and Organization
* **Watson-Crick Double Helix Model:**
  - Double-stranded, antiparallel strands (5' to 3' and 3' to 5').
  - Monomers: Deoxyribonucleotides composed of:
    1. Nitrogenous base (Purines: Adenine & Guanine; Pyrimidines: Cytosine & Thymine).
    2. Deoxyribose pentose sugar.
    3. Phosphate group.
  - **Chargaff's Rules:** Amount of $A = T$ (connected by 2 hydrogen bonds) and $G \\equiv C$ (connected by 3 hydrogen bonds).
  - Backbone: Alternating sugar and phosphate joined by covalent **phosphodiester bonds**.

---

## 2. DNA Replication (Semi-Conservative)
Each daughter DNA molecule contains one original parent strand and one newly synthesized strand (proven by Meselson and Stahl experiment).

### Key Replication Enzymes:
* **DNA Helicase:** Unwinds and unzips the double helix at the replication fork.
* **Single-Stranded Binding Proteins (SSBs):** Prevent separated strands from re-annealing.
* **RNA Primase:** Synthesizes short RNA primers to provide a free 3'-OH group.
* **DNA Polymerase III:** Adds complementary DNA nucleotides only in the 5' to 3' direction.
  - *Leading strand:* Synthesized continuously towards the replication fork.
  - *Lagging strand:* Synthesized discontinuously away from the fork in short segments called **Okazaki fragments**.
* **DNA Polymerase I:** Removes RNA primers and replaces them with DNA nucleotides.
* **DNA Ligase:** Covalently joins Okazaki fragments together.

---

## 3. Central Dogma of Molecular Biology
$$\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Polypeptide (Protein)}$$

### A. Transcription (Nucleus):
* RNA Polymerase binds to the **promoter sequence** (e.g., TATA box) on the template DNA strand.
* Synthesizes single-stranded mRNA in the 5' to 3' direction substituting Uracil (U) for Thymine (T).
* **Post-Transcriptional Modification (Eukaryotes):**
  1. *5' Capping:* Addition of 7-methylguanosine cap.
  2. *Polyadenylation:* Addition of poly-A tail (100–200 adenines) to the 3' end.
  3. *Splicing:* Removal of non-coding **introns** by spliceosomes and joining of coding **exons**.

### B. The Genetic Code:
* **Triplet Codon:** 3 nucleotides on mRNA code for one specific amino acid.
* **Characteristics:**
  - *Universal:* Same codon specifies the same amino acid in almost all organisms.
  - *Degenerate / Redundant:* 64 codons code for only 20 amino acids (multiple codons can code for the same amino acid).
  - *Non-overlapping & Comma-less.*
  - **Start Codon:** $\\text{AUG}$ (codes for Methionine).
  - **Stop Codons:** $\\text{UAA}$, $\\text{UAG}$, $\\text{UGA}$ (do not code for any amino acid).

### C. Translation (Ribosomes in Cytoplasm):
1. **Initiation:** Small ribosomal subunit binds to mRNA at the 5' cap and locates the AUG start codon; initiator tRNA brings Methionine.
2. **Elongation:** Ribosome moves along mRNA from 5' to 3'. tRNAs deliver amino acids to the A-site; peptide bonds are formed at the P-site.
3. **Termination:** A stop codon reaches the A-site; release factor binds and releases the completed polypeptide.

---

## 4. Mendelian & Modern Genetics
* **Mendel's First Law (Law of Segregation):** Alleles of a gene separate during gamete formation (meiosis), so each gamete carries only one allele.
  - Monohybrid heterozygous cross ($Aa \\times Aa$): Phenotypic ratio = **3:1**; Genotypic ratio = **1:2:1**.
* **Mendel's Second Law (Independent Assortment):** Genes for different traits assort independently during gamete formation.
  - Dihybrid heterozygous cross ($AaBb \\times AaBb$): Phenotypic ratio = **9:3:3:1**.

### Non-Mendelian Inheritance Patterns:
* **Incomplete Dominance:** Heterozygote displays an intermediate blending phenotype (e.g., Red $\\times$ White snapdragons = Pink flower).
* **Codominance:** Both alleles are simultaneously expressed without blending.
  - Example: Human ABO blood group ($I^A$ and $I^B$ are codominant; genotype $I^A I^B$ has Blood Type AB).
* **Sex-Linked (X-Linked) Traits:** Genes carried on the X chromosome.
  - Affects males more frequently because males are hemizygous ($X^d Y$).
  - Examples: Hemophilia (bleeder's disease) and Red-Green Color Blindness.

---

## 5. Mutations
* **Gene / Point Mutations:**
  - *Silent mutation:* Codon changes but codes for the same amino acid (due to degeneracy).
  - *Missense mutation:* Codon changes to code for a different amino acid (e.g., Sickle Cell Anemia: GAG $\\rightarrow$ GUG, replacing glutamic acid with valine).
  - *Nonsense mutation:* Codon changes to a premature stop codon, terminating the protein early.
  - *Frameshift mutation:* Insertion or deletion of nucleotides not in multiples of 3, shifting the reading frame.
* **Chromosomal Aneuploidy (Nondisjunction):**
  - **Down Syndrome:** Trisomy 21 (47, +21).
  - **Turner Syndrome:** Monosomy X (45, XO in females).
  - **Klinefelter Syndrome:** Extra X in males (47, XXY).`
      },
      {
        chapterOrder: 4,
        title: "Unit 4: Evolution & Natural Selection (EUEE Exam Guide)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 BIOLOGY: UNIT 4 — EVOLUTION

## 1. Theories of Evolution

### A. Jean-Baptiste Lamarck (Lamarckism — 1809)
* **Two Key Postulates:**
  1. *Theory of Use and Disuse:* Organs used extensively become larger and stronger; disused organs deteriorate.
  2. *Inheritance of Acquired Characteristics:* Modifications acquired during an organism's lifetime can be passed to offspring (e.g., ancestral short-necked giraffes stretching their necks to reach high leaves).
* **Why it was rejected:** August Weismann's germ-plasm experiment proved that somatic acquired modifications do not alter germ cells (DNA).

### B. Charles Darwin (Darwinism — 1859)
* Published *"On the Origin of Species by Means of Natural Selection"*.
* **Core Observations & Inferences:**
  1. *Overproduction:* Organisms produce more offspring than the environment can support.
  2. *Struggle for Existence:* Limited resources (food, territory, mates) lead to competition.
  3. *Heritable Variation:* Individuals within a population vary in physical and biochemical traits.
  4. *Survival of the Fittest / Differential Reproductive Success:* Individuals with favorable adaptations are more likely to survive and reproduce, passing advantageous genes to subsequent generations.

### C. Modern Synthetic Theory (Neo-Darwinism)
* Merges Darwin's natural selection with Mendelian population genetics and molecular biology.
* Recognizes that **populations**, not individuals, evolve over generations through changes in allele frequencies.

---

## 2. Evidences for Biological Evolution
1. **Fossil Record (Paleontology):**
   - Sedimentary rock layers demonstrate chronological appearance of species.
   - *Transitional fossils:* Exhibit traits common to both an ancestral group and its derived descendant group (e.g., *Archaeopteryx* showing reptilian teeth/tail and avian feathers).
2. **Comparative Anatomy:**
   - **Homologous Structures:** Similar anatomical origin and embryonic development, but adapted for different functions.
     - *Demonstrates Divergent Evolution.*
     - Example: Pentadactyl limb in humans (grasping), whales (swimming), bats (flying), and horses (running).
   - **Analogous Structures:** Different anatomical origins, but evolved similar functions due to similar environmental pressures.
     - *Demonstrates Convergent Evolution.*
     - Example: Wing of a bird (bones) vs. wing of a butterfly (chitin).
   - **Vestigial Structures:** Rudimentary organs that have lost their original function over evolutionary time.
     - Examples in humans: Vermiform appendix, coccyx (tailbone), wisdom teeth, and auricular muscles.
3. **Molecular Biology & Biochemistry:**
   - Universal genetic code and ATP usage across all kingdoms.
   - Cytochrome c protein amino acid sequence comparison shows close evolutionary relationships between humans and chimpanzees (0 differences) vs. rhesus monkeys (1 difference) vs. yeast (45 differences).

---

## 3. Population Genetics & Speciation

### A. The Hardy-Weinberg Principle
In a large, sexually reproducing population, allele and genotype frequencies remain constant from generation to generation if five conditions are met:
1. No mutations
2. Random mating
3. No gene flow (no immigration or emigration)
4. Infinitely large population size (no genetic drift)
5. No natural selection

**Equations:**
$$p + q = 1 \\quad \\text{(Allele Frequencies)}$$
$$p^2 + 2pq + q^2 = 1 \\quad \\text{(Genotype Frequencies)}$$
- $p$: frequency of dominant allele ($A$)
- $q$: frequency of recessive allele ($a$)
- $p^2$: frequency of homozygous dominant genotype ($AA$)
- $2pq$: frequency of heterozygous genotype ($Aa$)
- $q^2$: frequency of homozygous recessive genotype ($aa$)

### B. Natural Selection Types:
* **Stabilizing Selection:** Favors intermediate phenotypes and selects against extreme phenotypes (e.g., human infant birth weight).
* **Directional Selection:** Favors one extreme phenotype over others (e.g., industrial melanism in peppered moths, antibiotic resistance in bacteria).
* **Disruptive Selection:** Favors both extremes over intermediate phenotypes, potentially leading to speciation.

### C. Speciation Modes:
* **Allopatric Speciation:** Speciation occurring due to geographic isolation (e.g., mountain range, river, continental drift).
* **Sympatric Speciation:** Speciation occurring in the same geographic area, commonly through polyploidy in plants or behavioral/ecological niche separation.

---

## 4. Human Evolution and Ethiopian Discoveries
Ethiopia is globally celebrated as the **"Cradle of Humankind"** due to landmark hominid fossil discoveries in the Afar Depression (Aramis, Hadar, Middle Awash) and Omo Valley.

* **Important Ethiopian Hominid Fossils:**
  1. *Ardipithecus ramidus ("Ardi"):* Discovered at Aramis, Middle Awash (~4.4 million years old). Facultative biped.
  2. *Australopithecus afarensis ("Lucy" / "Dinkenesh"):* Discovered by Donald Johanson in 1974 at Hadar (~3.2 million years old). Fully bipedal with small brain capacity (~400 cc).
  3. *Homo erectus:* First species to use fire, sophisticated Acheulean stone handaxes, and migrate out of Africa.
  4. *Homo sapiens ("Omo I & II"):* Anatomically modern human fossils discovered along the Omo River, dated to ~195,000–230,000 years ago.`
      },
      {
        chapterOrder: 5,
        title: "Unit 5: Animal Behavior (Ethology & Adaptations)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 BIOLOGY: UNIT 5 — BEHAVIOR (ETHOLOGY)

## 1. What is Behavior?
Behavior is the observable response of an organism to internal or external stimuli.
* **Ethology:** The scientific study of animal behavior in natural environments.
* **Causes of Behavior (Tinbergen's Four Questions):**
  - *Proximate causes:* "How" questions — genetic, developmental, and physiological mechanisms triggering the behavior.
  - *Ultimate causes:* "Why" questions — evolutionary significance and survival/reproductive value of the behavior.

---

## 2. Innate (Inborn) Behavior
Innate behaviors are genetically programmed, stereotyped, performed automatically without prior experience or practice, and inherited from parents.

### Types of Innate Behavior:
1. **Reflex Actions:**
   - Rapid, automatic, involuntary responses to a specific stimulus without conscious thought.
   - Mediated by a simple **reflex arc**:
     $$\\text{Receptor} \\rightarrow \\text{Sensory Neuron} \\rightarrow \\text{Relay Neuron (Spinal Cord)} \\rightarrow \\text{Motor Neuron} \\rightarrow \\text{Effector (Muscle)}$$
   - Examples: Knee-jerk reflex, withdrawal of hand from hot surface, pupil constriction in bright light.
2. **Kinesis (Non-Directional Orientation):**
   - Change in the speed of movement or rate of turning in response to stimulus intensity, but **not** oriented toward or away from the stimulus.
   - Example: Woodlice move rapidly in dry air and slow down in moist air, ensuring they spend more time in humid environments.
3. **Taxis (Directional Orientation):**
   - Oriented movement directly toward (positive) or away from (negative) a directional stimulus.
   - *Phototaxis:* Movement in response to light (e.g., positive phototaxis in *Euglena* swimming toward light; negative phototaxis in earthworms avoiding light).
   - *Chemotaxis:* Movement in response to chemical gradients (e.g., bacteria swimming toward glucose; sperm swimming toward ovum).
4. **Fixed Action Patterns (FAPs):**
   - An unchangeable sequence of behavioral acts triggered by a specific sensory cue called a **Sign Stimulus** or **Releaser**.
   - Once initiated, a FAP must be carried out to completion even if the original stimulus is removed.
   - Examples:
     - Male three-spined stickleback fish attacking anything with a red underside (red belly is the sign stimulus).
     - Greylag goose retrieving an egg that rolled out of its nest.

---

## 3. Learned Behavior
Learned behaviors are acquired or modified through individual experience, practice, or environmental interactions. They are flexible and adaptive to changing environments.

### Types of Learned Behavior:
1. **Habituation:**
   - Waning or decrease in responsiveness to repeated, mild stimuli that carry no reward or punishment.
   - Prevents wasting energy on non-threatening stimuli.
   - Example: Crows ignoring scarecrows after repeated harmless exposure; sea anemones withdrawing tentacles when touched, but stopping after repeated touches.
2. **Imprinting:**
   - Rapid, irreversible learning occurring exclusively during a restricted **critical period** (sensitive period) early in life.
   - Example: Konrad Lorenz demonstrated that newly hatched goslings imprint on and follow the first moving object they see (whether their mother or Lorenz).
3. **Classical Conditioning (Associative Learning):**
   - Animal learns to associate an arbitrary conditioned stimulus with an unconditioned biological stimulus.
   - **Ivan Pavlov's Dog Experiment:**
     - Unconditioned Stimulus (Food) $\\rightarrow$ Unconditioned Response (Salivation).
     - Conditioned Stimulus (Bell ring) paired repeatedly with Food.
     - Conditioned Stimulus (Bell alone) $\\rightarrow$ Conditioned Response (Salivation).
4. **Operant Conditioning (Trial-and-Error Learning):**
   - Animal associates its own voluntary behavior with a consequence (reward or punishment).
   - **B.F. Skinner's Skinner Box:** A rat presses a lever to receive a food pellet (positive reinforcement) or to avoid electric shock (negative reinforcement).
5. **Latent (Exploratory) Learning:**
   - Learning that occurs without immediate reinforcement or apparent reward, and is revealed later when needed.
   - Example: Mice exploring a maze without food reward learn the layout faster when food is introduced later.
6. **Insight Learning (Reasoning):**
   - Highest form of learning; ability to solve a novel, complex problem by applying prior experience and cognitive reasoning without trial and error.
   - **Wolfgang Köhler's Chimpanzee Experiment:** Chimpanzee (Sultan) stacked wooden boxes and joined sticks together to reach bananas hanging out of reach from the ceiling.

---

## 4. Social Behavior and Communication
* **Communication Channels:**
  - *Chemical:* Pheromones (e.g., female silk moths releasing bombykol to attract males across kilometers; ant trail markers).
  - *Visual:* Courtship plumage in peacocks; honeybee waggle dance indicating direction and distance to nectar sources.
  - *Auditory:* Bird songs for territorial defense; frog mating calls.
  - *Tactile:* Social grooming in primates to reinforce social bonds.
* **Social Hierarchies & Territoriality:**
  - Dominance hierarchy (pecking order) reduces physical conflict within groups.
  - Territoriality ensures exclusive access to food, nesting sites, and mates.`
      }
    ];

    console.log("Seeding Study Notes into MongoDB...");
    let notesCount = 0;
    for (const noteData of studyNotes) {
      const chapter = seededChapters.find((c) => c.order === noteData.chapterOrder);

      // Check if note already exists for this chapter & title
      let existingNote = await Note.findOne({
        subjectId: biologySubject._id,
        chapterId: chapter?._id,
        title: noteData.title
      });

      if (!existingNote) {
        existingNote = await Note.create({
          userId: authorId,
          uploadedBy: authorId,
          subjectId: biologySubject._id,
          chapterId: chapter?._id,
          title: noteData.title,
          body: noteData.body,
          fileType: noteData.fileType,
          isPublic: true,
          isPremium: noteData.isPremium,
          status: "active"
        });
        console.log(`[CREATED NOTE] ${noteData.title}`);
      } else {
        existingNote.body = noteData.body;
        existingNote.isPublic = true;
        existingNote.status = "active";
        await existingNote.save();
        console.log(`[UPDATED NOTE] ${noteData.title}`);
      }
      notesCount++;
    }

    console.log(`\n======================================================`);
    console.log(`SUCCESS: Seeded 5 Grade 12 Biology Chapters & ${notesCount} Study Notes!`);
    console.log(`All notes are set to Public and ready for In-App Offline Study.`);
    console.log(`======================================================`);
  } catch (error) {
    console.error("Error seeding Biology notes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

seedBiologyGrade12();
