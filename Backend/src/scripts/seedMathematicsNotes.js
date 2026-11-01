import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";

async function seedMathematicsGrade12() {
  console.log("Connecting to MongoDB Atlas...");
  await connectDatabase();

  try {
    // 1. Find Mathematics (Natural)
    let mathSubject = await Subject.findOne({ code: "MATH_NAT" });
    if (!mathSubject) {
      mathSubject = await Subject.create({
        name: "Mathematics (Natural)",
        code: "MATH_NAT",
        gradeLevel: "grade-12",
        stream: "natural",
        description: "Grade 12 Ethiopian Curriculum: Sequences, Limits, Differential & Integral Calculus, Applications, and 3D Vectors.",
        isActive: true
      });
      console.log("Created Mathematics (Natural) subject.");
    } else {
      console.log(`Found Math subject: ${mathSubject.name} (${mathSubject._id})`);
    }

    // 2. Find Author User
    const authorUser = await User.findOne({
      role: { $in: ["teacher", "content_manager", "admin"] }
    });
    const authorId = authorUser?._id;
    console.log(`Using Author: ${authorUser?.displayName || "Lead Math Teacher"} (${authorUser?.role})`);

    // 3. Define the 6 Grade 12 Mathematics Chapters
    const chaptersData = [
      {
        order: 1,
        title: "Unit 1: Sequences and Series",
        description: "Arithmetic & Geometric Progressions, Sigma Notation, Infinite Series Convergence, Mathematical Induction, and Financial Math."
      },
      {
        order: 2,
        title: "Unit 2: Introduction to Limits and Continuity",
        description: "One-sided Limits, Indeterminate Forms (0/0), Limits at Infinity, Trigonometric Limits, Continuity at a Point, and Intermediate Value Theorem."
      },
      {
        order: 3,
        title: "Unit 3: Differential Calculus (Derivatives & Rules)",
        description: "Limit Definition of Derivative, Power, Product, Quotient & Chain Rules, Trigonometric, Exponential & Logarithmic Derivatives, and Implicit Differentiation."
      },
      {
        order: 4,
        title: "Unit 4: Applications of Differential Calculus",
        description: "Tangents & Normals, Critical Numbers, Increasing/Decreasing Functions, Extrema Tests, Concavity, Inflection Points, Optimization, and Related Rates."
      },
      {
        order: 5,
        title: "Unit 5: Integral Calculus & Applications",
        description: "Antiderivatives, Standard Integration Rules, u-Substitution, Integration by Parts, Fundamental Theorem of Calculus, Area Under & Between Curves."
      },
      {
        order: 6,
        title: "Unit 6: 3D Coordinate Geometry & Vectors",
        description: "Distance & Midpoint in 3D Space, Sphere Equations, Vector Components, Dot Product & Orthogonality, Cross Product, Lines & Planes in Space."
      }
    ];

    const seededChapters = [];
    for (const chData of chaptersData) {
      let chapter = await Chapter.findOne({
        subjectId: mathSubject._id,
        order: chData.order
      });

      if (!chapter) {
        chapter = await Chapter.create({
          subjectId: mathSubject._id,
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

    // 4. In-depth, High-Yield Grade 12 Math Study Notes
    const studyNotes = [
      {
        chapterOrder: 1,
        title: "Unit 1: Sequences and Series (Complete Formula Sheet & Guide)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 MATHEMATICS: UNIT 1 — SEQUENCES AND SERIES

## 1. Arithmetic Progression (AP)
An arithmetic sequence is a sequence in which each term after the first is obtained by adding a constant value called the **common difference** ($d$).
* **Common Difference:**
  $$d = a_{n} - a_{n-1} = a_2 - a_1$$
* **$n$-th General Term Formula:**
  $$a_n = a_1 + (n - 1)d$$
  *(Alternative formula using $k$-th term: $a_n = a_k + (n - k)d$)*
* **Sum of the First $n$ Terms ($S_n$):**
  $$S_n = \\frac{n}{2}\\left(2a_1 + (n - 1)d\\right) = \\frac{n}{2}(a_1 + a_n)$$
* **Arithmetic Mean:** If $a, b, c$ form an AP, then $b = \\frac{a + c}{2}$.

---

## 2. Geometric Progression (GP)
A geometric sequence is a sequence where each term after the first is found by multiplying the previous term by a fixed, non-zero number called the **common ratio** ($r$).
* **Common Ratio:**
  $$r = \\frac{a_{n}}{a_{n-1}} = \\frac{a_2}{a_1}$$
* **$n$-th General Term Formula:**
  $$a_n = a_1 \\cdot r^{n-1}$$
* **Sum of the First $n$ Terms ($S_n$):**
  $$S_n = \\frac{a_1(1 - r^n)}{1 - r} = \\frac{a_1(r^n - 1)}{r - 1} \\quad (r \\neq 1)$$
* **Geometric Mean:** If $a, b, c$ form a GP, then $b = \\pm\\sqrt{ac}$.

---

## 3. Infinite Geometric Series & Convergence
An infinite geometric series has the form:
$$S_\\infty = a_1 + a_1 r + a_1 r^2 + a_1 r^3 + \\dots$$
* **Convergence Condition:** The series converges if and only if:
  $$|r| < 1 \\quad (-1 < r < 1)$$
* **Sum to Infinity Formula:**
  $$S_\\infty = \\frac{a_1}{1 - r}$$
* **Divergence:** If $|r| \\geq 1$, the infinite series diverges and the sum does not exist.

*Example (Converting Repeating Decimals to Fractions):*
Express $0.\\overline{35} = 0.353535\\dots$ as a fraction:
$$a_1 = 0.35 = \\frac{35}{100}, \\quad r = 0.01 = \\frac{1}{100}$$
$$S_\\infty = \\frac{\\frac{35}{100}}{1 - \\frac{1}{100}} = \\frac{\\frac{35}{100}}{\\frac{99}{100}} = \\frac{35}{99}$$

---

## 4. Sigma Notation ($\\sum$) and Standard Summations
* **Linearity Properties:**
  $$\\sum_{i=1}^n c = c \\cdot n$$
  $$\\sum_{i=1}^n c \\cdot a_i = c \\sum_{i=1}^n a_i$$
  $$\\sum_{i=1}^n (a_i \\pm b_i) = \\sum_{i=1}^n a_i \\pm \\sum_{i=1}^n b_i$$
* **Key Summation Formulas:**
  1. Sum of first $n$ positive integers:
     $$\\sum_{i=1}^n i = 1 + 2 + 3 + \\dots + n = \\frac{n(n + 1)}{2}$$
  2. Sum of squares:
     $$\\sum_{i=1}^n i^2 = 1^2 + 2^2 + \\dots + n^2 = \\frac{n(n + 1)(2n + 1)}{6}$$
  3. Sum of cubes:
     $$\\sum_{i=1}^n i^3 = 1^3 + 2^3 + \\dots + n^3 = \\left[\\frac{n(n + 1)}{2}\\right]^2$$

---

## 5. Principle of Mathematical Induction (PMI)
Used to prove statements $P(n)$ true for all integers $n \\ge 1$:
1. **Base Step:** Prove that $P(1)$ is true.
2. **Inductive Hypothesis:** Assume $P(k)$ is true for some positive integer $k$.
3. **Inductive Step:** Prove that $P(k + 1)$ must also be true based on the assumption.

---

## 6. Financial Applications
* **Compound Interest:**
  $$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$
  - $P$ = Principal investment, $r$ = annual interest rate, $n$ = compounding periods per year, $t$ = time in years.
* **Continuously Compounded Interest:**
  $$A = P \\cdot e^{rt}$$`
      },
      {
        chapterOrder: 2,
        title: "Unit 2: Limits and Continuity (Theory, Rules & Techniques)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 MATHEMATICS: UNIT 2 — LIMITS AND CONTINUITY

## 1. The Concept of a Limit
The notation $\\lim_{x \\to a} f(x) = L$ means as $x$ approaches $a$ from either side (without reaching $a$), $f(x)$ approaches the value $L$.

### Existence of a Limit:
$$\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L$$
*(The two-sided limit exists if and only if both left-hand and right-hand limits exist and are equal).*

---

## 2. Limit Laws
If $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$:
1. **Sum & Difference:** $\\lim [f(x) \\pm g(x)] = L \\pm M$
2. **Product:** $\\lim [f(x) \\cdot g(x)] = L \\cdot M$
3. **Quotient:** $\\lim \\left[\\frac{f(x)}{g(x)}\\right] = \\frac{L}{M} \\quad (M \\neq 0)$
4. **Constant Multiple:** $\\lim [c \\cdot f(x)] = c \\cdot L$
5. **Power Law:** $\\lim [f(x)]^n = L^n$

---

## 3. Techniques for Evaluating Indeterminate Forms (0/0)
Direct substitution giving $\\frac{0}{0}$ requires algebraic simplification:

### Method A: Factoring
$$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{x - 2} = \\lim_{x \\to 2} (x + 2) = 4$$

### Method B: Rationalization (Conjugate Multiplication)
Used when square roots are present:
$$\\lim_{x \\to 0} \\frac{\\sqrt{x + 9} - 3}{x} = \\lim_{x \\to 0} \\frac{(\\sqrt{x + 9} - 3)(\\sqrt{x + 9} + 3)}{x(\\sqrt{x + 9} + 3)} = \\lim_{x \\to 0} \\frac{(x + 9) - 9}{x(\\sqrt{x + 9} + 3)} = \\frac{1}{3 + 3} = \\frac{1}{6}$$

---

## 4. Special Trigonometric Limits
Fundamental identities essential for EUEE:
1. Standard Sine Limit:
   $$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\quad \\text{and} \\quad \\lim_{x \\to 0} \\frac{\\sin(kx)}{x} = k$$
2. Cosine Identity:
   $$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x} = 0 \\quad \\text{and} \\quad \\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}$$
3. Tangent Limit:
   $$\\lim_{x \\to 0} \\frac{\\tan(kx)}{x} = k$$

*Example:*
$$\\lim_{x \\to 0} \\frac{\\sin 5x}{\\sin 3x} = \\lim_{x \\to 0} \\frac{\\frac{\\sin 5x}{5x} \\cdot 5x}{\\frac{\\sin 3x}{3x} \\cdot 3x} = \\frac{1 \\cdot 5}{1 \\cdot 3} = \\frac{5}{3}$$

---

## 5. Limits at Infinity & Rational Functions
For a rational function $f(x) = \\frac{a_n x^n + \\dots}{b_m x^m + \\dots}$:
* If $n < m$ (degree of numerator < degree of denominator):
  $$\\lim_{x \\to \\pm\\infty} f(x) = 0 \\quad (y = 0 \\text{ is horizontal asymptote})$$
* If $n = m$ (degree of numerator = degree of denominator):
  $$\\lim_{x \\to \\pm\\infty} f(x) = \\frac{a_n}{b_m} \\quad \\left(y = \\frac{a_n}{b_m} \\text{ is horizontal asymptote}\\right)$$
* If $n > m$ (degree of numerator > degree of denominator):
  $$\\lim_{x \\to \\pm\\infty} f(x) = \\pm\\infty \\quad (\\text{No horizontal asymptote})$$

---

## 6. Continuity
A function $f(x)$ is **continuous at a point $x = c$** if and only if all three conditions are satisfied:
1. $f(c)$ is defined ($c$ is in the domain).
2. $\\lim_{x \\to c} f(x)$ exists (left limit = right limit).
3. $\\lim_{x \\to c} f(x) = f(c)$.

### Types of Discontinuity:
* **Removable Discontinuity (Hole):** Limit exists, but $f(c) \\neq \\lim f(x)$ or $f(c)$ is undefined.
* **Jump Discontinuity:** $\\lim_{x \\to c^-} f(x) \\neq \\lim_{x \\to c^+} f(x)$ (common in step/piecewise functions).
* **Infinite Discontinuity:** Vertical asymptote where $f(x) \\to \\pm\\infty$.

### The Intermediate Value Theorem (IVT):
If $f(x)$ is continuous on the closed interval $[a, b]$, and $k$ is any value between $f(a)$ and $f(b)$, then there exists at least one number $c \\in (a, b)$ such that:
$$f(c) = k$$
*Application (Root Location):* If $f(a)$ and $f(b)$ have opposite signs ($f(a) \\cdot f(b) < 0$), then $f(x) = 0$ has at least one real root in $(a, b)$.`
      },
      {
        chapterOrder: 3,
        title: "Unit 3: Differential Calculus (Derivatives & Calculation Rules)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 MATHEMATICS: UNIT 3 — DIFFERENTIAL CALCULUS

## 1. Definition of the Derivative
The derivative represents the instantaneous rate of change and the slope of the tangent line to the curve $y = f(x)$:
$$f'(x) = \\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} = \\lim_{t \\to x} \\frac{f(t) - f(x)}{t - x}$$

### Differentiability Implies Continuity:
* If $f$ is differentiable at $x = c$, then $f$ is continuous at $x = c$.
* *Caution:* The converse is false. Continuous functions may fail to be differentiable at sharp corners/cusps (e.g., $f(x) = |x|$ at $x=0$) or vertical tangents.

---

## 2. Basic Differentiation Rules

| Rule Name | Mathematical Statement |
| :--- | :--- |
| **Constant Rule** | $\\frac{d}{dx}[c] = 0$ |
| **Power Rule** | $\\frac{d}{dx}[x^n] = n x^{n-1} \\quad (n \\in \\mathbb{R})$ |
| **Constant Multiple** | $\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f'(x)$ |
| **Sum & Difference** | $\\frac{d}{dx}[f(x) \\pm g(x)] = f'(x) \\pm g'(x)$ |
| **Product Rule** | $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$ |
| **Quotient Rule** | $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2} \\quad (v \\neq 0)$ |
| **Chain Rule** | $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$ |

---

## 3. Derivatives of Elementary Functions

### A. Trigonometric Derivatives:
$$\\frac{d}{dx}[\\sin x] = \\cos x \\qquad \\frac{d}{dx}[\\cos x] = -\\sin x$$
$$\\frac{d}{dx}[\\tan x] = \\sec^2 x \\qquad \\frac{d}{dx}[\\cot x] = -\\csc^2 x$$
$$\\frac{d}{dx}[\\sec x] = \\sec x \\tan x \\qquad \\frac{d}{dx}[\\csc x] = -\\csc x \\cot x$$

### B. Exponential & Logarithmic Derivatives:
$$\\frac{d}{dx}[e^x] = e^x \\qquad \\frac{d}{dx}[e^{kx}] = k \\cdot e^{kx}$$
$$\\frac{d}{dx}[a^x] = a^x \\ln a \\qquad (a > 0, a \\neq 1)$$
$$\\frac{d}{dx}[\\ln x] = \\frac{1}{x} \\qquad \\frac{d}{dx}[\\ln(u(x))] = \\frac{u'(x)}{u(x)}$$
$$\\frac{d}{dx}[\\log_a x] = \\frac{1}{x \\ln a}$$

---

## 4. The Chain Rule in Practice
General Power Rule:
$$\\frac{d}{dx}\\left[(u(x))^n\\right] = n(u(x))^{n-1} \\cdot u'(x)$$

*Example 1:* Differentiate $y = (3x^2 - 5x + 1)^4$:
$$y' = 4(3x^2 - 5x + 1)^3 \\cdot \\frac{d}{dx}(3x^2 - 5x + 1) = 4(3x^2 - 5x + 1)^3 (6x - 5)$$

*Example 2:* Differentiate $y = \\sin(e^{2x})$:
$$y' = \\cos(e^{2x}) \\cdot \\frac{d}{dx}(e^{2x}) = 2e^{2x}\\cos(e^{2x})$$

---

## 5. Implicit Differentiation
Used when $y$ cannot easily be explicitly solved in terms of $x$. Differentiate both sides with respect to $x$, applying the chain rule whenever differentiating terms with $y$:

*Example:* Find $\\frac{dy}{dx}$ for $x^2 + y^2 = 25$:
$$2x + 2y \\cdot \\frac{dy}{dx} = 0 \\implies 2y \\frac{dy}{dx} = -2x \\implies \\frac{dy}{dx} = -\\frac{x}{y}$$

---

## 6. Higher-Order Derivatives
* First derivative: $f'(x) = \\frac{dy}{dx}$
* Second derivative: $f''(x) = \\frac{d^2y}{dx^2} = \\frac{d}{dx}\\left(\\frac{dy}{dx}\\right)$
* $n$-th derivative: $f^{(n)}(x) = \\frac{d^ny}{dx^n}$`
      },
      {
        chapterOrder: 4,
        title: "Unit 4: Applications of Derivatives (Curve Sketching & Optimization)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 MATHEMATICS: UNIT 4 — APPLICATIONS OF DERIVATIVES

## 1. Tangent and Normal Lines
* **Slope of Tangent:** $m_{\\text{tan}} = f'(x_0)$
* **Equation of Tangent Line** at $(x_0, y_0)$:
  $$y - y_0 = f'(x_0)(x - x_0)$$
* **Slope of Normal Line:** Perpendicular to tangent $\\implies m_{\\text{norm}} = -\\frac{1}{f'(x_0)}$
* **Equation of Normal Line** at $(x_0, y_0)$:
  $$y - y_0 = -\\frac{1}{f'(x_0)}(x - x_0)$$

---

## 2. Increasing & Decreasing Functions
Let $f$ be continuous on $[a, b]$ and differentiable on $(a, b)$:
* If $f'(x) > 0$ for all $x \\in (a, b)$, then $f$ is **strictly increasing** on $[a, b]$.
* If $f'(x) < 0$ for all $x \\in (a, b)$, then $f$ is **strictly decreasing** on $[a, b]$.
* If $f'(x) = 0$ for all $x \\in (a, b)$, then $f$ is **constant** on $[a, b]$.

---

## 3. Critical Numbers and Relative Extrema
* **Critical Number:** A number $c$ in the domain of $f$ where:
  $$f'(c) = 0 \\quad \\text{or} \\quad f'(c) \\text{ is undefined}$$

### First Derivative Test:
Suppose $c$ is a critical number:
1. **Local Maximum:** $f'(x)$ changes sign from **positive to negative** ($+ \\to -$) at $c$.
2. **Local Minimum:** $f'(x)$ changes sign from **negative to positive** ($- \\to +$) at $c$.
3. **No Extremum:** $f'(x)$ does not change sign at $c$ (e.g., $f(x) = x^3$ at $x=0$).

### Second Derivative Test:
Suppose $f'(c) = 0$:
* If $f''(c) < 0 \\implies$ Local **Maximum** at $c$ (concave downward $\\cap$).
* If $f''(c) > 0 \\implies$ Local **Minimum** at $c$ (concave upward $\\cup$).
* If $f''(c) = 0 \\implies$ Inconclusive (use the First Derivative Test).

---

## 4. Concavity and Points of Inflection
* **Concave Upward:** $f''(x) > 0$ on $(a, b)$ — graph lies above its tangents (bowl shape $\\cup$).
* **Concave Downward:** $f''(x) < 0$ on $(a, b)$ — graph lies below its tangents (arch shape $\\cap$).
* **Point of Inflection:** A point $(c, f(c))$ on the curve where the concavity changes from upward to downward (or vice versa), requiring $f''(c) = 0$ or undefined with a sign change.

---

## 5. Absolute Extrema on Closed Intervals (Extreme Value Theorem)
To find absolute maximum and minimum of a continuous function on $[a, b]$:
1. Find all critical numbers $c_i \\in (a, b)$.
2. Evaluate $f(c_i)$ at all critical numbers.
3. Evaluate $f(a)$ and $f(b)$ at the endpoints.
4. The largest resulting value is the **Absolute Maximum**; the smallest is the **Absolute Minimum**.

---

## 6. Optimization Problems (Maximizing & Minimizing)
Systematic 5-Step Method:
1. **Understand:** Identify the quantity to be optimized and the constraints.
2. **Formulate:** Write an equation for the objective function $Q$.
3. **Single Variable:** Use constraints to express $Q$ in terms of one single variable.
4. **Differentiate:** Set $\\frac{dQ}{dx} = 0$ to find critical numbers.
5. **Verify:** Use the 1st or 2nd derivative test to confirm it is indeed a maximum or minimum.

*Classic Example:* A farmer has 120 meters of fencing to enclose a rectangular garden along a barn wall. What dimensions maximize area?
- Perimeter constraint: $2x + y = 120 \\implies y = 120 - 2x$
- Area objective: $A(x) = x \\cdot y = x(120 - 2x) = 120x - 2x^2$
- Differentiate: $A'(x) = 120 - 4x = 0 \\implies x = 30$ m
- Length: $y = 120 - 2(30) = 60$ m
- Maximum Area: $A = 30 \\times 60 = 1800\\text{ m}^2$.`
      },
      {
        chapterOrder: 5,
        title: "Unit 5: Integral Calculus & Area Applications",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 MATHEMATICS: UNIT 5 — INTEGRAL CALCULUS

## 1. Antiderivatives and Indefinite Integrals
If $F'(x) = f(x)$, then $F(x)$ is an antiderivative of $f(x)$.
The collection of all antiderivatives is the **indefinite integral**:
$$\\int f(x) \\, dx = F(x) + C$$
*(where $C$ is the arbitrary constant of integration).*

---

## 2. Standard Integration Formulas

| Function $f(x)$ | Indefinite Integral $\\int f(x) \\, dx$ |
| :--- | :--- |
| **Constant** | $\\int k \\, dx = kx + C$ |
| **Power Rule** | $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$ |
| **Reciprocal** | $\\int \\frac{1}{x} \\, dx = \\ln|x| + C$ |
| **Exponential** | $\\int e^x \\, dx = e^x + C \\qquad \\int e^{kx} \\, dx = \\frac{1}{k}e^{kx} + C$ |
| **General Base** | $\\int a^x \\, dx = \\frac{a^x}{\\ln a} + C$ |
| **Sine** | $\\int \\sin x \\, dx = -\\cos x + C$ |
| **Cosine** | $\\int \\cos x \\, dx = \\sin x + C$ |
| **Secant Squared** | $\\int \\sec^2 x \\, dx = \\tan x + C$ |
| **Cosecant Squared** | $\\int \\csc^2 x \\, dx = -\\cot x + C$ |
| **Secant Tangent** | $\\int \\sec x \\tan x \\, dx = \\sec x + C$ |

---

## 3. Techniques of Integration

### A. Integration by Substitution ($u$-Substitution)
Reverses the Chain Rule. Look for a function $g(x)$ whose derivative $g'(x)$ is present as a factor:
$$\\int f(g(x)) g'(x) \\, dx = \\int f(u) \\, du \\quad \\text{where } u = g(x), \\, du = g'(x)dx$$

*Example 1:* Evaluate $\\int 2x(x^2 + 5)^4 \\, dx$:
- Let $u = x^2 + 5 \\implies du = 2x \\, dx$
- $\\int u^4 \\, du = \\frac{u^5}{5} + C = \\frac{(x^2 + 5)^5}{5} + C$

*Example 2:* Evaluate $\\int \\tan x \\, dx$:
- $\\int \\frac{\\sin x}{\\cos x} \\, dx$. Let $u = \\cos x \\implies du = -\\sin x \\, dx$
- $\\int -\\frac{1}{u} \\, du = -\\ln|u| + C = -\\ln|\\cos x| + C = \\ln|\\sec x| + C$

### B. Integration by Parts
Reverses the Product Rule:
$$\\int u \\, dv = u v - \\int v \\, du$$

**LIATE Rule** for selecting $u$:
1. **L**ogarithmic functions ($\\ln x$)
2. **I**nverse trigonometric functions ($\\arcsin x$)
3. **A**lgebraic functions ($x^2, 3x$)
4. **T**rigonometric functions ($\\sin x, \\cos x$)
5. **E**xponential functions ($e^x$)

*Example:* Evaluate $\\int x e^x \\, dx$:
- Let $u = x \\implies du = dx$
- Let $dv = e^x dx \\implies v = e^x$
- $\\int x e^x \\, dx = x e^x - \\int e^x \\, dx = x e^x - e^x + C = e^x(x - 1) + C$

---

## 4. Definite Integrals & Fundamental Theorem of Calculus (FTC)

### Part 2 of FTC (Evaluation Theorem):
If $f$ is continuous on $[a, b]$ and $F$ is any antiderivative ($F' = f$):
$$\\int_a^b f(x) \\, dx = F(b) - F(a) = \\Big[F(x)\\Big]_a^b$$

### Key Properties of Definite Integrals:
1. $\\int_a^a f(x) \\, dx = 0$
2. $\\int_b^a f(x) \\, dx = -\\int_a^b f(x) \\, dx$
3. $\\int_a^b f(x) \\, dx = \\int_a^c f(x) \\, dx + \\int_c^b f(x) \\, dx$
4. If $f(x)$ is **odd** ($f(-x) = -f(x)$): $\\int_{-a}^a f(x) \\, dx = 0$
5. If $f(x)$ is **even** ($f(-x) = f(x)$): $\\int_{-a}^a f(x) \\, dx = 2 \\int_0^a f(x) \\, dx$

---

## 5. Applications: Area Computations

### A. Area Under a Curve (Above the $x$-axis):
$$A = \\int_a^b f(x) \\, dx$$

### B. Area Between Two Curves:
If $f(x) \\ge g(x)$ for all $x \\in [a, b]$:
$$A = \\int_a^b [f(x) - g(x)] \\, dx = \\int_a^b [\\text{Top curve} - \\text{Bottom curve}] \\, dx$$

*Example:* Find the area enclosed by $y = x^2$ and $y = 2x$:
- Intersection points: $x^2 = 2x \\implies x(x - 2) = 0 \\implies x = 0$ and $x = 2$.
- Between $0$ and $2$, line $2x \\ge x^2$.
$$A = \\int_0^2 (2x - x^2) \\, dx = \\left[x^2 - \\frac{x^3}{3}\\right]_0^2 = \\left(4 - \\frac{8}{3}\\right) - 0 = \\frac{4}{3} \\text{ square units}$$`
      },
      {
        chapterOrder: 6,
        title: "Unit 6: 3D Coordinate Geometry and Vectors (Master Review)",
        fileType: "text",
        isPremium: false,
        body: `# GRADE 12 MATHEMATICS: UNIT 6 — 3D GEOMETRY AND VECTORS

## 1. 3D Cartesian Coordinate System
Points in three-dimensional space are represented by an ordered triple $(x, y, z)$.
The three coordinate planes ($xy$-plane: $z=0$, $yz$-plane: $x=0$, $xz$-plane: $y=0$) divide 3D space into **8 octants**.

### Fundamental Formulas:
* **Distance between $P_1(x_1, y_1, z_1)$ and $P_2(x_2, y_2, z_2)$:**
  $$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$$
* **Midpoint Formula:**
  $$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}, \\frac{z_1 + z_2}{2}\\right)$$
* **Standard Equation of a Sphere** with center $(h, k, l)$ and radius $r$:
  $$(x - h)^2 + (y - k)^2 + (z - l)^2 = r^2$$

---

## 2. Vectors in 3D Space
A vector from $P_1(x_1, y_1, z_1)$ to $P_2(x_2, y_2, z_2)$:
$$\\vec{v} = \\langle x_2 - x_1, y_2 - y_1, z_2 - z_1 \\rangle = v_1\\mathbf{i} + v_2\\mathbf{j} + v_3\\mathbf{k}$$
where $\\mathbf{i} = \\langle 1, 0, 0 \\rangle$, $\\mathbf{j} = \\langle 0, 1, 0 \\rangle$, $\\mathbf{k} = \\langle 0, 0, 1 \\rangle$.

* **Magnitude (Length):**
  $$\\|\\vec{v}\\| = \\sqrt{v_1^2 + v_2^2 + v_3^2}$$
* **Unit Vector in Direction of $\\vec{v}$:**
  $$\\mathbf{u} = \\frac{\\vec{v}}{\\|\\vec{v}\\|}$$

---

## 3. The Dot Product (Scalar Product)
$$\\vec{u} \\cdot \\vec{v} = u_1 v_1 + u_2 v_2 + u_3 v_3 = \\|\\vec{u}\\| \\|\\vec{v}\\| \\cos\\theta$$
* **Angle between two vectors:**
  $$\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\|\\vec{v}\\|}$$
* **Orthogonality Condition:** Two non-zero vectors $\\vec{u}$ and $\\vec{v}$ are **orthogonal (perpendicular)** if and only if:
  $$\\vec{u} \\cdot \\vec{v} = 0$$

*Example:* Are $\\vec{u} = \\langle 2, -1, 3 \\rangle$ and $\\vec{v} = \\langle 3, 6, 0 \\rangle$ orthogonal?
$$\\vec{u} \\cdot \\vec{v} = (2)(3) + (-1)(6) + (3)(0) = 6 - 6 + 0 = 0 \\implies \\text{Yes, they are orthogonal!}$$

---

## 4. The Cross Product (Vector Product)
Unlike the dot product, the cross product $\\vec{u} \\times \\vec{v}$ produces a **vector** that is perpendicular to both $\\vec{u}$ and $\\vec{v}$.
$$\\vec{u} \\times \\vec{v} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\mathbf{i}(u_2 v_3 - u_3 v_2) - \\mathbf{j}(u_1 v_3 - u_3 v_1) + \\mathbf{k}(u_1 v_2 - u_2 v_1)$$

* **Geometric Properties:**
  1. $\\|\\vec{u} \\times \\vec{v}\\| = \\|\\vec{u}\\| \\|\\vec{v}\\| \\sin\\theta$
  2. **Area of Parallelogram** formed by $\\vec{u}$ and $\\vec{v}$:
     $$\\text{Area} = \\|\\vec{u} \\times \\vec{v}\\|$$
  3. **Area of Triangle** formed by $\\vec{u}$ and $\\vec{v}$:
     $$\\text{Area} = \\frac{1}{2}\\|\\vec{u} \\times \\vec{v}\\|$$
  4. **Parallel Vectors:** $\\vec{u} \\times \\vec{v} = \\mathbf{0} \\iff \\vec{u}$ and $\\vec{v}$ are parallel.

---

## 5. Lines and Planes in 3D Space

### A. Equations of a Line:
Passing through point $P_0(x_0, y_0, z_0)$ parallel to direction vector $\\vec{v} = \\langle a, b, c \\rangle$:
* **Vector Form:** $\\mathbf{r}(t) = \\mathbf{r}_0 + t\\vec{v}$
* **Parametric Equations:**
  $$x = x_0 + at, \\quad y = y_0 + bt, \\quad z = z_0 + ct \\quad (t \\in \\mathbb{R})$$
* **Symmetric Equations:**
  $$\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}$$

### B. Equation of a Plane:
Passing through point $P_0(x_0, y_0, z_0)$ with normal vector $\\vec{n} = \\langle A, B, C \\rangle$:
* **Point-Normal Form:**
  $$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$$
* **General Linear Form:**
  $$Ax + By + Cz + D = 0 \\quad (\\text{where } D = -(Ax_0 + By_0 + Cz_0))$$`
      }
    ];

    console.log("Seeding Study Notes into MongoDB...");
    let notesCount = 0;
    for (const noteData of studyNotes) {
      const chapter = seededChapters.find((c) => c.order === noteData.chapterOrder);

      let existingNote = await Note.findOne({
        subjectId: mathSubject._id,
        chapterId: chapter?._id,
        title: noteData.title
      });

      if (!existingNote) {
        existingNote = await Note.create({
          userId: authorId,
          uploadedBy: authorId,
          subjectId: mathSubject._id,
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
    console.log(`SUCCESS: Seeded 6 Grade 12 Mathematics Chapters & ${notesCount} Study Notes!`);
    console.log(`All notes are set to Public and ready for In-App Offline Study.`);
    console.log(`======================================================`);
  } catch (error) {
    console.error("Error seeding Mathematics notes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

seedMathematicsGrade12();
