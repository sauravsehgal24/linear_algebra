function inverseMatrix(matrix) {
    const n = matrix.length;
    
    // Create an identity matrix
    const identityMatrix = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
  
    // Augment the original matrix with the identity matrix
    const augmentedMatrix = matrix.map((row, rowIndex) =>
      row.concat(identityMatrix[rowIndex])
    );
  
    // Perform Gaussian elimination
    for (let i = 0; i < n; i++) {
      // Make the diagonal element 1
      const diagonalElement = augmentedMatrix[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmentedMatrix[i][j] /= diagonalElement;
      }
  
      // Make the other rows 0 in the current column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmentedMatrix[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
          }
        }
      }
    }
  
    // Extract the inverse matrix from the augmented matrix
    const inverse = augmentedMatrix.map(row => row.slice(n));
  
    return inverse;
  }
  
  // Example usage:
  const inputMatrix = [
    [4, 0, 0],
    [0, -5, 0],
    [0,0,10]
  ];
  
  const result = inverseMatrix(inputMatrix);
  
  console.log("Inverse of the matrix:");
  console.log(result);
  