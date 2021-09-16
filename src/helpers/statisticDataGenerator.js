export const getGraphData = (data, field, label) => {
  if (null === data) {
    return false
  }
  const options = {
    xaxis: {
      categories: Object.keys(data[field]),
    },
  };

  return {
    options,
    series: [{
      name: label,
      data:  Object.values(data[field])
    }]
  }
};
