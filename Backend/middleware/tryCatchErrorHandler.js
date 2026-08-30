const tryCatchHanler = theFun => (req, res, next) => {
  Promise.resolve(theFun(req, res, next)).catch(next);
};

export default tryCatchHanler;