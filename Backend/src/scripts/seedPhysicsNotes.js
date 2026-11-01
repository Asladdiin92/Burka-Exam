import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";

async function seedPhysics() {
  console.log("Connecting to MongoDB Atlas for Physics seeding...");
  await connectDatabase();

  try {
    const authorUser = await User.findOne({
      role: { $in: ["teacher", "content_manager", "admin"] }
    });
    const authorId = authorUser?._id;

    const gradesPhysics = [
      {
        gradeLevel: "grade-9",
        code: "PHYS_9",
        name: "Physics Grade 9",
        description: "Grade 9 Ethiopian Physics Curriculum: Vectors, 1D/2D Kinematics, Dynamics, Work-Energy-Power, Simple Machines, and Heat.",
        units: [
          {
            order: 1,
            title: "Unit 1: Vectors and Physical Quantities",
            noteTitle: "Unit 1: Vectors & Measurement (Formulas & Vector Addition)",
            body: `# Unit 1: Vectors and Physical Quantities (Grade 9 Physics)

## 1. Physical Quantities
* **Scalar Quantities:** Quantities described completely by **magnitude and unit** only.
  * Examples: Mass ($kg$), Distance ($m$), Speed ($m/s$), Time ($s$), Temperature ($K$), Energy ($J$), Work ($J$).
* **Vector Quantities:** Quantities described by **magnitude, unit, AND direction**.
  * Examples: Displacement ($m$), Velocity ($m/s$), Acceleration ($m/s^2$), Force ($N$), Momentum ($kg \\cdot m/s$), Weight ($N$).

---

## 2. Vector Representation and Addition
* Vector $\\vec{A}$ has magnitude $|\\vec{A}|$ and direction angle $\\theta$.
* **Vector Components in 2D:**
  $$A_x = A \\cos \\theta, \\quad A_y = A \\sin \\theta$$
  $$\\text{Magnitude: } |\\vec{A}| = \\sqrt{A_x^2 + A_y^2}, \\quad \\theta = \\tan^{-1}\\left(\\frac{A_y}{A_x}\\right)$$
* **Resultant of Two Vectors:**
  * In the same direction ($\\theta = 0^\\circ$): $R = A + B$ (Maximum)
  * In opposite directions ($\\theta = 180^\\circ$): $R = |A - B|$ (Minimum)
  * Perpendicular ($\\theta = 90^\\circ$): $R = \\sqrt{A^2 + B^2}$`
          },
          {
            order: 2,
            title: "Unit 2: Motion in One and Two Dimensions",
            noteTitle: "Unit 2: Kinematics in 1D & 2D (Equations of Motion & Free Fall)",
            body: `# Unit 2: Motion in One and Two Dimensions (Grade 9 Physics)

## 1. Linear Motion Definitions
* **Displacement ($\\Delta x$):** Change in position $\\Delta x = x_f - x_i$.
* **Average Velocity:** $v_{avg} = \\frac{\\Delta x}{\\Delta t}$.
* **Average Acceleration:** $a_{avg} = \\frac{\\Delta v}{\\Delta t} = \\frac{v - u}{t}$.

---

## 2. Uniformly Accelerated Motion Equations
When acceleration $a$ is constant:
1. $$v = u + at$$
2. $$s = ut + \\frac{1}{2}at^2$$
3. $$v^2 = u^2 + 2as$$
4. $$s = \\left(\\frac{u + v}{2}\\right)t$$

---

## 3. Free Fall Under Gravity
Near Earth's surface, all objects accelerate downward at $g \\approx 9.8\\, m/s^2$ (or $10\\, m/s^2$ in entrance exam problems).
* Taking upward as positive: $a = -g$.
* Maximum height reached by an object thrown vertically with initial velocity $u$:
  $$H_{\\max} = \\frac{u^2}{2g}, \\quad t_{\\text{up}} = \\frac{u}{g}, \\quad t_{\\text{total}} = \\frac{2u}{g}$$`
          },
          {
            order: 3,
            title: "Unit 3: Newton's Laws of Motion & Friction",
            noteTitle: "Unit 3: Dynamics (Newton's Laws, Momentum & Friction)",
            body: `# Unit 3: Newton's Laws of Motion & Friction (Grade 9 Physics)

## 1. Newton's Three Laws of Motion
1. **First Law (Law of Inertia):** An object continues in its state of rest or uniform motion in a straight line unless acted upon by an external net force.
   * Mass is the quantitative measure of inertia.
2. **Second Law:** The acceleration of an object is directly proportional to net force and inversely proportional to its mass:
   $$\\vec{F}_{net} = m\\vec{a} = \\frac{\\Delta \\vec{p}}{\\Delta t}$$
3. **Third Law (Action-Reaction):** For every action, there is an equal and opposite reaction:
   $$\\vec{F}_{A \\text{ on } B} = -\\vec{F}_{B \\text{ on } A}$$

---

## 2. Friction
* **Static Friction ($f_s$):** $f_s \\le \\mu_s N$; Maximum value: $f_{s,\\max} = \\mu_s N$.
* **Kinetic Friction ($f_k$):** $f_k = \\mu_k N$.
* **Key Fact:** $\\mu_s > \\mu_k$ (it takes more force to start an object moving than to keep it sliding).`
          },
          {
            order: 4,
            title: "Unit 4: Work, Energy and Power",
            noteTitle: "Unit 4: Work, Energy & Power (Conservation of Mechanical Energy)",
            body: `# Unit 4: Work, Energy and Power (Grade 9 Physics)

## 1. Work ($W$)
* Work done by a constant force $\\vec{F}$ over displacement $\\vec{s}$:
  $$W = F s \\cos \\theta$$
  * If $\\theta = 0^\\circ$ (force along displacement): $W = F s$ (Positive work)
  * If $\\theta = 90^\\circ$ (force perpendicular): $W = 0$ (No work done)
  * If $\\theta = 180^\\circ$ (opposing force like friction): $W = -F s$ (Negative work)
* SI Unit: Joule ($1\\, J = 1\\, N \\cdot m$).

---

## 2. Energy & Conservation Principle
* **Kinetic Energy (KE):** $KE = \\frac{1}{2}mv^2$.
* **Gravitational Potential Energy (PE):** $PE = mgh$.
* **Work-Energy Theorem:** $W_{net} = \\Delta KE = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2$.
* **Conservation of Mechanical Energy:**
  $$E_{mech} = KE_i + PE_i = KE_f + PE_f \\quad (\\text{in conservative fields})$$

---

## 3. Power ($P$)
* Rate of doing work:
  $$P = \\frac{W}{t} = \\vec{F} \\cdot \\vec{v}$$
* SI Unit: Watt ($1\\, W = 1\\, J/s$). Horsepower: $1\\, hp = 746\\, W$.`
          },
          {
            order: 5,
            title: "Unit 5: Simple Machines",
            noteTitle: "Unit 5: Simple Machines (Mechanical Advantage & Efficiency)",
            body: `# Unit 5: Simple Machines (Grade 9 Physics)

## 1. Machine Parameters
* **Mechanical Advantage (MA):**
  $$MA = \\frac{\\text{Load (Output Force)}}{\\text{Effort (Input Force)}} = \\frac{L}{E}$$
* **Velocity Ratio (VR):**
  $$VR = \\frac{\\text{Distance moved by Effort}}{\\text{Distance moved by Load}} = \\frac{d_E}{d_L}$$
* **Efficiency ($\\eta$):**
  $$\\eta = \\frac{\\text{Work Output}}{\\text{Work Input}} \\times 100\\% = \\frac{MA}{VR} \\times 100\\%$$
  * For an ideal machine (frictionless): $\\eta = 100\\% \\implies MA = VR$.
  * For real machines: $\\eta < 100\\% \\implies MA < VR$.

---

## 2. Common Simple Machines
1. **Inclined Plane:** $VR = \\frac{\\text{Length of incline } (l)}{\\text{Height } (h)} = \\frac{1}{\\sin \\theta}$.
2. **Pulleys:**
   * Single fixed pulley: $VR = 1$.
   * Single movable pulley: $VR = 2$.
   * Block and tackle system: $VR = n$ (total number of pulleys or rope segments supporting load).
3. **Hydraulic Press:**
   $$VR = \\frac{A_2}{A_1} = \\frac{d_2^2}{d_1^2}$$`
          },
          {
            order: 6,
            title: "Unit 6: Temperature and Heat",
            noteTitle: "Unit 6: Thermal Physics (Heat Transfer & Calorimetry)",
            body: `# Unit 6: Temperature and Heat (Grade 9 Physics)

## 1. Temperature Scales
* Celsius to Kelvin: $T(K) = T(^\\circ C) + 273.15$
* Celsius to Fahrenheit: $T(^\\circ F) = \\frac{9}{5}T(^\\circ C) + 32$

---

## 2. Thermal Expansion
* **Linear Expansion:** $\\Delta L = \\alpha L_0 \\Delta T$
* **Area Expansion:** $\\Delta A = 2\\alpha A_0 \\Delta T$
* **Volume Expansion:** $\\Delta V = \\beta V_0 \\Delta T = 3\\alpha V_0 \\Delta T$

---

## 3. Quantity of Heat & Calorimetry
* **Heat Capacity & Specific Heat ($c$):**
  $$Q = mc\\Delta T$$
* **Latent Heat of Phase Change ($L$):**
  $$Q = mL$$
  * Fusion (melting/freezing): $Q = mL_f$
  * Vaporization (boiling/condensing): $Q = mL_v$
* **Calorimetry Principle (Conservation of Thermal Energy):**
  $$Q_{\\text{lost}} = Q_{\\text{gained}}$$`
          }
        ]
      },
      {
        gradeLevel: "grade-10",
        code: "PHYS_10",
        name: "Physics Grade 10",
        description: "Grade 10 Ethiopian Physics Curriculum: Circular Motion, Electrostatics, Current Electricity, Electromagnetism, Waves & Optics, and Modern Physics.",
        units: [
          {
            order: 1,
            title: "Unit 1: Motion in Two Dimensions (Circular Motion & Gravitation)",
            noteTitle: "Unit 1: Uniform Circular Motion & Planetary Gravitation",
            body: `# Unit 1: Circular Motion and Gravitation (Grade 10 Physics)

## 1. Uniform Circular Motion (UCM)
* **Period ($T$) and Frequency ($f$):** $T = \\frac{1}{f}$.
* **Angular Velocity ($\\omega$):** $\\omega = \\frac{2\\pi}{T} = 2\\pi f = \\frac{v}{r}$.
* **Centripetal Acceleration ($a_c$):** Always directed toward center:
  $$a_c = \\frac{v^2}{r} = \\omega^2 r$$
* **Centripetal Force ($F_c$):**
  $$F_c = m a_c = \\frac{m v^2}{r} = m \\omega^2 r$$

---

## 2. Kepler's Laws & Universal Gravitation
1. **Newton's Law of Gravitation:**
   $$F_g = G \\frac{m_1 m_2}{r^2}, \\quad G = 6.674 \\times 10^{-11}\\, N \\cdot m^2/kg^2$$
2. **Acceleration due to gravity at surface:**
   $$g = \\frac{G M_E}{R_E^2}$$
3. **Kepler's Third Law:** $T^2 \\propto r^3$.`
          },
          {
            order: 2,
            title: "Unit 2: Electrostatics",
            noteTitle: "Unit 2: Electrostatics (Coulomb's Law, Electric Fields & Capacitors)",
            body: `# Unit 2: Electrostatics (Grade 10 Physics)

## 1. Coulomb's Law
Force between two stationary point charges $q_1$ and $q_2$:
$$F_e = k_e \\frac{|q_1 q_2|}{r^2} = \\frac{1}{4\\pi \\epsilon_0} \\frac{|q_1 q_2|}{r^2}$$
where $k_e \\approx 8.99 \\times 10^9\\, N \\cdot m^2/C^2$.

---

## 2. Electric Field ($\\vec{E}$) and Potential ($V$)
* **Electric Field:** Force per unit positive test charge:
  $$\\vec{E} = \\frac{\\vec{F}}{q_0} = \\frac{k_e Q}{r^2} \\hat{r}$$
* **Electric Potential ($V$):** Potential energy per unit charge:
  $$V = \\frac{k_e Q}{r}, \\quad \\Delta V = -E \\cdot d \\quad (\\text{uniform field})$$

---

## 3. Capacitors and Capacitance ($C$)
$$C = \\frac{Q}{V} = \\epsilon_0 \\frac{A}{d}$$
* Energy stored in capacitor: $U = \\frac{1}{2}QV = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}$.
* **Parallel:** $C_p = C_1 + C_2 + \\dots$
* **Series:** $\\frac{1}{C_s} = \\frac{1}{C_1} + \\frac{1}{C_2} + \\dots$`
          },
          {
            order: 3,
            title: "Unit 3: Current Electricity and DC Circuits",
            noteTitle: "Unit 3: Current Electricity (Ohm's Law, Resistors & Kirchhoff's Rules)",
            body: `# Unit 3: Current Electricity (Grade 10 Physics)

## 1. Electric Current and Ohm's Law
* **Current ($I$):** $I = \\frac{\\Delta Q}{\\Delta t}$.
* **Ohm's Law:** $V = I R$.
* **Resistance ($R$):**
  $$R = \\rho \\frac{L}{A}$$
  where $\\rho$ is resistivity, $L$ is length, $A$ is cross-sectional area.

---

## 2. Resistor Combinations
* **Series:** $R_{eq} = R_1 + R_2 + \\dots$ (Same current $I$, voltages add)
* **Parallel:** $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots$ (Same voltage $V$, currents add)

---

## 3. Electric Power and Energy
$$P = V I = I^2 R = \\frac{V^2}{R}, \\quad E = P \\cdot t$$`
          },
          {
            order: 4,
            title: "Unit 4: Magnetism and Electromagnetism",
            noteTitle: "Unit 4: Magnetism, Induction & Transformers",
            body: `# Unit 4: Magnetism and Electromagnetism (Grade 10 Physics)

## 1. Magnetic Forces
* On a moving charge: $\\vec{F}_B = q (\\vec{v} \\times \\vec{B}) \\implies F = q v B \\sin \\theta$.
* On a current-carrying wire: $F = I L B \\sin \\theta$.

---

## 2. Electromagnetic Induction
* **Magnetic Flux ($\\Phi_B$):** $\\Phi_B = B A \\cos \\theta$.
* **Faraday's Law:** Induced EMF equals rate of change of magnetic flux:
  $$\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t}$$
* **Lenz's Law:** The direction of induced current opposes the change causing it.

---

## 3. Transformers
$$\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}$$`
          },
          {
            order: 5,
            title: "Unit 5: Waves and Geometrical Optics",
            noteTitle: "Unit 5: Wave Mechanics & Optics (Reflection, Refraction & Lenses)",
            body: `# Unit 5: Waves and Geometrical Optics (Grade 10 Physics)

## 1. Wave Equation
$$v = f \\lambda = \\frac{\\lambda}{T}$$

---

## 2. Reflection and Refraction
* **Snell's Law of Refraction:**
  $$n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2$$
* **Index of Refraction:** $n = \\frac{c}{v}$.
* **Critical Angle & Total Internal Reflection:**
  $$\\sin \\theta_c = \\frac{n_2}{n_1} \\quad (n_1 > n_2)$$

---

## 3. Thin Lens & Mirror Formula
$$\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}, \\quad M = \\frac{h_i}{h_o} = -\\frac{d_i}{d_o}$$`
          },
          {
            order: 6,
            title: "Unit 6: Introduction to Modern Physics",
            noteTitle: "Unit 6: Modern Physics (Photoelectric Effect & Nuclear Decay)",
            body: `# Unit 6: Introduction to Modern Physics (Grade 10 Physics)

## 1. Photoelectric Effect
* Photon Energy: $E = hf = \\frac{hc}{\\lambda}$.
* Einstein's Photoelectric Equation:
  $$hf = \\Phi + KE_{\\max} = hf_0 + \\frac{1}{2}mv_{\\max}^2$$
  where $\\Phi = hf_0$ is the work function.

---

## 2. Radioactivity & Nuclear Decay
* **Alpha ($\\alpha$) decay:** emits $^4_2\\text{He}$.
* **Beta ($\\beta^-$) decay:** neutron converts to proton, emits electron and antineutrino.
* **Gamma ($\\gamma$) emission:** high-energy electromagnetic photon.
* **Half-life ($T_{1/2}$):**
  $$N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t / T_{1/2}}$$`
          }
        ]
      },
      {
        gradeLevel: "grade-11",
        code: "PHYS_11",
        name: "Physics Grade 11",
        description: "Grade 11 Ethiopian Physics Curriculum: Measurement & Errors, 2D Motion & Projectiles, Conservation of Linear Momentum, Rotational Dynamics, and Oscillations.",
        units: [
          {
            order: 1,
            title: "Unit 1: Measurement and Practical Work",
            noteTitle: "Unit 1: Error Analysis, Uncertainty & Dimensional Analysis",
            body: `# Unit 1: Measurement and Practical Work (Grade 11 Physics)

## 1. Errors and Uncertainties
* **Absolute Uncertainty ($\\Delta x$):** Margin of measurement error.
* **Relative / Percentage Uncertainty:** $\\frac{\\Delta x}{x} \\times 100\\%$.
* **Propagation of Uncertainties:**
  * Addition / Subtraction ($Z = X \\pm Y$): $\\Delta Z = \\Delta X + \\Delta Y$.
  * Multiplication / Division ($Z = X \\cdot Y$ or $Z = X / Y$): $\\frac{\\Delta Z}{Z} = \\frac{\\Delta X}{X} + \\frac{\\Delta Y}{Y}$.
  * Power ($Z = X^n$): $\\frac{\\Delta Z}{Z} = n \\frac{\\Delta X}{X}$.

---

## 2. Dimensional Analysis
Base dimensions: $[M]$ (mass), $[L]$ (length), $[T]$ (time).
* Force: $[MLT^{-2}]$
* Work / Energy: $[ML^2T^{-2}]$
* Pressure: $[ML^{-1}T^{-2}]$`
          },
          {
            order: 2,
            title: "Unit 2: Two-Dimensional Motion and Projectiles",
            noteTitle: "Unit 2: Projectile Motion & 2D Vectors",
            body: `# Unit 2: Two-Dimensional Motion (Grade 11 Physics)

## 1. Projectile Motion
Launched at angle $\\theta$ with initial velocity $u$:
* Horizontal velocity: $u_x = u \\cos \\theta$ (constant, $a_x = 0$).
* Vertical velocity: $u_y = u \\sin \\theta$, $a_y = -g$.
* **Time of Flight:** $T = \\frac{2 u \\sin \\theta}{g}$.
* **Maximum Height:** $H = \\frac{u^2 \\sin^2 \\theta}{2g}$.
* **Horizontal Range:** $R = \\frac{u^2 \\sin(2\\theta)}{g}$.
  * Maximum range occurs at $\\theta = 45^\\circ$.`
          },
          {
            order: 3,
            title: "Unit 3: Momentum and Collisions",
            noteTitle: "Unit 3: Impulse, Momentum & Collision Mechanics",
            body: `# Unit 3: Momentum and Collisions (Grade 11 Physics)

## 1. Linear Momentum and Impulse
* **Momentum:** $\\vec{p} = m\\vec{v}$.
* **Impulse ($\\vec{J}$):**
  $$\\vec{J} = \\vec{F}_{avg} \\Delta t = \\Delta \\vec{p} = m\\vec{v}_f - m\\vec{v}_i$$

---

## 2. Conservation of Linear Momentum
In an isolated system ($\\vec{F}_{ext} = 0$):
$$m_1 \\vec{u}_1 + m_2 \\vec{u}_2 = m_1 \\vec{v}_1 + m_2 \\vec{v}_2$$
* **Elastic Collisions:** Both momentum and kinetic energy are conserved.
  * Relative velocity of separation = relative velocity of approach: $v_2 - v_1 = -(u_2 - u_1)$.
* **Inelastic Collisions:** Momentum conserved, but KE is lost.
  * Completely inelastic: objects stick together ($v_1 = v_2 = V$).`
          },
          {
            order: 4,
            title: "Unit 4: Dynamics of Rotational Motion",
            noteTitle: "Unit 4: Rotational Kinematics, Torque & Angular Momentum",
            body: `# Unit 4: Rotational Motion (Grade 11 Physics)

## 1. Linear vs. Rotational Analogues
| Linear | Rotational | Relationship |
| :--- | :--- | :--- |
| Displacement $x$ | Angle $\\theta$ | $x = r\\theta$ |
| Velocity $v$ | Angular Velocity $\\omega$ | $v = r\\omega$ |
| Acceleration $a$ | Angular Acceleration $\\alpha$ | $a = r\\alpha$ |
| Mass $m$ | Moment of Inertia $I$ | $I = \\sum m r^2$ |
| Force $F$ | Torque $\\tau$ | $\\tau = r F \\sin \\theta$ |
| Momentum $p$ | Angular Momentum $L$ | $L = I\\omega$ |

---

## 2. Newton's 2nd Law for Rotation & Energy
* $\\tau_{net} = I\\alpha$
* Rotational Kinetic Energy: $KE_{rot} = \\frac{1}{2}I\\omega^2$.
* Total Kinetic Energy of Rolling Object: $KE_{total} = \\frac{1}{2}mv_{cm}^2 + \\frac{1}{2}I\\omega^2$.`
          },
          {
            order: 5,
            title: "Unit 5: Static Equilibrium of Rigid Bodies",
            noteTitle: "Unit 5: Conditions for Equilibrium & Center of Gravity",
            body: `# Unit 5: Static Equilibrium (Grade 11 Physics)

## 1. Equilibrium Conditions
For a rigid body to be in static equilibrium:
1. **Translational Equilibrium:**
   $$\\sum \\vec{F} = \\mathbf{0} \\implies \\sum F_x = 0, \\quad \\sum F_y = 0$$
2. **Rotational Equilibrium:**
   $$\\sum \\vec{\\tau} = \\mathbf{0} \\quad (\\text{about any arbitrary pivot point})$$`
          },
          {
            order: 6,
            title: "Unit 6: Oscillations and Gravitation",
            noteTitle: "Unit 6: Simple Harmonic Motion & Gravitational Fields",
            body: `# Unit 6: Oscillations and Gravitation (Grade 11 Physics)

## 1. Simple Harmonic Motion (SHM)
* Restoring force: $F = -kx$.
* Acceleration: $a = -\\omega^2 x$.
* Angular frequency: $\\omega = \\sqrt{\\frac{k}{m}}$.
* **Period of Mass-Spring System:** $T = 2\\pi\\sqrt{\\frac{m}{k}}$.
* **Period of Simple Pendulum:** $T = 2\\pi\\sqrt{\\frac{L}{g}}$.`
          }
        ]
      },
      {
        gradeLevel: "grade-12",
        code: "PHYS_12",
        name: "Physics Grade 12",
        description: "Grade 12 Ethiopian Physics Curriculum: Thermodynamics, EM Fields, Alternating Current, Physical Optics, and Nuclear Physics.",
        units: [
          {
            order: 1,
            title: "Unit 1: Thermodynamics",
            noteTitle: "Unit 1: Heat Engines, 1st & 2nd Laws of Thermodynamics",
            body: `# Unit 1: Thermodynamics (Grade 12 Physics)

## 1. First Law of Thermodynamics
$$\\Delta U = Q - W$$
where $\\Delta U$ is change in internal energy, $Q$ is heat added to system, $W$ is work done **by** system.
* **Isothermal process ($\\Delta T = 0$):** $\\Delta U = 0 \\implies Q = W$.
* **Isochoric / Isovolumetric ($\\Delta V = 0$):** $W = 0 \\implies \\Delta U = Q$.
* **Isobaric ($P = \\text{const}$):** $W = P \\Delta V$.
* **Adiabatic ($Q = 0$):** $\\Delta U = -W$.

---

## 2. Heat Engines and Efficiency
* Engine Efficiency: $\\eta = \\frac{W}{Q_H} = 1 - \\frac{Q_C}{Q_H}$.
* **Carnot Maximum Efficiency:**
  $$\\eta_{Carnot} = 1 - \\frac{T_C}{T_H}$$`
          },
          {
            order: 2,
            title: "Unit 2: Electric and Magnetic Fields",
            noteTitle: "Unit 2: Gauss's Law, Lorentz Force & Cyclotron Motion",
            body: `# Unit 2: Electric and Magnetic Fields (Grade 12 Physics)

## 1. Gauss's Law for Electricity
$$\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{enclosed}}{\\epsilon_0}$$

---

## 2. Lorentz Force
Force on a charged particle in both electric and magnetic fields:
$$\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})$$
* Radius of circular path in magnetic field: $r = \\frac{m v}{q B}$.
* Cyclotron frequency: $f = \\frac{q B}{2\\pi m}$.`
          },
          {
            order: 3,
            title: "Unit 3: Alternating Current (AC) Circuits",
            noteTitle: "Unit 3: AC Circuits (Phasors, Impedance & Resonance)",
            body: `# Unit 3: Alternating Current Circuits (Grade 12 Physics)

## 1. AC Quantities and RMS Values
$$I_{rms} = \\frac{I_0}{\\sqrt{2}} \\approx 0.707 I_0, \\quad V_{rms} = \\frac{V_0}{\\sqrt{2}} \\approx 0.707 V_0$$

---

## 2. Reactance and Impedance
* Inductive Reactance: $X_L = \\omega L = 2\\pi f L$ (Voltage leads current by $90^\\circ$).
* Capacitive Reactance: $X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C}$ (Current leads voltage by $90^\\circ$).
* **Series RLC Impedance ($Z$):**
  $$Z = \\sqrt{R^2 + (X_L - X_C)^2}$$
* **Resonance Frequency:** When $X_L = X_C$:
  $$f_0 = \\frac{1}{2\\pi \\sqrt{LC}}$$`
          },
          {
            order: 4,
            title: "Unit 4: Electromagnetic Waves & Physical Optics",
            noteTitle: "Unit 4: Wave Optics (Interference, Diffraction & Polarization)",
            body: `# Unit 4: Wave Optics (Grade 12 Physics)

## 1. Double-Slit Interference (Young's Experiment)
* Bright fringes (Constructive interference): $d \\sin \\theta = m \\lambda \\quad (m = 0, \\pm 1, \\dots)$
  $$y_m = \\frac{m \\lambda L}{d}$$
* Dark fringes (Destructive interference): $d \\sin \\theta = \\left(m + \\frac{1}{2}\\right) \\lambda$
* Fringe separation: $\\Delta y = \\frac{\\lambda L}{d}$.

---

## 2. Single-Slit Diffraction
* Dark minima: $a \\sin \\theta = m \\lambda \\quad (m = \\pm 1, \\pm 2, \\dots)$`
          },
          {
            order: 5,
            title: "Unit 5: Atomic and Nuclear Physics",
            noteTitle: "Unit 5: Bohr Atom, Binding Energy, Fission & Fusion",
            body: `# Unit 5: Atomic and Nuclear Physics (Grade 12 Physics)

## 1. Bohr Model of the Hydrogen Atom
* Quantized angular momentum: $L = mvr = n \\frac{h}{2\\pi}$.
* Energy levels: $E_n = -\\frac{13.6\\, eV}{n^2}$.

---

## 2. Nuclear Binding Energy & Mass Defect
* Mass defect: $\\Delta m = (Z m_p + N m_n) - M_{nucleus}$.
* Binding energy: $E_b = \\Delta m \\cdot c^2$ ($1\\, u = 931.5\\, MeV$).`
          },
          {
            order: 6,
            title: "Unit 6: Special Relativity and Astrophysics",
            noteTitle: "Unit 6: Special Relativity (Lorentz Factor, Time Dilation & Mass-Energy)",
            body: `# Unit 6: Special Relativity and Astrophysics (Grade 12 Physics)

## 1. Postulates of Special Relativity
1. The laws of physics are the same in all inertial reference frames.
2. The speed of light in vacuum $c$ is constant for all observers.

---

## 2. Relativistic Effects
* Lorentz factor: $\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}} \\ge 1$.
* **Time Dilation:** $\\Delta t = \\gamma \\Delta t_0$.
* **Length Contraction:** $L = \\frac{L_0}{\\gamma}$.
* **Mass-Energy Equivalence:** $E = \\gamma m_0 c^2$, Rest Energy: $E_0 = m_0 c^2$.`
          }
        ]
      }
    ];

    for (const g of gradesPhysics) {
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
    console.log("SUCCESS: All 4 Grades of Physics (9, 10, 11, 12) Seeded!");
    console.log("=======================================================");

  } catch (err) {
    console.error("Error in Physics seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Physics seeding connection closed.");
  }
}

seedPhysics();
