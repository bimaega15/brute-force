const pagination = (page, model, limit) => {
  const active = page - 1;
  const pembagian = model / limit;
  const pembulatanKeAtas = Math.ceil(pembagian);
  let totalPagination = [];
  for (let i = 0; i < pembulatanKeAtas; i++) {
    totalPagination[i] = i;
  }
  let rangeAwal = active - 1;
  if (rangeAwal < 0) {
    rangeAwal = 0;
  }
  let batasAkhir = rangeAwal + 3;
  const checkPagination = isset(totalPagination, batasAkhir);

  if (!checkPagination) {
    batasAkhir = totalPagination.length;
    rangeAwal = batasAkhir - 3;
    if (rangeAwal < 0) {
      rangeAwal = 0;
    }
  }

  let output = totalPagination;
  output = output.slice(rangeAwal, batasAkhir);

  let hasilPagination = [];
  let checkActive = "";
  output.map((v, i) => {
    checkActive = "";
    if (v == active) {
      checkActive = "active";
    }
    hasilPagination[i] = {
      index: v,
      page: v + 1,
      active: checkActive,
    };
  });

  // button
  let pageCurrent = active;
  let prevButton = pageCurrent - 1;
  let nextButton = pageCurrent + 1;

  let checkButtonPrev =
    isset(totalPagination, prevButton) == true ? true : false;
  let checkButtonNext =
    isset(totalPagination, nextButton) == true ? true : false;

  let linkButtonPrev = checkButtonPrev ? totalPagination[prevButton] + 1 : "";
  let linkButtonNext = checkButtonNext ? totalPagination[nextButton] + 1 : "";

  // current

  let hasilOutput = [];
  hasilOutput = {
    pagination: hasilPagination,
    buttonPrev: checkButtonPrev,
    buttonNext: checkButtonNext,
    linkButtonPrev: linkButtonPrev,
    linkButtonNext: linkButtonNext,
  };
  return hasilOutput;
};

const isset = (totalPagination, batasAkhir) => {
  if (typeof totalPagination[batasAkhir] !== "undefined") {
    return true;
  }
  return false;
};

module.exports = { pagination };
