const calculateAgeFromDate = (dobString) => {
  if (!dobString) return null;

  // "25-05-2002" → [25, 05, 2002]
  const [day, month, year] = dobString.split("-").map(Number);

  const birthDate = new Date(year, month - 1, day); // month 0-based hota hai
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassedThisYear) {
    age = age - 1;
  }

  return age;
};


export default calculateAgeFromDate