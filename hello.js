let nums = [0,0,1,1,1,2,2,3,3,4];

let arr = [];
    let k = [...new Set(nums)];
    console.log(k)
    for (let i = 0; i < nums.length; i++) {
        if(k[i]==0)arr.push(k[i])
        if (k[i] ) {
            arr.push(k[i]);
        } else if(k[i] !== 0){
            arr.push('_')
        };
    }
    console.log(arr)
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== "_") { 
        count++
        }
    }
    let result = arr.slice(0,count)
    console.log(result)


