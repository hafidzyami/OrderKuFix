function formatProfileURL(url: any): string {
    // Find the position of the first '/' after "https://firebasestorage.googleapis.com/v0/b/orderku-7b2aa.appspot.com/o/menu"
    const startIndex =
      url.indexOf(
        "https://firebasestorage.googleapis.com/v0/b/orderku-7b2aa.appspot.com/o/profile"
      ) +
      "https://firebasestorage.googleapis.com/v0/b/orderku-7b2aa.appspot.com/o/profile"
        .length;
  
    // Get the substring starting from the position of the first '/'
    const substringAfterMenu = url.substring(startIndex);
  
    // Replace all occurrences of '/' with '%2F' in the substring
    const replacedSubstring = substringAfterMenu.replace(/\//g, "%2F");
  
    // Concatenate the modified substring with the base URL
    const modifiedUrl = url.substring(0, startIndex) + replacedSubstring;
    const fixModifiedURL = modifiedUrl.replace(/ /g, "%20")
    return fixModifiedURL;
  }
  
  export default formatProfileURL;
  