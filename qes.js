
/**
 *
 * @param {*} a
 * @param  {...*} args
 * @returns
 */
 function gcd(a, ...args) {
  a = Math.abs(a)
  for (b of args) {
    b = Math.abs(b)
    while (b != 0) {
      m = a % b
      a = b
      b = m
    }
  }
  return a
}

/**
 *
 * @param {*} number
 * @returns
 */
function prime_factorize(number) {
  factors = {}
  let n = Math.abs(number)
  let i = 2
  let j = Math.ceil(Math.sqrt(n))
  while (i <= j) {
    if (n % i == 0) {
      factors[i] = (i in factors) ? factors[i] + 1 : 1
      n = Math.trunc(n / i)
    } else {
      i++
    }
  }
  if (n > 1) { factors[n] = 1 }
  return factors
}

/**
 * ax² + bx + c = 0
 */
class QuadraticEquation {
  constructor(a, b, c) {
    a = Number.parseFloat(a)
    b = Number.parseFloat(b)
    c = Number.parseFloat(c)
    if (Number.isNaN(a) || Number.isNaN(b) && Number.isNaN(c) || a == 0) {
      throw("ERROR")
    }
    this.a = a
    this.b = b
    this.c = c
  }

  /**
   * Δ = b² - 4ac
   */
  get delta() {
    return this.b * this.b - 4 * this.a * this.c
  }

  /**
   *        __________
   *  -b ± √ b² - 4ac
   * ------------------
   *        2a
   */
  get roots() {
    let delta = this.delta
    if (delta < 0) {
      return []
    }
    if (delta == 0) {
      return [-this.b / (2 * this.a)]
    }
    return [
      (-this.b + Math.sqrt(delta)) / (2 * this.a),
      (-this.b - Math.sqrt(delta)) / (2 * this.a),
    ]
  }

  /**
   *
   * @returns
   */
  normalize() {
    let a = this.a
    let b = this.b
    let c = this.c
    function scale(r) {
      if (Number.isInteger(r)) {
        return 1
      }
      return 10 ** String(r).split(".")[1].length
    }
    if (!Number.isInteger(a)) {
      let n = scale(a)
      a *= n
      b *= n
      c *= n
    }
    if (!Number.isInteger(b)) {
      let n = scale(b)
      a *= n
      b *= n
      c *= n
    }
    if (!Number.isInteger(c)) {
      let n = scale(c)
      a *= n
      b *= n
      c *= n
    }

    let d = gcd(a, b, c)
    a = Math.trunc(a / d)
    b = Math.trunc(b / d)
    c = Math.trunc(c / d)
    if (a < 0) {
      a = -a
      b = -b
      c = -c
    }
    return new QuadraticEquation(a, b, c)
  }

  /**
   *
   * @returns
   */
  solve() {
    let equation = this.normalize()
    let a = -equation.b
    let c = equation.delta
    let d = 2 * equation.a

    if (c == 0) {
      return [
        new QuadraticSolution(a, 0, 0, d)
      ]
    }

    return [
      new QuadraticSolution(a,  1, c, d),
      new QuadraticSolution(a, -1, c, d),
    ]
  }

  /**
   *
   * @returns
   */
  toLatex() {
    let s = ""

    if (this.a != 0) {
      if (this.a == 1) {
      } else if (this.a == -1) {
        s += "-"
      } else {
        s += this.a
      }
      s += "x^2"
    }

    if (this.b > 0) {
      s += " + "
    } else if (this.b < 0) {
      s += " - "
    }
    if (this.b != 0 && this.b != 1 && this.b != -1) {
      s += Math.abs(this.b)
    }
    if (this.b != 0) {
      s += "x"
    }

    if (this.c > 0) {
      s += " + "
    } else if (this.c < 0) {
      s += " - "
    }
    if (this.c != 0) {
      s += Math.abs(this.c)
    }

    s += " = 0"
    return s
  }

  /**
   *
   * @param {*} other
   * @returns
   */
  equals(other) {
    if (!(other instanceof QuadraticEquation)) {
      return false
    }
    return this.a == other.a && this.b == other.b && this.c == other.c
  }
}

/**
 *          ___
 *  A + ±B √ C
 * ------------
 *      D
 *
 * A = -b
 * B²C = b² - 4ac
 * D = 2a
 */
class QuadraticSolution {
  constructor(a, b, c, d) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
  }

  get hasSquareRoot() {
    return this.c != 1 && this.c != -1 && this.c != 0 && this.b != 0
  }

  get isComplex() {
    return this.c < 0 && this.b != 0
  }

  get isFraction() {
    return this.d != 1 && this.d != -1
  }

  simplify() {
    let a = this.a
    let b = this.b
    let c = this.c
    let d = this.d

    // simplify square root
    if (b != 0 && c != 0) {
      let factors = prime_factorize(c)
      for (let n in factors) {
        let count = factors[n]
        b *= n ** Math.trunc(count / 2)
        c /= n ** (Math.trunc(count / 2) * 2)
      }
    }

    // remove square root if possible
    if (c == 1) {
      a += b
      b = 0
      c = 0
    }

    // simplify fraction
    let cd = gcd(a, b, d)
    a = Math.trunc(a / cd)
    b = Math.trunc(b / cd)
    d = Math.trunc(d / cd)

    // normalize sign
    if (d < 0) {
      a = -a
      b = -b
      d = -d
    }

    return new QuadraticSolution(a, b, c, d)
  }

  /**
   *
   * @returns
   */
  toLatex() {
    let s = ""

    if (this.isFraction) {
      s += "\\dfrac{"
    }

    if (this.hasSquareRoot) {
      // with square root
      if (this.a != 0) {
        s += this.a + (this.b < 0 ? " - " : " + ")
      } else if (this.b < 0) {
        s += "- "
      }
      if (this.b != 1 && this.b != -1) {
        s += Math.abs(this.b)
      }
      s += "\\sqrt{" + Math.abs(this.c) + "}"
      if (this.isComplex) {
        s += " i"
      }
    } else if (this.isComplex) {
      // complex number without square root
      if (this.a != 0) {
        s += this.a + (this.b < 0 ? " - " : " + ")
      } else if (this.b < 0) {
        s += "- "
      }
      if (this.b != 1 && this.b != -1) {
        s += Math.abs(this.b)
      }
      s += " i"
    } else {
      s += this.a
      if (this.b > 0) {
        s += " + " + this.b
      } else if (this.b < 0) {
        s += " - " + -this.b
      }
    }

    if (this.isFraction) {
      s += "}{" + this.d + "}"
    }

    return s
  }

  /**
   *
   * @param {*} other
   * @returns
   */
  equals(other) {
    if (!(other instanceof QuadraticSolution)) {
      return false
    }
    return this.a == other.a && this.b == other.b && this.c == other.c
     && this.d == other.d
  }
}
