function removeDuplicates(arr) {
  const uniqueMap = {}; // 用于存储已经出现过的areaId
  const uniqueArray = []; // 用于存储去重后的数组

  for (const obj of arr) {
    if (!uniqueMap[obj.areaId]) {
      // 如果areaId在uniqueMap中不存在，将该对象添加到uniqueArray中
      uniqueMap[obj.areaId] = true; // 将areaId标记为已经出现
      uniqueArray.push(obj);
    }
  }

  return uniqueArray;
}

export {
	removeDuplicates
}