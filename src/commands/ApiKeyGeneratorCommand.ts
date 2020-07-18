import String from '../lib/String';

const bcrypt = require('bcryptjs');
const hashing = require('../../config/hashing');

const string = new String();
const key = string.random(7);

const randomString = string.random(80);
const plainTextHash = randomString;

const rounds = hashing.bcrypt.rounds;

bcrypt.hash(plainTextHash, rounds, async function(err: any, hash: any) {
  console.log("plaintext: ", `${key}.${plainTextHash}`);

  console.log("hashed: ", hash);

  console.log("matches: ", await bcrypt.compareSync(plainTextHash, hash));
});
