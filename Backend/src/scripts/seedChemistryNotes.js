import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";

async function seedChemistry() {
  console.log("Connecting to MongoDB Atlas for Chemistry seeding...");
  await connectDatabase();

  try {
    const authorUser = await User.findOne({
      role: { $in: ["teacher", "content_manager", "admin"] }
    });
    const authorId = authorUser?._id;

    const gradesChemistry = [
      {
        gradeLevel: "grade-9",
        code: "CHEM_9",
        name: "Chemistry Grade 9",
        description: "Grade 9 Ethiopian Chemistry: Structure of Atom, Periodic Classification, Chemical Bonding, Stoichiometry, and States of Matter.",
        units: [
          {
            order: 1,
            title: "Unit 1: Structure of the Atom",
            noteTitle: "Unit 1: Atomic Structure, Isotopes & Electron Configuration",
            body: `# Unit 1: Structure of the Atom (Grade 9 Chemistry)

## 1. Subatomic Particles
* **Proton ($p^+$):** Charge $+1$, Mass $\\approx 1.007\\, u$, located in nucleus.
* **Neutron ($n^0$):** Charge $0$, Mass $\\approx 1.008\\, u$, located in nucleus.
* **Electron ($e^-$):** Charge $-1$, Mass $\\approx \\frac{1}{1836}\\, u$, located in electron shells/orbitals.

---

## 2. Atomic Notation & Isotopes
* $^A_Z\\text{X}$:
  * $Z$ = **Atomic Number** (Number of protons). Identifies the element.
  * $A$ = **Mass Number** ($A = Z + N$, protons + neutrons).
  * $N = A - Z$ (Number of neutrons).
* **Isotopes:** Atoms of the same element with the **same atomic number ($Z$)** but **different mass numbers ($A$)** due to differing numbers of neutrons.
  * Example: Hydrogen isotopes: Protium ($^1_1\\text{H}$), Deuterium ($^2_1\\text{H}$), Tritium ($^3_1\\text{H}$).

---

## 3. Bohr Model & Electronic Configuration
* Shells: $n = 1 (K), 2 (L), 3 (M), 4 (N)$. Maximum electrons = $2n^2$.
  * $n=1: 2, \\quad n=2: 8, \\quad n=3: 18, \\quad n=4: 32$.
* **Valence Electrons:** Electrons in the outermost shell that determine chemical reactivity and bonding.`
          },
          {
            order: 2,
            title: "Unit 2: Periodic Classification of the Elements",
            noteTitle: "Unit 2: The Periodic Table & Periodic Trends",
            body: `# Unit 2: Periodic Classification of Elements (Grade 9 Chemistry)

## 1. Modern Periodic Law
* Elements are arranged in order of increasing **atomic number ($Z$)**, showing periodic repetition of chemical and physical properties.
* **Periods (Rows 1-7):** Indicate the number of occupied electron shells ($n$).
* **Groups / Families (Columns 1-18):** Elements in the same group have identical valence electron configurations and similar chemical behaviors.
  * Group 1: Alkali Metals ($ns^1$, highly reactive, form $+1$ ions).
  * Group 2: Alkaline Earth Metals ($ns^2$, form $+2$ ions).
  * Group 17: Halogens ($ns^2 np^5$, form $-1$ halide ions).
  * Group 18: Noble Gases ($ns^2 np^6$, inert, stable octet).

---

## 2. Periodic Trends
| Periodic Property | Across a Period (Left $\\to$ Right) | Down a Group (Top $\\to$ Bottom) |
| :--- | :--- | :--- |
| **Atomic Radius** | **Decreases** (increased effective nuclear charge $Z_{eff}$) | **Increases** (additional electron shells) |
| **Ionization Energy** | **Increases** (tighter nuclear hold on valence $e^-$) | **Decreases** (outer electrons shielded & farther) |
| **Electronegativity** | **Increases** (Fluorine is highest: 4.0) | **Decreases** (larger atomic size) |
| **Metallic Character** | **Decreases** (metals on left $\\to$ non-metals on right) | **Increases** (elements lose electrons more easily) |`
          },
          {
            order: 3,
            title: "Unit 3: Chemical Bonding and Intermolecular Forces",
            noteTitle: "Unit 3: Ionic, Covalent & Metallic Bonding",
            body: `# Unit 3: Chemical Bonding (Grade 9 Chemistry)

## 1. Types of Chemical Bonds
1. **Ionic Bonding:**
   * Transfer of electrons from a metal (low electronegativity) to a non-metal (high electronegativity).
   * Held together by strong electrostatic attraction between cations and anions.
   * High melting/boiling points, conduct electricity in molten or aqueous state.
2. **Covalent Bonding:**
   * Sharing of electron pairs between non-metallic atoms.
   * **Non-polar covalent:** Electronegativity difference $\\Delta EN < 0.4$.
   * **Polar covalent:** $0.4 \\le \\Delta EN < 1.7$ (unequal sharing, dipole moment).
3. **Metallic Bonding:**
   * Array of positive metal ions immersed in a "sea of delocalized electrons".
   * Explains electrical conductivity, thermal conductivity, malleability, and ductility.

---

## 2. Intermolecular Forces (Van der Waals Forces)
* **London Dispersion Forces:** Weakest, between all molecules (induced dipoles).
* **Dipole-Dipole Attractions:** Between polar molecules.
* **Hydrogen Bonding:** Exceptionally strong dipole force occurring when $H$ is bonded to highly electronegative small atoms: **$N, O, F$**. Responsible for high boiling point of water ($H_2O$).`
          },
          {
            order: 4,
            title: "Unit 4: Chemical Reactions and Stoichiometry",
            noteTitle: "Unit 4: Chemical Reactions, Mole Concept & Stoichiometry",
            body: `# Unit 4: Chemical Reactions & Stoichiometry (Grade 9 Chemistry)

## 1. The Mole Concept
* **Avogadro's Number ($N_A$):** $1\\text{ mole} = 6.022 \\times 10^{23}$ particles.
* **Molar Mass ($M$):** Mass of 1 mole of a substance in grams ($g/mol$).
  $$n = \\frac{m}{M} = \\frac{N}{N_A}$$
* **Molar Volume of Ideal Gas at STP (0°C, 1 atm):**
  $$V_m = 22.4\\, \\text{L/mol} \\implies n = \\frac{V}{22.4\\, \\text{L}}$$

---

## 2. Stoichiometric Calculations
* **Balancing:** Number of atoms of each element must be equal on both sides (Law of Conservation of Mass).
* **Limiting Reactant:** The reactant that is completely consumed first, limiting the amount of product formed.
* **Percentage Yield:**
  $$\\%\\text{ Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100\\%$$`
          },
          {
            order: 5,
            title: "Unit 5: Physical States of Matter",
            noteTitle: "Unit 5: Gas Laws, Kinetic Molecular Theory & Phase Changes",
            body: `# Unit 5: Physical States of Matter (Grade 9 Chemistry)

## 1. The Gas Laws
1. **Boyle's Law ($T$ constant):** $P_1 V_1 = P_2 V_2$.
2. **Charles's Law ($P$ constant):** $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$ ($T$ in Kelvin).
3. **Gay-Lussac's Law ($V$ constant):** $\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$.
4. **Combined Gas Law:** $\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$.
5. **Ideal Gas Equation:**
   $$PV = nRT$$
   where $R = 0.0821\\, \\text{L}\\cdot\\text{atm}/(\\text{mol}\\cdot\\text{K}) = 8.314\\, \\text{J}/(\\text{mol}\\cdot\\text{K})$.`
          }
        ]
      },
      {
        gradeLevel: "grade-10",
        code: "CHEM_10",
        name: "Chemistry Grade 10",
        description: "Grade 10 Ethiopian Chemistry: Introduction to Organic Chemistry, Inorganic Compounds, Electrochemistry, and Industrial Chemistry.",
        units: [
          {
            order: 1,
            title: "Unit 1: Introduction to Organic Chemistry",
            noteTitle: "Unit 1: Hydrocarbons (Alkanes, Alkenes, Alkynes & Isomerism)",
            body: `# Unit 1: Introduction to Organic Chemistry (Grade 10 Chemistry)

## 1. Hydrocarbon Classes
1. **Alkanes (Saturated):** $C_n H_{2n+2}$
   * All $C-C$ single bonds ($sp^3$ hybridized). Undergo substitution and combustion.
2. **Alkenes (Unsaturated):** $C_n H_{2n}$
   * Contains one $C=C$ double bond ($sp^2$ hybridized). Undergo addition reactions.
3. **Alkynes (Unsaturated):** $C_n H_{2n-2}$
   * Contains one $C\\equiv C$ triple bond ($sp$ hybridized).

---

## 2. Isomerism
* **Structural Isomers:** Compounds having the same molecular formula but different structural arrangements (e.g., butane and 2-methylpropane).`
          },
          {
            order: 2,
            title: "Unit 2: Important Inorganic Compounds (Acids, Bases & Salts)",
            noteTitle: "Unit 2: Oxides, Acids, Bases & Salts (pH & Reactions)",
            body: `# Unit 2: Important Inorganic Compounds (Grade 10 Chemistry)

## 1. Oxides
* **Acidic Oxides:** Non-metal oxides that react with water to form acids (e.g., $SO_3 + H_2O \\to H_2SO_4$).
* **Basic Oxides:** Metal oxides that react with water to form bases (e.g., $CaO + H_2O \\to Ca(OH)_2$).
* **Amphoteric Oxides:** Can act as acid or base (e.g., $Al_2O_3, ZnO$).
* **Neutral Oxides:** Do not form acid or base with water (e.g., $CO, NO, N_2O$).

---

## 2. Acids, Bases and pH
* **pH Definition:** $pH = -\\log[H^+]$, $pOH = -\\log[OH^-]$.
* At 25°C: $pH + pOH = 14$.
  * Acidic: $pH < 7$
  * Neutral: $pH = 7$
  * Basic (Alkaline): $pH > 7$`
          },
          {
            order: 3,
            title: "Unit 3: Electrochemistry",
            noteTitle: "Unit 3: Redox Reactions, Galvanic Cells & Faraday's Laws",
            body: `# Unit 3: Electrochemistry (Grade 10 Chemistry)

## 1. Oxidation & Reduction
* **Oxidation:** Loss of electrons (increase in oxidation state).
* **Reduction:** Gain of electrons (decrease in oxidation state).
* **LEO says GER:** **L**oss of **E**lectrons is **O**xidation, **G**ain of **E**lectrons is **R**eduction.

---

## 2. Galvanic vs. Electrolytic Cells
* **Galvanic (Voltaic) Cell:** Spontaneous redox reaction converts chemical energy to electrical energy ($E^\\circ_{cell} > 0$).
  * Anode: Oxidation occurs (negative terminal).
  * Cathode: Reduction occurs (positive terminal).
* **Electrolytic Cell:** Non-spontaneous reaction driven by external electrical energy.
  * Anode: Oxidation occurs (positive terminal).
  * Cathode: Reduction occurs (negative terminal).

---

## 3. Faraday's Laws of Electrolysis
$$m = Z I t = \\left(\\frac{M}{n F}\\right) I t$$
where $F = 96,485\\, C/mol$ ($1\\text{ Faraday}$).`
          },
          {
            order: 4,
            title: "Unit 4: Chemistry in Industry and Environment",
            noteTitle: "Unit 4: Industrial Chemicals (Haber, Ostwald & Contact Processes)",
            body: `# Unit 4: Chemistry in Industry & Environment (Grade 10 Chemistry)

## 1. Major Industrial Chemical Processes
1. **Haber Process (Ammonia Synthesis):**
   $$N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g) \\quad (\\Delta H < 0)$$
   * Conditions: Iron catalyst, $450^\\circ C$, $200\\, atm$.
2. **Contact Process (Sulfuric Acid $H_2SO_4$):**
   $$2SO_2 + O_2 \\xrightarrow{V_2O_5} 2SO_3$$
   * Catalyst: Vanadium(V) oxide ($V_2O_5$).
3. **Ostwald Process (Nitric Acid $HNO_3$):**
   * Ammonia oxidized using Platinum ($Pt$) catalyst.`
          }
        ]
      },
      {
        gradeLevel: "grade-11",
        code: "CHEM_11",
        name: "Chemistry Grade 11",
        description: "Grade 11 Ethiopian Chemistry: Quantum Atomic Model, Chemical Bonding & VSEPR, Chemical Kinetics, Equilibrium, and Solutions.",
        units: [
          {
            order: 1,
            title: "Unit 1: Atomic Structure and Periodic Properties",
            noteTitle: "Unit 1: Quantum Numbers, Orbitals & Electronic Principles",
            body: `# Unit 1: Atomic Structure and Quantum Mechanics (Grade 11 Chemistry)

## 1. The Four Quantum Numbers
1. **Principal Quantum Number ($n = 1, 2, 3, \\dots$):** Shell energy level and size.
2. **Angular Momentum / Azimuthal ($l = 0, 1, \\dots, n-1$):** Orbital shape:
   * $l = 0 \\implies s$ (spherical)
   * $l = 1 \\implies p$ (dumbbell)
   * $l = 2 \\implies d$ (cloverleaf)
   * $l = 3 \\implies f$ (complex)
3. **Magnetic Quantum Number ($m_l = -l, \\dots, 0, \\dots, +l$):** Spatial orientation of orbital.
4. **Spin Quantum Number ($m_s = +1/2, -1/2$):** Electron intrinsic spin.

---

## 2. Electron Filling Rules
* **Aufbau Principle:** Orbitals are filled in order of increasing energy ($1s, 2s, 2p, 3s, 3p, 4s, 3d, \\dots$).
* **Pauli Exclusion Principle:** No two electrons in an atom can have identical values for all 4 quantum numbers.
* **Hund's Rule:** Orbitals of equal energy are each occupied by one electron before any orbital is doubly occupied.`
          },
          {
            order: 2,
            title: "Unit 2: Chemical Bonding and Molecular Geometry",
            noteTitle: "Unit 2: VSEPR Theory, Hybridization & Molecular Geometries",
            body: `# Unit 2: Chemical Bonding and Molecular Geometry (Grade 11 Chemistry)

## 1. VSEPR Theory (Valence Shell Electron Pair Repulsion)
Electron pairs around a central atom repel each other and position as far apart as possible.
* $AX_2$: Linear ($180^\\circ$) - e.g., $BeCl_2, CO_2$
* $AX_3$: Trigonal Planar ($120^\\circ$) - e.g., $BF_3$
* $AX_2E$: Bent ($< 120^\\circ$) - e.g., $SO_2$
* $AX_4$: Tetrahedral ($109.5^\\circ$) - e.g., $CH_4$
* $AX_3E$: Trigonal Pyramidal ($107^\\circ$) - e.g., $NH_3$
* $AX_2E_2$: Bent ($104.5^\\circ$) - e.g., $H_2O$
* $AX_5$: Trigonal Bipyramidal ($90^\\circ, 120^\\circ$) - e.g., $PCl_5$
* $AX_6$: Octahedral ($90^\\circ$) - e.g., $SF_6$

---

## 2. Orbital Hybridization
* $sp$: Linear (1 s + 1 p)
* $sp^2$: Trigonal planar (1 s + 2 p)
* $sp^3$: Tetrahedral (1 s + 3 p)`
          },
          {
            order: 3,
            title: "Unit 3: Chemical Kinetics",
            noteTitle: "Unit 3: Reaction Rates, Rate Laws & Arrhenius Equation",
            body: `# Unit 3: Chemical Kinetics (Grade 11 Chemistry)

## 1. Rate Laws and Reaction Order
For reaction $aA + bB \\to cC$:
$$\\text{Rate} = k [A]^m [B]^n$$
* Overall reaction order = $m + n$.
* $k$ is the rate constant, dependent on temperature.

---

## 2. Integrated Rate Laws
* **Zero Order:** $[A]_t = -kt + [A]_0$, half-life $t_{1/2} = \\frac{[A]_0}{2k}$.
* **First Order:** $\\ln[A]_t = -kt + \\ln[A]_0$, half-life $t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}$ (independent of initial concentration).
* **Second Order:** $\\frac{1}{[A]_t} = kt + \\frac{1}{[A]_0}$.

---

## 3. Arrhenius Equation & Activation Energy
$$k = A e^{-E_a / (RT)} \\implies \\ln k = -\\frac{E_a}{R}\\left(\\frac{1}{T}\\right) + \\ln A$$`
          },
          {
            order: 4,
            title: "Unit 4: Chemical Equilibrium",
            noteTitle: "Unit 4: Equilibrium Constant ($K_c, K_p$) & Le Chatelier's Principle",
            body: `# Unit 4: Chemical Equilibrium (Grade 11 Chemistry)

## 1. Equilibrium Constant Expression
For $aA + bB \\rightleftharpoons cC + dD$:
$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$
$$K_p = K_c (RT)^{\\Delta n}, \\quad \\Delta n = (c + d) - (a + b)$$
*(Solids and pure liquids are omitted from $K_c$ and $K_p$)*

---

## 2. Le Chatelier's Principle
When an equilibrium system is subjected to a disturbance, the system shifts to counteract that disturbance:
* **Concentration:** Adding reactant shifts equilibrium **Right**; adding product shifts **Left**.
* **Pressure/Volume:** Increasing pressure shifts toward side with **fewer moles of gas**.
* **Temperature:**
  * Endothermic ($\\Delta H > 0$): Increasing $T$ increases $K_c$ (shifts **Right**).
  * Exothermic ($\\Delta H < 0$): Increasing $T$ decreases $K_c$ (shifts **Left**).
* **Catalyst:** Speeds up both forward and reverse rates equally; **does not change $K_c$ or position of equilibrium**.`
          },
          {
            order: 5,
            title: "Unit 5: Solutions and Colligative Properties",
            noteTitle: "Unit 5: Concentrations & Colligative Properties of Solutions",
            body: `# Unit 5: Solutions and Colligative Properties (Grade 11 Chemistry)

## 1. Concentration Expressions
* **Molarity ($M$):** $M = \\frac{\\text{moles of solute}}{\\text{liters of solution}} = \\frac{n}{V}$.
* **Molality ($m$):** $m = \\frac{\\text{moles of solute}}{\\text{mass of solvent in } kg}$.
* **Mole Fraction ($X_A$):** $X_A = \\frac{n_A}{n_{\\text{total}}}$.

---

## 2. Colligative Properties (Depend on number of solute particles)
1. **Raoult's Law (Vapor Pressure Lowering):** $P_A = X_A P_A^\\circ$.
2. **Boiling Point Elevation:** $\\Delta T_b = i K_b m$.
3. **Freezing Point Depression:** $\\Delta T_f = i K_f m$.
4. **Osmotic Pressure:** $\\Pi = i M R T$.
*(where $i$ is the van 't Hoff factor)*`
          }
        ]
      },
      {
        gradeLevel: "grade-12",
        code: "CHEM_12",
        name: "Chemistry Grade 12",
        description: "Grade 12 Ethiopian Chemistry: Acid-Base Equilibria, Chemical Thermodynamics, Advanced Electrochemistry, and Advanced Organic Chemistry.",
        units: [
          {
            order: 1,
            title: "Unit 1: Acid-Base Equilibria and Buffer Solutions",
            noteTitle: "Unit 1: Acid-Base Equilibria ($K_a, K_b$, Buffers & Titrations)",
            body: `# Unit 1: Acid-Base Equilibria (Grade 12 Chemistry)

## 1. Autoionization of Water & pH
* $K_w = [H_3O^+][OH^-] = 1.0 \\times 10^{-14}$ at $25^\\circ C$.
* $pH = -\\log[H_3O^+], \\quad pOH = -\\log[OH^-], \\quad pH + pOH = 14$.

---

## 2. Weak Acids and Bases
* Weak acid dissociation: $HA + H_2O \\rightleftharpoons H_3O^+ + A^-$
  $$K_a = \\frac{[H_3O^+][A^-]}{[HA]}, \\quad [H^+] \\approx \\sqrt{K_a \\cdot C_a}$$
* Weak base dissociation: $B + H_2O \\rightleftharpoons BH^+ + OH^-$
  $$K_b = \\frac{[BH^+][OH^-]}{[B]}, \\quad [OH^-] \\approx \\sqrt{K_b \\cdot C_b}$$
* Conjugate pair relationship: $K_a \\cdot K_b = K_w$.

---

## 3. Buffer Solutions and Henderson-Hasselbalch
A buffer resists pH changes upon addition of small amounts of strong acid or base.
$$pH = pK_a + \\log\\left(\\frac{[\\text{Conjugate Base } A^-]}{[\\text{Weak Acid } HA]}\\right)$$`
          },
          {
            order: 2,
            title: "Unit 2: Chemical Thermodynamics and Energetics",
            noteTitle: "Unit 2: Enthalpy (Hess's Law), Entropy & Gibbs Free Energy",
            body: `# Unit 2: Chemical Thermodynamics (Grade 12 Chemistry)

## 1. Enthalpy ($\\Delta H$) & Hess's Law
* Exothermic: $\\Delta H < 0$ (heat released).
* Endothermic: $\\Delta H > 0$ (heat absorbed).
* **Hess's Law:** $\\Delta H^\\circ_{\\text{rxn}} = \\sum n \\Delta H^\\circ_f(\\text{products}) - \\sum m \\Delta H^\\circ_f(\\text{reactants})$.

---

## 2. Entropy ($\\Delta S$) & Spontaneity ($\\Delta G$)
* **Entropy ($S$):** Measure of randomness or molecular disorder.
* **Gibbs Free Energy Equation:**
  $$\\Delta G = \\Delta H - T \\Delta S$$
* **Spontaneity Criteria:**
  * $\\Delta G < 0$: Spontaneous process (Exergonic).
  * $\\Delta G = 0$: System at equilibrium.
  * $\\Delta G > 0$: Non-spontaneous process (Endergonic).
* **Standard Free Energy & Equilibrium Constant:**
  $$\\Delta G^\\circ = -RT \\ln K$$`
          },
          {
            order: 3,
            title: "Unit 3: Advanced Electrochemistry and Cells",
            noteTitle: "Unit 3: Nernst Equation, Standard Potentials & Corrosion",
            body: `# Unit 3: Advanced Electrochemistry (Grade 12 Chemistry)

## 1. Standard Cell Potential ($E^\\circ_{cell}$)
$$E^\\circ_{cell} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$$
* Spontaneous if $E^\\circ_{cell} > 0$.
* Relationship to Free Energy:
  $$\\Delta G^\\circ = -n F E^\\circ_{cell}$$

---

## 2. The Nernst Equation (Non-standard conditions)
$$E_{cell} = E^\\circ_{cell} - \\frac{RT}{nF} \\ln Q = E^\\circ_{cell} - \\frac{0.0592}{n} \\log_{10} Q \\quad (\\text{at } 298\\, K)$$
* At equilibrium ($E_{cell} = 0, Q = K$):
  $$E^\\circ_{cell} = \\frac{0.0592}{n} \\log_{10} K$$`
          },
          {
            order: 4,
            title: "Unit 4: Advanced Organic Chemistry and Functional Groups",
            noteTitle: "Unit 4: Oxygen & Nitrogen Functional Groups, Polymers & Biomolecules",
            body: `# Unit 4: Advanced Organic Chemistry (Grade 12 Chemistry)

## 1. Functional Groups Summary
| Class | General Formula | Functional Group | Example |
| :--- | :--- | :--- | :--- |
| **Alcohol** | $R-OH$ | Hydroxyl ($-OH$) | Ethanol ($CH_3CH_2OH$) |
| **Ether** | $R-O-R'$ | Alkoxy ($-O-$) | Diethyl ether |
| **Aldehyde** | $R-CHO$ | Carbonyl at chain end | Ethanal ($CH_3CHO$) |
| **Ketone** | $R-CO-R'$ | Carbonyl within chain | Propanone ($CH_3COCH_3$) |
| **Carboxylic Acid** | $R-COOH$ | Carboxyl ($-COOH$) | Ethanoic acid ($CH_3COOH$) |
| **Ester** | $R-COO-R'$ | Ester ($-COO-$) | Ethyl ethanoate |
| **Amine** | $R-NH_2$ | Amino ($-NH_2$) | Methylamine ($CH_3NH_2$) |

---

## 2. Esterification Reaction
Carboxylic Acid + Alcohol $\\xrightarrow{H_2SO_4}$ Ester + Water:
$$R-COOH + R'-OH \\rightleftharpoons R-COOR' + H_2O$$`
          }
        ]
      }
    ];

    for (const g of gradesChemistry) {
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

    console.log("\n=========================================================");
    console.log("SUCCESS: All 4 Grades of Chemistry (9, 10, 11, 12) Seeded!");
    console.log("=========================================================");

  } catch (err) {
    console.error("Error in Chemistry seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Chemistry seeding connection closed.");
  }
}

seedChemistry();
