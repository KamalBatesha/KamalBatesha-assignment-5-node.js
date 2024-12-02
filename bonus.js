function findMajorityElement(nums) {
    const countMap = new Map();
    const majorityCount = Math.floor(nums.length / 2);

    for (let num of nums) {
        countMap.set(num, (countMap.get(num) || 0) + 1);
        // Check if we've found a majority element
        if (countMap.get(num) > majorityCount) {
            return num; // Return the majority element
        }
    }
    let maxCount = 0;
    let majorityElement = null;
    for (let [num, count] of countMap) {
        if (count > maxCount) {
            maxCount = count;
            majorityElement = num;
        }

    }
    

    return majorityElement; 
}

// Example usage
console.log(findMajorityElement([3, 2, 3]));
console.log(findMajorityElement([2, 2, 1, 1, 1, 2, 2]));
console.log(findMajorityElement([1, 2, 3, 4, 5]));
console.log(findMajorityElement([1, 1, 3, 4, 5])); 