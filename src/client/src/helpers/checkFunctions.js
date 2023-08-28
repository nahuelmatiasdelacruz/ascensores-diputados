export const checkEmpty = (obj) => {
    for (var propiedad in obj) {
        if (!obj[propiedad] || obj[propiedad] === '') {
          return false;
        }
      }
      return true;
}