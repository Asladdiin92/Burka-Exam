import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const physics2014Questions = [
  {
    questionNumber: 1,
    grade: "Grade 10",
    topic: "Unit 5: Geometrical Optics — Image Formation by Plane Mirrors",
    difficulty: "easy",
    prompt: "Suppose a triangular object (O) is placed in front of a vertical plane mirror on a horizontal baseline, with its sloped hypotenuse facing the mirror and its vertical side farthest from the mirror. Its image is observed at position (X). Which diagram represents the image (I) formed by the mirror when observed from position (X)?",
    options: [
      "Diagram A: Image I placed at equal distance behind the mirror on the baseline, facing the same direction as O without lateral inversion",
      "Diagram B: Image I elevated above the baseline, facing the same direction as O",
      "Diagram C: Image I on the baseline at equal perpendicular distance behind the mirror, laterally inverted so its vertical edge faces away from the mirror (mirror-symmetric to O)",
      "Diagram D: Image I elevated above the baseline and laterally inverted"
    ],
    correctAnswer: "C",
    explanation: "A plane mirror always produces a virtual, upright, and laterally inverted image of the same size as the object, located at the exact same perpendicular distance behind the mirror as the object is in front of it. Since the triangular object rests on the baseline with its hypotenuse facing the mirror, its laterally inverted image must also rest on the baseline with its hypotenuse facing the mirror (Diagram C)."
  },
  {
    questionNumber: 2,
    grade: "Grade 10",
    topic: "Unit 5: Geometrical Optics — Spherical Mirrors & Mirror Equation",
    difficulty: "medium",
    prompt: "An object is placed 25.0 cm in front of a concave mirror having focal length of 10.0 cm. The magnification of the mirror is __________.",
    options: [
      "2.5",
      "16.7",
      "0.67",
      "1.5"
    ],
    correctAnswer: "C",
    explanation: "Given u = 25.0 cm and f = 10.0 cm. Using the mirror formula 1/f = 1/u + 1/v: 1/v = 1/10.0 - 1/25.0 = (5 - 2)/50 = 3/50 cm⁻¹ => v = 50/3 ≈ 16.67 cm. Magnification M = v / u = (50/3) / 25.0 = 2/3 ≈ 0.67."
  },
  {
    questionNumber: 3,
    grade: "Grade 11",
    topic: "Unit 1: Measurement and Practical Work — Uncertainties and Experimental Errors",
    difficulty: "easy",
    prompt: "Which of the following statements distinguishes between random and systematic errors?",
    options: [
      "Systematic error can be minimized by taking several readings and averaging; whereas random error cannot be minimized.",
      "Systematic error makes measured values to be always above or always below the true value; whereas random error causes measured values to be sometimes above and sometimes below the true value.",
      "Random error makes measured values to be always above or always below the true value; whereas systematic error causes measured values to be sometimes above and sometimes below the true value.",
      "Random error is biased, whereas systematic error does not show bias."
    ],
    correctAnswer: "B",
    explanation: "Systematic errors consistently shift measurements in one direction (always above or always below true value) due to calibration or zero errors. Random errors cause unpredictable fluctuations scattering readings both above and below the true value, which can be minimized by averaging repeated measurements."
  },
  {
    questionNumber: 4,
    grade: "Grade 11",
    topic: "Unit 2: Vector Quantities — Unit Vectors and Vector Operations",
    difficulty: "easy",
    prompt: "The unit vector in the direction of A⃗ = 3î + 4ĵ is __________.",
    options: [
      "(3/5)î + (4/5)ĵ",
      "2î − ĵ",
      "(3/2)î + (4/2)ĵ",
      "î + ĵ"
    ],
    correctAnswer: "A",
    explanation: "The magnitude of A⃗ = 3î + 4ĵ is |A⃗| = √(3² + 4²) = √25 = 5. The unit vector in the direction of A⃗ is û = A⃗ / |A⃗| = (3î + 4ĵ)/5 = (3/5)î + (4/5)ĵ."
  },
  {
    questionNumber: 5,
    grade: "Grade 11",
    topic: "Unit 2: Vector Quantities — Collinear and Parallel Vectors",
    difficulty: "easy",
    prompt: "Which of the following pair of vectors are collinear?",
    options: [
      "2î − 3ĵ and 4î − 6ĵ",
      "î + ĵ and −î + ĵ",
      "2î + 3ĵ and −4î + 6ĵ",
      "2î + 3ĵ and −4î − 6ĵ"
    ],
    correctAnswer: "D",
    explanation: "Two vectors are collinear (parallel or antiparallel) if one is a scalar multiple of the other: B⃗ = k A⃗. For 2î + 3ĵ and −4î − 6ĵ, we have −4î − 6ĵ = −2(2î + 3ĵ), where k = -2 (antiparallel collinear)."
  },
  {
    questionNumber: 6,
    grade: "Grade 9 & Grade 11",
    topic: "Kinematics — Motion in a Straight Line & Motion Graphs",
    difficulty: "easy",
    prompt: "For an object moving in straight line,",
    options: [
      "if the displacement changes by equal amount in equal time interval, the displacement-time graph is horizontal line.",
      "the area of the region under the displacement-time graph and the slope of velocity-time graph are, respectively, the acceleration and displacement of the object.",
      "if the velocity increases by equal amount in equal time interval, the velocity-time graph is straight line with positive slope and the acceleration-time graph is horizontal.",
      "the slope of displacement-time graph and the area of the region under acceleration-time graph are, respectively, the acceleration and velocity of the object."
    ],
    correctAnswer: "C",
    explanation: "When velocity increases by equal amounts in equal time intervals, the acceleration is constant (positive). Hence, the v-t graph is a straight line with constant positive slope, and the a-t graph is a horizontal straight line."
  },
  {
    questionNumber: 7,
    grade: "Grade 11",
    topic: "Circular & Rotational Motion — Planetary and Satellite Motion",
    difficulty: "easy",
    prompt: "Which of the following is true about satellite motion?",
    options: [
      "A satellite moving closer to the Earth takes longer time to complete one revolution than a satellite farther from the Earth.",
      "For two satellites moving around the Earth at equal orbital radius, a heavier satellite has larger speed than a lighter one.",
      "For equal orbital radius, a satellite moving around the Earth has smaller speed than a satellite moving about Moon.",
      "A satellite closer to Earth is faster than a satellite farther from the Earth."
    ],
    correctAnswer: "D",
    explanation: "Orbital speed for a satellite in a circular orbit of radius r around the Earth is v = √(G M_e / r). Since orbital speed is inversely proportional to √r, a satellite closer to Earth (smaller r) moves with a greater speed."
  },
  {
    questionNumber: 8,
    grade: "Grade 11",
    topic: "Unit 4: Dynamics — Laws of Motion and Static Friction",
    difficulty: "medium",
    prompt: "A block of mass m is placed on horizontal surface. The coefficient of static friction between the block and the surface is μ. A force of magnitude F pushes downward on the block at an angle θ below the horizontal. The minimum magnitude of the force F required to slide the block on the surface is __________.",
    options: [
      "μmg / (cos θ − μ sin θ)",
      "μmg / (cos θ + μ sin θ)",
      "μmg / (cos θ − sin θ)",
      "μmg / (cos θ + sin θ)"
    ],
    correctAnswer: "A",
    explanation: "Vertical equilibrium: N = mg + F sin θ. For sliding to occur, the horizontal driving force F cos θ must overcome maximum static friction f_s,max = μ N = μ(mg + F sin θ). Rearranging: F cos θ - μ F sin θ = μ mg => F(cos θ - μ sin θ) = μ mg => F = μmg / (cos θ − μ sin θ)."
  },
  {
    questionNumber: 9,
    grade: "Grade 11",
    topic: "Unit 4: Dynamics — Impulse and Conservation of Linear Momentum",
    difficulty: "medium",
    prompt: "A ball of mass m moving with a speed v strikes a hard wall at an angle θ with the wall. It is reflected with the same speed at the same angle θ with the wall. If the ball is in contact with the wall for time t, then the average force acting on the wall is given by __________.",
    options: [
      "(mv / t) cos θ",
      "(mv / t) sin θ",
      "(2mv / t) cos θ",
      "(2mv / t) sin θ"
    ],
    correctAnswer: "D",
    explanation: "The angle θ is measured between the trajectory and the wall surface. The velocity component parallel to the wall is v cos θ (unchanged). The velocity component perpendicular to the wall changes from +v sin θ (towards wall) to -v sin θ (away from wall). Change in momentum magnitude is Δp = 2mv sin θ. Average force F_avg = Δp / t = (2mv / t) sin θ."
  },
  {
    questionNumber: 10,
    grade: "Grade 11",
    topic: "Unit 5: Work, Energy and Power — Work-Energy Theorem",
    difficulty: "easy",
    prompt: "According to the work-energy theorem,",
    options: [
      "work done by tension on an object tied to a string and moving in a horizontal circle is negative.",
      "work done by gravity on an object thrown downward is negative.",
      "work done by gravity on an object thrown upward and moving upward is negative.",
      "work done by gravitational force on a satellite moving around the earth in a circular orbit is positive."
    ],
    correctAnswer: "C",
    explanation: "When an object moves upward, displacement is upward while gravitational force is downward (angle φ = 180°, cos 180° = -1). Therefore, gravity does negative work, decreasing the kinetic energy."
  },
  {
    questionNumber: 11,
    grade: "Grade 12",
    topic: "Unit 2: Wave Motion — Superposition of Waves and Standing Waves",
    difficulty: "medium",
    prompt: "Standing wave is formed when two identical waves travelling in opposite directions in the same medium interfere with each other. If y₁ and y₂ are the interfering waves and y = y₁ + y₂ is the resulting standing wave, which of the following is a correct combination?",
    options: [
      "y₁ = A sin(kx − ωt), y₂ = A sin(kx + ωt), y = A sin(kx) cos(2ωt)",
      "y₁ = A sin(kx − ωt), y₂ = A sin(kx + ωt), y = 2A sin(kx) cos(ωt)",
      "y₁ = A sin(kx − ωt), y₂ = A sin(kx − ωt), y = 2A sin(kx) cos(ωt)",
      "y₁ = A sin(kx − ωt), y₂ = A cos(kx + ωt), y = 2A sin(kx − ωt)"
    ],
    correctAnswer: "B",
    explanation: "Using the sum-to-product trigonometric identity: sin(α) + sin(β) = 2 sin((α + β)/2) cos((α - β)/2). With α = kx - ωt and β = kx + ωt: y = y₁ + y₂ = A [sin(kx - ωt) + sin(kx + ωt)] = 2A sin(kx) cos(ωt)."
  },
  {
    questionNumber: 12,
    grade: "Grade 12",
    topic: "Unit 2: Wave Motion — Wave Optics and Young's Double-Slit Interference",
    difficulty: "medium",
    prompt: "A Young double slit experiment consists of two narrow slits separated by 0.06 mm and 1.2 m away from a screen. If the slits are illuminated with a light of wavelength 563 nm, the location of the fourth bright fringe on the screen is __________.",
    options: [
      "0.394 cm.",
      "0.45 cm.",
      "3.94 cm.",
      "4.5 cm."
    ],
    correctAnswer: "D",
    explanation: "Given d = 0.06 mm = 6 × 10⁻⁵ m, L = 1.2 m, λ = 563 × 10⁻⁹ m, and m = 4. The position of the 4th bright fringe is y₄ = m λ L / d = (4 × 5.63 × 10⁻⁷ × 1.2) / (6 × 10⁻⁵) = 4.504 × 10⁻² m = 4.5 cm."
  },
  {
    questionNumber: 13,
    grade: "Grade 11 / Grade 12",
    topic: "Electrostatics — Electric Dipole in a Uniform Electric Field",
    difficulty: "medium",
    prompt: "An electric dipole consists of a negative charge −q placed at a point with x and y coordinates (−2, −2) and a positive charge +q at (2, 2). The dipole is placed in a uniform electric field E⃗ directed in the positive x direction. If the dipole axis makes an angle θ with the field, which of the following is true about the dipole?",
    options: [
      "The field rotates the dipole in the direction of decreasing the angle θ, until the dipole becomes parallel to the field.",
      "The field rotates it in the direction of increasing the angle θ, until the dipole is perpendicular to the field.",
      "It is in both translational and rotational equilibrium.",
      "It travels in the direction of the electric field."
    ],
    correctAnswer: "A",
    explanation: "In a uniform electric field, net force is zero (no translational acceleration). The torque τ⃗ = p⃗ × E⃗ tends to align the dipole moment p⃗ (from -q to +q) parallel to E⃗, thereby decreasing the angle θ until θ = 0."
  },
  {
    questionNumber: 14,
    grade: "Grade 11 / Grade 12",
    topic: "Electrostatics — Electric Potential Due to a Point Charge",
    difficulty: "easy",
    prompt: "The electric potential at a distance of 2 cm from a −1.6 × 10⁻⁹ C point charge is __________.",
    options: [
      "−14.4 V.",
      "720 V.",
      "4.4 V.",
      "−720 V."
    ],
    correctAnswer: "D",
    explanation: "Electric potential V = k q / r. Given q = -1.6 × 10⁻⁹ C, r = 0.02 m, and k = 9 × 10⁹ N·m²/C²: V = (9 × 10⁹ × (-1.6 × 10⁻⁹)) / 0.02 = -14.4 / 0.02 = -720 V."
  },
  {
    questionNumber: 15,
    grade: "Grade 10",
    topic: "Unit 2: Electric Current and Circuit — Series and Parallel Resistor Networks",
    difficulty: "medium",
    prompt: "Two resistors R₁ = 1 Ω and R₂ = 4 Ω are connected in parallel to each other and their combination is connected in series with a third resistor R₃ = 2 Ω. The whole combination is connected to a voltage source of potential difference 14 V. The potential difference across R₁ is __________.",
    options: [
      "10 V.",
      "14 V.",
      "5 V.",
      "4 V."
    ],
    correctAnswer: "D",
    explanation: "1) Parallel resistance R_p = (1 × 4)/(1 + 4) = 0.8 Ω. 2) Total resistance R_total = 0.8 + 2 = 2.8 Ω. 3) Total current I = V / R_total = 14 / 2.8 = 5 A. 4) Voltage across parallel branch (and R₁): V₁ = I × R_p = 5 × 0.8 = 4 V."
  },
  {
    questionNumber: 16,
    grade: "Grade 10 & Grade 12",
    topic: "Electromagnetism — Magnetic Field of a Solenoid",
    difficulty: "easy",
    prompt: "Consider a long and tightly wound solenoid carrying current I, having length L and N turns of winding. If n is the number of turns per unit length, which of the following describes the magnetic field produced by the solenoid?",
    options: [
      "The magnetic field inside the solenoid is zero, whereas the field outside is perpendicular to the length of the solenoid.",
      "The magnetic field inside the solenoid is constant and is parallel to the solenoid's axis, whereas the field outside is negligible.",
      "The magnetic field inside the solenoid is uniform and perpendicular to the axis of the solenoid.",
      "The magnetic field outside the solenoid is as strong as the field inside it."
    ],
    correctAnswer: "B",
    explanation: "Inside an ideal long solenoid, the magnetic field is uniform and constant (B = μ₀ n I) parallel to its axis, while outside the solenoid the magnetic field is practically zero (negligible)."
  },
  {
    questionNumber: 17,
    grade: "Grade 10 & Grade 12",
    topic: "Electromagnetic Induction — Faraday's Law",
    difficulty: "easy",
    prompt: "According to the law of electromagnetic induction,",
    options: [
      "the magnitude of emf induced in a circuit is directly proportional to the rate of change of the magnetic flux crossing any surface bounded by the circuit.",
      "a changing magnetic field parallel to the plane of a circuit induces an emf in it.",
      "a constant magnetic flux crossing the surface of a circuit induced an emf in the circuit.",
      "an emf is induced in a circuit when a constant magnetic field crosses its surface."
    ],
    correctAnswer: "A",
    explanation: "Faraday's law states that the induced electromotive force in a closed circuit is directly proportional to the time rate of change of magnetic flux through the circuit: |ε| = |dΦ_B / dt|."
  },
  {
    questionNumber: 18,
    grade: "Grade 12",
    topic: "Unit 5: Alternating Current (AC) Circuits — Power in Series RLC Circuits",
    difficulty: "medium",
    prompt: "A resistor R, a capacitor C, and inductor L are connected in series to an AC voltage source that generates a sinusoidal voltage, V(t) = V_p sin(ωt), with V_p and ω being the peak voltage and angular frequency of the source. If X_C, X_L, and Z are capacitive reactance, inductive reactance, and impedance, respectively; I_rms and V_rms are the root-mean-square (rms) values of the current and voltage, the average power dissipated in the series RLC circuit is given by __________.",
    options: [
      "2 I_p V_p [ R / √(R² + (X_L − X_C)²) ]",
      "I_rms V_rms",
      "I_rms V_rms [ R / √(R² + (X_L − X_C)²) ]",
      "I_rms² Z"
    ],
    correctAnswer: "C",
    explanation: "Average power in a series RLC AC circuit is P_avg = V_rms I_rms cos φ, where the power factor is cos φ = R / Z = R / √(R² + (X_L − X_C)²). Thus, P_avg = I_rms V_rms [ R / √(R² + (X_L − X_C)²) ]."
  },
  {
    questionNumber: 19,
    grade: "Grade 12",
    topic: "Unit 6: Atomic Physics — Quantum Mechanics and Heisenberg Uncertainty Principle",
    difficulty: "easy",
    prompt: "According to the Heisenberg's uncertainty principle,",
    options: [
      "the larger the position uncertainty, the larger the momentum uncertainty.",
      "if the uncertainty in position decreases, the momentum uncertainty decreases, too.",
      "the more precisely we measure the position of a particle; we become less precise of its momentum and vice versa.",
      "we can measure both the position and momentum of a particle simultaneously with unlimited precision."
    ],
    correctAnswer: "C",
    explanation: "Heisenberg's uncertainty principle (Δx · Δp ≥ ℏ/2) dictates that position and momentum cannot be simultaneously measured with arbitrary precision; increasing the precision of position (smaller Δx) increases the uncertainty in momentum (larger Δp), and vice versa."
  },
  {
    questionNumber: 20,
    grade: "Grade 12",
    topic: "Unit 7: Nuclear Physics — Nuclear Binding Energy and Stability Curve",
    difficulty: "hard",
    prompt: "The graph of nuclear binding energy per nucleon (BE/A) versus mass number (A) has its peak near an atomic weight A = 56. Which of the following statements is true about the graph?",
    options: [
      "Uranium (A = 235), which has larger binding energy than iron (A = 56), is more stable than iron.",
      "Nucleus with larger number of neutron is more stable than nucleus of the same atom with smaller number of neutron.",
      "For heavier nuclei (A > 56), the binding energy per nucleon decreases with the increase of mass number; implying that heavier atoms can increase their stability by increasing their protons' number.",
      "For smaller atoms (A < 56), the binding energy per nucleon generally increases with the increase of mass number; indicating that lighter atoms can increase stability through nuclear fission."
    ],
    correctAnswer: "A",
    explanation: "Total binding energy of Uranium-235 is ~1786 MeV, which is much larger than the total binding energy of Iron-56 (~492 MeV). However, Iron-56 has a higher binding energy per nucleon (8.8 MeV vs 7.6 MeV), making Iron more stable. (Note: Option D contains a typo in the exam paper substituting 'fission' for 'fusion', which leads to Option A being the keyed choice)."
  },
  {
    questionNumber: 21,
    grade: "Grade 12",
    topic: "Unit 2: Wave Motion — Sound Waves, Reflection (Echo), and Refraction",
    difficulty: "easy",
    prompt: "Which of the following statements is NOT correct about reflection and refraction of sound waves and their applications?",
    options: [
      "In pre-natal scanning, reflection and refraction of sound allows doctors to monitor the progress of a developing baby.",
      "Reflection of sound (echo) is formed when sound enters a medium of varying densities.",
      "Reflection and refraction of sound are used to detect flaws in metals and to help people park their cars.",
      "Refraction of sound is the change in its direction as it travels through a medium having different densities."
    ],
    correctAnswer: "B",
    explanation: "An echo is formed when sound reflects off a solid boundary back into the same medium, whereas bending as sound enters a medium of varying densities describes refraction, not reflection."
  },
  {
    questionNumber: 22,
    grade: "Grade 11",
    topic: "Unit 6: Rotational Motion — Rotational Work and Energy",
    difficulty: "easy",
    prompt: "A torque τ rotates an object of mass m and moment of inertia I through an angle θ. The work done on the object by the torque is __________.",
    options: [
      "Iθ",
      "mθ",
      "τθ",
      "τI"
    ],
    correctAnswer: "C",
    explanation: "Rotational work done by a constant torque τ acting through an angular displacement θ is W = τ θ."
  },
  {
    questionNumber: 23,
    grade: "Grade 11",
    topic: "Gravitation and Kepler's Third Law of Planetary Motion",
    difficulty: "medium",
    prompt: "A satellite revolves around the Earth in a circular orbit of radius r = 4 × 10¹⁶ m. The period of the satellite is __________.",
    options: [
      "2.5 × 10¹⁹ s.",
      "3.7 × 10²⁷ s.",
      "3.7 × 10²⁶ s.",
      "2.5 × 10¹⁸ s."
    ],
    correctAnswer: "D",
    explanation: "By Kepler's Third Law, T = 2π √(r³ / (G M_e)). With r = 4 × 10¹⁶ m and G M_e = (6.67 × 10⁻¹¹)(6 × 10²⁴) ≈ 4.0 × 10¹⁴: T = 2π √(64 × 10⁴⁸ / 4.0 × 10¹⁴) = 2π √(16 × 10³⁴) = 2π × 4 × 10¹⁷ = 8π × 10¹⁷ s ≈ 2.5 × 10¹⁸ s."
  },
  {
    questionNumber: 24,
    grade: "Grade 10",
    topic: "Unit 1: Electrostatics — Methods of Charging (Conduction, Induction, Friction)",
    difficulty: "easy",
    prompt: "One of the following statements is a correct description of the charging processes?",
    options: [
      "During charging a neutral object by induction using a negatively charged rod, charge flows from the rod to the object.",
      "When a neutral metallic sphere is charged by induction using a negatively charged rod, the sphere acquires a net negative charge.",
      "When a positively charged object is momentarily brought into contact with a neutral metallic sphere, the sphere acquires a net positive charge.",
      "When a plastic rod is rubbed with wool, the two objects acquire a net charge of the same sign."
    ],
    correctAnswer: "C",
    explanation: "In charging by conduction (contact), electrons transfer between the contacting bodies so the neutral object acquires charge of the same sign as the charging body (a positively charged rod draws electrons, leaving the sphere positively charged)."
  },
  {
    questionNumber: 25,
    grade: "Grade 11",
    topic: "Capacitors and Dielectrics",
    difficulty: "medium",
    prompt: "A parallel plate capacitor is charged with a battery. The battery is then disconnected, and a dielectric material is inserted between the plates of the capacitor. Which of the following is correct about the effect of the dielectric?",
    options: [
      "The potential difference between the plates remains the same and the charge increases.",
      "The charge on the plates decreases and the energy stored increases.",
      "The electric field between the plates and the energy stored decrease.",
      "The capacitance remains the same and the electric field between the plates increases."
    ],
    correctAnswer: "C",
    explanation: "With the battery disconnected, charge Q remains constant. Inserting a dielectric increases capacitance (C = κ C₀, κ > 1). Electric field E = V / d = Q / (C d) decreases by 1/κ, and stored electrostatic energy U = Q² / (2C) decreases by 1/κ."
  },
  {
    questionNumber: 26,
    grade: "Grade 10 & Grade 12",
    topic: "Current Electricity — Resistance and Resistivity",
    difficulty: "easy",
    prompt: "Which one of the following statements is correct about the resistance of a conductor with a circular cross-section?",
    options: [
      "At a given temperature, the resistance of copper and silver wires of the same length and diameter is the same.",
      "The resistance of the conductor increases as its length increases and its diameter decreases.",
      "The resistance of the conductor increases as its length and diameter increases.",
      "The resistance of the conductor decreases as it is heated."
    ],
    correctAnswer: "B",
    explanation: "Resistance R = ρ L / A = 4 ρ L / (π D²). Resistance is directly proportional to length L and inversely proportional to diameter squared (D²)."
  },
  {
    questionNumber: 27,
    grade: "Grade 10 & Grade 12",
    topic: "Current Electricity — Ohm's Law Circuit Setup",
    difficulty: "easy",
    prompt: "A student wants to investigate Ohm's law using an ammeter (A) and a voltmeter (V) to measure current through and potential difference across a resistor R, with a rheostat to vary the current. Which connection is the correct circuit setup?",
    options: [
      "Circuit A: Resistor R and Ammeter A in series, Voltmeter V connected across the rheostat",
      "Circuit B: Resistor R in series with Ammeter A and variable resistor (rheostat), and Voltmeter V connected in parallel directly across Resistor R",
      "Circuit C: Voltmeter V connected across the battery, Ammeter A in series with R",
      "Circuit D: Ammeter A connected in parallel with Resistor R, and Voltmeter V connected in series"
    ],
    correctAnswer: "B",
    explanation: "In an Ohm's law experiment, the ammeter (low resistance) must be in series with the component to measure current, while the voltmeter (high resistance) must be in parallel directly across resistor R to measure its potential drop."
  },
  {
    questionNumber: 28,
    grade: "Grade 10 & Grade 12",
    topic: "Magnetism — Motion of Charged Particles in a Uniform Magnetic Field",
    difficulty: "medium",
    prompt: "Circular paths followed by two charges q₁ and q₂ moving with the same speed in uniform magnetic field directed into the page (×) are observed. Charge q₁ follows an outer circular path (clockwise) and q₂ follows an inner circular path (counter-clockwise). If the two charges have the same mass, which of the following is correct about the sign and the magnitude of charges?",
    options: [
      "q₁ is negative, q₂ is positive and |q₁| < |q₂|.",
      "q₁ is negative, q₂ is positive and |q₁| > |q₂|.",
      "q₁ is positive, q₂ is negative and |q₁| < |q₂|.",
      "q₁ is positive, q₂ is negative and |q₁| > |q₂|."
    ],
    correctAnswer: "A",
    explanation: "1) Right-hand rule with B into page: Clockwise deflection requires negative charge (q₁ is negative), and counter-clockwise deflection requires positive charge (q₂ is positive). 2) Cyclotron radius r = mv / (|q|B) => |q| = mv / (rB). Since r₁ > r₂, we have |q₁| < |q₂|."
  },
  {
    questionNumber: 29,
    grade: "Grade 10 & Grade 12",
    topic: "Electromagnetic Induction — Ideal Transformers",
    difficulty: "easy",
    prompt: "The primary coil of a transformer has 250 turns and its secondary coil consists of 1500 turns. If 220 V is applied to its primary coil, the voltage induced in the secondary coil and the ratio of current in the primary coil to the current in the secondary coil, respectively, are __________.",
    options: [
      "1320 V and 6",
      "1330 V and 6",
      "1220 V and 60",
      "1320 V and 60"
    ],
    correctAnswer: "A",
    explanation: "Turns ratio N_s / N_p = 1500 / 250 = 6. Secondary voltage V_s = V_p (N_s / N_p) = 220 V × 6 = 1320 V. Current ratio I_p / I_s = N_s / N_p = 6."
  },
  {
    questionNumber: 30,
    grade: "Grade 10",
    topic: "Introduction to Electronics — Semiconductor Diodes",
    difficulty: "easy",
    prompt: "A diode is an electronic component that",
    options: [
      "is useful to convert a DC voltage to AC voltage.",
      "allows electric current to pass through it in one direction.",
      "allows the flow of current when its p-type region is connected to the negative terminal of a cell.",
      "allows current to pass through it either from cathode to anode or from anode to cathode."
    ],
    correctAnswer: "B",
    explanation: "A p-n junction diode conducts easily when forward-biased and blocks current when reverse-biased, permitting current flow in one direction only."
  },
  {
    questionNumber: 31,
    grade: "Grade 9 & Grade 11",
    topic: "Vectors — Resolution and Addition of Force Vectors",
    difficulty: "medium",
    prompt: "Three forces, each having equal magnitudes of 10 N, are applied to an object on a horizontal surface. A force F₁ makes an angle of 30° above positive x-axis, F₂ makes 30° above the negative x-axis, and the third force F₃ is directed along the positive x-axis. The magnitude and direction of their resultant force are, respectively,",
    options: [
      "20 N 45° above positive x-axis.",
      "14.1 N in the positive y-axis.",
      "20 N in the negative y-axis.",
      "14.1 N 45° above positive x-axis."
    ],
    correctAnswer: "D",
    explanation: "R_x = 10 cos 30° - 10 cos 30° + 10 = 10 N. R_y = 10 sin 30° + 10 sin 30° + 0 = 5 + 5 = 10 N. Resultant R = √(10² + 10²) = 10√2 ≈ 14.1 N at θ = tan⁻¹(10/10) = 45° above positive x-axis."
  },
  {
    questionNumber: 32,
    grade: "Grade 9 & Grade 11",
    topic: "Uniformly Accelerated Motion — Free Fall",
    difficulty: "easy",
    prompt: "A student throws a ball vertically upward with a speed of 20 m/s. The maximum height reached by the ball and its velocity 3.0 s after it was thrown are, respectively,",
    options: [
      "20 m and 30 m/s upward.",
      "15 m and 10 m/s downward.",
      "105 m and 50 m/s upward.",
      "20 m and 10 m/s downward."
    ],
    correctAnswer: "D",
    explanation: "1) Max height h_max = u² / (2g) = 20² / (2 × 10) = 20 m. 2) Velocity at t = 3.0 s: v = u - gt = 20 - 10(3) = -10 m/s (10 m/s downward)."
  },
  {
    questionNumber: 33,
    grade: "Grade 9 & Grade 11",
    topic: "Dynamics — Static, Limiting, and Kinetic Friction",
    difficulty: "easy",
    prompt: "Which one of the following statements describes the difference between different types of friction?",
    options: [
      "For an object at rest on a horizontal surface, static friction increases with the increase of the applied force and reaches a maximum value just before sliding occurs.",
      "Limiting friction is the minimum value of static friction that keeps an object stationary.",
      "If there is a constant force applied to a stationary object on a horizontal surface, the static friction becomes equal to the limiting friction.",
      "Limiting and kinetic frictions exist at the same time between two surfaces sliding over each other."
    ],
    correctAnswer: "A",
    explanation: "Static friction is a self-adjusting force that exactly matches the applied force up to a maximum value called the limiting friction, after which sliding motion starts."
  },
  {
    questionNumber: 34,
    grade: "Grade 9 & Grade 11",
    topic: "Newton's Second Law — Apparent Weight in an Elevator",
    difficulty: "easy",
    prompt: "The apparent weight of a 60 kg student standing inside a lift is",
    options: [
      "600 N when the lift accelerates with acceleration equal to gravitational acceleration.",
      "600 N when the lift accelerates upward with 2 m/s².",
      "480 N when the lift accelerates downward with 2 m/s².",
      "720 N when the lift is at rest."
    ],
    correctAnswer: "C",
    explanation: "When accelerating downward with acceleration a = 2 m/s², the apparent weight (normal force N) is N = m(g - a) = 60 kg × (10 - 2) m/s² = 480 N."
  },
  {
    questionNumber: 35,
    grade: "Grade 9",
    topic: "Unit 4: Work, Energy and Power — Renewable and Non-Renewable Energy Resources",
    difficulty: "easy",
    prompt: "Which of the following statements describe the use of energy resources?",
    options: [
      "Solar energy produced by photovoltaic cells is free of greenhouse gases and has a very low running cost.",
      "Hydroelectric power generates a large amount of energy using small dam with little environmental impact and cheap initial cost of construction.",
      "Geothermal energy is the most accessible, environmental friendly and inexpensive source of energy.",
      "Wind energy, which is due to the pressure difference in space as the result of uneven sun heat, is a consistent and economical source of energy."
    ],
    correctAnswer: "A",
    explanation: "Photovoltaic solar panels directly convert sunlight into electricity with zero operational greenhouse gas emissions and minimal ongoing operating/maintenance costs."
  },
  {
    questionNumber: 36,
    grade: "Grade 9",
    topic: "Unit 5: Simple Machines — Mechanical Advantage of an Inclined Plane",
    difficulty: "easy",
    prompt: "A student wants to raise an object of mass m through a height h using an inclined plane that makes an angle θ above the horizontal. If l is the length of the inclined surface, which one of the following is correct about the actual mechanical advantage (AMA) and ideal mechanical advantage (IMA) of the inclined plane?",
    options: [
      "Neglecting friction, its AMA is 1 / sin θ.",
      "Neglecting friction, its IMA is 1 / cos θ.",
      "In the presence of friction, its AMA is 1 / sin θ.",
      "In the absence of friction, AMA is sin θ and its IMA is cos θ."
    ],
    correctAnswer: "A",
    explanation: "For an inclined plane, IMA = length / height = l / (l sin θ) = 1 / sin θ. When friction is neglected, the actual mechanical advantage equals ideal mechanical advantage: AMA = IMA = 1 / sin θ."
  },
  {
    questionNumber: 37,
    grade: "Grade 9",
    topic: "Unit 6: Fluid Statics — Archimedes' Principle and Law of Floatation",
    difficulty: "easy",
    prompt: "According to the law of floatation, an object must displaces a volume of fluid",
    options: [
      "equal to the weight of undisplaced fluid.",
      "equal to its apparent weight.",
      "less than its own weight.",
      "equals to its own weight."
    ],
    correctAnswer: "D",
    explanation: "The law of floatation states that a floating body in equilibrium displaces a weight of fluid equal to its own total weight."
  },
  {
    questionNumber: 38,
    grade: "Grade 9",
    topic: "Unit 7: Temperature and Heat — Anomalous Thermal Expansion of Water",
    difficulty: "medium",
    prompt: "Which one of the following statements describes the unusual behavior of expansion of water?",
    options: [
      "The density of water at 0 °C is less than its density at 4 °C, since water molecules move further apart and form a second hydrogen bond with other water molecules.",
      "As a temperature of water increases above 4 °C, its density increases since water molecules move further apart to form a second hydrogen bond with other molecules.",
      "At 0 °C, water has larger density and smaller volume than its density and volume at 4 °C.",
      "As a temperature of water increases from 0 °C to 4 °C, its density increases since one molecule of water forms one hydrogen bond with another molecule."
    ],
    correctAnswer: "A",
    explanation: "Water exhibits maximum density at 4 °C. As water cools from 4 °C to 0 °C, its molecules arrange into an open cage-like hydrogen-bonded hexagonal lattice, increasing volume and lowering density."
  },
  {
    questionNumber: 39,
    grade: "Grade 9",
    topic: "Unit 7: Temperature and Heat — Calorimetry and Thermal Equilibrium",
    difficulty: "medium",
    prompt: "A 40 g of water at 50 °C is poured into a well-insulated 30 g of copper calorimeter at 20 °C. The temperature of water at equilibrium becomes __________.",
    options: [
      "52.4 °C",
      "47.9 °C",
      "35 °C",
      "30 °C"
    ],
    correctAnswer: "B",
    explanation: "Heat lost by water = heat gained by copper: m_w c_w (50 - T_f) = m_c c_c (T_f - 20) => 40(4200)(50 - T_f) = 30(420)(T_f - 20) => 40(50 - T_f) = 3(T_f - 20) => 2000 - 40 T_f = 3 T_f - 60 => 43 T_f = 2060 => T_f = 47.9 °C."
  },
  {
    questionNumber: 40,
    grade: "Grade 9 & Grade 12",
    topic: "Wave Motion — Wave Speed Equation",
    difficulty: "easy",
    prompt: "An FM radio signal is transmitted from a radio station at a frequency of 1.5 × 10⁸ Hz. If the wavelength of the radio wave is 2.00 m, the speed of the FM signal is __________.",
    options: [
      "6.00 × 10⁸ m/s.",
      "1.33 × 10⁻⁸ m/s.",
      "3 × 10⁸ m/s.",
      "0.75 × 10⁸ m/s."
    ],
    correctAnswer: "C",
    explanation: "Wave speed v = f · λ = (1.5 × 10⁸ Hz) × (2.00 m) = 3.0 × 10⁸ m/s."
  },
  {
    questionNumber: 41,
    grade: "Grade 11",
    topic: "Unit 5: Work, Energy and Power — Conservation of Mechanical Energy & Dissipative Forces",
    difficulty: "easy",
    prompt: "Which one of the following statements is correct about transformation of mechanical energy into other forms and the law of conservation of total energy?",
    options: [
      "Due to dissipative force, the mechanical energy of a wooden block sliding on a rough horizontal surface is not conserved.",
      "Mechanical energy of a wooden block sliding on a rough horizontal surface is conserved.",
      "Neglecting air resistance, an object moving vertically downward gains potential energy and loses an equal amount of kinetic energy.",
      "Neglecting air resistance, an object moving vertically upward gains kinetic energy and loses an equal amount of gravitational potential energy."
    ],
    correctAnswer: "A",
    explanation: "Friction is a non-conservative dissipative force that does negative work, converting mechanical energy into thermal energy and sound. Hence, mechanical energy is not conserved."
  },
  {
    questionNumber: 42,
    grade: "Grade 11",
    topic: "Unit 6: Rotational Motion — Rotational Kinematics with Constant Angular Acceleration",
    difficulty: "easy",
    prompt: "A wheel rotating at angular speed of 20 rev/s is brought to rest after 40 rev under a constant angular acceleration. The angular acceleration of a point on the wheel is __________.",
    options: [
      "5 rev/s².",
      "−5 rev/s².",
      "−0.5 rev/s².",
      "0.25 rev/s²."
    ],
    correctAnswer: "B",
    explanation: "Using ω² = ω₀² + 2α θ: 0 = 20² + 2 α (40) => 80 α = -400 => α = -5 rev/s²."
  },
  {
    questionNumber: 43,
    grade: "Grade 11",
    topic: "Unit 6: Rotational Motion — Moment of Inertia and Parallel Axis Theorem",
    difficulty: "easy",
    prompt: "The parallel axis theorem states that if I_cm is the moment of inertia of a body of mass M about an axis passing through its center of mass (cm), its moment of inertia about any axis",
    options: [
      "perpendicular to and a displacement d from the axis through the cm is I = I_cm + ½Md².",
      "parallel to and a displacement d from the axis through the cm is I = I_cm + Md².",
      "perpendicular to and a displacement d from the axis through the cm is I = I_cm + Md².",
      "parallel to and a displacement d from the axis through the cm is I = I_cm + ½Md²."
    ],
    correctAnswer: "B",
    explanation: "The Parallel Axis Theorem states that I = I_cm + M d² for any axis parallel to the axis through the center of mass and separated by perpendicular distance d."
  },
  {
    questionNumber: 44,
    grade: "Grade 11",
    topic: "Unit 7: Equilibrium — Torque and Rotational Equilibrium of a Rigid Body",
    difficulty: "medium",
    prompt: "Three forces of equal magnitude F are exerted concurrently at the center point O of a uniform horizontal beam of length L: F₁ acts at 30° above the positive x-axis, F₂ acts at 30° above the negative x-axis, and F₃ acts vertically downward along the negative y-axis. If τ⃗_A, τ⃗_B, and τ⃗_O are net torques on the beam about an axis passing through point A, B, and O, respectively, which one of the following expressions is correct?",
    options: [
      "τ⃗_A = τ⃗_B = τ⃗_O = 0",
      "τ⃗_A > τ⃗_B > τ⃗_O",
      "τ⃗_A < τ⃗_B < τ⃗_O",
      "τ⃗_O = 0, τ⃗_A > τ⃗_B"
    ],
    correctAnswer: "A",
    explanation: "The vector sum of the three concurrent forces at point O is: F_net,x = F cos 30° - F cos 30° = 0; F_net,y = F sin 30° + F sin 30° - F = 0.5 F + 0.5 F - F = 0. Since the net force acting at O is identically zero (F⃗_net = 0⃗), the net torque about any reference point P is τ⃗_P = r⃗_PO × F⃗_net = 0⃗. Thus, τ⃗_A = τ⃗_B = τ⃗_O = 0."
  },
  {
    questionNumber: 45,
    grade: "Grade 11",
    topic: "Unit 8: Properties of Bulk Matter — Elasticity, Stress, and Strain",
    difficulty: "easy",
    prompt: "Tensile stress is the",
    options: [
      "parallel component of the applied force divided by the cross sectional area of an object.",
      "ratio of change in length of an object to the original length.",
      "perpendicular component of the applied force divided by the cross sectional area of an object.",
      "ratio of original length to the change in length of the object."
    ],
    correctAnswer: "C",
    explanation: "Tensile (normal) stress is defined as the perpendicular force F_⊥ per unit cross-sectional area A: σ = F_⊥ / A."
  },
  {
    questionNumber: 46,
    grade: "Grade 11",
    topic: "Unit 8: Properties of Bulk Matter — Surface Tension and Capillary Rise",
    difficulty: "medium",
    prompt: "A certain fluid has a density of 1080 kg/m³ and is observed to rise to a height of 2.1 cm in a 1.0 mm diameter tube. If the contact angle between the wall and the surface is zero (cos 0° = 1), the surface tension of the fluid is __________.",
    options: [
      "5670 N/m.",
      "0.02835 N/m.",
      "0.1134 N/m.",
      "0.0567 N/m."
    ],
    correctAnswer: "D",
    explanation: "Tube radius r = 0.5 mm = 5 × 10⁻⁴ m, h = 0.021 m, ρ = 1080 kg/m³, g = 10 m/s². From h = (2 γ cos θ)/(ρ g r), we get γ = (h ρ g r)/(2 cos θ) = (0.021 × 1080 × 10 × 5 × 10⁻⁴) / 2 = 0.1134 / 2 = 0.0567 N/m."
  },
  {
    questionNumber: 47,
    grade: "Grade 11",
    topic: "Unit 9: Heat and Thermodynamics — Thermal Conduction (Fourier's Law)",
    difficulty: "medium",
    prompt: "A slab of thermal insulator has a cross-section of 0.1 m², a length of 2 cm, and thermal conductivity of 0.1 J/(m·s·°C). If the temperature difference between the opposite faces of the insulator is 100 °C, the amount of heat flowing through the slab in 24 h is __________.",
    options: [
      "1.2 × 10³ J.",
      "4.32 × 10⁶ J.",
      "7.2 × 10⁴ J.",
      "5.0 × 10¹ J."
    ],
    correctAnswer: "B",
    explanation: "Q = (k A ΔT / L) · t. With k = 0.1, A = 0.1 m², ΔT = 100 °C, L = 0.02 m, and t = 24 × 3600 = 86,400 s: Q = (0.1 × 0.1 × 100 / 0.02) × 86,400 = (1.0 / 0.02) × 86,400 = 50 × 86,400 = 4,320,000 J = 4.32 × 10⁶ J."
  },
  {
    questionNumber: 48,
    grade: "Grade 12",
    topic: "Unit 1: Thermodynamics — First Law of Thermodynamics",
    difficulty: "easy",
    prompt: "A 100 J of work is done on a system and 418.6 J of heat is extracted from it. According to the first law of thermodynamics, the change in the internal energy of the system is __________.",
    options: [
      "−518.6 J.",
      "−318.6 J.",
      "318.6 J.",
      "518.6 J."
    ],
    correctAnswer: "B",
    explanation: "By the First Law of Thermodynamics: ΔU = Q + W_on. Heat extracted: Q = -418.6 J. Work done on the system: W_on = +100 J. Change in internal energy ΔU = -418.6 + 100 = -318.6 J."
  },
  {
    questionNumber: 49,
    grade: "Grade 12",
    topic: "Unit 1: Thermodynamics — Reversible and Irreversible Processes & Second Law",
    difficulty: "easy",
    prompt: "Which of the following statements describe the difference between reversible and irreversible processes?",
    options: [
      "In an irreversible process, a system can move from one thermodynamic state to another and back to its initial state; whereas a system in a reversible process cannot move back to its initial state.",
      "A system undergoing reversible process is always close to thermodynamic equilibrium, whereas a system undergoing irreversible process is not in thermal equilibrium.",
      "Ice at 0 °C placed in a metallic can at 40 °C undergoes a reversible process; whereas ice at 0 °C placed in a metal can at 0 °C undergoes an irreversible process.",
      "A process is reversible if its entropy increases, but irreversible if its entropy is constant."
    ],
    correctAnswer: "B",
    explanation: "A reversible process proceeds quasi-statically so that the system is always in infinitesimal proximity to thermodynamic equilibrium. In an irreversible process, the system moves through nonequilibrium intermediate states."
  },
  {
    questionNumber: 50,
    grade: "Grade 12",
    topic: "Unit 2: Oscillations and Waves — Forced Oscillations and Resonance",
    difficulty: "easy",
    prompt: "Which one of the following statements is correct about resonance in an oscillating object?",
    options: [
      "At resonance, the driving frequency is equal to the natural frequency and the amplitude becomes maximum.",
      "Damping increases the amplitude and natural frequency of the oscillator.",
      "Resonance occurs when the frequency of a periodic driving force is greater than the natural frequency of the oscillator.",
      "Resonance occurs when the oscillator is subject to a constant driving force."
    ],
    correctAnswer: "A",
    explanation: "Resonance occurs when the frequency of an external periodic driving force matches the system's natural frequency (f_driving = f_natural), maximizing energy transfer and producing a peak amplitude of oscillation."
  }
];

const targetPath = path.resolve(__dirname, "../seeds/data/physics_esslce_2014_booklet099.json");
fs.writeFileSync(targetPath, JSON.stringify(physics2014Questions, null, 2), "utf8");
console.log(`Generated ${physics2014Questions.length} Physics 2014 questions in ${targetPath}`);
