```
# Simple Cipher

Implement a simple shift cipher like Caesar and a more secure substitution cipher.

## Step 1

"If he had anything confidential to say, he wrote it in cipher, that is,
by so changing the order of the letters of the alphabet, that not a word
could be made out. If anyone wishes to decipher these, and get at their
meaning, he must substitute the fourth letter of the alphabet, namely D,
for A, and so with the others."
—Suetonius, Life of Julius Caesar

Ciphers are very straight-forward algorithms that allow us to render
text less readable while still allowing easy deciphering. They are
vulnerable to many forms of cryptoanalysis, but we are lucky that
generally our little sisters are not cryptoanalysts.

The Caesar Cipher was used for some messages from Julius Caesar that
were sent afield. Now Caesar knew that the cipher wasn't very good, but
he had one ally in that respect: almost nobody could read well. So even
being a couple letters off was sufficient so that people couldn't
recognize the few words that they did know.

Your task is to create a simple shift cipher like the Caesar Cipher.
This image is a great example of the Caesar Cipher:

![Caesar Cipher][1]

For example:

Giving "iamapandabear" as input to the encode function returns the cipher "ldpdsdqgdehdu". Obscure enough to keep our message secret in transit.

When "ldpdsdqgdehdu" is put into the decode function it would return
the original "iamapandabear" letting your friend read your original
message.

## Step 2

Shift ciphers are no fun though when your kid sister figures it out. Try
amending the code to allow us to specify a key and use that for the
shift distance. This is called a substitution cipher.

Here's an example:

Given the key "aaaaaaaaaaaaaaaaaa", encoding the string "iamapandabear"
would return the original "iamapandabear".

Given the key "ddddddddddddddddd", encoding our string "iamapandabear"
would return the obscured "ldpdsdqgdehdu"

In the example above, we've set a = 0 for the key value. So when the
plaintext is added to the key, we end up with the same message coming
out. So "aaaa" is not an ideal key. But if we set the key to "dddd", we
would get the same thing as the Caesar Cipher.

## Step 3

The weakest link in any cipher is the human being. Let's make your
substitution cipher a little more fault tolerant by providing a source
of randomness and ensuring that the key contains only lowercase letters.

If someone doesn't submit a key at all, generate a truly random key of
at least 100 characters in length.

If the key submitted is not composed only of lowercase letters, your
solution should handle the error in a language-appropriate way.

## Extensions

Shift ciphers work by making the text slightly odd, but are vulnerable
to frequency analysis. Substitution ciphers help that, but are still
very vulnerable when the key is short or if spaces are preserved. Later
on you'll see one solution to this problem in the exercise
"crypto-square".

If you want to go farther in this field, the questions begin to be about
how we can exchange keys in a secure way. Take a look at [Diffie-Hellman
on Wikipedia][dh] for one of the first implementations of this scheme.

[1]: https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Caesar_cipher_left_shift_of_3.svg/320px-Caesar_cipher_left_shift_of_3.svg.png
[dh]: http://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange

## Setup

Go through the setup instructions for JavaScript to install the
 necessary dependencies:

http://exercism.io/languages/javascript/installation

## Running the test suite

The provided test suite uses [Jasmine](https://jasmine.github.io/).
You can install it by opening a terminal window and running the
following command:


$ npm install -g jasmine


Run the test suite from the exercise directory with:


$ jasmine simple-cipher.spec.js


In many test suites all but the first test have been marked "pending".
Once you get a test passing, activate the next one by changing `xit` to `it`.

## Source

Substitution Cipher at Wikipedia [http://en.wikipedia.org/wiki/Substitution_cipher](http://en.wikipedia.org/wiki/Substitution_cipher)

## Submitting Incomplete Solutions
It's possible to submit an incomplete solution so you can see how others have completed the exercise.

```

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
