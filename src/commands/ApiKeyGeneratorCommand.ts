import String from '../lib/String';

const bcrypt = require('bcrypt');
const saltRounds = 10;

const string = new String();
const key = string.random(7);
const randomString = string.random(80);
const plainTextHash = randomString;

bcrypt.hash(plainTextHash, saltRounds, async function(err: any, hash: any) {
  console.log("plaintext: ", `${key}.${plainTextHash}`);

  console.log("hashed: ", hash);

  console.log("matches: ", await bcrypt.compareSync(plainTextHash, hash));
});
