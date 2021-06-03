const Kuznechik = require("./kuznechik");

module.exports = class GCM {
  constructor() {
    this.kuznechik = new Kuznechik();
    this.key = Buffer.alloc(0);
  }

  randomBytes(size) {
    let result = Buffer.alloc(0);
    for (let i = 0; i < size; i++) {
      result = Buffer.concat([
        result,
        Buffer.from([Math.floor(Math.random() * 256)]),
      ]);
    }
    return result;
  }

  setKeys(key) {
    this.key = key;
    this.kuznechik.setKey(this.key);
  }

  CTR(ctr, n) {
    let array = n.toString(16).replace(/\D/g, "0").split("").map(Number);
    while (array.length != 8) {
      array.unshift(0);
    }
    let temp = Buffer.from(array);
    for (let i = 0; i < 8; ++i) {
      ctr[i + 8] += temp[i];
    }
    return ctr;
  }

  Encrypt(input) {
    let IV = this.randomBytes(16);
    let result = Buffer.alloc(input.length);
    let ctr0 = this.kuznechik.X(Buffer.alloc(16), IV);
    let tag = this.kuznechik.Encrypt(Buffer.alloc(16));
    let ctr = this.CTR(ctr0, 0);
    ctr0 = this.kuznechik.Encrypt(ctr0);
    let numIters = Math.floor(input.length / 16);
    for (let i = 0; i < numIters; ++i) {
      let temp = this.kuznechik.Encrypt(ctr);
      for (let j = 0; j < 16; j++) {
        result[i * 16 + j] = temp[j] ^ input[i * 16 + j];
        tag[j] = tag[j] ^ result[i * 16 + j];
      }
      ctr = this.CTR(ctr, i + 1);
    }

    if (input.length % 16 != 0) {
      let temp = this.kuznechik.Encrypt(ctr);
      for (let j = 0; j < input.length % 16; j++) {
        result[numIters * 16 + j] = temp[j] ^ input[numIters * 16 + j];
        tag[j] = tag[j] ^ result[numIters * 16 + j];
      }
    }

    let temp = Buffer.alloc(15);
    temp = Buffer.concat([temp, Buffer.from([128])]);

    for (let j = 0; j < 16; j++) {
      tag[j] = tag[j] ^ temp[j];
      tag[j] = tag[j] ^ ctr0[j];
    }

    result = Buffer.concat([IV, result, tag]);
    return result;
  }

  Decrypt(input) {
    let IV = input.slice(0, 16);
    let _tag = input.slice(input.length - 16);
    input = input.slice(16, input.length - 16);
    let result = Buffer.alloc(input.length);
    let ctr0 = this.kuznechik.X(Buffer.alloc(16), IV);
    let tag = this.kuznechik.Encrypt(Buffer.alloc(16));
    let ctr = this.CTR(ctr0, 0);
    ctr0 = this.kuznechik.Encrypt(ctr0);
    let numIters = Math.floor(input.length / 16);
    for (let i = 0; i < numIters; ++i) {
      let temp = this.kuznechik.Encrypt(ctr);
      for (let j = 0; j < 16; j++) {
        result[i * 16 + j] = temp[j] ^ input[i * 16 + j];
        tag[j] = tag[j] ^ input[i * 16 + j];
      }
      ctr = this.CTR(ctr, i + 1);
    }

    if (input.length % 16 != 0) {
      let temp = this.kuznechik.Encrypt(ctr);
      for (let j = 0; j < input.length % 16; j++) {
        result[numIters * 16 + j] = temp[j] ^ input[numIters * 16 + j];
        tag[j] = tag[j] ^ input[numIters * 16 + j];
      }
    }

    let temp = Buffer.alloc(15);
    temp = Buffer.concat([temp, Buffer.from([128])]);

    for (let j = 0; j < 16; j++) {
      tag[j] = tag[j] ^ temp[j];
      tag[j] = tag[j] ^ ctr0[j];
    }

    if (!Buffer.compare(tag, _tag)) return result;
    else return "Auth tag error";
  }
};
