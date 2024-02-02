// Utility function --------------------------
const matrixMultiplication = (A,B)=>{
  let b;
  // B is a vector
  if(!Array.isArray(B[0])){
      b = (new Array(B.length)).fill(0);
      for(var i=0; i<B.length; i++){
          for(var j=0; j<B.length; j++){
              b[i] += A[i][j]*B[j]
          }
      }
  }
  // B is a matrix
  else{
      b = []
      for(var i=0;i<B.length;i++){
          b[i] = (new Array(B.length)).fill(0);
          for(var j=0;j<B.length;j++){
              for(var k=0;k<B.length;k++){
                  b[i][j] += A[i][k]*B[k][j]
              }
          }
      }
  }
  return b
}

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
// ----------------------------------------------

const generatorHB = (n,x)=>{
  // generate H
  let H = [] 
  for(var i=0;i<n;i++){
      H[i] = (new Array(n)).fill(0)
      for(var j=0; j<n; j++){
          // I have done +1 instead of -1 because the index of the array is starting from 0. 
          H[i][j]=(1/(i+j+1))
      }
  }
  // generate b
  const b = matrixMultiplication(H,x)
  return {H,b}
}

const forwardSubstitution = (matrix, b, n)=>{
  let x = (new Array(n)).fill(0);
  for(var j=0;j<n;j++){
      if (matrix[j][j]==0) return
      x[j]=b[j]/matrix[j][j] 
      for(var i=j+1; i<n;i++){
          b[i]=b[i]-matrix[i][j]*x[j]
      }
  }
  return x;
}

const backwardSubstitution = (matrix, b, n)=>{
  let x = (new Array(n)).fill(0);
  for(var j=n-1;j>=0;j--){
      if (matrix[j][j]==0) return
      x[j]=b[j]/matrix[j][j] // value for x[0]
      for(var i=0; i<=j-1;i++){
          b[i]=b[i]-matrix[i][j]*x[j]
      }
  }
  return x;
}
function gaussElimination(A,n) {
  // Initialize L and U matrix with 0
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const U = Array.from({ length: n }, () => Array(n).fill(0));
  // LU decomp
  for (let i = 0; i < n; i++) {
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * U[j][k];
      }
      U[i][k] = A[i][k] - sum;
    }

    for (let k = i; k < n; k++) {
      if (i === k) {
        L[i][i] = 1; 
      } else {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[k][j] * U[j][i];
        }
        L[k][i] = (A[k][i] - sum) / U[i][i];
      }
    }
  }
  return { L, U };
}


// MAIN METHOD
(()=>{
  const n=13;
  for(var i=2;i<=n;i++){
      console.log(`\n------------------------------------------\nn = ${i}`)
      const x = new Array(i).fill(1)
      const {H, b} = generatorHB(i,x)

      // Solve for 𝑯x^ = 𝒃
      const { L, U } = gaussElimination(H,i);
      const y = forwardSubstitution(L,b,i)
      const x_cap = backwardSubstitution(U,y,i)
      console.log(`\nx_cap = [${x_cap}]`)

      // Matrix Multiply 𝑯 and x^
      const H_xCap = matrixMultiplication(H,x_cap)

      // Calculate residual and it's infinity norm
      const r = b.map((element, index)=>element - H_xCap[index])
      const r_infinity_norm = Math.max(...(r.map((element)=>Math.abs(element))))
      console.log(`\nr = [${r}]\n\nr_infinity_norm = ${r_infinity_norm}`)

      // Calculate delta_x and delta_x infinity norm
      const deltaX = x_cap.map((element, index)=>element - x[index])
      const deltaX_infinity_norm = Math.max(...(deltaX.map((element)=>Math.abs(element))))
      console.log(`\ndelta_x = [${deltaX}]\n\ndeltaX_infinity_norm = ${deltaX_infinity_norm}\n\nPercentage error (deltaX_infinity_norm/x_infinity_norm) = ${deltaX_infinity_norm*100}\n`)
      console.log(`Cond_infinity(H) = ${cond(H)}\n----------------------------------------\n`)
  }
})()
