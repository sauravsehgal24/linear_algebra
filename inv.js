
const inverseMatrix = (matrix)=> {
    const n = matrix.length
    const identityMatrix = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    )
    const augmentedMatrix = matrix.map((el, index) =>
      [...el,...identityMatrix[index]]
    )
    for (let i = 0; i < n; i++) {
      const diagonalElement = augmentedMatrix[i][i]
      for (let j = 0; j < 2 * n; j++) {
        augmentedMatrix[i][j] /= diagonalElement
      }
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const fac = augmentedMatrix[k][i]
          for (let j = 0; j < 2 * n; j++) {
            augmentedMatrix[k][j] -= fac * augmentedMatrix[i][j]
          }
        }
      }
    }
    return augmentedMatrix.map(el => el.slice(n))
  }
  
  const cond = (H)=>{
    const H_inverse = inverseMatrix(H)
    const H_infinity_norm = Math.max(...(H.map((row)=>row.reduce((acc,el)=>acc+Math.abs(el),0))))
    const H_inverse_infinity_norm = Math.max(...(H_inverse.map((row)=>row.reduce((acc,el)=>acc+Math.abs(el),0))))
    return H_infinity_norm * H_inverse_infinity_norm
  }

  const matrix = [
    [1,0.5,0.3333333333333333],
    [0.5,0.3333333333333333,0.25],
    [0.3333333333333333,0.25,0.2]
  ]

  console.log(cond(matrix))
