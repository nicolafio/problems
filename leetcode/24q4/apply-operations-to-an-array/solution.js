function applyOperations(nums) {
    // copy.
    nums = [...nums];

    let n = nums.length;

    for (let i = 0; i < n - 1; i++) {
        if (nums[i] === nums[i + 1]) {
            nums[i] *= 2;
            nums[i + 1] = 0;
        }
    }

    nums = nums.filter(v => v > 0);

    for (let i = nums.length; i < n; i++) {
        nums.push(0);
    }

    return nums;
}
