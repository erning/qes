# QUADRATIC EQUATION SOLVER

```
EQUATION:
x² + 2x + 3 = 0

SOLUTIONS:
           ___
x₁ = -1 + √ 2 i
           ___
x₂ = -1 - √ 2 i
```

----

### 表示一元二次方程的数据结构

一元二次方程的标准形式为 $ax^2 + bx + c = 0$，当 $a$, $b$, $c$ 为有理数时，总是能将 $a$、$b$、$c$，转换为整数形式。我们只实现 $a$、$b$、$c$ 为有理数的情况。用一个结构体表示，

```
STRUCT {
  a: DOUBLE
  b: DOUBLE
  c: DOUBLE
}
```

### 一元二次方程的简化

当一元二次方程的参数 $a$、$b$、$c$ 不为整数时，我们将方程两边同时乘以 10 的倍数，直到 $a$、$b$、$c$ 都为整数；

当一元二次方程的参数 $a$、$b$、$c$ 不为互质数时，我们将方程两边同时除以 $a$, $b$, $c$ 的最大公约数；

当一元二次方程的参数 $a$ 为负数时，我们将方程两边同时乘以 $-1$。

由于我们使用标准形式来表示一元二次方程，方程右边始终为 $0$，乘除操作我们只需要对 $a$、$b$、$c$ 进行。

### 最大公约数

编程使用 [輾轉相除法](https://zh.wikipedia.org/zh-cn/輾轉相除法)，

```
function gcd(a, b)
    while b ≠ 0
        t ← b
        b ← a mod b
        a ← t
    return a
```

### 表示一元二次方程根的数据结构

根据一元二次方程的求根公式，$\dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$，我们将根分解为 $A$、$B$、$C$、$D$ 四个部分： $\dfrac{A + B\sqrt{C}}{D}$。其中,

- $A=-b$
- $B=\pm 1$
- $C=b^2 -4ac$
- $D=2a$

求解之前，我们先将一元二次方程的 $a$, $b$, $c$ 转化为整数形式。这样，$A$、$B$、$C$、$D$ 也都是整数。也可以用一个结构体表示根，

```
STRUCT {
  a: INTEGER
  b: INTEGER
  c: INTEGER
  d: INTEGER
```

### 一元二次方程根的简化

对应式子 $\dfrac{A + B\sqrt{C}}{D}$，我们首先化简根号部分，即 $B\sqrt{C}$。

- 如果 $C = m^2 n \quad m, n \in \Z^+$，根号部分可以化简为 $B*m \sqrt{n}$
- 如果 $C = 0$，根号部分等于 $0$
- 如果 $C < 0$，根号部分转化为 $B\sqrt{-C}i$

然后，我们找出 $A$、$B$、$D$ 的最大公约数 $g$，在分式的分子与分母同时除以 $g$

### 分解质因数

对于 $B \sqrt{C} = B \sqrt{m^2n} = Bm\sqrt{n}$，为了找出 $m$ 和 $n$，可以对 $C$ 分解质因数，然后找出每个质因数的个数。设分解后某个质数 $p$，它的个数为 $q$，
- 当 $q$为偶数时，$p^q$ 可以完全提出根号，根号外为 $p^{\frac{q}{2}}$，根号内保留 $1$
- 当 $q$为奇数时，$p^{q-1}$，可以提出根号，根号外为 $p^{\frac{q-1}{2}}$，根号内保留 $p$

编程做因式分解
```
function prime_factorize(number)
    factors = {}
    n ← abs(number)
    i ← 2
    while i <= abs(number)
        if (n % i == 0)
            factors[i]++
            n ← n / i
        else
            i ← i + 1
    return factors
```

### 格式化输出一元二次方程的解

可以选择用 [LaTeX](https://zh.wikipedia.org/wiki/LaTeX) 格式输出，用浏览器展示比较简单，我们选用 [KaTeX](https://katex.org/docs/supported.html) 实现。 

`\dfrac{A + B \sqrt{C}}{D}` 渲染后为，$\dfrac{A + B\sqrt{C}}{D}$ 

输出 LaTeX 时也要做一些化简工作，

- 当 $C = \pm 1$ 时，不用渲染根号
- 当 $C = 1$ 时，分子只渲染 $A + B$ 运算后的结果 
- 当 $C < 0$ 时，分子后面加上 $i$ 表示虚数
- 当 $B = 0$ 时，分子部分只渲染 $A$ 的值
- 当 $B < 0$ 时，$B$ 之前的 $+$ 号 改为 $-$ 号，渲染 $|B|$ 的值
- 当 $A = 0$ 时，只渲染化简后的 $B \sqrt{C}$，且如果 $B >= 0$，不渲染 $B$ 之前的 $+$ 号
- 当 $D = 1$ 时，不用渲染分号及分母


### Javascript

为了方便数学公式的显示，我们用浏览器来实现，因此采用 Javascript + [vue](https://vuejs.org) 框架。