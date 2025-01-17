exports.createReference = (arr, key, value) => {
    return arr.reduce((reference, element) => {
        reference[element[key]] = element[value];
      return ref;
    }, {});
  };