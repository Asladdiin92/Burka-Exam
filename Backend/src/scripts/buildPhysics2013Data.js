import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const physicsQuestions = [
  {
    questionNumber: 1,
    grade: "Grade 11 / 12",
    topic: "Current Electricity & DC Circuits (Kirchhoff's Rules)",
    difficulty: "easy",
    prompt: "Kirchhoff's junction rule states that",
    options: [
      "current traversing any closed loop at particular time is zero.",
      "the potential drop at a given junction equals the electromotive force at that particular point.",
      "charge entering the junction equals the charge leaving that junction at a particular time.",
      "the sum of the voltage drop across any closed loop equals the sum of electromotive force."
    ],
    correctAnswer: "C",
    explanation: "Kirchhoff's junction rule (KCL) is based on the conservation of electric charge. Since charge cannot accumulate or be destroyed at a circuit node, the rate of charge entering a junction must equal the rate of charge leaving that junction (∑ I_in = ∑ I_out)."
  },
  {
    questionNumber: 2,
    grade: "Grade 12",
    topic: "Magnetism (Magnetic Properties of Matter)",
    difficulty: "medium",
    prompt: "Which one of the following statements is NOT correct about the magnetic properties of matter?",
    options: [
      "There is a tendency to oppose the applied magnetic field in a diamagnetic substance.",
      "The unpaired electrons in diamagnetic materials will align with the applied magnetic field and parallel to each other.",
      "The unpaired electrons in ferromagnetic materials will align with the applied magnetic field and parallel to each other.",
      "The unpaired electrons in paramagnetic substance will tend to align themselves in the same direction as the applied magnetic field."
    ],
    correctAnswer: "B",
    explanation: "Diamagnetic materials have all their electrons paired, meaning they possess no net permanent atomic magnetic dipole moments (no unpaired electrons). When placed in a magnetic field, induced orbital currents weakly oppose the field (by Lenz's law). Thus, the statement that 'unpaired electrons in diamagnetic materials align with the applied magnetic field' is NOT correct."
  },
  {
    questionNumber: 3,
    grade: "Grade 12",
    topic: "Magnetism (Magnetic Force on a Current-Carrying Conductor)",
    difficulty: "easy",
    prompt: "Suppose a conductor of length l carrying a current I is placed in a uniform magnetic field of magnitude B. When the conductor is making an angle θ with that of the magnetic field, then the force experienced by the conductor due to the magnetic field is given by",
    options: [
      "F⃗ = I(B⃗ × l⃗)",
      "F⃗ = BIl cos θ",
      "F⃗ = BIl tan θ",
      "F⃗ = I(l⃗ × B⃗)"
    ],
    correctAnswer: "D",
    explanation: "The magnetic force on a straight current-carrying conductor of length vector l⃗ in a uniform magnetic field B⃗ is given by the vector cross product F⃗ = I(l⃗ × B⃗). Its magnitude is F = BIl sin θ."
  },
  {
    questionNumber: 4,
    grade: "Grade 12",
    topic: "Magnetism (Tangent Galvanometer & Magnetic Field of a Circular Coil)",
    difficulty: "medium",
    prompt: "Which one of the following statements is correct about a tangent galvanometer?",
    options: [
      "The current through a coil of the wire generates a magnetic field at the center of the coil.",
      "It consists of a coil of insulated copper wire on a circular magnetic frame.",
      "The current is inversely proportional to the tangent of the angle of the needle's deflection.",
      "It is a device used to measure the electric current in terms of the electric field it produces."
    ],
    correctAnswer: "A",
    explanation: "A tangent galvanometer consists of a circular coil of wire wound on a non-magnetic frame. When current flows through the coil, it produces a uniform magnetic field at its center perpendicular to the Earth's horizontal magnetic field. By the tangent law, the current is directly proportional to the tangent of the deflection angle (I = K tan θ)."
  },
  {
    questionNumber: 5,
    grade: "Grade 12",
    topic: "Magnetism (Magnetic Field of a Long Straight Conductor)",
    difficulty: "easy",
    prompt: "A long straight conductor carries a current I in the upward vertical direction. Which statement is NOT correct about the magnetic field produced by this current-carrying conductor?",
    options: [
      "Doubling the current through the conductor doubles the field strength.",
      "Reversing the current direction will reverse the direction of the magnetic field.",
      "The magnetic field encircles the conductor.",
      "The field strength is directly proportional to the distance from the conductor."
    ],
    correctAnswer: "D",
    explanation: "According to Ampère's law (and the Biot-Savart law), the magnetic field B at a perpendicular distance r from a long straight wire carrying current I is B = (μ₀ I) / (2π r). Thus, the field strength is inversely proportional to distance r (B ∝ 1/r), not directly proportional."
  },
  {
    questionNumber: 6,
    grade: "Grade 12",
    topic: "Electromagnetic Induction (Faraday's Law)",
    difficulty: "medium",
    prompt: "A coiled copper wire has 50 turns and a coil cross-sectional area of 9 × 10⁻⁴ m². This coil is initially placed in a uniform magnetic field of 0.02 T and pulled out of the field completely (where the field is zero) in 0.5 seconds. What is the magnitude of the induced electromotive force?",
    options: [
      "3.2 mV",
      "9.0 mV",
      "18 mV",
      "1.8 mV"
    ],
    correctAnswer: "D",
    explanation: "By Faraday's law of induction, |ε| = N |ΔΦ_B| / Δt = N A |ΔB| / Δt. Given N = 50, A = 9 × 10⁻⁴ m², ΔB = 0.02 T, and Δt = 0.5 s: |ε| = (50 × 9 × 10⁻⁴ × 0.02) / 0.5 = (9 × 10⁻⁴) / 0.5 = 1.8 × 10⁻³ V = 1.8 mV."
  },
  {
    questionNumber: 7,
    grade: "Grade 12",
    topic: "Electromagnetic Induction (Self-Inductance)",
    difficulty: "easy",
    prompt: "A 15.0 mH inductor is used to induce an electromotive force of 5.0 mV. What is the rate of change of the induced current?",
    options: [
      "3.0 A/s",
      "0.30 A/s",
      "0.33 A/s",
      "3.3 A/s"
    ],
    correctAnswer: "C",
    explanation: "The magnitude of self-induced emf is |ε| = L |ΔI / Δt|. Solving for the rate of change of current: |ΔI / Δt| = |ε| / L = (5.0 × 10⁻³ V) / (15.0 × 10⁻³ H) = 5 / 15 = 1/3 A/s ≈ 0.33 A/s."
  },
  {
    questionNumber: 8,
    grade: "Grade 12",
    topic: "Electromagnetic Induction (Relative Motion & Lenz's Law)",
    difficulty: "medium",
    prompt: "A coil and a permanent magnet are set in relative motion. Which one of the following statements is NOT correct about the induced electromotive force?",
    options: [
      "Coils with a larger number of turns produce greater induced electromotive forces.",
      "Moving a magnet relative to the coil and the coil relative to the magnet with equal speed will produce the same electromotive force.",
      "The magnitude of the induced electromotive force is directly proportional to the relative velocity between the two.",
      "The direction in which the coil moves relative to the magnetic field does not have any effect on the induced electromotive force."
    ],
    correctAnswer: "D",
    explanation: "The direction of motion of the coil relative to the magnetic field determines both whether magnetic flux increases, decreases, or remains zero (e.g. moving parallel to magnetic field lines induces zero emf) and the polarity/direction of the induced emf (by Lenz's law). Hence, claiming direction has no effect is NOT correct."
  },
  {
    questionNumber: 9,
    grade: "Grade 12",
    topic: "Electromagnetic Induction & AC Circuits (Transformers & Power Transmission)",
    difficulty: "easy",
    prompt: "What is the advantage of using alternating current in the transmission of electric energy?",
    options: [
      "It enables electricity to reach the consumers at very high voltage.",
      "It enables a transformer to increase or decrease the voltage as required.",
      "It completely avoids energy loss due to heating.",
      "It uses very high current in the transmission line."
    ],
    correctAnswer: "B",
    explanation: "The principal advantage of AC in electrical power systems is that transformers can easily step up the voltage for high-voltage, low-current long-distance transmission (minimizing I²R heating loss) and then step down the voltage to safe consumer levels."
  },
  {
    questionNumber: 10,
    grade: "Grade 12",
    topic: "Alternating Current (AC) Circuits (Capacitive Reactance)",
    difficulty: "easy",
    prompt: "Capacitive reactance is defined as",
    options: [
      "the equivalent quantity to resistance when we are talking about capacitors.",
      "the equivalent quantity to impedance in an RLC circuit.",
      "the equivalent quantity to resistance when we are talking about inductors.",
      "the equivalent quantity to resistance when we are talking about resistors."
    ],
    correctAnswer: "A",
    explanation: "Capacitive reactance (X_C = 1 / (2πfC), measured in Ohms Ω) is the opposition offered by a capacitor to the flow of alternating current, representing the AC equivalent of resistance specifically for capacitors."
  },
  {
    questionNumber: 11,
    grade: "Grade 11 / 12",
    topic: "Thermodynamics (Second Law & Entropy)",
    difficulty: "easy",
    prompt: "The second law of thermodynamics states that",
    options: [
      "the increase in the internal energy of a system is equal to the sum of the energy entering the system through heating, and work done on the system.",
      "two bodies that are separately in thermal equilibrium with a third body must be in thermal equilibrium with each other.",
      "no process is possible in which there is an overall decrease in the entropy of the universe.",
      "no process is possible in which there is an overall increase in the entropy of the universe."
    ],
    correctAnswer: "C",
    explanation: "In terms of entropy, the Second Law of Thermodynamics asserts that in any spontaneous or natural process, the total entropy of the universe (system + surroundings) must increase or remain constant: ΔS_universe ≥ 0. Hence, no process can produce an overall decrease in the entropy of the universe."
  },
  {
    questionNumber: 12,
    grade: "Grade 12",
    topic: "Oscillations and Waves (Simple Harmonic Motion Energy)",
    difficulty: "medium",
    prompt: "A mass-spring system is set to oscillate in a simple harmonic motion over a frictionless horizontal surface. The amplitude of this oscillation is 20 cm. A second mass-spring system with the same spring constant is set to oscillate in the same way but with an amplitude of 10 cm. The energy of the",
    options: [
      "first mass-spring system has four times the second one.",
      "second mass-spring system has the square of the first one.",
      "first mass-spring system has twice the second one.",
      "second mass-spring system has half of the first one."
    ],
    correctAnswer: "A",
    explanation: "The total mechanical energy in SHM is proportional to the square of amplitude: E = ½ k A². Since both systems have the same spring constant k, E₁ / E₂ = (A₁ / A₂)² = (20 cm / 10 cm)² = 2² = 4. Thus, the first system has four times the energy of the second."
  },
  {
    questionNumber: 13,
    grade: "Grade 12",
    topic: "Oscillations and Waves (Superposition & Destructive Interference)",
    difficulty: "medium",
    prompt: "Suppose you are given two travelling waves that have the same frequency and the same amplitude A. The first wave starts downward from zero with amplitude -1A (y₁(t) = -A sin(ωt)), and the second wave starts upward from zero with amplitude +1A (y₂(t) = +A sin(ωt)), meaning they are 180° out of phase at all times. Which graph represents the superposition of the two waves?",
    options: [
      "Graph A: Rectified positive half-cycles of amplitude +2A",
      "Graph B: An inverted sine wave of amplitude 2A starting downward",
      "Graph C: A sine wave of amplitude 2A starting upward",
      "Graph D: A flat zero-amplitude line along the time axis (complete destructive interference)"
    ],
    correctAnswer: "D",
    explanation: "Because both waves have identical frequency and amplitude A but are 180° (π radians) out of phase at every instant, their displacements cancel each other out completely: y(t) = y₁(t) + y₂(t) = -A sin(ωt) + A sin(ωt) = 0. This complete destructive interference produces a flat line of zero amplitude (Graph D)."
  },
  {
    questionNumber: 14,
    grade: "Grade 12",
    topic: "Oscillations and Waves (Standing Waves on a Stretched String)",
    difficulty: "medium",
    prompt: "A string vibrating with a speed of 110 m/s in its fourth harmonic has a frequency of 880 Hz. What is the length of the string?",
    options: [
      "25.0 cm",
      "12.5 cm",
      "50.0 cm",
      "31.3 cm"
    ],
    correctAnswer: "A",
    explanation: "For a stretched string fixed at both ends vibrating in the n-th harmonic: f_n = n (v / 2L). Here, n = 4, v = 110 m/s, and f₄ = 880 Hz. Solving for L: L = (n v) / (2 f₄) = (4 × 110) / (2 × 880) = 440 / 1760 = 0.25 m = 25.0 cm."
  },
  {
    questionNumber: 15,
    grade: "Grade 12",
    topic: "Wave Optics (Diffraction vs. Interference Fringe Widths)",
    difficulty: "medium",
    prompt: "Interference patterns are observed after a monochromatic beam of light passes through a single slit and a double slit. Which one of the following is correct about the width of the central maxima and the first-order maxima in single-slit and double-slit patterns?",
    options: [
      "The width of the central maxima is equal to the width of the first-order maxima in a single-slit interference while it has twice the width of the first-order maxima in double-slit interference.",
      "The width of the central maxima has twice the width of the first-order maxima in both cases.",
      "The width of the central maxima and first-order maxima have equal width in both cases.",
      "The width of the central maxima has twice the width of the first-order maxima in a single-slit interference while it has equal width in double-slit interference."
    ],
    correctAnswer: "D",
    explanation: "In single-slit diffraction, the central maximum lies between m = -1 and m = +1 minima, giving it a width of 2λL/a, which is twice the width of any subsequent secondary maximum (λL/a). In double-slit interference, all bright fringes have uniform equal fringe width Δy = λL/d."
  },
  {
    questionNumber: 16,
    grade: "Grade 12",
    topic: "Wave Optics (Young's Double-Slit Fringe Spacing)",
    difficulty: "easy",
    prompt: "A light wave of wavelength 590 nm passes through a narrow double slit of 0.2 mm slit separation. An interference pattern is formed on a screen at a distance of 1.5 m. What is the distance between consecutive bright fringes on the screen?",
    options: [
      "1.97 mm",
      "4.43 mm",
      "0.43 mm",
      "44.3 mm"
    ],
    correctAnswer: "B",
    explanation: "The fringe separation is given by Δy = (λ L) / d. Given λ = 590 × 10⁻⁹ m, L = 1.5 m, and d = 0.2 × 10⁻³ m: Δy = (590 × 10⁻⁹ × 1.5) / (0.2 × 10⁻³) = (885 × 10⁻⁹) / (2 × 10⁻⁴) = 4.425 × 10⁻³ m ≈ 4.43 mm."
  },
  {
    questionNumber: 17,
    grade: "Grade 11 / 12",
    topic: "Electrostatics (Gauss's Law)",
    difficulty: "easy",
    prompt: "According to Gauss's law, the net electric flux through any hypothetical closed surface is proportional to the enclosed",
    options: [
      "Electric field.",
      "Potential difference.",
      "Electric current.",
      "Electric charge."
    ],
    correctAnswer: "D",
    explanation: "Gauss's law states that the net electric flux Φ_E through any closed Gaussian surface equals the net enclosed charge Q_enclosed divided by the electric permittivity of free space: Φ_E = ∮ E⃗ · dA⃗ = Q_enclosed / ε₀. Hence, flux is directly proportional to enclosed electric charge."
  },
  {
    questionNumber: 18,
    grade: "Grade 11 / 12",
    topic: "Electrostatics & Capacitors (Effect of Dielectrics)",
    difficulty: "easy",
    prompt: "When a dielectric material is placed between two parallel metal plates in the presence of electric fields, it enables the plates to store",
    options: [
      "much less charge at different potential difference.",
      "the same charge at the same potential difference.",
      "much more charge at the same potential difference.",
      "much more charge at different potential difference."
    ],
    correctAnswer: "C",
    explanation: "A dielectric material increases the capacitance by a factor of its dielectric constant ε_r (C = ε_r C₀, where ε_r > 1). Since charge Q = C V, maintaining the same potential difference V allows the capacitor to store much more charge (Q = ε_r Q₀)."
  },
  {
    questionNumber: 19,
    grade: "Grade 11 / 12",
    topic: "Electrostatics & Capacitors (Energy Density)",
    difficulty: "medium",
    prompt: "A parallel-plate capacitor with plate area A and plate separation d stores a charge Q when a potential difference V is kept between the plates. Then the region between the plates is completely filled with a dielectric material of dielectric constant ε_r. If E denotes the electric field between the plates, the energy density stored by the capacitor is",
    options: [
      "u = ½ ε₀ ε_r E²",
      "u = (ε₀ ε_r Q V²) / (A d)",
      "u = ½ ε_r E Q² V",
      "u = (ε₀ ε_r V² A) / (2 d E)"
    ],
    correctAnswer: "A",
    explanation: "The total electrostatic energy is U = ½ C V² = ½ (ε₀ ε_r A / d)(E d)² = ½ ε₀ ε_r E² (A d). The energy density u is the energy per unit volume (Volume = A d): u = U / (A d) = ½ ε₀ ε_r E²."
  },
  {
    questionNumber: 20,
    grade: "Grade 11 / 12",
    topic: "Current Electricity (Drift Velocity)",
    difficulty: "easy",
    prompt: "A uniform conductor of length L and cross-sectional area A carries a current I when a potential difference V is applied across its ends. If the number of free electrons per unit volume of the conductor is n, and the electron charge is e, then the drift velocity of the electrons in the conductor is",
    options: [
      "v_d = I / (e L A)",
      "v_d = I / (n e A)",
      "v_d = I / (n e L A)",
      "v_d = I / (n e L)"
    ],
    correctAnswer: "B",
    explanation: "The relationship between electric current I and electron drift velocity v_d is I = n e A v_d. Solving for drift velocity gives v_d = I / (n e A)."
  },
  {
    questionNumber: 21,
    grade: "Grade 11",
    topic: "Measurement and Experimental Physics (Selection of Instruments)",
    difficulty: "easy",
    prompt: "A student wants to measure the length and height of the school laboratory. There are Vernier calipers, meter stick, micrometer screw gauge, and meter tape measuring instruments in the laboratory. Which one of the following measuring instruments and unit is appropriate for the measurement?",
    options: [
      "Meter tape and meter",
      "Vernier calipers and millimeter",
      "Micrometer screw gauge and millimeter",
      "Meter stick and centimeter"
    ],
    correctAnswer: "A",
    explanation: "A school laboratory has dimensions on the scale of several meters (typically 5 to 15 meters). A flexible measuring meter tape graduated in meters is the most suitable, practical, and accurate instrument for room-scale architectural dimensions."
  },
  {
    questionNumber: 22,
    grade: "Grade 11",
    topic: "Measurement and Experimental Physics (Data Tabulation & Units)",
    difficulty: "easy",
    prompt: "In reporting an experimental result, the collected data has to be clearly tabulated with appropriate units. Which of the following representations correctly formats data collected during an experiment?",
    options: [
      "Table with Voltage [4V, 6V, 8V, 12V, 16V] and Current [0.5 I, 0.75 I, 1 I, 1.5 I, 2.0 I]",
      "Table with Voltage (V) and Current (C) in column headers",
      "Table with Voltage (V) and Current (A) in column headers, and pure numbers in cells",
      "Table with units V and C repeated in every individual cell"
    ],
    correctAnswer: "C",
    explanation: "Standard scientific convention requires placing the physical quantity name and its SI unit in the table header—Voltage (V) and Current (A)—while leaving the data cells as pure numerical values without repeating unit letters."
  },
  {
    questionNumber: 23,
    grade: "Grade 11",
    topic: "Vectors (Graphical Representation of Vectors)",
    difficulty: "easy",
    prompt: "A 10 N force is applied in the direction of North-East. Which of the following graphical representations of the force is correct? (Assume the paper head points towards North and right points towards East.)",
    options: [
      "An arrow pointing upward and to the right (North-East)",
      "An arrow pointing upward and to the left (North-West)",
      "An arrow pointing horizontally to the right (East)",
      "An arrow pointing downward and to the right (South-East)"
    ],
    correctAnswer: "A",
    explanation: "With North oriented toward the top of the page (+y) and East toward the right (+x), the North-East direction points upward and to the right (at 45° in the first quadrant), which corresponds to arrow A."
  },
  {
    questionNumber: 24,
    grade: "Grade 11",
    topic: "Vectors (Head-to-Tail Vector Addition)",
    difficulty: "easy",
    prompt: "Two vectors—one of magnitude 8 units in the direction of East and a second vector of magnitude 6 units in the direction of North—are given. If you add the two vectors using the graphical method, which diagram represents the resultant of the two vectors?",
    options: [
      "Diagram A: 8 units East (right), 6 units North (upward from the head of 8), with the resultant vector pointing North-East from the tail of 8 to the head of 6",
      "Diagram B: 8 units East (right), 6 units South (downward), with the resultant pointing South-East",
      "Diagram C: 6 units North (upward), 8 units East from its tail, with the resultant pointing South-East",
      "Diagram D: 6 units North (upward), 8 units East from its base, with the hypotenuse arrow pointing North-West"
    ],
    correctAnswer: "A",
    explanation: "According to the triangle (head-to-tail) rule of vector addition: start with the 8-unit vector pointing East, place the tail of the 6-unit vector pointing North at the head of the first vector, and draw the resultant vector from the tail of the first to the head of the second, pointing North-East with magnitude √(8² + 6²) = 10 units."
  },
  {
    questionNumber: 25,
    grade: "Grade 11",
    topic: "Vectors (Collinear Vectors)",
    difficulty: "easy",
    prompt: "Which of the following pairs of vectors are collinear?",
    options: [
      "[4, 2]ᵀ and [-4, -2]ᵀ",
      "[4, 2]ᵀ and [-4, 2]ᵀ",
      "[4, 2]ᵀ and [4, -2]ᵀ",
      "[-4, -2]ᵀ and [4, -2]ᵀ"
    ],
    correctAnswer: "A",
    explanation: "Two vectors u⃗ and v⃗ are collinear (parallel or antiparallel) if and only if one is a scalar multiple of the other: v⃗ = k u⃗. Here, [-4, -2]ᵀ = -1 × [4, 2]ᵀ (scalar k = -1), meaning they are antiparallel and collinear."
  },
  {
    questionNumber: 26,
    grade: "Grade 11",
    topic: "Kinematics in 1D & 2D (Instantaneous vs. Average Velocity)",
    difficulty: "easy",
    prompt: "Instantaneous velocity is different from average velocity in that instantaneous velocity is",
    options: [
      "the velocity at a particular instant of time.",
      "in opposite direction to the displacement of the moving object.",
      "the total displacement to the time taken.",
      "the average velocity during the time of acceleration."
    ],
    correctAnswer: "A",
    explanation: "Average velocity is calculated over a finite time interval (v_avg = Δx / Δt), whereas instantaneous velocity is the derivative v = dx/dt evaluated at a single, specific instant in time (as Δt approaches zero)."
  },
  {
    questionNumber: 27,
    grade: "Grade 11",
    topic: "Kinematics in 1D & 2D (Uniformly Accelerated Rectilinear Motion)",
    difficulty: "easy",
    prompt: "A car travelling at 20 m/s starts to speed up. After 5 minutes its speed is 144 m/s. What is the acceleration of the car?",
    options: [
      "28.8 m/s²",
      "0.41 m/s²",
      "24.8 m/s²",
      "0.55 m/s²"
    ],
    correctAnswer: "B",
    explanation: "Given u = 20 m/s, v = 144 m/s, and t = 5 minutes = 5 × 60 s = 300 s. Acceleration a = (v - u) / t = (144 - 20) / 300 = 124 / 300 ≈ 0.413 m/s² ≈ 0.41 m/s²."
  },
  {
    questionNumber: 28,
    grade: "Grade 11",
    topic: "Kinematics in 1D & 2D (Projectile vs. Vertical Motion)",
    difficulty: "medium",
    prompt: "A bullet of 200 g mass is fired horizontally from a 30.0 m high building. At the same time, a bullet of the same mass is fired vertically down from the same height. What can be concluded about the motion of the two bullets?",
    options: [
      "A bullet fired vertically takes more time to strike the ground.",
      "Both bullets move with the same horizontal velocity.",
      "Both bullets strike the ground at the same time.",
      "A bullet fired horizontally takes more time to strike the ground."
    ],
    correctAnswer: "D",
    explanation: "The horizontally fired bullet has an initial vertical velocity of zero (u_y = 0), so its fall time is t = √(2h/g). The vertically fired bullet has a non-zero downward initial velocity (u_y > 0), reaching the ground faster. Thus, the horizontally fired bullet takes more time to strike the ground."
  },
  {
    questionNumber: 29,
    grade: "Grade 11",
    topic: "Kinematics in 1D & 2D (Relative Velocity in 2D)",
    difficulty: "medium",
    prompt: "A bird flies at a speed of 10 m/s to South relative to the Earth. A wind blows at a speed of 4 m/s to East relative to the Earth. What is the speed and direction of the bird relative to the wind?",
    options: [
      "6 m/s in the direction of North-East",
      "10.8 m/s in the direction of North-West",
      "6 m/s in the direction of South-East",
      "10.8 m/s in the direction of South-West"
    ],
    correctAnswer: "D",
    explanation: "Let East be +î and North be +ĵ. Bird relative to Earth: v⃗_BE = -10 ĵ. Wind relative to Earth: v⃗_WE = +4 î. Bird relative to wind: v⃗_BW = v⃗_BE - v⃗_WE = -4 î - 10 ĵ. Since both components are negative (West and South), the direction is South-West. Speed = √((-4)² + (-10)²) = √116 ≈ 10.77 m/s ≈ 10.8 m/s."
  },
  {
    questionNumber: 30,
    grade: "Grade 11",
    topic: "Dynamics (Scope and Definition)",
    difficulty: "easy",
    prompt: "Dynamics is a branch of mechanics concerned with the motion of an object",
    options: [
      "under the action of forces.",
      "under the action of balanced forces.",
      "without its causes.",
      "whose velocity is constant."
    ],
    correctAnswer: "A",
    explanation: "Classical mechanics is divided into kinematics (description of motion without regard to its causes) and dynamics (study of motion under the action of forces and torques that cause or modify motion)."
  },
  {
    questionNumber: 31,
    grade: "Grade 11",
    topic: "Rotational Motion (Vector Nature of Torque and Force)",
    difficulty: "hard",
    prompt: "Which one of the following statements is correct about a bar on which a force acts at one end and is pivoted at the other?",
    options: [
      "The force is parallel to the angular acceleration produced.",
      "The force, angular velocity, and the torque are coplanar.",
      "The force is coplanar with the torque it produces.",
      "The force is collinear with the angular velocity."
    ],
    correctAnswer: "C",
    explanation: "In geometric vector space, any two free or intersecting vectors (here, the force vector F⃗ and the torque vector τ⃗) define a common plane and are coplanar with each other (specifically perpendicular within that plane)."
  },
  {
    questionNumber: 32,
    grade: "Grade 11",
    topic: "Equilibrium of Rigid Bodies (Rotational Equilibrium)",
    difficulty: "easy",
    prompt: "The necessary condition for an object to be in rotational equilibrium is",
    options: [
      "the net moment of all forces should be non-zero.",
      "the net torque acting on the object is different from zero.",
      "the net force exerted on the object must be zero.",
      "the sum of clockwise torques equals the sum of counter-clockwise torques."
    ],
    correctAnswer: "D",
    explanation: "For rotational equilibrium, the net external torque acting on the object must be zero (∑ τ = 0), which means the sum of clockwise torques must balance the sum of counter-clockwise torques."
  },
  {
    questionNumber: 33,
    grade: "Grade 11",
    topic: "Bulk Properties of Matter (Elastic Strain Energy)",
    difficulty: "easy",
    prompt: "An aluminum wire of initial length 2.0 m is increased by 2.0 cm in its length on application of a force of 9.0 N. What is the strain energy of the material?",
    options: [
      "0.18 J",
      "0.9 J",
      "9.0 × 10⁻² J",
      "4.5 × 10⁻² J"
    ],
    correctAnswer: "C",
    explanation: "Elastic strain energy stored in a stretched wire under Hooke's law is U = ½ F ΔL. Given F = 9.0 N and ΔL = 2.0 cm = 0.02 m: U = ½ × 9.0 × 0.02 = 0.09 J = 9.0 × 10⁻² J."
  },
  {
    questionNumber: 34,
    grade: "Grade 11",
    topic: "Fluid Mechanics (Capillary Rise / Jurin's Law)",
    difficulty: "medium",
    prompt: "Ethanol has a surface tension of 22 × 10⁻³ N/m and its density is 0.789 g/cm³. The radius of the capillary tube is 15 mm, and the contact angle is 30°. Determine the height rise in the column of the capillary tube.",
    options: [
      "0.32 mm",
      "0.16 mm",
      "3.2 mm",
      "1.6 mm"
    ],
    correctAnswer: "A",
    explanation: "By Jurin's law, h = (2 γ cos θ) / (ρ g r). With γ = 22 × 10⁻³ N/m, θ = 30° (cos 30° ≈ 0.866), ρ = 789 kg/m³, r = 0.015 m, and g = 9.8 m/s²: h = (2 × 0.022 × 0.866) / (789 × 9.8 × 0.015) = 0.0381 / 115.98 ≈ 3.28 × 10⁻⁴ m ≈ 0.32 mm."
  },
  {
    questionNumber: 35,
    grade: "Grade 11",
    topic: "Fluid Mechanics (Laminar Flow & Drag)",
    difficulty: "easy",
    prompt: "Suppose a stream of fluid flows past a solid object. Which one of the following does NOT affect the laminar flow of the fluid?",
    options: [
      "Viscosity of the fluid",
      "The density of the solid object",
      "The shape of the solid object",
      "The speed of the solid object"
    ],
    correctAnswer: "B",
    explanation: "The transition between laminar and turbulent flow is determined by the fluid's viscosity, fluid density, relative speed, and the shape/dimensions of the object (as parameterized by Reynolds number). The mass density of the solid object itself has no effect on external fluid flow."
  },
  {
    questionNumber: 36,
    grade: "Grade 11",
    topic: "Fluid Mechanics (Equation of Continuity)",
    difficulty: "easy",
    prompt: "Water enters a tube of non-uniform diameter. The speed of the water at the entry of area A₁ is 12 m/s and the speed becomes 4 m/s at the exit opening of area A₂. Which one is correct about the ratio of A₁ / A₂?",
    options: [
      "1/4",
      "4",
      "3",
      "1/3"
    ],
    correctAnswer: "D",
    explanation: "By the continuity equation for an incompressible fluid: A₁ v₁ = A₂ v₂. Therefore: A₁ / A₂ = v₂ / v₁ = (4 m/s) / (12 m/s) = 1/3."
  },
  {
    questionNumber: 37,
    grade: "Grade 11",
    topic: "Thermal Physics (Triple Point)",
    difficulty: "easy",
    prompt: "The particular temperature and pressure at which the solid, liquid, and gaseous phases of a given substance are all at equilibrium with one another is known as:",
    options: [
      "Heat capacity",
      "Triple point",
      "Critical point",
      "Phase change"
    ],
    correctAnswer: "B",
    explanation: "The triple point of a substance is the unique thermodynamic state (temperature and pressure) at which the solid, liquid, and vapor phases coexist in dynamic equilibrium."
  },
  {
    questionNumber: 38,
    grade: "Grade 11",
    topic: "Thermal Physics (Thermal Expansion Mechanism)",
    difficulty: "easy",
    prompt: "Most solids expand upon heating. Which one of the following statements correctly describes the phenomenon?",
    options: [
      "Increase in temperature decreases the vibrational kinetic energy and increases the amplitude of the atoms constituting the solid.",
      "Increase in temperature increases the vibrational kinetic energy and decreases the amplitude of the atoms constituting the solid.",
      "Increase in temperature increases the vibrational kinetic energy and amplitude of the atoms constituting the solid.",
      "Increase in temperature decreases the vibrational kinetic energy and amplitude of the atoms constituting the solid."
    ],
    correctAnswer: "C",
    explanation: "Heating a solid transfers thermal energy to the lattice atoms, increasing both their vibrational kinetic energy and vibrational amplitude about their equilibrium positions. Due to asymmetric interatomic potentials, this increases average interatomic spacing, causing macroscopic expansion."
  },
  {
    questionNumber: 39,
    grade: "Grade 11 / 12",
    topic: "Thermodynamics (First Law of Thermodynamics)",
    difficulty: "easy",
    prompt: "If 25 J is taken away by heat from a system, and the system does 20 J of work, what is the change in internal energy of the system?",
    options: [
      "45.0 J",
      "-45.0 J",
      "5.0 J",
      "-5.0 J"
    ],
    correctAnswer: "B",
    explanation: "By the First Law of Thermodynamics, ΔU = Q - W. Since 25 J of heat is removed from the system, Q = -25.0 J. The work done by the system is W = +20.0 J. Thus, ΔU = -25.0 J - 20.0 J = -45.0 J."
  },
  {
    questionNumber: 40,
    grade: "Grade 11",
    topic: "Kinetic Theory & Gas Laws (Dalton's Law)",
    difficulty: "easy",
    prompt: "A sample mixture of gas contains 72% of hydrogen and 28% of helium. What is the partial pressure of helium at an atmospheric pressure of 76 cm of mercury (Hg)?",
    options: [
      "33.44 cm of Hg",
      "76.0 cm of Hg",
      "54.72 cm of Hg",
      "21.28 cm of Hg"
    ],
    correctAnswer: "D",
    explanation: "By Dalton's law of partial pressures, the partial pressure of helium is P_He = x_He × P_total = 0.28 × 76 cm Hg = 21.28 cm of Hg."
  },
  {
    questionNumber: 41,
    grade: "Grade 11",
    topic: "Dynamics (Coefficient of Friction)",
    difficulty: "easy",
    prompt: "Which one of the following statements is NOT correct about the concept and units of coefficient of friction?",
    options: [
      "Coefficient of friction is the ratio of frictional force to normal force.",
      "Coefficient of static friction is less than its value of kinetic friction.",
      "Coefficient of static friction has no unit.",
      "The coefficient of friction is always less or equal to unity (1)."
    ],
    correctAnswer: "B",
    explanation: "For any pair of surfaces, the coefficient of static friction is greater than the coefficient of kinetic friction (μ_s > μ_k), because overcoming initial microscopic surface interlocking and adhesion requires more force than maintaining sliding. Thus statement B is NOT correct."
  },
  {
    questionNumber: 42,
    grade: "Grade 11",
    topic: "Kinematics in 1D & 2D (Uniform Rectilinear Motion)",
    difficulty: "easy",
    prompt: "A car is traveling at constant velocity along a straight line. Which statement is correct?",
    options: [
      "The displacement of the car increases linearly with time.",
      "The displacement of the car is in the opposite direction.",
      "The net force on the car is different from zero.",
      "The acceleration of the car is in the opposite direction."
    ],
    correctAnswer: "A",
    explanation: "At constant velocity v, acceleration is zero, net force is zero, and displacement is given by s = v t, meaning displacement increases linearly with time."
  },
  {
    questionNumber: 43,
    grade: "Grade 11",
    topic: "Linear Momentum & Collisions (Impulse-Momentum Theorem)",
    difficulty: "easy",
    prompt: "Which one of the following statements is correct about the impulse on an object?",
    options: [
      "The impulse on an object is changed when the net force acting on the object is zero.",
      "The area under the curve of a momentum versus time graph is the impulse on an object.",
      "Impulse is the change in momentum when a force is exerted on an object for a very short period of time.",
      "Impulse is the rate of change in momentum due to an external force exerted on an object for a very short period of time."
    ],
    correctAnswer: "C",
    explanation: "According to the impulse-momentum theorem, impulse J⃗ = ∫ F⃗ dt equals the change in momentum Δp⃗ of an object during the time interval the force is exerted."
  },
  {
    questionNumber: 44,
    grade: "Grade 11",
    topic: "Linear Momentum & Collisions (Elastic vs. Inelastic Collisions)",
    difficulty: "easy",
    prompt: "Consider two collisions that occurred between two trollies having the same mass, moving with the same speed, and in opposite directions:\nCollision 1: After collision, the two trollies bounce back with the same speed.\nCollision 2: After collision, the two trollies stick together due to a magnetic coupler.\nWhich of the following statements is correct about the two collisions?",
    options: [
      "Both collisions are elastic.",
      "Collision 1 is elastic and collision 2 is inelastic.",
      "Both collisions are inelastic.",
      "Collision 1 is inelastic and collision 2 is elastic."
    ],
    correctAnswer: "B",
    explanation: "In Collision 1, kinetic energy is conserved because both trollies rebound with their original speeds, so it is elastic. In Collision 2, the trollies stick together and lose kinetic energy, so it is inelastic."
  },
  {
    questionNumber: 45,
    grade: "Grade 11 / 12",
    topic: "Work, Energy, and Oscillations (Vertical Mass-Spring Oscillator)",
    difficulty: "medium",
    prompt: "Suppose that you are given a mass attached to a spring and it oscillates up and down. This mass-spring system has maximum gravitational potential energy (GPE), elastic potential energy (EPE), and kinetic energy (KE) at the",
    options: [
      "middle, top, and bottom respectively.",
      "middle, bottom, and top respectively.",
      "bottom, middle, and top respectively.",
      "top, bottom, and middle respectively."
    ],
    correctAnswer: "D",
    explanation: "In vertical mass-spring oscillations: GPE (mgh) is maximum at the highest point (top); EPE (½ k x²) is maximum at maximum stretch (bottom); and KE (½ m v²) is maximum at the equilibrium position where speed is highest (middle)."
  },
  {
    questionNumber: 46,
    grade: "Grade 11",
    topic: "Work, Energy, and Power (Conservation of Energy in Pendulum)",
    difficulty: "easy",
    prompt: "A simple pendulum of length 2.5 m and mass m swings in a vertical plane. When it passes the lowest point A, its speed is 2.0 m/s. (Neglect air resistance and take g = 10 m/s²). What is the height h of the pendulum at maximum displacement positions B and C above point A?",
    options: [
      "0.1 m",
      "2.5 m",
      "0.2 m",
      "0.4 m"
    ],
    correctAnswer: "C",
    explanation: "By conservation of mechanical energy between the lowest point A (where v = 2.0 m/s and h = 0) and the turning points B/C (where v = 0): ½ m v_A² = m g h. Thus, h = v_A² / (2g) = (2.0)² / (2 × 10) = 4.0 / 20 = 0.2 m."
  },
  {
    questionNumber: 47,
    grade: "Grade 11",
    topic: "Work, Energy, and Power (Energy Dissipation with Air Resistance)",
    difficulty: "hard",
    prompt: "A 5.0 kg stone is dropped from the top of a 30.0 m building. At a height of 10.0 m above the ground, 60% of its initial potential energy is converted to kinetic energy. Which of the following statements is correct about the transformation of energy for the stone?",
    options: [
      "The sum of its potential energy and kinetic energy is the same at every point during its fall.",
      "6.7% of its gravitational potential energy is dissipated due to air resistance.",
      "60% of its original potential energy is converted to heat energy due to air resistance.",
      "The remaining 40% of the energy is still available as gravitational potential energy."
    ],
    correctAnswer: "B",
    explanation: "Initial potential energy at h₀ = 30.0 m is PE₀ = mg(30.0). At h = 10.0 m, the remaining potential energy is PE = mg(10.0) = (10/30) PE₀ = 33.33% of PE₀. The kinetic energy is given as 60% of PE₀. Total mechanical energy at 10.0 m is PE + KE = 33.33% + 60% = 93.33% of PE₀. Therefore, the energy dissipated by air resistance is 100% - 93.33% = 6.67% ≈ 6.7% of the initial gravitational potential energy."
  },
  {
    questionNumber: 48,
    grade: "Grade 11",
    topic: "Rotational Motion (Vector Cross Product of Torque)",
    difficulty: "medium",
    prompt: "A force of F⃗ = [3, 4]ᵀ N acts at a position displacement of r⃗ = [4, 3]ᵀ m. The magnitude and the direction of the torque produced is",
    options: [
      "-7.0 N·m k̂",
      "-24.0 N·m k̂",
      "24.0 N·m k̂",
      "7.0 N·m k̂"
    ],
    correctAnswer: "D",
    explanation: "Torque is τ⃗ = r⃗ × F⃗ = (r_x F_y - r_y F_x) k̂ = (4 × 4 - 3 × 3) k̂ = (16 - 9) k̂ = +7.0 N·m k̂."
  },
  {
    questionNumber: 49,
    grade: "Grade 11",
    topic: "Rotational Kinematics (Uniform Angular Acceleration)",
    difficulty: "medium",
    prompt: "A wheel starts rotating at 1.2 Hz and reaches 1.8 Hz in 5 seconds. Calculate the angular displacement it covers within 5 seconds.",
    options: [
      "10π rad",
      "3π rad",
      "30π rad",
      "15π rad"
    ],
    correctAnswer: "D",
    explanation: "Initial angular speed ω₀ = 2π f₀ = 2π(1.2) = 2.4π rad/s. Final angular speed ω = 2π f = 2π(1.8) = 3.6π rad/s. Angular displacement for uniform angular acceleration is θ = ½ (ω₀ + ω) t = ½ (2.4π + 3.6π) × 5 = ½ (6.0π) × 5 = 15π rad."
  },
  {
    questionNumber: 50,
    grade: "Grade 11",
    topic: "Rotational Dynamics (Angular Momentum of Rigid Body)",
    difficulty: "easy",
    prompt: "If you are given the physical quantities in angular motion: torque (τ), linear momentum (p), moment of inertia (I), angular speed (ω), and angular acceleration (α), the angular momentum (L) is the",
    options: [
      "product of moment of inertia and angular speed.",
      "ratio of moment of inertia to angular acceleration.",
      "product of moment of inertia and torque.",
      "ratio of linear momentum to moment of inertia."
    ],
    correctAnswer: "A",
    explanation: "For a rigid body rotating about a fixed axis, the angular momentum L is defined as the product of its moment of inertia (I) and its angular speed (ω): L = I ω."
  }
];

const targetPath = path.resolve(__dirname, "../seeds/data/physics_esslce_2013_booklet21.json");
fs.writeFileSync(targetPath, JSON.stringify(physicsQuestions, null, 2), "utf8");
console.log(`Generated ${physicsQuestions.length} Physics questions in ${targetPath}`);
