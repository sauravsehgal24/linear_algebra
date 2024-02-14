const expandCopyMatrix = (matrix,n,n_trim)=> {
    const I_fix = Array.from({ length:n }, (_, i) =>
        Array.from({ length:n }, (_, j) => (i === j ? 1 : 0))
    )
    for (let i = 0+n_trim; i < n; i++) {
        for (let j = 0+n_trim; j < n; j++) {
            I_fix[i][j] = matrix[i-n_trim][j-n_trim]; 
        }
    }
    return I_fix;
}

const  matrix_multiplication = (a, b, n_trim, H_flag)=> {
    let result = [];
    const hard_array = b.map(innerArray => [...innerArray])
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0+n_trim; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k+n_trim][j];
            }
            if(H_flag){
                hard_array[i+n_trim][j]=sum
            }
            else{
                result[i][j] = sum
            }
        }
    }
    return H_flag?hard_array:result
}

const householder = (matrix) =>{
    const hard_matrix = matrix.map(innerArray => [...innerArray])
    let Q;
    const H_array = []
    for(var column=0;column<matrix[0].length;column++){
        const I = Array.from({ length: matrix.length-column }, (_, i) =>
            Array.from({ length: matrix.length-column }, (_, j) => (i === j ? 1 : 0))
        )
        const e = new Array(matrix.length-column).fill(0)
        e[0]=1
        const alpha = ((0-matrix[column][column])/Math.abs(matrix[column][column]))*Math.pow(matrix.reduce((acc,el,index)=>{
            if(column<=index) return (acc+Math.pow(el[column],2)) 
            else return 0
        },0),0.5)
        let v=[]
        let j=0;
        while(j<matrix.length){
            if (column<=j){
                v.push(matrix[j][column]-(alpha*e[j-column]))
            }
            j++
        }
        // 2d array
        const v_vt = v.map((el)=>{
            return v.map((el2)=>{
                return el*el2
            })
        })
        let vt_v = v.reduce((acc,el)=>Math.pow(el,2)+acc,0)
        if(Math.abs(vt_v)<1e-10)continue
        vt_v = 2/vt_v
        const H = I.map((row,row_index)=>{
            return row.map((el,el_index)=>{
                return el-(vt_v * v_vt[row_index][el_index])
            })
        })
        matrix = matrix_multiplication(H,matrix,column,true)
        console.log(`\nMatrix After H${column+1} --------------------------------\n`)
        console.log(matrix)
        console.log("\n\n---------------------------------")
        const H_expand = expandCopyMatrix(H,matrix.length,column)
        H_array.push(H_expand)
        if(Q){
            Q = matrix_multiplication(Q,H_expand,0,false)
        }else{
            Q = H_expand
        }
    }
    let R;
    for(var i=2;i>=0;i--){
        if(!R)R=H_array[i]
        else R = matrix_multiplication(R,H_array[i],0,false)
    }
    R = matrix_multiplication(R,hard_matrix,0,false)
    return {Q,R}
}

const transpose = (matrix)=> {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const transposedMatrix = [];
    for (let j = 0; j < numCols; j++) {
        transposedMatrix[j] = []; 
        for (let i = 0; i < numRows; i++) {
            transposedMatrix[j][i] = matrix[i][j]; 
        }
    }
    return transposedMatrix;
}

const backwardSubstitution = (matrix, b)=>{
    const n = matrix.length;
    let x = (new Array(matrix.length)).fill(0);
    for(var j=n-1;j>=0;j--){
        if (matrix[j][j]==0) return
        x[j]=b[j]/matrix[j][j] // value for x[0]
        for(var i=0; i<=j-1;i++){
            b[i]=b[i]-matrix[i][j]*x[j]
        }
    }
    return x;
}


// MAIN
(()=>{
    const A = [
        [1, 0 , 0, 0],
        [0, 1 , 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
        [1, -1 , 0, 0],
        [1, 0 , -1, 0],
        [1, 0 , 0, -1],
        [0, 1, -1,0],
        [0, 1, 0, -1],
        [0, 0, 1, -1],
        
    ]
    const b = [
        [2.95],[1.74],[-1.45],[1.32],[1.23],[4.45],[1.61],[3.21],[0.45],[-2.75]
    ]
    const obj = householder(A,b)
    const Qt = transpose(obj.Q)
    const R = obj.R.slice(0, A[0].length)
    for(var i=0;i<R.length;i++){
        for (var j=0;j<R[0].length;j++){
            if(Math.abs(R[i][j])<1e-10) R[i][j]=0
        }
    }
    const Qt_b = matrix_multiplication(Qt,b,0,false)
    const _b = Qt_b.map((row)=>row[0]).slice(0, A[0].length)
    const x = backwardSubstitution(R,_b)
    console.log("\n\n---------------------------------\nSolution for X and Delta_X \n---------------------------------\n")
    x.forEach((el,index)=>{
        console.log(`X_Cap${index+1} = ${el} | Measured X${index+1} = ${b[index]} | Delta X = ${el-b[index]}\n`)
    })
})()
