
var app = new Vue({
  el: '#app',
  data: {
    paramA: "",
    paramB: "",
    paramC: "",
    message: "",
    question: "",
    answer: [],
  },
  computed: {
  },

  methods: {
    calculate: function() {
      this.message = ""
      this.question = []
      this.answer = []
      let a = parseFloat(this.paramA)
      let b = parseFloat(this.paramB)
      let c = parseFloat(this.paramC)
      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        this.message = "a, b, c should be rational number"
        return
      }
      if (a == 0) {
        this.message = "a should not be zero"
        return
      }

      let qe = new QuadraticEquation(a, b, c)
      this.question = qe.toLatex()

      let qes = qe.normalize()
      if (!qes.equals(qe)) {
        this.question += " \\Longrightarrow " + qes.toLatex()
      }

      solutions = qe.solve()
      subscript = solutions.length > 1 ? 1 : 0
      for (solution of solutions) {
        let s = "x"
        if (subscript > 0) {
          s += "_" + subscript
          subscript++
        }
        s += " = " + solution.toLatex()

        let ss = solution.simplify()
        if (!ss.equals(solution)) {
          s += " = " + ss.toLatex()
        }
        this.answer.push(s)
      }
    },
  },
})
