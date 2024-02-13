

function householder(matrix,b) {
    for(var column=0;column<matrix[0].length;column++){
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
        const vt_v = v.reduce((acc,el)=>Math.pow(el,2)+acc,0)
        for(var i=column;i<=matrix[0].length;i++){
            if(i==matrix[0].length){
                const vt_b = b.reduce((acc,el,row)=>{
                    if (column<=row) return (v[row-column]*el) + acc
                    else return 0
                },0)
                const y_b=v.map((el)=>el*2*vt_b/vt_v)
                b.forEach((el,index,array)=>{
                    if (column<=index) {
                        array[index] = el-y_b[index-column]
                    }
                })
            }
            else{
                const vt_a = matrix.reduce((acc,el,row)=>{
                    if (column<=row) return (v[row-column]*el[i]) + acc
                    else return 0
                },0)
                const y = v.map((el)=>el*2*vt_a/vt_v)
                matrix.forEach((el,row, array)=>{
                    if (column<=row) {
                        array[row][i] = el[i]-y[row-column]
                    }
                })
            }
        }
    }
    return {matrix,b}
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

// Example usage
const A = [
    [1, -1 , 0, 0],
    [1, 0, -1,0],
    [1, 0, 0, -1],
    [0, 1, -1, 0],
    [0, 1, 0, -1],
    [0, 0, 1, -1],
]

const b = [
    1.23,4.45,1.61,3.21,0.45,-2.75
]

const obj = householder(A,b)
const upper_matrix = obj.matrix.slice(0, A[0].length);
const b_cap = obj.b.slice(0,A[0].length)
const x = backwardSubstitution(upper_matrix,b_cap)
console.log(x)

