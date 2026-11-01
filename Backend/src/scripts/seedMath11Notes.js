import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";
import { Note } from "../models/Note.js";
import { User } from "../models/User.js";

async function seedMath11Notes() {
  console.log("Connecting to MongoDB Atlas...");
  await connectDatabase();

  try {
    // 1. Find or create Mathematics Grade 11 (Natural)
    let mathSubject = await Subject.findOne({ code: "MATH_11" });
    if (!mathSubject) {
      mathSubject = await Subject.create({
        name: "Mathematics Grade 11 (Natural)",
        code: "MATH_11",
        gradeLevel: "grade-11",
        stream: "natural",
        description: "Grade 11 Ethiopian Curriculum (Natural Science): Relations & Functions, Rational Functions, Matrices, Vectors, Transformations, Statistics & Probability, and Coordinate Geometry.",
        isActive: true
      });
      console.log("Created Mathematics Grade 11 (Natural) subject.");
    } else {
      console.log(`Found Math Grade 11 subject: ${mathSubject.name} (${mathSubject._id})`);
    }

    // 2. Author User
    const authorUser = await User.findOne({
      role: { $in: ["teacher", "content_manager", "admin"] }
    });
    const authorId = authorUser?._id;
    console.log(`Author assigned: ${authorUser?.displayName || "Lead Mathematics Instructor"} (${authorUser?.role})`);

    // 3. Define the 7 Grade 11 Natural Mathematics Chapters
    const chaptersData = [
      {
        order: 1,
        title: "Unit 1: Further on Relations and Functions",
        description: "Composition of functions, inverse functions, power & polynomial functions, division algorithm, remainder and factor theorems, and function graphing."
      },
      {
        order: 2,
        title: "Unit 2: Rational Expressions and Rational Functions",
        description: "Operations on rational expressions, vertical/horizontal/slant asymptotes, graphing rational functions, and partial fractions decomposition."
      },
      {
        order: 3,
        title: "Unit 3: Coordinate Geometry (Conic Sections & Lines)",
        description: "Lines in the plane, distance from point to line, circles, parabolas, ellipses, and hyperbolas with their standard equations and properties."
      },
      {
        order: 4,
        title: "Unit 4: Matrices and Determinants",
        description: "Matrix algebra, determinants of 2x2 and 3x3 matrices, minors, cofactors, adjugate, matrix inversion, and solving systems using Cramer's rule & Gaussian elimination."
      },
      {
        order: 5,
        title: "Unit 5: Vectors in Two and Three Dimensions",
        description: "Vector components, magnitude, unit vectors, dot product, scalar and vector projections, cross product, and geometric applications to area and volume."
      },
      {
        order: 6,
        title: "Unit 6: Transformations of the Plane",
        description: "Translations, rotations, reflections, dilations, and representing plane transformations using 2x2 transformation matrices."
      },
      {
        order: 7,
        title: "Unit 7: Statistics and Probability",
        description: "Measures of central tendency, dispersion (variance & standard deviation), counting principles (nPr, nCr), conditional probability, and Bayes' Theorem."
      }
    ];

    const chapterMap = {};
    for (const cData of chaptersData) {
      let ch = await Chapter.findOne({
        subjectId: mathSubject._id,
        order: cData.order
      });

      if (ch) {
        ch.title = cData.title;
        ch.description = cData.description;
        ch.isActive = true;
        await ch.save();
        console.log(`Updated Chapter ${ch.order}: ${ch.title}`);
      } else {
        ch = await Chapter.create({
          subjectId: mathSubject._id,
          order: cData.order,
          title: cData.title,
          description: cData.description,
          isActive: true
        });
        console.log(`Created Chapter ${ch.order}: ${ch.title}`);
      }
      chapterMap[cData.order] = ch._id;
    }

    // 4. Comprehensive Study Notes for Each Chapter
    const notesData = [
      {
        chapterOrder: 1,
        title: "Unit 1: Further on Relations and Functions (Master Study Guide)",
        content: `# Unit 1: Further on Relations and Functions

## 1. Relations and Functions Overview
- A **relation** $R$ from set $A$ to set $B$ is any subset of the Cartesian product $A \\times B$.
- A **function** $f: A \\to B$ is a relation where **every element** in the domain $A$ is paired with **exactly one element** in the codomain $B$.
  - **Vertical Line Test:** A curve in the Cartesian plane represents a function if and only if no vertical line intersects the curve more than once.

### Function Classifications
1. **One-to-One (Injective):**
   - $f(x_1) = f(x_2) \\implies x_1 = x_2$.
   - **Horizontal Line Test:** Any horizontal line intersects the graph at most once.
2. **Onto (Surjective):**
   - For every $y \\in B$, there exists at least one $x \\in A$ such that $f(x) = y$ (i.e., $\\text{Range}(f) = \\text{Codomain}(B)$).
3. **Bijective (One-to-One Correspondence):**
   - Both injective and surjective.
   - **Crucial Theorem:** A function has an inverse $f^{-1}$ if and only if it is **bijective**.

---

## 2. Composition of Functions
Given functions $f(x)$ and $g(x)$:
$$(f \\circ g)(x) = f(g(x))$$
- **Domain of $(f \\circ g)$:**
  $$\\text{Dom}(f \\circ g) = \\{x \\in \\text{Dom}(g) \\mid g(x) \\in \\text{Dom}(f)\\}$$
- **Properties:**
  - Generally non-commutative: $f(g(x)) \\neq g(f(x))$.
  - Associative: $f \\circ (g \\circ h) = (f \\circ g) \\circ h$.
  - Identity: $(f \\circ I)(x) = (I \\circ f)(x) = f(x)$.

---

## 3. Inverse Functions ($f^{-1}$)
- If $f(a) = b$, then $f^{-1}(b) = a$.
- **Cancellation Equations:**
  $$f(f^{-1}(x)) = x \\quad \\text{and} \\quad f^{-1}(f(x)) = x$$
- **Graphing Property:**
  - The graph of $y = f^{-1}(x)$ is the reflection of $y = f(x)$ across the line $y = x$.
  - $\\text{Domain}(f^{-1}) = \\text{Range}(f)$ and $\\text{Range}(f^{-1}) = \\text{Domain}(f)$.

---

## 4. Polynomial Functions and Theorems
A polynomial function of degree $n$ is:
$$P(x) = a_n x^n + a_{n-1} x^{n-1} + \\dots + a_1 x + a_0 \\quad (a_n \\neq 0)$$

1. **Division Algorithm:**
   $$P(x) = D(x) \\cdot Q(x) + R(x)$$
   where either $R(x) = 0$ or $\\deg(R) < \\deg(D)$.
2. **Remainder Theorem:**
   - When a polynomial $P(x)$ is divided by $(x - c)$, the remainder is simply $R = P(c)$.
3. **Factor Theorem:**
   - $(x - c)$ is a factor of $P(x)$ if and only if $P(c) = 0$.
4. **Rational Root Theorem:**
   - If $\\frac{p}{q}$ in lowest terms is a rational zero of $P(x)$, then:
     - $p$ is an integer factor of the constant term $a_0$.
     - $q$ is an integer factor of the leading coefficient $a_n$.

---

## 5. Ethiopian Entrance Exam High-Yield Tips
> **Common Trap:** Finding the domain of $(f \\circ g)(x)$:
> - First simplify $g(x)$ and identify its restrictions: $x \\in \\text{Dom}(g)$.
> - Then write $f(g(x))$ and identify new restrictions.
> - The final domain is the **intersection** of both conditions! Never just simplify $f(g(x))$ algebraically first, or you may miss hidden domain holes.`
      },
      {
        chapterOrder: 2,
        title: "Unit 2: Rational Expressions & Functions (Asymptotes & Partial Fractions)",
        content: `# Unit 2: Rational Expressions and Rational Functions

## 1. Rational Expressions
A rational expression is a quotient of two polynomials:
$$R(x) = \\frac{P(x)}{Q(x)}, \\quad Q(x) \\neq 0$$
- **Domain:** All real numbers $x$ such that $Q(x) \\neq 0$.
- **Simplification:** Factor both numerator and denominator completely and cancel common nonzero factors.

---

## 2. Graphing Rational Functions and Asymptotes
Let $f(x) = \\frac{a_n x^n + \\dots + a_0}{b_m x^m + \\dots + b_0}$:

### A. Vertical Asymptotes (VA) & Holes
- Factor $f(x) = \\frac{P(x)}{Q(x)}$.
- If $(x - c)$ is a factor of both $P(x)$ and $Q(x)$:
  - Cancelling gives a **removable discontinuity (hole)** at $x = c$.
- Any factor $(x - a)$ remaining in the denominator after cancellation produces a **vertical asymptote** at $x = a$.
- As $x \\to a^{\\pm}$, $f(x) \\to \\pm \\infty$.

### B. Horizontal Asymptotes (HA)
Compare degree $n$ (numerator) and degree $m$ (denominator):
1. **$n < m$ (Bottom-heavy):**
   $$y = 0 \\quad (\\text{the } x\\text{-axis is the HA})$$
2. **$n = m$ (Equal degrees):**
   $$y = \\frac{a_n}{b_m} \\quad (\\text{ratio of leading coefficients})$$
3. **$n > m$ (Top-heavy):**
   - No horizontal asymptote.
   - If $n = m + 1$, there is an **oblique (slant) asymptote** found by polynomial long division:
     $$f(x) = (mx + b) + \\frac{R(x)}{Q(x)} \\implies y = mx + b$$

---

## 3. Partial Fractions Decomposition
Decomposing a proper rational fraction $\\frac{P(x)}{Q(x)}$ (where $\\deg P < \\deg Q$):

### Case 1: Distinct Linear Factors
If $Q(x) = (a_1 x + b_1)(a_2 x + b_2)$:
$$\\frac{P(x)}{Q(x)} = \\frac{A}{a_1 x + b_1} + \\frac{B}{a_2 x + b_2}$$

### Case 2: Repeated Linear Factors
If $Q(x) = (ax + b)^k$:
$$\\frac{P(x)}{(ax + b)^k} = \\frac{A_1}{ax + b} + \\frac{A_2}{(ax + b)^2} + \\dots + \\frac{A_k}{(ax + b)^k}$$

### Case 3: Irreducible Quadratic Factors
If $Q(x) = (ax^2 + bx + c)$ where $b^2 - 4ac < 0$:
$$\\frac{P(x)}{(x - d)(ax^2 + bx + c)} = \\frac{A}{x - d} + \\frac{Bx + C}{ax^2 + bx + c}$$

---

## 4. Worked Example: Partial Fractions
Decompose $\\frac{5x - 4}{x^2 - x - 2}$:
1. Factor denominator: $(x - 2)(x + 1)$.
2. Set up:
   $$\\frac{5x - 4}{(x - 2)(x + 1)} = \\frac{A}{x - 2} + \\frac{B}{x + 1}$$
3. Multiply by $(x - 2)(x + 1)$:
   $$5x - 4 = A(x + 1) + B(x - 2)$$
4. Substitute convenient values:
   - Let $x = 2$: $5(2) - 4 = A(3) \\implies 6 = 3A \\implies A = 2$.
   - Let $x = -1$: $5(-1) - 4 = B(-3) \\implies -9 = -3B \\implies B = 3$.
5. **Solution:**
   $$\\frac{5x - 4}{x^2 - x - 2} = \\frac{2}{x - 2} + \\frac{3}{x + 1}$$`
      },
      {
        chapterOrder: 3,
        title: "Unit 3: Coordinate Geometry & Conic Sections (Formulas & Review)",
        content: `# Unit 3: Coordinate Geometry (Conic Sections & Lines)

## 1. Lines in the Coordinate Plane
- **Slope:** $m = \\frac{y_2 - y_1}{x_2 - x_1}$
- **Point-Slope Form:** $y - y_1 = m(x - x_1)$
- **Slope-Intercept Form:** $y = mx + b$
- **General Linear Form:** $Ax + By + C = 0$
- **Parallel Lines:** $m_1 = m_2$
- **Perpendicular Lines:** $m_1 \\cdot m_2 = -1 \\iff m_2 = -\\frac{1}{m_1}$
- **Perpendicular Distance from Point $(x_0, y_0)$ to Line $Ax + By + C = 0$:**
  $$d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}$$

---

## 2. The Circle
A circle is the locus of all points $(x, y)$ equidistant ($r$) from center $(h, k)$:
$$(x - h)^2 + (y - k)^2 = r^2$$
- **General Equation:** $x^2 + y^2 + Dx + Ey + F = 0$
  - Center: $\\left(-\\frac{D}{2}, -\\frac{E}{2}\\right)$
  - Radius: $r = \\sqrt{\\left(\\frac{D}{2}\\right)^2 + \\left(\\frac{E}{2}\\right)^2 - F}$
  - Real circle if $D^2 + E^2 - 4F > 0$.

---

## 3. The Parabola
Set of all points equidistant from a fixed point (Focus) and a fixed line (Directrix).
- **Focal length:** $p$ (distance from vertex to focus).

| Axis of Symmetry | Standard Equation | Vertex | Focus | Directrix | Opening |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Vertical** | $(x - h)^2 = 4p(y - k)$ | $(h, k)$ | $(h, k + p)$ | $y = k - p$ | Up ($p > 0$) / Down ($p < 0$) |
| **Horizontal** | $(y - k)^2 = 4p(x - h)$ | $(h, k)$ | $(h + p, k)$ | $x = h - p$ | Right ($p > 0$) / Left ($p < 0$) |

---

## 4. The Ellipse
Set of all points where the **sum** of distances to two foci is constant ($2a$).
$$\\frac{(x - h)^2}{a^2} + \\frac{(y - k)^2}{b^2} = 1 \\quad (a > b)$$
- Relationship: $a^2 = b^2 + c^2 \\implies c = \\sqrt{a^2 - b^2}$
- **Eccentricity:** $e = \\frac{c}{a}$, where $0 < e < 1$.
- Length of Major Axis = $2a$; Length of Minor Axis = $2b$.

---

## 5. The Hyperbola
Set of all points where the **absolute difference** of distances to two foci is constant ($2a$).
1. **Horizontal Transverse Axis:**
   $$\\frac{(x - h)^2}{a^2} - \\frac{(y - k)^2}{b^2} = 1$$
   - Foci: $(h \\pm c, k)$, where $c^2 = a^2 + b^2$.
   - Asymptotes: $y - k = \\pm \\frac{b}{a}(x - h)$.
2. **Vertical Transverse Axis:**
   $$\\frac{(y - k)^2}{a^2} - \\frac{(x - h)^2}{b^2} = 1$$
   - Asymptotes: $y - k = \\pm \\frac{a}{b}(x - h)$.
   - Eccentricity: $e = \\frac{c}{a} > 1$.`
      },
      {
        chapterOrder: 4,
        title: "Unit 4: Matrices and Determinants (Complete Algebra & Inverses)",
        content: `# Unit 4: Matrices and Determinants

## 1. Matrix Basics and Operations
A matrix $A$ of dimension $m \\times n$ has $m$ rows and $n$ columns.
- **Matrix Addition/Subtraction:** Defined only for matrices of identical dimensions.
- **Scalar Multiplication:** $k \\cdot A = [k \\cdot a_{ij}]$.
- **Matrix Multiplication:**
  - $A_{m \\times k} \\times B_{k \\times n} = C_{m \\times n}$
  - Defined only when columns of $A$ equal rows of $B$.
  - In general, $AB \\neq BA$ (Matrix multiplication is **not commutative**).
- **Identity Matrix ($I_n$):** $AI = IA = A$.

---

## 2. Determinants
### A. $2 \\times 2$ Determinant
$$\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$

### B. $3 \\times 3$ Determinant (Cofactor Expansion)
$$\\det \\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix} = a(ei - fh) - b(di - fg) + c(dh - eg)$$

### C. Determinant Key Properties
1. $\\det(AB) = \\det(A) \\cdot \\det(B)$.
2. $\\det(A^T) = \\det(A)$.
3. $\\det(k A) = k^n \\det(A)$ for an $n \\times n$ matrix.
4. If any two rows or columns are identical (or proportional), $\\det(A) = 0$.
5. If a row or column is all zeros, $\\det(A) = 0$.
6. Interchanging two rows multiplies the determinant by $-1$.
7. Adding a scalar multiple of one row to another does **not change** the determinant.

---

## 3. Matrix Inverse ($A^{-1}$)
A square matrix $A$ is **invertible (non-singular)** if and only if $\\det(A) \\neq 0$.
$$A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A)$$
- **For a $2 \\times 2$ Matrix:**
  $$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$
- **Inverse Properties:**
  - $(A^{-1})^{-1} = A$
  - $(AB)^{-1} = B^{-1} A^{-1}$ (Reversal rule)
  - $\\det(A^{-1}) = \\frac{1}{\\det(A)}$

---

## 4. Systems of Linear Equations
Given $AX = B$:
1. **Matrix Inversion Method:**
   $$X = A^{-1}B \\quad (\\text{when } \\det(A) \\neq 0)$$
2. **Cramer's Rule:**
   For a system of $n$ equations in $n$ unknowns:
   $$x_i = \\frac{\\det(A_i)}{\\det(A)}$$
   where $A_i$ is formed by replacing column $i$ with the constants vector $B$.`
      },
      {
        chapterOrder: 5,
        title: "Unit 5: Vectors in 2D and 3D (Dot & Cross Products)",
        content: `# Unit 5: Vectors in Two and Three Dimensions

## 1. Vector Fundamentals
A vector has both **magnitude** and **direction**.
- In 3D space: $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle = v_1 \\mathbf{i} + v_2 \\mathbf{j} + v_3 \\mathbf{k}$
- **Magnitude:**
  $$\\|\\mathbf{v}\\| = \\sqrt{v_1^2 + v_2^2 + v_3^2}$$
- **Unit Vector in direction of $\\mathbf{v}$:**
  $$\\mathbf{\\hat{u}} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}, \\quad \\|\\mathbf{\\hat{u}}\\| = 1$$

---

## 2. Dot Product (Scalar Product)
$$\\mathbf{u} \\cdot \\mathbf{v} = u_1 v_1 + u_2 v_2 + u_3 v_3 = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos \\theta$$
- **Angle between vectors:**
  $$\\cos \\theta = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$
- **Orthogonality Test:**
  $$\\mathbf{u} \\perp \\mathbf{v} \\iff \\mathbf{u} \\cdot \\mathbf{v} = 0$$
- **Scalar Projection of $\\mathbf{u}$ onto $\\mathbf{v}$:**
  $$\\text{comp}_{\\mathbf{v}} \\mathbf{u} = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|}$$
- **Vector Projection of $\\mathbf{u}$ onto $\\mathbf{v}$:**
  $$\\text{proj}_{\\mathbf{v}} \\mathbf{u} = \\left( \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{v}\\|^2} \\right) \\mathbf{v}$$

---

## 3. Cross Product (Vector Product)
The cross product is defined **only in 3D** and yields a vector **perpendicular** to both $\\mathbf{u}$ and $\\mathbf{v}$:
$$\\mathbf{u} \\times \\mathbf{v} = \\det \\begin{pmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{pmatrix}$$
- **Magnitude:**
  $$\\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin \\theta$$
- **Parallel Vectors:** $\\mathbf{u} \\parallel \\mathbf{v} \\iff \\mathbf{u} \\times \\mathbf{v} = \\mathbf{0}$.
- **Geometric Applications:**
  - Area of Parallelogram formed by $\\mathbf{u}$ and $\\mathbf{v}$: $A = \\|\\mathbf{u} \\times \\mathbf{v}\\|$
  - Area of Triangle: $A_{\\Delta} = \\frac{1}{2} \\|\\mathbf{u} \\times \\mathbf{v}\\|$
  - Volume of Parallelepiped (Scalar Triple Product):
    $$V = |\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})|$$`
      },
      {
        chapterOrder: 6,
        title: "Unit 6: Transformations of the Plane (Matrices & Geometry)",
        content: `# Unit 6: Transformations of the Plane

## 1. Types of Plane Transformations
A transformation maps every point $(x, y)$ in the Cartesian plane to an image point $(x', y')$.

### A. Translation
$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} h \\\\ k \\end{pmatrix}$$
- Note: Translation by non-zero $(h, k)$ is an affine transformation, not linear through origin.

---

## 2. Linear Transformations and $2 \\times 2$ Matrices
$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix}$$

### Standard Transformation Matrices
1. **Reflection:**
   - In the $x$-axis: $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$
   - In the $y$-axis: $\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$
   - In the line $y = x$: $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$
   - In the line $y = -x$: $\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$
   - In the Origin: $\\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}$

2. **Rotation about Origin by Angle $\\theta$ (Counter-Clockwise):**
   $$R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$$
   - For $90^\\circ$: $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$
   - For $180^\\circ$: $\\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}$
   - For $270^\\circ$: $\\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$

3. **Scaling / Dilation with factor $k$:**
   $$S_k = \\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}$$

4. **Shearing:**
   - Horizontal shear by factor $k$: $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$
   - Vertical shear by factor $k$: $\\begin{pmatrix} 1 & 0 \\\\ k & 1 \\end{pmatrix}$

---

## 3. Composition of Transformations
If transformation $T_1$ has matrix $M_1$ and $T_2$ has matrix $M_2$, the combined transformation "$T_1$ followed by $T_2$" has matrix:
$$M_{\\text{composite}} = M_2 \\cdot M_1$$
*(Note reverse matrix order!)*`
      },
      {
        chapterOrder: 7,
        title: "Unit 7: Statistics and Probability (Distributions & Counting Rules)",
        content: `# Unit 7: Statistics and Probability

## 1. Measures of Central Tendency
- **Mean (Ungrouped):** $\\bar{x} = \\frac{\\sum x_i}{n}$
- **Mean (Grouped):** $\\bar{x} = \\frac{\\sum f_i m_i}{\\sum f_i}$, where $m_i$ is class midpoint.
- **Median:** Middle value when sorted. For grouped data:
  $$\\text{Median} = L + \\left( \\frac{\\frac{N}{2} - CF_b}{f_m} \\right) w$$
- **Mode:** Most frequent observation. For grouped data, in the modal class:
  $$\\text{Mode} = L + \\left( \\frac{\\Delta_1}{\\Delta_1 + \\Delta_2} \\right) w$$

---

## 2. Measures of Dispersion
- **Range:** $R = x_{\\max} - x_{\\min}$
- **Variance (Population $\\sigma^2$, Sample $s^2$):**
  $$\\sigma^2 = \\frac{\\sum (x_i - \\mu)^2}{N} = \\frac{\\sum x_i^2}{N} - \\mu^2$$
  $$s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n - 1}$$
- **Standard Deviation:** $\\sigma = \\sqrt{\\sigma^2}$
- **Coefficient of Variation (Relative Dispersion):**
  $$CV = \\frac{\\sigma}{\\mu} \\times 100\\%$$

---

## 3. Counting Principles
1. **Fundamental Counting Principle:** If task 1 can be done in $n_1$ ways and task 2 in $n_2$ ways, both can be done in $n_1 \\times n_2$ ways.
2. **Permutations (Order Matters):**
   $$P(n, r) = \\frac{n!}{(n - r)!}$$
3. **Combinations (Order Does NOT Matter):**
   $$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}$$

---

## 4. Probability Rules & Bayes' Theorem
- **Complement Rule:** $P(A') = 1 - P(A)$
- **Addition Rule (Any two events):**
  $$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$
  *(If mutually exclusive, $P(A \\cap B) = 0$)*
- **Conditional Probability:**
  $$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0$$
- **Independent Events:**
  $$A \\text{ and } B \\text{ independent} \\iff P(A \\cap B) = P(A) \\cdot P(B)$$
- **Bayes' Theorem:**
  $$P(A_k \\mid B) = \\frac{P(B \\mid A_k) P(A_k)}{\\sum_{i=1}^n P(B \\mid A_i) P(A_i)}$$`
      }
    ];

    console.log("Seeding Study Notes into MongoDB Atlas...");
    for (const nData of notesData) {
      const chapterId = chapterMap[nData.chapterOrder];

      // Upsert note by chapterId & subjectId
      let note = await Note.findOne({
        subjectId: mathSubject._id,
        chapterId: chapterId
      });

      if (note) {
        note.title = nData.title;
        note.body = nData.content;
        note.status = "active";
        note.isPublic = true;
        note.uploadedBy = authorId;
        await note.save();
        console.log(`[UPDATED NOTE] ${note.title}`);
      } else {
        note = await Note.create({
          userId: authorId,
          uploadedBy: authorId,
          title: nData.title,
          body: nData.content,
          fileType: "text",
          subjectId: mathSubject._id,
          chapterId: chapterId,
          status: "active",
          isPublic: true,
          isPremium: false
        });
        console.log(`[CREATED NOTE] ${note.title}`);
      }
    }

    console.log("\n======================================================");
    console.log("SUCCESS: Seeded 7 Grade 11 Mathematics Chapters & Notes!");
    console.log("All notes are Public, Active, and In-App Offline Ready.");
    console.log("======================================================");

  } catch (error) {
    console.error("Error seeding Grade 11 Math notes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

seedMath11Notes();
