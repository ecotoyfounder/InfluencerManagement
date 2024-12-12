const generateTempId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
};

export default generateTempId;
