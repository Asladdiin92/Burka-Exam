import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extractImagesFromDocx } from "./extractDocxImages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCX_PATH = "C:/Users/BURKA/.gemini/antigravity/brain/2521200a-ca40-43f9-88e7-cea27c09466a/.user_uploaded/media_1793041404552_25061f75.docx";

// 1. Extract embedded figures from docx
console.log("Extracting images from docx:", DOCX_PATH);
let images = {};
try {
  images = extractImagesFromDocx(DOCX_PATH);
  console.log(`Successfully extracted ${Object.keys(images).length} images:`, Object.keys(images));
} catch (err) {
  console.warn("Could not extract images from docx:", err.message);
}

// Map images in order: image1 -> Q9, image2 -> Q12, image3 -> Q40, image4 -> Q48, image5 -> Q51, image6 -> Q72, image7 -> Q79
const sortedImageKeys = Object.keys(images).sort();
const qImageMap = {
  9: images[sortedImageKeys[0]] || images["word/media/image1.png"],
  12: images[sortedImageKeys[1]] || images["word/media/image2.png"],
  40: images[sortedImageKeys[2]] || images["word/media/image3.png"],
  48: images[sortedImageKeys[3]] || images["word/media/image4.png"],
  51: images[sortedImageKeys[4]] || images["word/media/image5.png"],
  72: images[sortedImageKeys[5]] || images["word/media/image6.png"],
  79: images[sortedImageKeys[6]] || images["word/media/image7.png"]
};

// 2. Full 100 Questions Master Dataset
const rawQuestions = [
  {
    questionNumber: 1,
    grade: "Grade 9",
    unit: "Unit 3: Human Biology and Health (Grade 9)",
    topic: "Unit 3: Human Biology and Health (The Circulatory System)",
    difficulty: "easy",
    prompt: "Which one of the following sentences is correct about the activities of the heart?",
    options: [
      "The noise of heartbeat one hears through a stethoscope is the sound of valves.",
      "As the heart beats blood travels through the arteries with a uniform pressure.",
      "Diastole is when the heart muscles contract and force the blood out.",
      "Systole is when the heart muscles relax and it fills with blood."
    ],
    correctAnswer: "A",
    explanation: "The characteristic 'lub-dub' sound of the heartbeat heard through a stethoscope is produced by the closing of the heart valves (atrioventricular valves followed by semilunar valves) preventing backflow of blood. Option B is incorrect because arterial blood pressure fluctuates between systolic and diastolic pressure. Options C and D reverse the definitions of systole (contraction) and diastole (relaxation)."
  },
  {
    questionNumber: 2,
    grade: "Grade 9",
    unit: "Unit 4: Microorganisms and Disease (Grade 9)",
    topic: "Unit 4: Micro-organisms and Disease",
    difficulty: "medium",
    prompt: "During culturing micro-organisms, all of the following activities are important EXCEPT",
    options: [
      "tilting the lid of the Petri dish during inoculation.",
      "adding distilled water to a sterilized agar.",
      "sterilizing the inoculating loops.",
      "transferring target micro-organisms into an agar medium."
    ],
    correctAnswer: "B",
    explanation: "Nutrient agar is prepared by dissolving agar powder in distilled water BEFORE sterilization (autoclaving) and pouring into Petri dishes. Adding distilled water to an already sterilized agar medium is unnecessary, dilutes the solidified medium, and risks contamination. Tilting the Petri dish lid slightly (A), flaming the inoculating loop (C), and transferring the inoculum (D) are standard aseptic techniques."
  },
  {
    questionNumber: 3,
    grade: "Grade 9",
    unit: "Unit 4: Microorganisms and Disease (Grade 9)",
    topic: "Unit 4: Micro-organisms and Disease",
    difficulty: "medium",
    prompt: "Which one of the following diseases can be caused by more than one type of microorganisms?",
    options: [
      "Cholera",
      "Gastroenteritis",
      "Typhoid",
      "Tuberculosis"
    ],
    correctAnswer: "B",
    explanation: "Gastroenteritis (acute infectious diarrhea/stomach flu) can be caused by a wide variety of microorganisms, including viruses (rotavirus, norovirus), bacteria (Salmonella, Escherichia coli, Campylobacter, Shigella), and protozoa (Giardia, Entamoeba). In contrast, cholera is specifically caused by Vibrio cholerae, typhoid by Salmonella typhi, and tuberculosis by Mycobacterium tuberculosis."
  },
  {
    questionNumber: 4,
    grade: "Grade 9",
    unit: "Unit 4: Microorganisms and Disease (Grade 9)",
    topic: "Unit 4: Micro-organisms and Disease",
    difficulty: "easy",
    prompt: "Which one of the following diseases is correctly explained with its causes or symptoms?",
    options: [
      "Syphilis is caused by Neisseria gonorrhoeae.",
      "Gonorrhoea has a burning sensation symptom while urinating.",
      "Gonorrhoea is caused by Treponema pallidum.",
      "Syphilis has sore ulceration on the genitals as a symptom."
    ],
    correctAnswer: "B",
    explanation: "Gonorrhoea (caused by the bacterium Neisseria gonorrhoeae) characteristically causes a burning sensation when urinating and a yellowish-white discharge from the genitals. Note: Syphilis (caused by Treponema pallidum) also produces a painless sore/ulceration called a chancre in its primary stage (making D also biologically accurate in textbook descriptions), though B is the primary standard key in the ESSLCE marking scheme."
  },
  {
    questionNumber: 5,
    grade: "Grade 9",
    unit: "Unit 5: Classification (Grade 9)",
    topic: "Unit 5: Classification",
    difficulty: "easy",
    prompt: "The names of which two taxa are used in binomial nomenclature?",
    options: [
      "The two lowest units of classification",
      "The two middle units of classification",
      "The highest and the lowest unit of classification",
      "The two highest units of classification"
    ],
    correctAnswer: "A",
    explanation: "Binomial nomenclature (developed by Carl Linnaeus) names each organism using the two lowest taxonomic ranks in the standard seven-taxon hierarchy (Kingdom, Phylum, Class, Order, Family, Genus, Species): the Genus name (capitalized) and the species epithet (lowercase)."
  },
  {
    questionNumber: 6,
    grade: "Grade 10",
    unit: "Unit 2: Heredity (Grade 10)",
    topic: "Unit 2: Heredity",
    difficulty: "medium",
    prompt: "In a dihybrid self-crossing of a plant with genotype DdCc, 3600 offspring were produced. How many of the offspring will have the ddcc genotype?",
    options: [
      "300",
      "450",
      "150",
      "225"
    ],
    correctAnswer: "D",
    explanation: "In a Mendelian dihybrid self-cross (DdCc × DdCc), the phenotypic ratio is 9:3:3:1 across 16 possible gametic combinations, and the homozygous double-recessive genotype (ddcc) occurs with a probability of 1/16. Multiplying total offspring by 1/16 gives: 3600 × (1/16) = 225 offspring."
  },
  {
    questionNumber: 7,
    grade: "Grade 12",
    unit: "Unit 3: Genetics (Grade 12)",
    topic: "Unit 4: Genetics (Protein Synthesis)",
    difficulty: "medium",
    prompt: "Identify the correct statement regarding translation in eukaryotic cells. The",
    options: [
      "helicase enzyme begins to unwind a section of DNA.",
      "polymerase assembles free RNA nucleotides into a chain.",
      "first two codons of the mRNA enter the ribosome.",
      "RNA polymerase moves along the antisense strand."
    ],
    correctAnswer: "C",
    explanation: "During translation at the ribosome, the mRNA binds to the ribosome such that the first two codons enter the ribosomal binding sites (the P and A sites), allowing complementary tRNA anticodons carrying specific amino acids to align and form a peptide bond. Options A, B, and D describe DNA replication or transcription."
  },
  {
    questionNumber: 8,
    grade: "Grade 12",
    unit: "Unit 3: Genetics (Grade 12)",
    topic: "Unit 4: Genetics (Meiosis and Variation)",
    difficulty: "easy",
    prompt: "Which of the following sentences explains how crossing over brings variation?",
    options: [
      "In meiosis I, there is splitting up of pairs of homologous chromosomes and line up.",
      "In meiosis I, there is exchange of a section of DNA between chromatids.",
      "In meiosis II, homologous chromosomes align themselves independent of other pairs.",
      "In meiosis II, chromatids from each chromosome are separated at random."
    ],
    correctAnswer: "B",
    explanation: "Crossing over takes place during Prophase I of meiosis I, when non-sister chromatids of homologous chromosomes pair up (synapsis), break at chiasmata, and exchange corresponding sections of DNA. This genetic recombination produces new allele combinations on the chromosomes."
  },
  {
    questionNumber: 9,
    grade: "Grade 12",
    unit: "Unit 3: Genetics (Grade 12)",
    topic: "Unit 4: Genetics (DNA Replication)",
    difficulty: "easy",
    prompt: "Consider the following model of DNA replication. Which one of the following is true about A, B and C?",
    options: [
      "A and B are identical with each other but not with C.",
      "C is not identical with A and B.",
      "B and C are not identical with each other.",
      "A, B and C are identical with each other."
    ],
    correctAnswer: "D",
    explanation: "Semi-conservative DNA replication unwinds the parent DNA molecule (C) and uses each strand as a template to synthesize a complementary new strand via base-pairing rules (A-T, G-C). Consequently, the two resulting daughter DNA molecules (A and B) are genetically identical both to each other and to the original parent DNA molecule (C)."
  },
  {
    questionNumber: 10,
    grade: "Grade 12",
    unit: "Unit 3: Genetics (Grade 12)",
    topic: "Unit 4: Genetics (Protein Synthesis)",
    difficulty: "easy",
    prompt: "What is the central role of tRNA in translation?",
    options: [
      "Carrying genetic information from DNA in the nucleus to ribosomes",
      "Recognizing the codon of mRNA and bring the correct amino acid to the ribosomes",
      "Acting as a template for converting a genetic code into amino acid sequence",
      "Assembling the amino acid into a polypeptide chain"
    ],
    correctAnswer: "B",
    explanation: "Transfer RNA (tRNA) molecules act as adaptors during translation: each tRNA has a specific anticodon loop that recognizes and base-pairs with a complementary codon on the mRNA, and an amino acid attachment site at its 3' end that delivers the corresponding amino acid to the growing polypeptide at the ribosome."
  },
  {
    questionNumber: 11,
    grade: "Grade 10",
    unit: "Unit 1: Biotechnology (Grade 10)",
    topic: "Unit 1: Biotechnology",
    difficulty: "easy",
    prompt: "Which one of the following sentences explains the traditional use of biotechnology? Production of",
    options: [
      "insulin using transgenic bacteria",
      "dairy products at household level",
      "myco-proteins under a laboratory",
      "vinegar using industrial fermenter"
    ],
    correctAnswer: "B",
    explanation: "Traditional biotechnology involves using natural microorganisms in household fermentation processes practiced for thousands of years—such as making dairy products (yogurt/ergo, cheese/ayib), baking bread (injera, dabo), and brewing traditional beverages (tella, tej). Transgenic insulin (A), mycoprotein (C), and industrial fermenters (D) represent modern biotechnology."
  },
  {
    questionNumber: 12,
    grade: "Grade 12",
    unit: "Unit 2: Ecology (Grade 12)",
    topic: "Unit 2: Ecology (Energy Flow & Pyramids)",
    difficulty: "easy",
    prompt: "Consider the following diagram demonstrating the pyramid of energy. Which of the following is INCORRECT about the above pyramid of energy?",
    options: [
      "The organisms of each trophic level use large proportion of the energy to build their body.",
      "The organisms of the first trophic level convert light energy into chemical energy.",
      "The energy lost as heat to the surrounding in each trophic level is insignificant.",
      "The amount of energy transferred through the trophic levels drops with each step up of the pyramid."
    ],
    correctAnswer: "C",
    explanation: "In an ecosystem's pyramid of energy, roughly 90% of the energy at each trophic level is lost—primarily as metabolic heat during cellular respiration and unassimilated waste—leaving only ~10% to be transferred to the next trophic level. Therefore, stating that heat loss at each trophic level is 'insignificant' (C) is incorrect."
  },
  {
    questionNumber: 13,
    grade: "Grade 10",
    unit: "Unit 2: Heredity (Grade 10)",
    topic: "Unit 2: Heredity (Mitosis and Meiosis)",
    difficulty: "easy",
    prompt: "Which one of the following sentences is correct about mitosis? It",
    options: [
      "is the division of sex cells resulting in identical daughter cells.",
      "produces four different daughter cells from a single cell.",
      "is the division of somatic cells to make identical daughter cells.",
      "produces half number of chromosomes from the original cell."
    ],
    correctAnswer: "C",
    explanation: "Mitosis is the nuclear division of somatic (body) cells that produces two genetically identical diploid daughter cells with the same chromosome number as the parent cell, supporting growth and tissue repair."
  },
  {
    questionNumber: 14,
    grade: "Grade 10",
    unit: "Unit 2: Heredity (Grade 10)",
    topic: "Unit 2: Heredity (Mendelian Inheritance)",
    difficulty: "easy",
    prompt: "A cross between pea plants having heterozygous genotype (Rr) has been made. Which of the following is correct about the offspring according to the Mendelian inheritance? The genotypic probability of getting",
    options: [
      "Rr is 25%.",
      "Rr is 75%.",
      "RR is 50%.",
      "rr is 25%."
    ],
    correctAnswer: "D",
    explanation: "Crossing two heterozygotes (Rr × Rr) produces a genotypic ratio of 1 RR (25%) : 2 Rr (50%) : 1 rr (25%). Thus, the probability of obtaining offspring with the homozygous recessive genotype (rr) is 25%."
  },
  {
    questionNumber: 15,
    grade: "Grade 10",
    unit: "Unit 2: Heredity (Grade 10)",
    topic: "Unit 2: Heredity (Chromosomes and DNA)",
    difficulty: "easy",
    prompt: "Which one of the following is correct about DNA? It is",
    options: [
      "smaller molecule and coding for only protein.",
      "made of phosphate, sugar and bases.",
      "a single stranded molecule.",
      "less stable and degrades quickly."
    ],
    correctAnswer: "B",
    explanation: "DNA is a polynucleotide macromolecule composed of repeating nucleotide monomers, each consisting of a phosphate group, a pentose sugar (deoxyribose), and a nitrogenous base (A, T, C, or G). DNA is a huge, double-stranded, highly stable molecule (whereas RNA is smaller, single-stranded, and degrades more rapidly)."
  },
  {
    questionNumber: 16,
    grade: "Grade 9",
    unit: "Unit 5: Classification (Grade 9)",
    topic: "Unit 5: Classification (Kingdom Animalia)",
    difficulty: "easy",
    prompt: "Which one of the following phyla is characterized by a flexible cartilaginous rod-like structure, that runs along the dorsal side of the body?",
    options: [
      "Phylum Mollusca",
      "Phylum Chordata",
      "Phylum Annelida",
      "Phylum Arthropoda"
    ],
    correctAnswer: "B",
    explanation: "Animals in Phylum Chordata are defined by possessing a notochord—a flexible, cartilaginous rod-like structure running along the dorsal side of the body—at least at some stage of their development."
  },
  {
    questionNumber: 17,
    grade: "Grade 9",
    unit: "Unit 5: Classification (Grade 9)",
    topic: "Unit 5: Classification (Kingdom Animalia)",
    difficulty: "easy",
    prompt: "Which one of the following groups of organisms is correctly matched with its phylum?",
    options: [
      "Starfish - Phylum Echinodermata",
      "Fish - Phylum Arthropoda",
      "Snail - Phylum Annelida",
      "Earthworm - Phylum Mollusca"
    ],
    correctAnswer: "A",
    explanation: "Starfish (sea stars) are spiny-skinned marine invertebrates belonging to Phylum Echinodermata. Fish belong to Phylum Chordata, snails belong to Phylum Mollusca, and earthworms belong to Phylum Annelida."
  },
  {
    questionNumber: 18,
    grade: "Grade 9",
    unit: "Unit 6: Environment (Grade 9)",
    topic: "Unit 6: Environment (Nutrient Cycles)",
    difficulty: "medium",
    prompt: "Which one of the following events happens during carbon cycle? Carbon dioxide is",
    options: [
      "transferred from plants to animals by their feeding relationship.",
      "absorbed from air when microbes decompose plants and animals.",
      "removed from the air by animals during respiration.",
      "returned into the air by plants during photosynthesis."
    ],
    correctAnswer: "A",
    explanation: "Carbon fixed by plants from atmospheric CO2 into organic compounds during photosynthesis is passed along food chains from plants to animals through feeding relationships. Options B, C, and D are false because decomposition and respiration release CO2 into the air, whereas photosynthesis removes CO2 from the air."
  },
  {
    questionNumber: 19,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (Homeostasis & The Liver)",
    difficulty: "hard",
    prompt: "Which one of the following is not the function of the liver?",
    options: [
      "Controlling cholesterol",
      "Storing glycogen",
      "Monosaccharide metabolism",
      "Bile formation"
    ],
    correctAnswer: "C",
    explanation: "In the Ethiopian Grade 10 Biology curriculum, the major functions of the liver include carbohydrate homeostasis (converting excess glucose to glycogen and storing it), controlling cholesterol levels, bile formation, deamination of excess amino acids, and detoxification. While the liver converts glucose to glycogen, direct cellular oxidation/metabolism of monosaccharides (glycolysis) occurs across all body cells, making 'Monosaccharide metabolism' (C) the intended exception in the ESSLCE key."
  },
  {
    questionNumber: 20,
    grade: "Grade 9",
    unit: "Unit 5: Classification (Grade 9)",
    topic: "Unit 5: Classification (Vertebrate Classes)",
    difficulty: "easy",
    prompt: "A zoologist studied 5 vertebrate species (spA, spB, spC, spD & spE) and described their features as follows.\nspA: Smooth moist skin; pass parts of their lives in water and on land\nspB: Streamlined bodies with scales; gills for gaseous exchange\nspC: Feathers over the body and scales on legs; endothermic; horny beak\nspD: Dry skin with scales; ectothermic; lungs for respiration\nspE: Mammary glands; endothermic; higher internal body temperature\nBased on the features listed above, spA, spB, spC, spD and spE can be classified under the vertebrate classes, respectively,",
    options: [
      "Amphibia, Reptilia, Aves, Mammalia, and Pisces.",
      "Pisces, Aves, Reptilia, Mammalia, and Amphibia.",
      "Pisces, Amphibia, Aves, Reptilia, and Mammalia.",
      "Amphibia, Pisces, Aves, Reptilia, and Mammalia."
    ],
    correctAnswer: "D",
    explanation: "Matching each description to its vertebrate class: spA (moist skin, dual water/land life) = Amphibia; spB (scales, gills, streamlined) = Pisces (fish); spC (feathers, beak, endothermic) = Aves (birds); spD (dry scaly skin, ectothermic, lungs) = Reptilia; spE (mammary glands, endothermic) = Mammalia."
  },
  {
    questionNumber: 21,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health / Adaptations to Environment",
    difficulty: "easy",
    prompt: "Which of the following plant adaptation mechanisms helps cactus to adapt in the desert environment?",
    options: [
      "Spreading its seeds in wider areas",
      "Increasing number of stomata in its leaves",
      "Having broad leaves",
      "Storing water in its tissue"
    ],
    correctAnswer: "D",
    explanation: "Cacti are xerophytes (succulent plants) adapted to arid desert environments by storing large quantities of water in their thick, fleshy stem tissues, reducing leaves to spines to minimize surface area, and having sunken/fewer stomata."
  },
  {
    questionNumber: 22,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (The Skin & Thermoregulation)",
    difficulty: "easy",
    prompt: "What is the function of dermis of the skin? It",
    options: [
      "acts as protection against heat loss.",
      "protects the entry of pathogens into the body.",
      "forms a waterproof around the body tissue.",
      "contains blood vessels and sweat glands."
    ],
    correctAnswer: "D",
    explanation: "The dermis (middle layer of the skin) is rich in connective tissue and houses blood vessels (arterioles and capillaries), sweat glands, sebaceous glands, hair follicles, and sensory nerve endings. Waterproofing and pathogen barrier functions belong primarily to the cornified epidermis (B, C), while insulation against heat loss belongs to the subcutaneous fat layer/hypodermis (A)."
  },
  {
    questionNumber: 23,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (Sense Organs - The Ear)",
    difficulty: "medium",
    prompt: "Children who play by spinning round and round fast, when they stop, they feel dizzy. Why?",
    options: [
      "The otoliths round in the same direction with the head.",
      "The optic nerves reports that the children are still moving.",
      "The fluid in their semicircular canals keeps on moving after they stop.",
      "The sensory hairs vibrate highly in response to movement of their body."
    ],
    correctAnswer: "C",
    explanation: "Rotational movement is detected by the three semicircular canals of the inner ear. When someone spins rapidly and then suddenly stops, the endolymph fluid inside the semicircular canals continues moving briefly due to inertia, bending the cupula and hair cells and sending false signals to the brain that the head is still spinning, causing dizziness."
  },
  {
    questionNumber: 24,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (Reproductive System)",
    difficulty: "easy",
    prompt: "When does menstruation start in women with no obvious reproductive health problem? It happens when",
    options: [
      "the fertilized ovum reaches the uterus and attaches into the thick, spongy lining.",
      "the FSH stimulates the development of a follicle in the ovary and the egg ripens.",
      "pregnancy occurs and the embryo obtains nourishment and oxygen.",
      "thick spongy lining of the uterus detaches in the absence of pregnancy."
    ],
    correctAnswer: "D",
    explanation: "If fertilization and implantation do not occur, the corpus luteum degenerates, progesterone and estrogen levels drop sharply, and the thick, vascular, spongy endometrium (lining of the uterus) breaks down and detaches, exiting through the vagina as menstrual flow."
  },
  {
    questionNumber: 25,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (Excretory System / The Kidney)",
    difficulty: "medium",
    prompt: "Which one of the following sentences is correctly matched with the function of kidney structures?",
    options: [
      "Bowman's capsule - acts as a filter to produce urine",
      "Cortex - monitors the osmotic pressure of the blood",
      "Glomerulus - concentrates urine and conserves water",
      "Loop of Henle - involved in ultrafiltration"
    ],
    correctAnswer: "A",
    explanation: "Together with the glomerulus, Bowman's capsule acts as the ultrafiltration unit of the nephron, filtering blood plasma under high pressure to form glomerular filtrate (the precursor to urine). Osmotic pressure is monitored by osmoreceptors in the hypothalamus (not the cortex), and the Loop of Henle concentrates urine and conserves water (not the glomerulus)."
  },
  {
    questionNumber: 26,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (Thermoregulation)",
    difficulty: "easy",
    prompt: "Which of the following temperature controlling mechanisms in homoiotherms is categorized into behavioral method?",
    options: [
      "Sweating when the temperature increases",
      "Constriction of capillaries when the temperature falls",
      "Shivering as a result of drop in temperature",
      "Seeking shade when the temperature rises"
    ],
    correctAnswer: "D",
    explanation: "Thermoregulatory mechanisms are divided into physiological (autonomic responses like sweating, vasoconstriction, vasodilation, and shivering) and behavioral responses (conscious actions such as seeking shade, wallowing, burrowing, or changing clothing). Seeking shade (D) is a behavioral mechanism."
  },
  {
    questionNumber: 27,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Industrial & Medical Applications of Enzymes)",
    difficulty: "easy",
    prompt: "Industries in the medicine sector use glucose oxidase in clinistix strips for",
    options: [
      "restoring blood supply to area of heart muscle.",
      "detecting toxic metabolites in the blood.",
      "easy diagnosis of diabetes by examining a urine sample.",
      "reducing the viscosity of mucus."
    ],
    correctAnswer: "C",
    explanation: "Clinistix (biosensor test strips) contain immobilized enzymes glucose oxidase and peroxidase along with a chromogen. They are dipped into a urine sample to detect glucose (glycosuria) via a color change, providing a rapid and easy diagnostic test for diabetes mellitus."
  },
  {
    questionNumber: 28,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Enzyme Classification and Nomenclature)",
    difficulty: "medium",
    prompt: "In the systematic naming of enzymes, assume an enzyme is designated as EC 3.4.11.1. Which of the following correctly describes this enzyme?",
    options: [
      "11 - gives a sub-subclass to which the enzyme belongs.",
      "1 - a reference of Enzyme Commission.",
      "4 - shows to which main class the enzyme belongs.",
      "3 - indicates a subclass to which the enzyme belongs."
    ],
    correctAnswer: "A",
    explanation: "In the Enzyme Commission (EC) four-number code (EC W.X.Y.Z): the 1st digit (3) denotes the main class (Hydrolases), the 2nd digit (4) denotes the subclass, the 3rd digit (11) denotes the sub-subclass, and the 4th digit (1) is the specific serial number of the enzyme within its sub-subclass."
  },
  {
    questionNumber: 29,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Models of Enzyme Action)",
    difficulty: "easy",
    prompt: "Which one of the following sentences explains the lock-and-key model of enzyme action? The",
    options: [
      "attached substrate- the enzyme complex enters into a transition state.",
      "model explains enzyme inhibition in a complete manner.",
      "shapes of the substrate is complementary to the active site.",
      "attachment of substrate to an enzyme produces a conformational change."
    ],
    correctAnswer: "C",
    explanation: "Fischer's lock-and-key model proposes that the rigid active site of an enzyme has a specific geometric shape that is directly complementary to the shape of its substrate, fitting together like a key into a lock without undergoing a conformational change (which is instead described by Koshland's induced-fit model in A and D)."
  },
  {
    questionNumber: 30,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Cofactors, Coenzymes, and Holoenzymes)",
    difficulty: "easy",
    prompt: "Which one of the following sentences is correct about apo-enzymes? They are",
    options: [
      "cofactors that give an enzyme its catalytic activity.",
      "proteins that combine with cofactors to form active enzymes.",
      "organic molecules and many are derived from vitamins.",
      "inorganic molecules that bind loosely with the cofactors."
    ],
    correctAnswer: "B",
    explanation: "An apoenzyme is the inactive protein portion of a conjugate enzyme. It must bind with its non-protein cofactor (an inorganic ion or an organic coenzyme) to form the catalytically active whole enzyme, called a holoenzyme."
  },
  {
    questionNumber: 31,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Enzyme Inhibition)",
    difficulty: "easy",
    prompt: "How does a competitive inhibitor affect an enzyme catalyzed reaction? By",
    options: [
      "denaturing the active site of the enzyme",
      "producing conformational change of the enzyme",
      "binding to the allosteric site of the enzyme",
      "blocking the active site of the enzyme"
    ],
    correctAnswer: "D",
    explanation: "A competitive inhibitor has a molecular structure similar to the normal substrate and competes directly with the substrate for the enzyme's active site. By binding to and occupying the active site, it temporarily blocks the substrate from binding."
  },
  {
    questionNumber: 32,
    grade: "Grade 10",
    unit: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    topic: "Unit 4: Food Making and Growth in Plants (Leaf Structure)",
    difficulty: "easy",
    prompt: "Which one of the following leaf structures is correctly matched with its function?",
    options: [
      "Palisade mesophyll - the main photosynthetic tissue of the leaf",
      "Waxy cuticle - controls the entry of carbon dioxide into the leaf",
      "Guard cells - have lots of air space and gas exchange area of the leaf",
      "Spongy mesophyll - helps to prevent water loss from the leaf"
    ],
    correctAnswer: "A",
    explanation: "The palisade mesophyll consists of tightly packed, columnar cells near the upper surface of the leaf that are densely packed with chloroplasts, making it the primary site of photosynthesis. The waxy cuticle prevents water loss (D), guard cells regulate stomatal opening to control CO2 entry (B), and the spongy mesophyll has large air spaces for gas diffusion (C)."
  },
  {
    questionNumber: 33,
    grade: "Grade 10",
    unit: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    topic: "Unit 4: Food Making and Growth in Plants (Transport in Plants)",
    difficulty: "medium",
    prompt: "Which one of the following statements correctly describes the movement of materials in plants?",
    options: [
      "Passive transport can takes place in the phloem.",
      "The transport of organic materials is due to transpiration.",
      "Water is transported in dead tissue.",
      "Active transport can take place in the xylem."
    ],
    correctAnswer: "C",
    explanation: "Water and dissolved mineral ions are transported upward from the roots to the leaves via the xylem, which consists of hollow, lignified, dead cells (xylem vessels and tracheids) moved passively by transpiration pull. Phloem consists of living sieve tubes that transport organic solutes via active translocation."
  },
  {
    questionNumber: 34,
    grade: "Grade 10",
    unit: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    topic: "Unit 4: Food Making and Growth in Plants (Plant Hormones)",
    difficulty: "easy",
    prompt: "What will happen if an agriculture extension worker injects gibberellins into a dwarf plant? The",
    options: [
      "leaves will fall.",
      "stem will grow.",
      "roots will elongate.",
      "side shoots will grow fast."
    ],
    correctAnswer: "B",
    explanation: "Gibberellins are plant growth hormones that stimulate cell elongation and division in stems (internode elongation). Applying gibberellins to genetically dwarf plants overcomes their dwarfism and causes their stems to elongate to normal height."
  },
  {
    questionNumber: 35,
    grade: "Grade 10",
    unit: "Unit 4: Food Making and Growth in Plants (Grade 10)",
    topic: "Unit 4: Food Making and Growth in Plants (Seed Germination)",
    difficulty: "medium",
    prompt: "A biologist collected two types of seeds (SA and SB) from the field and sowed them in moist soils enriched with nutrients. Then, he recorded his observations as follows:\nSA:\n• The seedling of this seed emerged from the soil curved while pushing up through the soil.\n• The hypocotyl straightened and carried the cotyledons and plumule above the soil surface.\nSB:\n• The plumule of the seedling pushed its way out of the soil, while the cotyledon remained underground.\n• Unlike what occurred during the germination of SA, the plumule of this seed did not form a hook.\nWhich one of the following is correct about the observations of the biologist?",
    options: [
      "Both SA and SB are of monocots.",
      "SA is of a monocot, while SB is of a dicot.",
      "Both SA and SB are of dicots.",
      "SA is of a dicot, while SB is of a monocot."
    ],
    correctAnswer: "D",
    explanation: "Seed SA exhibits epigeal germination (the hypocotyl forms a protective hook and elongates, carrying the cotyledons above ground), which is typical of dicot seeds such as kidney beans. Seed SB exhibits hypogeal germination where the cotyledon remains underground and the plumule pushes straight up (enclosed in a coleoptile without forming a hypocotyl hook), which is typical of monocot seeds such as maize."
  },
  {
    questionNumber: 36,
    grade: "Grade 11",
    unit: "Unit 2: Biochemical Molecules (Grade 11)",
    topic: "Unit 2: Biochemical Molecules (Properties of Water)",
    difficulty: "easy",
    prompt: "Which one of the following sentences correctly describes the properties of water? It",
    options: [
      "contracts when it freezes and ice acts as an insulator.",
      "takes low energy to change into vapor.",
      "allows all light wavelengths to pass through its various depths.",
      "requires high amount of energy to heat up."
    ],
    correctAnswer: "D",
    explanation: "Due to extensive hydrogen bonding between water molecules, water has a high specific heat capacity—meaning it requires a large amount of heat energy to raise its temperature. Option A is false because water expands (becomes less dense) when it freezes; Option B is false because water has a high latent heat of vaporization."
  },
  {
    questionNumber: 37,
    grade: "Grade 11",
    unit: "Unit 2: Biochemical Molecules (Grade 11)",
    topic: "Unit 2: Biochemical Molecules / Grade 10 Unit 2: Heredity",
    difficulty: "medium",
    prompt: "An organic molecule which is an important part of structure of chromosome is",
    options: [
      "amino acid.",
      "glycogen.",
      "amylose.",
      "triglyceride."
    ],
    correctAnswer: "A",
    explanation: "Eukaryotic chromosomes are composed of chromatin, a complex of DNA tightly wound around histone proteins. Since proteins are polymers built from amino acids (whereas glycogen and amylose are polysaccharides and triglycerides are lipids), amino acids are an essential organic structural component of chromosomes."
  },
  {
    questionNumber: 38,
    grade: "Grade 11",
    unit: "Unit 2: Biochemical Molecules (Grade 11)",
    topic: "Unit 2: Biochemical Molecules (Carbohydrates)",
    difficulty: "medium",
    prompt: "In animal cells, glycogen is hydrolyzed quickly to release glucose for respiration. This is due to the presence of several",
    options: [
      "microfibrils in its side chain.",
      "α-1,6-glycosidic bonds.",
      "β-1,4-glycosidic bonds.",
      "enzymes that hydrolyse it easily."
    ],
    correctAnswer: "B",
    explanation: "Glycogen is a highly branched polysaccharide containing numerous α-1,6-glycosidic bonds at its branch points (every 8–10 glucose residues) in addition to α-1,4-glycosidic bonds along its chains. This high degree of branching creates many terminal ends where enzymes can simultaneously attach and rapidly hydrolyze glucose units to meet the high metabolic demands of animal cells."
  },
  {
    questionNumber: 39,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Factors Affecting Enzyme Action)",
    difficulty: "hard",
    prompt: "A student has conducted an experiment using different enzymes to assess the enhancement of reaction rates under different conditions. She represents her results as indicated in the following table.\n\nEnzyme | Cofactor | Rate Enhancement | Optimum Temp (°C)\nX | Zn++ | 1.4 × 10^17 | 37\nY | Cu++ | 7.7 × 10^6 | 45\nZ | None | 4.6 × 10^5 | 28\nM | Co++ | 1.7 × 10^8 | 30\n\nWhich one of the following is an acceptable conclusion of the experiment?",
    options: [
      "Enzyme 'X' could have enhanced the rate better at temperature slightly higher than 37°C.",
      "Enzyme 'M' cannot enhance the rate of reaction further if the temperature exceeds 30°C.",
      "The rate enhancement for enzymes 'Z' is less because it didn't use a cofactor.",
      "As temperature increases the rate of chemical reaction decreases."
    ],
    correctAnswer: "B",
    explanation: "The table lists the 'Optimum temperature required (°C)' for each enzyme, which is the temperature at which the enzyme achieves its maximum possible rate enhancement. For Enzyme 'M', the optimum temperature is 30°C (with a rate enhancement of 1.7 × 10^8). Therefore, increasing the temperature beyond its 30°C optimum will not increase the reaction rate further (in fact, activity declines above the optimum due to thermal denaturation). Option A is false for the same reason (37°C is already X's optimum)."
  },
  {
    questionNumber: 40,
    grade: "Grade 11",
    unit: "Unit 2: Biochemical Molecules (Grade 11)",
    topic: "Unit 2: Biochemical Molecules (Lipids)",
    difficulty: "medium",
    prompt: "This item is based on the following diagram which depicts structural formula of a biological molecule: [Three-carbon chain with three -OH hydroxyl groups: CH2(OH)-CH(OH)-CH2(OH)]. The molecule represented by the above structure is",
    options: [
      "cellulose.",
      "amylopectin.",
      "fatty acid.",
      "glycerol."
    ],
    correctAnswer: "D",
    explanation: "The vertical three-carbon polyalcohol structure (C3H8O3, propane-1,2,3-triol, with three carbons each bonded to a hydroxyl -OH group) represents glycerol, one of the two building blocks of triglycerides and phospholipids."
  },
  {
    questionNumber: 41,
    grade: "Grade 10",
    unit: "Unit 5: Conservation of Natural Resources (Grade 10)",
    topic: "Unit 5: Conservation of Natural Resources (Biodiversity in Ethiopia)",
    difficulty: "medium",
    prompt: "Which of the following is an Ethiopian endemic plant?",
    options: [
      "Noug seed",
      "Avocado",
      "Bahir zaf",
      "Bunna"
    ],
    correctAnswer: "A",
    explanation: "In the Ethiopian secondary biology curriculum, Noug (Guizotia abyssinica / Niger seed), Teff, Enset, and Zigba are highlighted as indigenous/endemic Ethiopian crop/plant species domesticated in the Ethiopian highlands (whereas Avocado is native to Central America and Bahir zaf / Eucalyptus was introduced from Australia)."
  },
  {
    questionNumber: 42,
    grade: "Grade 11",
    unit: "Unit 1: The Science of Biology (Grade 11)",
    topic: "Unit 1: The Science of Biology (The Scientific Method)",
    difficulty: "easy",
    prompt: "When a biologist shares her research findings with other fellow biologists, she is",
    options: [
      "making her hypothesis.",
      "reporting her result.",
      "drawing her conclusion.",
      "analyzing her data."
    ],
    correctAnswer: "B",
    explanation: "The final step of the scientific method—communicating and publishing research findings in scientific journals or conferences so other scientists can review and replicate the work—is reporting the results."
  },
  {
    questionNumber: 43,
    grade: "Grade 10",
    unit: "Unit 5: Conservation of Natural Resources (Grade 10)",
    topic: "Unit 5: Conservation of Natural Resources (Wildlife & National Parks)",
    difficulty: "easy",
    prompt: "Walia ibex is an endemic animal species in Ethiopia which is found in",
    options: [
      "Nechisar National Park.",
      "Omo National Park.",
      "Bale Mountain National Park.",
      "Simien Mountain National Park."
    ],
    correctAnswer: "D",
    explanation: "The Walia ibex (Capra walie) is a critically endangered endemic wild goat found exclusively on the northern escarpments of the Simien Mountains National Park in Ethiopia."
  },
  {
    questionNumber: 44,
    grade: "Grade 10",
    unit: "Unit 5: Conservation of Natural Resources (Grade 10)",
    topic: "Unit 5: Conservation of Natural Resources (Pollution & Global Warming)",
    difficulty: "easy",
    prompt: "All of the following sentences are correct about pollution EXCEPT",
    options: [
      "deforestation increases the amount of CO2 absorbed from the atmosphere.",
      "decomposition of dead bodies increases the amount of CO2 in the atmosphere.",
      "burning fossil fuels increases pollution due to the release of hydrocarbons.",
      "burning of wood increases pollution by causing global dimming which blocks sunlight."
    ],
    correctAnswer: "A",
    explanation: "Trees act as carbon sinks that absorb CO2 from the atmosphere via photosynthesis. Therefore, deforestation DECREASES the amount of CO2 absorbed from the atmosphere (leading to higher atmospheric CO2 levels and global warming), making statement A false."
  },
  {
    questionNumber: 45,
    grade: "Grade 11",
    unit: "Unit 2: Biochemical Molecules (Grade 11)",
    topic: "Unit 2: Biochemical Molecules (Organic vs. Inorganic Molecules)",
    difficulty: "easy",
    prompt: "This item is based on the table below which shows a list of molecules:\nRow 1: Calcium carbonate, glucose and methane\nRow 2: Carbon dioxide, linoleic acid and water\nRow 3: Linoleic acid, glucose and methane\nRow 4: Iron III oxide, glycine and glucose\n\nIn the above table, which number holds only organic molecules?",
    options: [
      "2",
      "3",
      "4",
      "1"
    ],
    correctAnswer: "B",
    explanation: "Organic molecules are carbon-containing compounds with C–H bonds (excluding simple oxides, carbonates, and cyanides). Row 3 contains linoleic acid (a fatty acid), glucose (a monosaccharide), and methane (a hydrocarbon)—all three are organic molecules. Row 1 contains inorganic calcium carbonate (CaCO3); Row 2 contains inorganic CO2 and H2O; Row 4 contains inorganic Iron(III) oxide (Fe2O3)."
  },
  {
    questionNumber: 46,
    grade: "Grade 9",
    unit: "Unit 3: Human Biology and Health (Grade 9)",
    topic: "Unit 3: Human Biology and Health (The Digestive System)",
    difficulty: "easy",
    prompt: "Which of the following enzymes is correctly matched to the food stuffs it acts on?",
    options: [
      "Pepsin - protein",
      "Maltase - lipids",
      "Amylase - fats",
      "Trypsin - starch"
    ],
    correctAnswer: "A",
    explanation: "Pepsin is a gastric protease secreted in the stomach that hydrolyzes proteins into peptides. Maltase acts on maltose (a disaccharide), amylase acts on starch, and trypsin acts on proteins/polypeptides."
  },
  {
    questionNumber: 47,
    grade: "Grade 9",
    unit: "Unit 3: Human Biology and Health (Grade 9)",
    topic: "Unit 3: Human Biology and Health (Breathing & Artificial Respiration)",
    difficulty: "easy",
    prompt: "Suppose your friend fails suddenly due to heart attack while he is playing football. The victim needs artificial breathing to keep him alive until medical support arrives. Which activity is strictly prohibited in this situation?",
    options: [
      "Remove any obstacle from the mouth that might block the airway",
      "Open the airway by removing any obstacles from the mouth",
      "Make sure the airway is open and the head is tilted back",
      "Give mouth to mouth resuscitation if he is conscious"
    ],
    correctAnswer: "D",
    explanation: "Artificial respiration (mouth-to-mouth resuscitation) is performed only on an unconscious casualty who has stopped breathing. Giving mouth-to-mouth resuscitation to a conscious, breathing person is unnecessary and strictly prohibited. Options A, B, and C are essential first-aid steps (ABC protocol)."
  },
  {
    questionNumber: 48,
    grade: "Grade 9",
    unit: "Unit 3: Human Biology and Health (Grade 9)",
    topic: "Unit 3: Human Biology and Health (Mechanism of Breathing)",
    difficulty: "medium",
    prompt: "Consider the following figure which demonstrates air movements during breathing using the bell-jar model representing the lung. Which of the following breathing movements happens when air enters into and exits from the balloon lungs?",
    options: [
      "Air enters when the bell-jar thorax contracts.",
      "Air enters when the rubber sheet is pushed up.",
      "Air exits when Y-piece is rotated both clock wise and counter-clockwise.",
      "Air exits when the balloon lungs have higher pressure than the external environment."
    ],
    correctAnswer: "D",
    explanation: "In the bell-jar lung model, pulling the rubber sheet (diaphragm) down increases the volume inside the bell jar, lowering internal pressure below atmospheric pressure so air enters the balloons. Pushing the rubber sheet up decreases the volume and increases pressure inside the bell jar and balloon lungs above the external atmospheric pressure, forcing air to exit (D)."
  },
  {
    questionNumber: 49,
    grade: "Grade 9",
    unit: "Unit 3: Human Biology and Health (Grade 9)",
    topic: "Unit 3: Human Biology and Health (The Heart and Circulation)",
    difficulty: "easy",
    prompt: "Which one of the following structures of the heart is correctly matched with its function?",
    options: [
      "Right atrium - contracts and forces deoxygenated blood into the lungs",
      "Left ventricle - contracts and forces oxygenated blood around the body",
      "Right ventricle - contracts and forces blood into the left ventricles",
      "Left atrium - contracts and forces blood into the right ventricles"
    ],
    correctAnswer: "B",
    explanation: "The thick-walled left ventricle contracts powerfully to pump oxygenated blood through the aorta to the entire body (systemic circulation). The right atrium pumps blood into the right ventricle (not lungs), the right ventricle pumps blood to the lungs, and the left atrium pumps blood into the left ventricle."
  },
  {
    questionNumber: 50,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (Cellular Respiration)",
    difficulty: "easy",
    prompt: "In the aerobic cellular respiration",
    options: [
      "Krebs cycle takes place in the cytoplasm.",
      "glycolysis takes place in the mitochondria.",
      "electron transport chain takes place in the cytoplasm.",
      "pyruvate enters into the mitochondria for further stages."
    ],
    correctAnswer: "D",
    explanation: "During aerobic respiration, glycolysis occurs in the cytoplasm (cytosol) to produce pyruvate. When oxygen is available, pyruvate is actively transported into the mitochondrial matrix, where it undergoes the link reaction and the Krebs cycle, followed by the electron transport chain on the inner mitochondrial membrane."
  },
  {
    questionNumber: 51,
    grade: "Grade 9",
    unit: "Unit 3: Human Biology and Health (Grade 9)",
    topic: "Unit 3: Human Biology and Health (Double Circulation)",
    difficulty: "easy",
    prompt: "Consider the following diagram showing blood circulation system in the human body. In the above diagram, the parts indicated by numbers 1, 2, 3 and 4, are respectively",
    options: [
      "aorta, vena cava, pulmonary vein, pulmonary artery.",
      "pulmonary artery, pulmonary vein, vena cava, aorta.",
      "pulmonary vein, aorta, vena cava, pulmonary artery.",
      "vena cava, pulmonary artery, aorta, pulmonary vein."
    ],
    correctAnswer: "A",
    explanation: "Following the arrows in the double circulation diagram: Vessel 1 carries blood from the heart to the body (aorta); Vessel 2 returns blood from the body to the heart (vena cava); Vessel 3 carries oxygenated blood from the lungs to the heart (pulmonary vein); Vessel 4 carries deoxygenated blood from the heart to the lungs (pulmonary artery)."
  },
  {
    questionNumber: 52,
    grade: "Grade 11",
    unit: "Unit 4: Cell Biology (Grade 11)",
    topic: "Unit 4: Cell Biology (Fluid Mosaic Model of Cell Membrane)",
    difficulty: "medium",
    prompt: "Which one of the following descriptions of proteins is correctly matched with its function in a cell membrane?",
    options: [
      "Peripheral protein - anchor integral proteins to the cytoskeleton",
      "Glycoprotein - reduces the fluidity of the membrane",
      "Channel proteins - larger molecules can pass through them",
      "Carrier proteins - specific ions can pass along them"
    ],
    correctAnswer: "A",
    explanation: "Peripheral (extrinsic) proteins on the cytoplasmic surface of the plasma membrane attach to integral proteins and link them to intracellular cytoskeleton filaments, maintaining cell shape and stabilizing protein positions. Cholesterol (not glycoprotein) regulates membrane fluidity (B), channel proteins form narrow hydrophilic pores for small specific ions/water (C), and carrier proteins bind specific molecules like glucose/amino acids (and ions via pumps) by undergoing conformational change."
  },
  {
    questionNumber: 53,
    grade: "Grade 9",
    unit: "Unit 2: Cell Biology (Grade 9)",
    topic: "Unit 2: Cell Biology (Osmosis)",
    difficulty: "medium",
    prompt: "Suppose a hypothetical cell of 15% solute concentration is put in a beaker containing 90% water and 10% solute. In which way will the water move?",
    options: [
      "From the cell to the beaker",
      "From the beaker to the cell",
      "Both into and out of the cell",
      "Both into and out of the beaker"
    ],
    correctAnswer: "B",
    explanation: "A cell with 15% solute has 85% water, whereas the beaker solution has 10% solute and 90% water (making the beaker solution hypotonic / higher water potential relative to the cell). By osmosis, net water movement occurs from the region of higher water concentration (90% in the beaker) to the region of lower water concentration (85% inside the cell)—i.e., from the beaker to the cell."
  },
  {
    questionNumber: 54,
    grade: "Grade 12",
    unit: "Unit 5: Behavior (Grade 12)",
    topic: "Unit 5: Behavior (Innate vs. Learned Behavior)",
    difficulty: "easy",
    prompt: "Which one of the following is an example of a learned behaviour?",
    options: [
      "Nest-building",
      "Knee-jerk reflex",
      "Weaving a web",
      "Classical conditioning"
    ],
    correctAnswer: "D",
    explanation: "Classical conditioning (discovered by Ivan Pavlov) is a form of associative learned behavior in which an animal learns to associate a neutral conditioned stimulus with an unconditioned stimulus. Nest-building by birds (A), the knee-jerk spinal reflex (B), and web-weaving by spiders (C) are innate (inborn, genetically programmed) behaviors."
  },
  {
    questionNumber: 55,
    grade: "Grade 11",
    unit: "Unit 4: Cell Biology (Grade 11)",
    topic: "Unit 4: Cell Biology (Membrane Transport)",
    difficulty: "easy",
    prompt: "Which one of the following is correct about transport of substances across the cell membrane?",
    options: [
      "Simple diffusion - large particles transported through channel proteins",
      "Facilitated diffusion - particles move from high water potential to lower one",
      "Passive transport - particles require energy in the form of ATP to derive the transport",
      "Active transport - particles move from low to higher concentration using carrier proteins"
    ],
    correctAnswer: "D",
    explanation: "Active transport moves ions or molecules against their concentration gradient (from lower concentration to higher concentration) across a cell membrane using specific protein carrier pumps and metabolic energy from ATP."
  },
  {
    questionNumber: 56,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (The Krebs Cycle)",
    difficulty: "medium",
    prompt: "Which one of the following processes of aerobic respiration takes place in the Krebs cycle?",
    options: [
      "Hydrogen atoms carried by reduced NAD and FAD are released and split into protons and electrons.",
      "Two molecules of ATP are used to phosphorylate each molecules of glucose.",
      "Two carbon group from acetyl coenzyme A reacts with a 4-carbon compound to form citrate.",
      "Fructose 1, 6-bisphosphate is split into two molecules of the three-carbon sugar GP."
    ],
    correctAnswer: "C",
    explanation: "In the first step of the Krebs (citric acid) cycle inside the mitochondrial matrix, the 2-carbon acetyl group from acetyl-CoA condenses with a 4-carbon compound (oxaloacetate) to form the 6-carbon compound citrate (citric acid). Option A occurs in the electron transport chain, while Options B and D occur in glycolysis."
  },
  {
    questionNumber: 57,
    grade: "Grade 12",
    unit: "Unit 4: Evolution (Grade 12)",
    topic: "Unit 3: Evolution (Human Evolution & Brain Size)",
    difficulty: "medium",
    prompt: "In the course of evolution, which of the following is true about the human brain?",
    options: [
      "Modern humans have a brain size between 0.7% and 1.0% of their body mass.",
      "Australopithecus have a brain size between 1.8% and 2.3% of their body mass.",
      "The pre-humans brain uses 80% of the resting energy requirement.",
      "Homo sapiens brain uses 25% of the resting energy requirement."
    ],
    correctAnswer: "D",
    explanation: "In the Ethiopian Grade 12 Biology textbook (Unit 3, Human Evolution), it is explicitly noted that the large brain of modern humans (Homo sapiens) makes up 1.8% to 2.3% of total body mass (whereas Australopithecus had a brain size of 0.7% to 1.0% of body mass) and consumes about 25% of the body's resting energy requirement."
  },
  {
    questionNumber: 58,
    grade: "Grade 12",
    unit: "Unit 5: Behavior (Grade 12)",
    topic: "Unit 5: Behavior (Innate vs. Learned Behavior)",
    difficulty: "easy",
    prompt: "All of the following are examples of innate behaviours EXCEPT",
    options: [
      "training killer whales at marine parks.",
      "increasing breathing rate during exercise.",
      "producing tears when dust gets into the eyes.",
      "a fly moving its maggot into more humid environment."
    ],
    correctAnswer: "A",
    explanation: "Training killer whales at marine parks involves operant conditioning (rewarding desired actions with fish/reinforcement), which is a learned behavior. Options B and C are innate physiological/protective reflexes, and Option D (kinesis/taxis of maggots moving to humid environments) is an innate orientation behavior."
  },
  {
    questionNumber: 59,
    grade: "Grade 12",
    unit: "Unit 5: Behavior (Grade 12)",
    topic: "Unit 5: Behavior (Learned Behavior - Insight Learning)",
    difficulty: "easy",
    prompt: "Which one of the following is an example of in-sight learning?",
    options: [
      "Salivation of a dog when a bell was rung in the absence of food, which was paired with the conditioned stimulus.",
      "Use of boxes, after several trials, by a chimpanzee placed in an enclosed area to obtain bananas placed on the top of an enclosure.",
      "Exhibition of modifications of natural behaviors of guide dogs, horses or zoo animals to desired behaviors.",
      "Lack of response from a lady, which sat in a shop in which a strong deodorant was continuously released from a can."
    ],
    correctAnswer: "B",
    explanation: "Wolfgang Köhler's classic experiments with chimpanzees (such as Sultan stacking boxes to reach bananas suspended from the ceiling of an enclosure) demonstrate insight learning—solving a problem mentally by understanding relationships between objects. Option A is classical conditioning, Option C is operant conditioning, and Option D is habituation."
  },
  {
    questionNumber: 60,
    grade: "Grade 12",
    unit: "Unit 5: Behavior (Grade 12)",
    topic: "Unit 5: Behavior (Social and Territorial Behavior)",
    difficulty: "easy",
    prompt: "Which one of the following is an example of territorial behaviour of animals?",
    options: [
      "A male robin threatening an intruder",
      "Fixed action of zebra fish to find a mate",
      "Penguins huddling to reduce heat loss",
      "Honeybees nesting in a tree"
    ],
    correctAnswer: "A",
    explanation: "Territorial behavior involves defending a specific geographical area against conspecific intruders (often using songs, visual displays, or threat postures, such as a male European robin displaying its red breast to threaten an intruder). Option B is courtship behavior, Option C is thermoregulatory social aggregation, and Option D is eusocial nesting."
  },
  {
    questionNumber: 61,
    grade: "Grade 9",
    unit: "Unit 1: Biology and Technology (Grade 9)",
    topic: "Unit 1: Biology and Technology (Renowned Ethiopian Biologists)",
    difficulty: "easy",
    prompt: "One of the following renowned Ethiopian biologists has developed a vaccine for the rinderpest disease.",
    options: [
      "Professor Sebsebe Demissew",
      "Professor Yalemtsehay Mekonnen",
      "Professor Beyene Petros",
      "Professor Tilahun Yilma"
    ],
    correctAnswer: "D",
    explanation: "Professor Tilahun Yilma is a world-renowned Ethiopian veterinary virologist who developed a heat-stable recombinant vaccine against the devastating cattle plague rinderpest, playing a pivotal role in the global eradication of the disease."
  },
  {
    questionNumber: 62,
    grade: "Grade 9",
    unit: "Unit 2: Cell Biology (Grade 9)",
    topic: "Unit 2: Cell Biology (The Microscope)",
    difficulty: "easy",
    prompt: "A grade nine student has planned to study animal cells using a compound light microscope. She prepared a slide of stained human cheek cells for this purpose. Which one of the following activities should she first do?",
    options: [
      "Adjust the iris diaphragm until the maximum brightness is coming.",
      "Set up the microscope with the lowest power objective in place.",
      "Using coarse focusing knob to rotate the nosepiece for a higher magnification lens.",
      "Looking through the eyepiece lens to move the objectives down."
    ],
    correctAnswer: "B",
    explanation: "When beginning microscopic observation of a specimen slide, the very first step in setting up the compound light microscope is to click the lowest power objective lens into position over the stage (as it provides the widest field of view and prevents the lens from striking the slide)."
  },
  {
    questionNumber: 63,
    grade: "Grade 9",
    unit: "Unit 2: Cell Biology (Grade 9)",
    topic: "Unit 2: Cell Biology (Cell Structure and Function)",
    difficulty: "easy",
    prompt: "Which one of the following is true about plant cells? They have",
    options: [
      "vacuole which controls all activities of the cell.",
      "lysosomes which contain hydrolytic enzymes.",
      "chloroplast which is filled with sap, liquids and minerals.",
      "cell wall which gives support and strengthen to the cell."
    ],
    correctAnswer: "D",
    explanation: "Plant cells are surrounded by a rigid outer cellulose cell wall that provides mechanical support, strength, and protection against osmotic bursting. The nucleus (not vacuole) controls cell activities (A), the vacuole (not chloroplast) is filled with cell sap (C), and lysosomes are characteristic of animal cells (B)."
  },
  {
    questionNumber: 64,
    grade: "Grade 9",
    unit: "Unit 2: Cell Biology (Grade 9)",
    topic: "Unit 2: Cell Biology (Osmosis in Plant Cells)",
    difficulty: "easy",
    prompt: "A plant cell is placed in a solution which has lower solute concentration than its contents. After a few minutes the cell will become",
    options: [
      "turgid.",
      "flaccid.",
      "plasmolysed.",
      "burst."
    ],
    correctAnswer: "A",
    explanation: "A solution with a lower solute concentration than the cell sap is hypotonic (higher water potential). Water enters the plant cell by osmosis, swelling the vacuole and pushing the cytoplasm firmly against the rigid cellulose cell wall until the cell becomes fully turgid (the cell wall prevents bursting)."
  },
  {
    questionNumber: 65,
    grade: "Grade 9",
    unit: "Unit 3: Human Biology and Health (Grade 9)",
    topic: "Unit 3: Human Biology and Health (The Digestive System)",
    difficulty: "easy",
    prompt: "Which one of the following is correct about human food digestion?",
    options: [
      "The stomach physically breaks down the ingested food.",
      "Mouth use protease enzyme to breakdown proteins.",
      "Large intestine is the site of lipid hydrolysis.",
      "The small intestine is site of absorption of digested molecules."
    ],
    correctAnswer: "D",
    explanation: "The small intestine (specifically the ileum, lined with millions of villi and microvilli) is the principal site for the absorption of digested nutrient molecules (glucose, amino acids, fatty acids, glycerol) into the bloodstream and lacteals. Note: While the stomach also churns food physically (A), D is the core curriculum statement emphasized for completion of digestion and absorption."
  },
  {
    questionNumber: 66,
    grade: "Grade 12",
    unit: "Unit 3: Genetics (Grade 12)",
    topic: "Unit 4: Genetics (Gene Mutations)",
    difficulty: "easy",
    prompt: "Sickle cell anemia is caused by the replacement of glutamic acid by valine at a specific position in the beta chains of hemoglobin. This change is an example of which mutation?",
    options: [
      "Addition",
      "Substitution",
      "Inversion",
      "Deletion"
    ],
    correctAnswer: "B",
    explanation: "Sickle-cell anemia results from a point mutation (base substitution) in the HBB gene on chromosome 11, where adenine (A) is replaced by thymine (T) in the 6th codon (GAG → GTG), causing the amino acid valine to substitute for glutamic acid in the β-globin polypeptide chain."
  },
  {
    questionNumber: 67,
    grade: "Grade 12",
    unit: "Unit 4: Evolution (Grade 12)",
    topic: "Unit 3: Evolution (Theories of the Origin of Life)",
    difficulty: "medium",
    prompt: "Stanley Miller conducted spark-discharge experiment by taking a mixture of gases that he thought to represent the primitive atmosphere of the Earth. All of the following were found in his gas mixture EXCEPT",
    options: [
      "NH3",
      "CH4",
      "H2",
      "CO2"
    ],
    correctAnswer: "D",
    explanation: "In his classic 1953 spark-discharge apparatus testing Oparin and Haldane's biochemical origin-of-life hypothesis, Stanley Miller used a strongly reducing gas mixture consisting of methane (CH4), ammonia (NH3), hydrogen gas (H2), and water vapor (H2O). Carbon dioxide (CO2) was not part of his original gas mixture."
  },
  {
    questionNumber: 68,
    grade: "Grade 12",
    unit: "Unit 4: Evolution (Grade 12)",
    topic: "Unit 3: Evolution (Theories of Evolution - Darwinism vs. Lamarckism)",
    difficulty: "easy",
    prompt: "Which one of the following sentences explains the Darwin theory of evolution?",
    options: [
      "Environment changes, creating a need for organism to change.",
      "There is a natural variation in features that are heritable.",
      "New features acquired in lifetime are passed to the offspring.",
      "There is development of new feature in order to survive."
    ],
    correctAnswer: "B",
    explanation: "Charles Darwin's theory of evolution by natural selection is based on the observation that individuals within a population exhibit natural, heritable variations, and those with advantageous traits survive and reproduce more successfully. Options A, C, and D describe Lamarck's theory of use/disuse and inheritance of acquired characteristics."
  },
  {
    questionNumber: 69,
    grade: "Grade 12",
    unit: "Unit 4: Evolution (Grade 12)",
    topic: "Unit 3: Evolution (Evidence for Evolution)",
    difficulty: "easy",
    prompt: "Comparative anatomy provides evidence of evolution because it",
    options: [
      "looks at structural similarities of organisms.",
      "has remains of animals and plants from the remote past.",
      "has an impression of animal even if the actual parts are missing.",
      "studies the development of the embryos of vertebrates."
    ],
    correctAnswer: "A",
    explanation: "Comparative anatomy examines structural similarities and differences among organisms (such as homologous structures like the pentadactyl limb in vertebrates), indicating divergent evolution from a common ancestor. Options B and C describe paleontology (fossils), while Option D describes comparative embryology."
  },
  {
    questionNumber: 70,
    grade: "Grade 12",
    unit: "Unit 4: Evolution (Grade 12)",
    topic: "Unit 3: Evolution (Speciation and Reproductive Isolation)",
    difficulty: "easy",
    prompt: "About 3 million years ago the Isthmus of Panama separated the shrimp population of the Caribbean Sea and created two populations of shrimps, one on either side of the isthmus. They still look remarkably similar, but they do not interbreed with each other. Which type of isolation is described by this scenario?",
    options: [
      "Seasonal isolation",
      "Geographical isolation",
      "Behavioural isolation",
      "Temporal isolation"
    ],
    correctAnswer: "B",
    explanation: "The formation of the Isthmus of Panama created a physical land barrier separating a single ancestral marine shrimp population into Pacific and Caribbean populations. Separation by a physical barrier (landmass, mountain range, river, ocean) is geographical isolation, leading to allopatric speciation."
  },
  {
    questionNumber: 71,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Control of Metabolic Pathways / End-Product Inhibition)",
    difficulty: "easy",
    prompt: "In a metabolic pathway, the end-product inhibition occurs when the",
    options: [
      "last product of the pathway inhibits the last enzymatic reaction.",
      "first product of the pathway inhibits the last enzymatic reaction.",
      "first product of the pathway inhibits the third enzyme of the reaction.",
      "last product of the pathway inhibits the first enzymatic reaction."
    ],
    correctAnswer: "D",
    explanation: "In feedback (end-product) inhibition, when the final end-product of a multi-step metabolic pathway accumulates above a critical concentration, it binds allosterically to the enzyme catalyzing the FIRST committed step of the pathway, shutting down the entire pathway and preventing wasteful accumulation of intermediates."
  },
  {
    questionNumber: 72,
    grade: "Grade 11",
    unit: "Unit 3: Enzymes (Grade 11)",
    topic: "Unit 3: Enzymes (Kinetics & Factors Affecting Enzyme Action)",
    difficulty: "medium",
    prompt: "The following graph shows the rate of reaction of catalase enzyme at a constant temperature and at different substrate concentration (in %). From the above graph, we can conclude that catalase was functional with its minimum turnover rate from substrate concentration of",
    options: [
      "0.4 to 0.5.",
      "0.1 to 0.2.",
      "0.5 to 0.6.",
      "0.3 to 0.4."
    ],
    correctAnswer: "B",
    explanation: "Looking at the reaction velocity (turnover rate) curve across the four given substrate concentration intervals: between 0.1% and 0.2%, the reaction velocity is at its lowest level among the listed choices (40 to 56 units), whereas in 0.3–0.4%, 0.4–0.5%, and 0.5–0.6% the enzyme approaches Vmax (66 to 76 units). Note: If 'rate of increase' (slope) rather than turnover rate (velocity) were meant, 0.5 to 0.6 (C) has the flattest slope as active sites saturate."
  },
  {
    questionNumber: 73,
    grade: "Grade 11",
    unit: "Unit 4: Cell Biology (Grade 11)",
    topic: "Unit 4: Cell Biology (Cell Theory)",
    difficulty: "easy",
    prompt: "Which one of the following statements is correct about the description of the cell theory?",
    options: [
      "Schleiden and Schwann stated that all cells come from pre-existing cells.",
      "Virchow stated that cell is the unit of structure, physiology and organization of living things.",
      "Modern cell theory states that cells contain hereditary information that passes from cell to cell.",
      "Spontaneous generation theory states that all cells have basically different chemical composition."
    ],
    correctAnswer: "C",
    explanation: "Modern cell theory expands upon the classical cell theory (Schleiden, Schwann, and Virchow) by stating that cells contain hereditary information (DNA) which is passed from cell to cell during cell division, that all cells have basically the same chemical composition, and that all energy flow of life occurs within cells. Options A and B swap the contributions of Schleiden/Schwann and Rudolf Virchow ('Omnis cellula e cellula')."
  },
  {
    questionNumber: 74,
    grade: "Grade 11",
    unit: "Unit 4: Cell Biology (Grade 11)",
    topic: "Unit 4: Cell Biology (Cell Size and Magnification Calculations)",
    difficulty: "easy",
    prompt: "A student measured the diameter of onion epidermal cells at a magnification of 100X using a field of view adjusted to 2mm by stage micrometer. What would be the diameter of individual cells if 8 cells fit into the field of view of the microscope at 100X magnification?",
    options: [
      "250μm",
      "200μm",
      "150μm",
      "300μm"
    ],
    correctAnswer: "A",
    explanation: "First convert the field of view diameter from millimeters to micrometers: 2 mm = 2 × 1000 μm = 2000 μm. Since 8 onion epidermal cells fit end-to-end across the 2000 μm field of view at the same 100X magnification, the diameter of each individual cell is 2000 μm ÷ 8 = 250 μm."
  },
  {
    questionNumber: 75,
    grade: "Grade 11",
    unit: "Unit 4: Cell Biology (Grade 11)",
    topic: "Unit 4: Cell Biology (Prokaryotic vs. Eukaryotic Cells)",
    difficulty: "easy",
    prompt: "Which of the following characteristics of cells is found only in prokaryotic cell?",
    options: [
      "Division of labor within the cell",
      "Continuous loop of DNA",
      "10 - 100 μm long",
      "Higher level of complexity"
    ],
    correctAnswer: "B",
    explanation: "Prokaryotic cells lack a membrane-bound nucleus and instead possess a single, circular, continuous loop of naked DNA located in the nucleoid region. Division of labor via membrane-bound organelles (A), larger size of 10–100 μm (C; prokaryotes are 1–10 μm), and higher complexity (D) are characteristics of eukaryotic cells."
  },
  {
    questionNumber: 76,
    grade: "Grade 12",
    unit: "Unit 1: Microorganisms (Grade 12)",
    topic: "Unit 1: Microorganisms (Viruses)",
    difficulty: "medium",
    prompt: "Which one of the following sentences is true about viruses?",
    options: [
      "AIDS is caused by a DNA virus.",
      "Corona virus is a DNA virus.",
      "Swine flu is caused by an RNA virus.",
      "Herpes simplex is a DNA virus."
    ],
    correctAnswer: "D",
    explanation: "Herpes simplex is explicitly classified as a double-stranded DNA virus in the Ethiopian Grade 12 Biology textbook (Unit 1), and Swine flu (H1N1 influenza) is an RNA virus (making both C and D scientifically true). In the Grade 12 textbook table of viruses, Herpes simplex is the primary textbook example of a DNA virus, while HIV (A) is a retrovirus (RNA) and Coronavirus/Influenza (B, C) are RNA viruses."
  },
  {
    questionNumber: 77,
    grade: "Grade 12",
    unit: "Unit 1: Microorganisms (Grade 12)",
    topic: "Unit 1: Microorganisms (HIV Replication Cycle)",
    difficulty: "easy",
    prompt: "The following steps are involved when HIV infects its host cell in the human body.\n1. Conversion of viral RNA into DNA and its incorporation into cell's DNA.\n2. Viral DNA's transcription into viral RNA and production of proteins.\n3. Assemblage of new viral particles from RNA, proteins and Reverse Transcriptase\n4. The binding of gp120 of HIV to CD4 of a T-Lymphocyte\n5. Fusion of HIV with the plasma membrane of the host cell\n6. Release of its RNA and reverse transcriptase into the cell.\nThe logical order of the steps listed above would be",
    options: [
      "4, 5, 6, 1, 2, 3.",
      "4, 2, 5, 6, 1, 3.",
      "4, 6, 5, 2, 1, 3.",
      "4, 1, 2, 5, 6, 3."
    ],
    correctAnswer: "A",
    explanation: "The chronological sequence of HIV infection and replication is: (4) Attachment of viral gp120 glycoprotein to the CD4 receptor on a helper T-lymphocyte → (5) Fusion of the viral envelope with the host plasma membrane → (6) Entry/release of viral RNA and enzymes (reverse transcriptase) into the cytoplasm → (1) Reverse transcription of viral RNA into viral DNA and integration into host DNA as a provirus → (2) Transcription of viral RNA and translation of viral proteins → (3) Assembly of new virions."
  },
  {
    questionNumber: 78,
    grade: "Grade 12",
    unit: "Unit 1: Microorganisms (Grade 12)",
    topic: "Unit 1: Microorganisms / Unit 2: Ecology (Nitrogen Cycle)",
    difficulty: "easy",
    prompt: "Which one of the following bacteria produces ammonium ion by forming a symbiotic association with peas and beans?",
    options: [
      "Klebsiella",
      "Azotobacter",
      "Pseudomonas",
      "Rhizobium"
    ],
    correctAnswer: "D",
    explanation: "Rhizobium is a mutualistic nitrogen-fixing bacterium that lives inside root nodules of leguminous plants (such as peas, beans, and clover), reducing atmospheric nitrogen gas (N2) into ammonium ions (NH4+). Azotobacter and Klebsiella are free-living nitrogen fixers, while Pseudomonas is a denitrifying bacterium."
  },
  {
    questionNumber: 79,
    grade: "Grade 12",
    unit: "Unit 2: Ecology (Grade 12)",
    topic: "Unit 2: Ecology (The Water Cycle)",
    difficulty: "easy",
    prompt: "This item is based on the following diagram which depicts the water cycle. In the above diagram, the letters A, B, C and D respectively represent",
    options: [
      "evaporation, transpiration, condensation, precipitation.",
      "evaporation, precipitation, transpiration, condensation.",
      "evaporation, transpiration, precipitation, condensation.",
      "evaporation, precipitation, condensation, transpiration."
    ],
    correctAnswer: "A",
    explanation: "Tracing the arrows in the hydrological (water) cycle diagram (from the Grade 12 textbook): Arrow A rising from the ocean represents evaporation; Arrow B rising from vegetation/trees represents transpiration; Arrow C high in the atmosphere forming clouds represents condensation; and Arrow D falling from clouds onto land represents precipitation."
  },
  {
    questionNumber: 80,
    grade: "Grade 12",
    unit: "Unit 2: Ecology (Grade 12)",
    topic: "Unit 2: Ecology (Ecological Succession)",
    difficulty: "medium",
    prompt: "Which one of the following comparisons is true about primary and secondary successions? Secondary succession has",
    options: [
      "reduced species diversity.",
      "reduced total biomass of the community.",
      "has slower progress to reach to the climax.",
      "more stable community."
    ],
    correctAnswer: "D",
    explanation: "Secondary succession starts on pre-existing soil containing a seed bank, organic matter, and soil biota (unlike primary succession on bare rock). Consequently, secondary succession progresses much faster to reach a complex, diverse, high-biomass, and more stable climax community (making A, B, and C false and D correct)."
  },
  {
    questionNumber: 81,
    grade: "Grade 12",
    unit: "Unit 2: Ecology (Grade 12)",
    topic: "Unit 2: Ecology (Terrestrial Biomes)",
    difficulty: "medium",
    prompt: "Which one of the following sentences describes the tropical rainforest biome? It has",
    options: [
      "poor and thin soil.",
      "sparse - succulent plants.",
      "frozen and rocky soil.",
      "migrating animals."
    ],
    correctAnswer: "A",
    explanation: "Despite supporting lush vegetation, tropical rainforests characteristically have nutrient-poor, thin, acidic soils because heavy year-round rainfall rapidly leaches soluble minerals and rapid decomposition is immediately absorbed by shallow tree roots. Sparse succulent plants (B) describe deserts, frozen rocky soil/permafrost (C) describes tundra, and large herds of migrating grazers (D) characterize savanna/grasslands."
  },
  {
    questionNumber: 82,
    grade: "Grade 12",
    unit: "Unit 2: Ecology (Grade 12)",
    topic: "Unit 2: Ecology (Aquatic Biomes)",
    difficulty: "easy",
    prompt: "Fresh water biomes like streams and rivers are characterized by the presence of",
    options: [
      "corals, crabs and planktons.",
      "algae, planktons and fish.",
      "corals, kelps and angler fish.",
      "angler fish, algae and crabs."
    ],
    correctAnswer: "B",
    explanation: "Freshwater lotic biomes (streams and rivers) contain freshwater algae, phytoplankton/zooplankton, and freshwater fish. Corals, kelp forests, and deep-sea anglerfish (present in A, C, and D) are exclusively marine (oceanic/estuarine) organisms."
  },
  {
    questionNumber: 83,
    grade: "Grade 9",
    unit: "Unit 2: Ecology (Grade 12)",
    topic: "Unit 6: Environment / Grade 12 Unit 2: Ecology (Population Dynamics)",
    difficulty: "easy",
    prompt: "Which one of the following statements correctly describes intra-specific and inter-specific competitions? In intra-specific competition the",
    options: [
      "competition is less severe but in inter-specific competition it is more.",
      "competition is for a few requirements but in inter-specific competition the competition is for all requirements.",
      "competing individuals have similar adaptation but in inter-specific competition the adaptation is different.",
      "competing individuals belong to different species but in inter-specific competition the individuals are of the same species."
    ],
    correctAnswer: "C",
    explanation: "Intraspecific competition occurs between members of the SAME species, meaning the competing individuals share virtually identical ecological niches, resource requirements, and adaptations (making competition much more intense). Interspecific competition occurs between individuals of DIFFERENT species with different adaptations."
  },
  {
    questionNumber: 84,
    grade: "Grade 10",
    unit: "Unit 2: Heredity (Grade 10)",
    topic: "Unit 2: Heredity / Grade 12 Unit 4: Genetics (Meiosis)",
    difficulty: "easy",
    prompt: "Which one of the following stages of cell division is correctly described in meiosis II?",
    options: [
      "Prophase II - pairs of homologous chromosomes split up",
      "Anaphase II - chromatids from each chromosome separate",
      "Metaphase II - chromosomes pair and exchange segments",
      "Telophase II - two haploid cells are produced"
    ],
    correctAnswer: "B",
    explanation: "During Anaphase II of meiosis, the centromeres divide and sister chromatids of each chromosome separate and move toward opposite poles as individual daughter chromosomes. Homologous chromosomes pair and exchange segments in Prophase I (C), separate in Anaphase I (A), and Telophase II yields four haploid cells (D)."
  },
  {
    questionNumber: 85,
    grade: "Grade 12",
    unit: "Unit 3: Genetics (Grade 12)",
    topic: "Unit 4: Genetics (Sex-Linked, Sex-Limited, and Sex-Influenced Traits)",
    difficulty: "medium",
    prompt: "Which one of the following events is an example of a sex influenced trait?",
    options: [
      "Pattern baldness",
      "Lactation",
      "Retinitis pigmentosa",
      "Undescended testicles"
    ],
    correctAnswer: "A",
    explanation: "Male-pattern baldness is the classic example of a sex-influenced trait: the autosomal allele for baldness acts as dominant in males (due to high testosterone levels) but recessive in females, so heterozygous (Bb) males are bald while heterozygous (Bb) females are not. Lactation (B) and undescended testicles (D) are sex-limited traits."
  },
  {
    questionNumber: 86,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (Anaerobic Respiration / Lactic Acid Fermentation)",
    difficulty: "medium",
    prompt: "Which of the following processes takes place when lactate is produced?",
    options: [
      "NAD and FAD are regenerated from reduced NAD and FAD.",
      "ATP is produced through oxidative phosphorylation.",
      "Protons accumulation created in the inter-membrane space.",
      "Reduced NAD supplies hydrogen and becomes oxidized itself."
    ],
    correctAnswer: "D",
    explanation: "During lactic acid fermentation in animal muscle cells lacking oxygen, pyruvate accepts hydrogen atoms from reduced NAD (NADH + H+) to form lactate. In doing so, reduced NAD (NADH) donates its hydrogen and becomes oxidized back to NAD+, allowing glycolysis to continue producing a small amount of ATP via substrate-level phosphorylation."
  },
  {
    questionNumber: 87,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (Photosynthesis - Photosystems)",
    difficulty: "easy",
    prompt: "Which one of the following structures of the photosystem is correctly related with its function?",
    options: [
      "Chlorophyll a - a reaction center molecule",
      "Antenna complex - light dependent reaction begins",
      "Carotenoid - provides the hydrogen ions",
      "Thylakoid - absorbs blue and red pigments"
    ],
    correctAnswer: "A",
    explanation: "Within a photosystem embedded in the thylakoid membrane, specialized chlorophyll a molecules (such as P680 in PSII and P700 in PSI) form the reaction center where photoexcitation initiates the primary photochemical reaction. Accessory pigments (chlorophyll b and carotenoids) form the antenna complex that harvests light and funnels energy to the chlorophyll a reaction center."
  },
  {
    questionNumber: 88,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (Electron Transport Chain & Oxidative Phosphorylation)",
    difficulty: "easy",
    prompt: "What happens during the electron transport system of respiration? The",
    options: [
      "four-carbon compound undergoes molecular transformation to generate oxaloacetate.",
      "hydrogen atoms carried by FADH and NADH are released and split into protons and electrons.",
      "citrate losses a carbon atom to form a five-carbon atom compound and CO2.",
      "five carbon compound is further decarboxylated to form a four-carbon compound."
    ],
    correctAnswer: "B",
    explanation: "At the start of the mitochondrial electron transport chain (cristae), hydrogen atoms delivered by reduced coenzymes (NADH and FADH2) are released and split into protons (H+) and high-energy electrons (e-). The electrons pass along electron carriers to pump protons across the inner membrane, while Options A, C, and D all occur during the Krebs cycle."
  },
  {
    questionNumber: 89,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (Light-Independent Reactions / Calvin Cycle)",
    difficulty: "easy",
    prompt: "During light independent reactions of photosynthesis, glucose is synthesized through",
    options: [
      "synthesis of reduced NADP that provides hydrogen ion.",
      "six turns of the Calvin cycle to make one molecule of glucose.",
      "release of hydrogen ions at the electron transport chain.",
      "transmission of electrons to the inside of the thylakoid."
    ],
    correctAnswer: "B",
    explanation: "In the light-independent reactions (Calvin cycle) in the chloroplast stroma, each turn of the cycle fixes one molecule of CO2. Therefore, six turns of the Calvin cycle (fixing 6 CO2 molecules) are required to produce two exported triose phosphate (TP/G3P) molecules, which combine to synthesize one 6-carbon glucose molecule. Options A, C, and D occur in the light-dependent stage."
  },
  {
    questionNumber: 90,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (Factors Affecting Photosynthesis)",
    difficulty: "medium",
    prompt: "Which one of the following factors of photosynthesis is correctly matched with its effect?",
    options: [
      "CO2 concentration - limits the reactions by influencing rate of initial reaction with RuBP",
      "Low temperature - limits the rate of reactions by reducing the number of electrons in the chlorophyll",
      "Low Rubisco - limits the number of reactions in the light dependent reaction",
      "Light intensity - limits the rate of ATP synthase enzyme action in light dependent reactions"
    ],
    correctAnswer: "A",
    explanation: "Carbon dioxide is a substrate in the first step of the Calvin cycle, where it reacts with ribulose bisphosphate (RuBP) catalyzed by Rubisco. Low CO2 concentration directly limits the rate of this initial carbon-fixation reaction with RuBP."
  },
  {
    questionNumber: 91,
    grade: "Grade 10",
    unit: "Unit 2: Heredity (Grade 10)",
    topic: "Unit 2: Heredity (Test Cross)",
    difficulty: "easy",
    prompt: "Which one of the following monohybrid crosses can be a test cross?",
    options: [
      "Rr X Rr",
      "RR X Rr",
      "RR X rr",
      "RR X RR"
    ],
    correctAnswer: "C",
    explanation: "A test cross is used to determine the unknown genotype of an individual showing a dominant phenotype (which could be homozygous dominant RR or heterozygous Rr) by crossing it with a homozygous recessive individual (rr). Among the choices, only 'RR × rr' (C) crosses a dominant-phenotype individual with a homozygous recessive tester (rr)."
  },
  {
    questionNumber: 92,
    grade: "Grade 10",
    unit: "Unit 5: Conservation of Natural Resources (Grade 10)",
    topic: "Unit 5: Conservation of Natural Resources (Conservation of Vegetation)",
    difficulty: "easy",
    prompt: "Which of the following is different from the rest with regard to conservation of vegetation?",
    options: [
      "Using local practices for conservation",
      "Replanting of land with endemic species",
      "Replanting indigenous tree species",
      "Large scale introduction of exotic plants"
    ],
    correctAnswer: "D",
    explanation: "Using traditional local conservation practices (A), replanting endemic species (B), and replanting indigenous trees (C) all promote native biodiversity and ecological restoration. In contrast, large-scale introduction of exotic (non-native) plant species (D) often depletes soil water/nutrients, displaces native flora, and threatens local biodiversity."
  },
  {
    questionNumber: 93,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (The Nervous System)",
    difficulty: "easy",
    prompt: "In the nervous co-ordination system, which of the following statements explains the synapse? It is a",
    options: [
      "chemical that transmits nerve impulses across the nervous system.",
      "part of the skull that encloses brain for the purpose of protection.",
      "junction between two neurons or a neuron and a muscle.",
      "short term change in the electrical potential on the surface of cells."
    ],
    correctAnswer: "C",
    explanation: "A synapse is the microscopic functional junction (gap) between the axon terminal of one neuron and the dendrite/cell body of the next neuron (or between a motor neuron and a muscle/effector cell). Option A describes a neurotransmitter, Option B describes the cranium, and Option D describes an action potential."
  },
  {
    questionNumber: 94,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (Reflex Actions)",
    difficulty: "medium",
    prompt: "Two students want to demonstrate a simple spinal reflex action using the knee jerk reflex. One of them sits down with one leg loosely crossed over the other. The other hits the crossed leg just below the knee cap gently but firmly using the edge of his hand. Which one of the following situations will happen during this demonstration? The",
    options: [
      "impulse travels to the brain.",
      "hit ligament stretches the muscle.",
      "lower leg to jerk downwards and inwards.",
      "impulse travels to quadriceps muscle from the brain."
    ],
    correctAnswer: "B",
    explanation: "When the patellar tendon/ligament just below the kneecap (patella) is tapped, it pulls on and stretches the quadriceps femoris muscle in the thigh. Stretch receptors in the muscle send sensory impulses to the spinal cord, which immediately relays motor impulses back to the quadriceps muscle, causing the lower leg to jerk upward and forward (outward). Thus, statement B ('hit ligament stretches the muscle') is correct."
  },
  {
    questionNumber: 95,
    grade: "Grade 10",
    unit: "Unit 3: Human Biology and Health (Grade 10)",
    topic: "Unit 3: Human Biology and Health (Sense Organs - The Eye)",
    difficulty: "easy",
    prompt: "Which of the following eye structures is correctly matched with its function?",
    options: [
      "Pupil - serves as the eye's protective outer layer.",
      "Iris - controls the amount of light entering the eye.",
      "Cornea - provides nutrition to the retina.",
      "Choroid - bends the light into the eye."
    ],
    correctAnswer: "B",
    explanation: "The iris is the pigmented muscular diaphragm of the eye whose circular and radial smooth muscles contract or relax to adjust the diameter of the pupil, thereby controlling the amount of light entering the eye. The sclera is the protective outer layer (A), the choroid supplies blood/nutrition to the retina (C), and the cornea refracts/bends light entering the eye (D)."
  },
  {
    questionNumber: 96,
    grade: "Grade 11",
    unit: "Unit 5: Energy Transformation (Grade 11)",
    topic: "Unit 5: Energy Transformation (C3, C4, and CAM Photosynthesis)",
    difficulty: "medium",
    prompt: "In the CAM photosynthetic pathway,",
    options: [
      "malate is stored in the mesophyll cells during the day.",
      "glucose is synthesized in the bundle sheath cell during night.",
      "ATP and NADPH are produced during the night.",
      "the C4 stage and the Calvin cycle are separated in time."
    ],
    correctAnswer: "D",
    explanation: "In Crassulacean Acid Metabolism (CAM) plants (such as pineapples and cacti), stomata open at night to fix CO2 into malate (the C4 stage, stored in mesophyll vacuoles overnight) and close during the day when malate is decarboxylated to supply CO2 to the Calvin cycle using light-dependent ATP and NADPH. Thus, the C4 carbon-fixation stage and the Calvin cycle occur in the same mesophyll cells but are separated in time (night vs. day)."
  },
  {
    questionNumber: 97,
    grade: "Grade 12",
    unit: "Unit 1: Microorganisms (Grade 12)",
    topic: "Unit 1: Microorganisms (Bacteria & Gram Staining)",
    difficulty: "easy",
    prompt: "In Gram staining, if some bacteria retain the crystal violet after counter staining, then the bacteria is",
    options: [
      "Gram positive.",
      "Gram negative.",
      "Gram intermediate.",
      "Gram variable."
    ],
    correctAnswer: "A",
    explanation: "Gram-positive bacteria have a thick peptidoglycan cell wall layer that traps the crystal violet–iodine complex during alcohol decolorization. Consequently, they retain the dark purple/violet stain even after counterstaining with safranin."
  },
  {
    questionNumber: 98,
    grade: "Grade 12",
    unit: "Unit 1: Microorganisms (Grade 12)",
    topic: "Unit 1: Microorganisms (Pathogenicity of Bacteria)",
    difficulty: "medium",
    prompt: "Which one of the following sentences explains the mechanism of bacterium to produce disease?",
    options: [
      "Its hyphae secrets enzymes which digest substances in the tissue.",
      "It enters into the living cells and disrupts the metabolic systems.",
      "It attaches with white blood cells and destroy the immune system.",
      "Its genetic material is incorporated into the cell for instruction."
    ],
    correctAnswer: "B",
    explanation: "Pathogenic bacteria cause disease by invading living host tissues/cells, multiplying rapidly, and releasing toxins (exotoxins and endotoxins) that disrupt the metabolic systems of host cells. Option A describes pathogenic fungi (hyphae), while Options C and D describe HIV/retroviruses."
  },
  {
    questionNumber: 99,
    grade: "Grade 12",
    unit: "Unit 1: Microorganisms (Grade 12)",
    topic: "Unit 1: Microorganisms / Unit 4: Genetics (Genetic Engineering)",
    difficulty: "easy",
    prompt: "Which one of the following sentences explains the role of bacteria in genetic engineering? They are used to",
    options: [
      "isolate genes from donor DNA.",
      "open up a plasmid.",
      "cut genes from donor DNA.",
      "contain a recombinant plasmid."
    ],
    correctAnswer: "D",
    explanation: "In recombinant DNA technology (genetic engineering), bacteria serve as host organisms that take up and contain the recombinant plasmid vector, multiplying rapidly to clone the foreign gene and express its protein product (such as human insulin). Restriction endonuclease enzymes (not whole bacteria) cut donor DNA and open plasmids (A, B, C)."
  },
  {
    questionNumber: 100,
    grade: "Grade 12",
    unit: "Unit 1: Microorganisms (Grade 12)",
    topic: "Unit 1: Microorganisms (Characteristics of Viruses)",
    difficulty: "easy",
    prompt: "Which one of the following sentences describes a virus? It",
    options: [
      "has differentiated organelles.",
      "is saprophytic.",
      "is acellular.",
      "undergoes respiration."
    ],
    correctAnswer: "C",
    explanation: "Viruses are ultramicroscopic, acellular (non-cellular) infectious particles consisting only of a nucleic acid core (DNA or RNA) enclosed in a protein coat (capsid). They lack cytoplasm and cellular organelles (A), do not respire or metabolize (D), and are obligate intracellular parasites rather than saprophytes (B)."
  }
];

// Attach images to questions
const finalQuestions = rawQuestions.map(q => {
  if (qImageMap[q.questionNumber]) {
    return {
      ...q,
      imageUrl: qImageMap[q.questionNumber]
    };
  }
  return q;
});

const outDir = path.resolve(__dirname, "../seeds/data");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "biology_esslce_2015_booklet480.json");

fs.writeFileSync(outPath, JSON.stringify(finalQuestions, null, 2), "utf8");
console.log(`Successfully generated ${finalQuestions.length} questions in ${outPath}`);
console.log(`Embedded diagrams attached to: ${finalQuestions.filter(q => q.imageUrl).map(q => 'Q' + q.questionNumber).join(", ")}`);
