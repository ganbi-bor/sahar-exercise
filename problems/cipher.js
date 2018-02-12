const Cipher = function(input) {
    this.key = input;
    this.alphabet = 'abcdefghijklmnopqrstuvwxyz';
};

/**
 * The opposite of indexToChar.
 * Takes in a character and an alphabet string. Returns the alphaIndex of the
 * character. For instance, for the regular alphabet:
 * char = a returns 0
 * char = b returns 1
 * char = z returns 25
 * @param  {str} char     a single character to find the index of
 * @param  {str} alphabet an alphabet string to match the character against to find the index
 * @return {int}          an integer representing the index of the character
 */
const _charToAlphaIndex = (char, alphabet) => {
    let alphaIndex = null;

    while (alphaIndex === null) {
        alphabet.split('').forEach((alphaChar) => {
            if (alphaChar === char) {
                alphaIndex = alphabet.indexOf(alphaChar);
            }
        });
    };
  return alphaIndex;
};

/**
 * The opposite of charToAlphaIndex.
 * Takes in a character index and an alphabet string. Returns the character at
 * the given index using the alphabet string. For instance, for the regular alphabet:
 * index = 0 returns 'a'
 * index = 25 returns 'z'
 * index = 26 returns 'a'
 * We use % to convert the index to its corresponding index when wrapped around the alphabet.
 * For instance, an index of 40 % 26 = 14, so we use the new index of 14 to find the correct
 * character.
 * @param  {int} index    integer representing the index of the character
 * @param  {str} alphabet an alphabet string to match the index of the character against
 * @return {str}          a single character at that position in the alphabet
 */
const _indexToChar = (index, alphabet) => {
    // If we're given a negative index, we need to add the alphabet length
    // to convert it to its positive match
    if (index < 0) {
        index = index + alphabet.length;
    }
    // We need to use % to make sure the index will fit on the alphabet
    // e.g., if we're given an index of 40, that doesn't fit on the alphabet.
    const convertedIndex = index % alphabet.length;

    return alphabet.charAt(convertedIndex);
};

/**
 * Validates a given key to ensure that the key is long enough to be able to
 * properly encode or decode the stringToConvert. If the key is not long enough,
 * this method will repeat the key characters until the key becomes long enough.
 * For instance, given a key of 'ab' and a stringToConvert of 'sahar', the key will
 * return as 'ababa'.
 * // TO DO: Add more validation for non-alpha keys
 * @param  {str} key            the key provided by the user
 * @param  {str} stringToConvert the string we're taking action on to convert later
 * @return {str}                the validated key
 */
const _validateKey = (key, stringToConvert) => {
    if (key.length != stringToConvert.length) {
        index = -1;
        while (key.length != stringToConvert.length) {
            index += 1;
            key = key.concat(key.charAt(index));
        }
    }
    return key;
};

/**
 * The opposite of decode.
 * Takes in a string and returns an encoded string. Uses the provided key
 * to encode each individual character according to the matching key character
 * (by index). For instance, given a key of 'bbbb': string = 'abcd' returns 'bcde'
 * @param  {str} stringToEncode user inputted string to encode
 * @return {str}                encoded string
 */
Cipher.prototype.encode = function(strToEncode) {
    let encodedArray = [];
    let charStrIndex = -1;

    let key = _validateKey(this.key, strToEncode);

    strToEncode.split('').forEach((char) => {
        charStrIndex += 1;
        // get the alphaIndex of the current character
        const charAlphaIndex = _charToAlphaIndex(char, this.alphabet);
        // get the alphaIndex of the key character at the current character's position
        const keyCharAlphaIndex = _charToAlphaIndex(key.toLowerCase().charAt(charStrIndex), this.alphabet);

        const encodedIndex = charAlphaIndex + keyCharAlphaIndex;
        const encodedChar = _indexToChar(encodedIndex, this.alphabet);

        return encodedArray.push(encodedChar);
    });

    return encodedArray.join('');
};

/**
 * The opposite of encode.
 * Takes in an encoded string and returns a decoded string. Uses the provided key
 *to decode each individual character according to the matching key character
 *(by index). For instance, given a key of 'bbbb:
 *encoded = 'bcde' returns the decoded string, 'abcd'
 * @param  {str} encodedString user inputted encoded string to decode
 * @return {str}               decoded string
 */
Cipher.prototype.decode = function(encodedStr) {
    let decodedArray = [];
    let charStrIndex = -1;

    let key = _validateKey(this.key, encodedStr);

    encodedStr.split('').forEach((char) => {
        charStrIndex += 1;
        // get the alphaIndex of the current character
        const charAlphaIndex = _charToAlphaIndex(char, this.alphabet);
        // get the alphaIndex of the key character at the current character's position
        const keyCharAlphaIndex = _charToAlphaIndex(key.toLowerCase().charAt(charStrIndex), this.alphabet);

        const decodedIndex = charAlphaIndex - keyCharAlphaIndex;
        const decodedChar = _indexToChar(decodedIndex, this.alphabet);

        return decodedArray.push(decodedChar);
    });

    return decodedArray.join('');
};

module.exports = Cipher;
