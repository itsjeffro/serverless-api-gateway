import crypto from 'crypto';

class ApiKeyGenerator {
  randomString(length?: number) {
    const chosenLength = length || 32;

    let string = '';

    for (let i = 1; i <= chosenLength; i++) {
      const len = string.length;

      const size = chosenLength - len;

      const bytes = crypto.randomBytes(size);

      const base64 = Buffer.from(bytes);

      string += base64.toString('base64')
        .replace('/', '')
        .replace('+', '')
        .replace('=', '')
        .substr(0,1);
    }

    return string;
  }

  generate() {
    return this.randomString();
  }
}

export default ApiKeyGenerator;
