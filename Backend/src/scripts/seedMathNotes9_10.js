import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";

async function seedMath9_10() {
  console.log("Connecting to MongoDB Atlas for Mathematics (Grades 9-10) seeding...");
  await connectDatabase();

  try {
    const authorUser = await User.findOne({
      role: { $in: ["teacher", "content_manager", "admin"] }
    });
    const authorId = authorUser?._id;

    const gradesMath = [
      {
        gradeLevel: "grade-9",
        code: "MATH_9",
        name: "Mathematics Grade 9",
        description: "Grade 9 Ethiopian Mathematics: Real Number System, Equations & Inequalities, Trigonometry, Regular Polygons & Circles, Congruency & Similarity, and Statistics.",
        units: [
          {
            order: 1,
            title: "Unit 1: The Number System and Radicals",
            noteTitle: "Unit 1: Real Numbers, Radicals & Scientific Notation",
            body: `# Unit 1: The Number System (Grade 9 Mathematics)

## 1. Classification of Real Numbers ($\\mathbb{R}$)
* **Natural Numbers ($\\mathbb{N}$):** $\\{1, 2, 3, \\dots\\}$
* **Whole Numbers ($\\mathbb{W}$):** $\\{0, 1, 2, 3, \\dots\\}$
* **Integers ($\\mathbb{Z}$):** $\\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$
* **Rational Numbers ($\\mathbb{Q}$):** Numbers expressible as $\\frac{a}{b}$ where $a, b \\in \\mathbb{Z}, b \\neq 0$ (terminating or repeating decimals).
* **Irrational Numbers ($\\mathbb{I}$ or $\\mathbb{Q}'$):** Non-terminating, non-repeating decimals (e.g., $\\sqrt{2}, \\sqrt{3}, \\pi, e$).
* $\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{Q}'$.

---

## 2. Laws of Radicals
For $a, b > 0$:
1. $\\sqrt[n]{a \\cdot b} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b}$
2. $\\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}}$
3. $(\\sqrt[n]{a})^n = a$
4. $\\sqrt[m]{\\sqrt[n]{a}} = \\sqrt[mn]{a}$
5. **Rationalizing Denominators:**
   * For $\\frac{1}{\\sqrt{a}}$: multiply numerator and denominator by $\\sqrt{a}$.
   * For $\\frac{1}{\\sqrt{a} \\pm \\sqrt{b}}$: multiply by conjugate $(\\sqrt{a} \\mp \\sqrt{b})$.`
          },
          {
            order: 2,
            title: "Unit 2: Equations and Inequalities",
            noteTitle: "Unit 2: Linear Equations, Systems & Inequalities",
            body: `# Unit 2: Equations and Inequalities (Grade 9 Mathematics)

## 1. Linear Equations in One Variable
General form: $ax + b = 0 \\implies x = -\\frac{b}{a} \\quad (a \\neq 0)$.

---

## 2. Systems of Linear Equations in Two Variables
$$\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}$$
* **Substitution Method:** Solve one equation for one variable and substitute into the second.
* **Elimination Method:** Multiply equations to create equal and opposite coefficients for one variable, then add.
* **Geometric Interpretation:**
  * Unique solution: Lines intersect at exactly one point ($m_1 \\neq m_2$).
  * Infinitely many solutions: Lines coincide (dependent system).
  * No solution: Lines are parallel and distinct ($m_1 = m_2$, $b_1 \\neq b_2$).

---

## 3. Linear Inequalities
* When multiplying or dividing both sides of an inequality by a **negative number**, the inequality sign **must be reversed**!
  $$-2x < 6 \\implies x > -3$$`
          },
          {
            order: 3,
            title: "Unit 3: Introduction to Trigonometry",
            noteTitle: "Unit 3: Trigonometric Ratios (SOH CAH TOA) & Special Angles",
            body: `# Unit 3: Introduction to Trigonometry (Grade 9 Mathematics)

## 1. Right Triangle Definitions (SOH CAH TOA)
In a right-angled triangle with acute angle $\\theta$:
$$\\sin \\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}, \\quad \\cos \\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}, \\quad \\tan \\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{\\sin \\theta}{\\cos \\theta}$$

---

## 2. Special Angles Table
| Angle | $\\sin \\theta$ | $\\cos \\theta$ | $\\tan \\theta$ |
| :--- | :--- | :--- | :--- |
| **$30^\\circ$** | $\\frac{1}{2}$ | $\\frac{\\sqrt{3}}{2}$ | $\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$ |
| **$45^\\circ$** | $\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$ | $\\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$ | $1$ |
| **$60^\\circ$** | $\\frac{\\sqrt{3}}{2}$ | $\\frac{1}{2}$ | $\\sqrt{3}$ |

---

## 3. Fundamental Pythagorean Identity
$$\\sin^2 \\theta + \\cos^2 \\theta = 1$$`
          },
          {
            order: 4,
            title: "Unit 4: Regular Polygons and Circles",
            noteTitle: "Unit 4: Polygon Angle Formulas & Circle Theorems",
            body: `# Unit 4: Regular Polygons and Circles (Grade 9 Mathematics)

## 1. Regular Polygons of $n$ Sides
* **Sum of Interior Angles:** $S = (n - 2) \\times 180^\\circ$
* **Each Interior Angle:** $\\theta_{\\text{int}} = \\frac{(n - 2) \\times 180^\\circ}{n}$
* **Sum of Exterior Angles:** Always equal to $360^\\circ$.
* **Each Exterior Angle:** $\\theta_{\\text{ext}} = \\frac{360^\\circ}{n}$

---

## 2. Circle Geometry
* **Circumference:** $C = 2\\pi r = \\pi d$
* **Area:** $A = \\pi r^2$
* **Arc Length ($s$):** $s = \\frac{\\theta}{360^\\circ} \\times 2\\pi r$
* **Sector Area:** $A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\times \\pi r^2$`
          },
          {
            order: 5,
            title: "Unit 5: Congruency and Similarity",
            noteTitle: "Unit 5: Congruence & Similarity Criteria for Triangles",
            body: `# Unit 5: Congruency and Similarity (Grade 9 Mathematics)

## 1. Triangle Congruence Criteria ($\\cong$)
Two triangles are congruent if all corresponding sides and angles are equal:
1. **SSS:** Side-Side-Side
2. **SAS:** Side-Angle-Side (included angle)
3. **ASA:** Angle-Side-Angle (included side)
4. **AAS:** Angle-Angle-Side
5. **RHS:** Right-Hypotenuse-Side

---

## 2. Triangle Similarity Criteria ($\\sim$)
Corresponding angles are equal, and corresponding sides are in proportion:
1. **AA:** Two pairs of corresponding angles are equal.
2. **SAS:** One angle equal and including sides proportional.
3. **SSS:** All three pairs of sides are proportional.
* **Ratio of Areas:** $\\frac{\\text{Area}_1}{\\text{Area}_2} = k^2$ (where $k$ is linear scale factor).
* **Ratio of Volumes:** $\\frac{\\text{Volume}_1}{\\text{Volume}_2} = k^3$.`
          },
          {
            order: 6,
            title: "Unit 6: Statistics and Probability",
            noteTitle: "Unit 6: Ungrouped Data Statistics & Basic Probability",
            body: `# Unit 6: Statistics and Probability (Grade 9 Mathematics)

## 1. Measures of Central Tendency
* **Mean:** $\\bar{x} = \\frac{\\sum x}{n}$
* **Median:** The middle value of an ordered dataset.
* **Mode:** The value that occurs with highest frequency.

---

## 2. Elementary Probability
$$P(E) = \\frac{\\text{Number of favorable outcomes } n(E)}{\\text{Total number of possible outcomes } n(S)}$$
* $0 \\le P(E) \\le 1$.
* $P(\\text{Impossible Event}) = 0$, $P(\\text{Certain Event}) = 1$.`
          }
        ]
      },
      {
        gradeLevel: "grade-10",
        code: "MATH_10",
        name: "Mathematics Grade 10",
        description: "Grade 10 Ethiopian Mathematics: Relations & Functions, Polynomial Functions, Exponential & Logarithmic Functions, Coordinate Geometry, and Plane/Solid Figures.",
        units: [
          {
            order: 1,
            title: "Unit 1: Relations and Quadratic Functions",
            noteTitle: "Unit 1: Relations, Functions & Quadratic Graphing",
            body: `# Unit 1: Relations and Functions (Grade 10 Mathematics)

## 1. Quadratic Functions
Standard form: $f(x) = ax^2 + bx + c \\quad (a \\neq 0)$.
* **Vertex Form:** $f(x) = a(x - h)^2 + k$
  * Vertex: $(h, k) = \\left(-\\frac{b}{2a}, f\\left(-\\frac{b}{2a}\\right)\\right)$
  * Axis of symmetry: $x = -\\frac{b}{2a}$.
* **Opening Direction:**
  * $a > 0$: Parabola opens **upward**, vertex is a **minimum**.
  * $a < 0$: Parabola opens **downward**, vertex is a **maximum**.
* **Quadratic Formula & Discriminant ($\\Delta = b^2 - 4ac$):**
  $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
  * $\\Delta > 0$: Two distinct real roots.
  * $\\Delta = 0$: Exactly one real root (repeated root).
  * $\\Delta < 0$: No real roots (two complex roots).`
          },
          {
            order: 2,
            title: "Unit 2: Polynomial Functions and Theorems",
            noteTitle: "Unit 2: Polynomial Division, Remainder & Factor Theorems",
            body: `# Unit 2: Polynomial Functions (Grade 10 Mathematics)

## 1. Polynomial Long Division & Synthetic Division
$$P(x) = D(x) Q(x) + R(x)$$

---

## 2. Remainder and Factor Theorems
* **Remainder Theorem:** If polynomial $P(x)$ is divided by $(x - c)$, the remainder is $R = P(c)$.
* **Factor Theorem:** $(x - c)$ is a factor of $P(x) \\iff P(c) = 0$.`
          },
          {
            order: 3,
            title: "Unit 3: Exponential and Logarithmic Functions",
            noteTitle: "Unit 3: Exponents, Logarithms & Exponential Equations",
            body: `# Unit 3: Exponential and Logarithmic Functions (Grade 10 Mathematics)

## 1. Exponential Functions ($f(x) = b^x, b > 0, b \\neq 1$)
* Always passes through $(0, 1)$.
* Horizontal asymptote: $y = 0$.
* Domain: $(-\\infty, \\infty)$; Range: $(0, \\infty)$.

---

## 2. Logarithmic Functions
$$\\log_b x = y \\iff b^y = x \\quad (x > 0, b > 0, b \\neq 1)$$

### Key Laws of Logarithms
1. **Product Rule:** $\\log_b(xy) = \\log_b x + \\log_b y$
2. **Quotient Rule:** $\\log_b\\left(\\frac{x}{y}\\right) = \\log_b x - \\log_b y$
3. **Power Rule:** $\\log_b(x^k) = k \\log_b x$
4. **Change of Base Formula:** $\\log_b x = \\frac{\\log_a x}{\\log_a b} = \\frac{\\ln x}{\\ln b}$`
          },
          {
            order: 4,
            title: "Unit 4: Coordinate Geometry of Lines",
            noteTitle: "Unit 4: Distance, Midpoint & Linear Equations",
            body: `# Unit 4: Coordinate Geometry (Grade 10 Mathematics)

## 1. Distance and Midpoint
* **Distance Formula:**
  $$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
* **Midpoint Formula:**
  $$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$

---

## 2. Slope & Line Equations
* Slope: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.
* Slope-Intercept Form: $y = mx + b$.
* Point-Slope Form: $y - y_1 = m(x - x_1)$.
* Parallel lines: $m_1 = m_2$.
* Perpendicular lines: $m_1 \\cdot m_2 = -1$.`
          },
          {
            order: 5,
            title: "Unit 5: Plane Geometry & Solid Figures",
            noteTitle: "Unit 5: Surface Area, Volume & Circle Theorems",
            body: `# Unit 5: Solid Figures & Plane Geometry (Grade 10 Mathematics)

## 1. Solid Mensuration Formulas
| Solid | Total Surface Area ($A$) | Volume ($V$) |
| :--- | :--- | :--- |
| **Cylinder** | $2\\pi r h + 2\\pi r^2$ | $\\pi r^2 h$ |
| **Cone** | $\\pi r l + \\pi r^2$ ($l = \\sqrt{r^2 + h^2}$) | $\\frac{1}{3}\\pi r^2 h$ |
| **Sphere** | $4\\pi r^2$ | $\\frac{4}{3}\\pi r^3$ |
| **Pyramid** | $\\text{Base Area} + \\frac{1}{2} P_{\\text{base}} l$ | $\\frac{1}{3} A_{\\text{base}} h$ |

---

## 2. Inscribed Angle Theorem
An angle inscribed in a circle is **half** the measure of its intercepted central angle:
$$\\theta_{\\text{inscribed}} = \\frac{1}{2} \\theta_{\\text{central}}$$
* An angle inscribed in a semicircle is always a **right angle ($90^\\circ$)**.`
          },
          {
            order: 6,
            title: "Unit 6: Probability and Statistics",
            noteTitle: "Unit 6: Grouped Data, Standard Deviation & Probability Rules",
            body: `# Unit 6: Statistics and Probability (Grade 10 Mathematics)

## 1. Grouped Data Calculations
* **Mean:** $\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}$ (where $x_i$ is class midpoint).
* **Variance ($s^2$):** $s^2 = \\frac{\\sum f_i (x_i - \\bar{x})^2}{n - 1}$.
* **Standard Deviation ($s$):** $s = \\sqrt{s^2}$.

---

## 2. Addition and Multiplication Rules of Probability
* **Addition Rule:**
  $$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$
  *(Mutually exclusive events: $P(A \\cap B) = 0 \\implies P(A \\cup B) = P(A) + P(B)$)*
* **Multiplication Rule for Independent Events:**
  $$P(A \\cap B) = P(A) \\cdot P(B)$$`
          }
        ]
      }
    ];

    for (const g of gradesMath) {
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
    console.log("SUCCESS: Mathematics Grades 9 and 10 Seeded!");
    console.log("=======================================================");

  } catch (err) {
    console.error("Error in Math 9-10 seeding:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Math 9-10 seeding connection closed.");
  }
}

seedMath9_10();
