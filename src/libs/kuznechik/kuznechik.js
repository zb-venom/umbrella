module.exports = class Kuznechik {
  //
  // Нелинейное биективное преобразование
  //
  Pi = Buffer.from([
    252, 238, 221, 17, 207, 110, 49, 22, 251, 196, 250, 218, 35, 197, 4, 77,
    233, 119, 240, 219, 147, 46, 153, 186, 23, 54, 241, 187, 20, 205, 95, 193,
    249, 24, 101, 90, 226, 92, 239, 33, 129, 28, 60, 66, 139, 1, 142, 79, 5,
    132, 2, 174, 227, 106, 143, 160, 6, 11, 237, 152, 127, 212, 211, 31, 235,
    52, 44, 81, 234, 200, 72, 171, 242, 42, 104, 162, 253, 58, 206, 204, 181,
    112, 14, 86, 8, 12, 118, 18, 191, 114, 19, 71, 156, 183, 93, 135, 21, 161,
    150, 41, 16, 123, 154, 199, 243, 145, 120, 111, 157, 158, 178, 177, 50, 117,
    25, 61, 255, 53, 138, 126, 109, 84, 198, 128, 195, 189, 13, 87, 223, 245,
    36, 169, 62, 168, 67, 201, 215, 121, 214, 246, 124, 34, 185, 3, 224, 15,
    236, 222, 122, 148, 176, 188, 220, 232, 40, 80, 78, 51, 10, 74, 167, 151,
    96, 115, 30, 0, 98, 68, 26, 184, 56, 130, 100, 159, 38, 65, 173, 69, 70,
    146, 39, 94, 85, 47, 140, 163, 165, 125, 105, 213, 149, 59, 7, 88, 179, 64,
    134, 172, 29, 247, 48, 55, 107, 228, 136, 217, 231, 137, 225, 27, 131, 73,
    76, 63, 248, 254, 141, 83, 170, 144, 202, 216, 133, 97, 32, 113, 103, 164,
    45, 43, 9, 91, 203, 155, 37, 208, 190, 229, 108, 82, 89, 166, 116, 210, 230,
    244, 180, 192, 209, 102, 175, 194, 57, 75, 99, 182,
  ]);
  //
  // Линейное биективное преобразование
  //
  linear = Buffer.from([
    148, 32, 133, 16, 194, 192, 1, 251, 1, 192, 194, 16, 133, 32, 148, 1,
  ]);

  constructor() {
    this.iterKeys = [];
    this.iterConst = [];
    this.key = Buffer.alloc(16);
    this.KeyGenerator();
  }

  setKey(key) {
    this.key = key;
    this.GetKeys(key);
  }

  getKey() {
    return this.key;
  }

  //
  // Сложение двух двоичных векторов по модулю 2
  //
  X(a, b) {
    let result = Buffer.alloc(16);
    for (let i = 0; i < 16; i++) {
      result[i] = a[i] ^ b[i];
    }
    return result;
  }

  //
  // Нелинейное биективное преобразование (преобразование S)
  //
  S(input) {
    let result = Buffer.alloc(0);
    for (let i = 0; i < input.length; i++)
      result = Buffer.concat([result, Buffer.from([this.Pi[input[i]]])]);
    while (result.length < 16)
      result = Buffer.concat([Buffer.alloc(1), result]);
    return result;
  }

  reversedS(input) {
    let result = Buffer.alloc(16);
    while (input.length < 16) input = Buffer.concat([input, Buffer.alloc(1)]);
    for (let i = 0; i < 16; i++) result[i] = this.Pi.indexOf(input[i]);
    return result;
  }

  //
  // Линейное преобразование (преобразование L)
  //
  L(input) {
    let result = input;
    for (let i = 0; i < 16; i++) {
      result = this.R(result);
    }
    return result;
  }

  reversedL(input) {
    let result = input;
    for (let i = 0; i < 16; i++) {
      result = this.reversedR(result);
    }
    return result;
  }

  //
  // преобразование R
  //
  R(input) {
    let result = Buffer.alloc(16);
    for (let i = 0; i < 16; i++) {
      result[i] = input[i - 1];
      result[0] ^= this.GaloisPolynomial(this.linear[i], input[i]);
    }
    return result;
  }

  reversedR(input) {
    let result = Buffer.alloc(16);
    result[15] = input[0];
    for (let i = 0; i < 15; i++) {
      result[i] = input[i + 1];
      result[15] ^= this.GaloisPolynomial(input[i + 1], this.linear[i]);
    }
    return result;
  }

  //
  // Функция умножения чисел в конечном поле (или поле Галуа)
  // над неприводимым полиномом x^8 + x^7 + x^6 + x + 1
  //
  GaloisPolynomial(a, b) {
    let result = 0;
    for (let i = 0; i < 8; i++) {
      if (b & 1) result ^= a;
      a = (a & 0x80 ? 0xc3 : 0x00) ^ (a <<= 1);
      b >>= 1;
    }
    return result;
  }

  //
  // Генерация 32 итерационных ключей
  //
  KeyGenerator() {
    for (let i = 0; i < 32; i++) {
      this.key[i] = Math.floor(Math.random() * 255);
    }
    this.GetKeys(this.key);
  }

  GetKeys(key) {
    let key1 = Buffer.alloc(16),
      key2 = Buffer.alloc(16);
    for (let i = 0; i < 16; i++) {
      key1[i] = key[i];
      key2[i] = key[16 + i];
    }
    this.iterKeys[0] = key1;
    this.iterKeys[1] = key2;
    this.ConstGen();
    let temp1, temp2;
    temp1 = this.iterKeys;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j += 2) {
        temp2 = this.F(temp1[0], temp1[1], this.iterConst[j + 8 * i]);
        temp1 = this.F(temp2[0], temp2[1], this.iterConst[j + 1 + 8 * i]);
      }

      this.iterKeys[2 * i + 2] = temp1[0];
      this.iterKeys[2 * i + 3] = temp1[1];
    }
  }

  ConstGen() {
    for (let i = 0; i < 32; i++) {
      let temp = Buffer.alloc(16);
      temp[15] = i + 1;
      temp = this.L(temp);
      this.iterConst.push(temp);
    }
  }

  F(key1, key2, iterConst) {
    let outKey1,
      outKey2 = key1,
      internal = this.X(key1, iterConst);
    internal = this.S(internal);
    internal = this.L(internal);

    outKey1 = this.X(internal, key2);

    let key = [outKey1, outKey2];
    return key;
  }

  Encrypt(input) {
    let result = input;
    for (let i = 0; i < 9; i++) {
      result = this.X(result, this.iterKeys[i]);
      result = this.S(result);
      result = this.L(result);
    }
    result = this.X(result, this.iterKeys[9]);
    return result;
  }

  Decrypt(input) {
    let result = this.X(input, this.iterKeys[9]);
    for (let i = 8; i >= 0; i--) {
      result = this.reversedL(result);
      result = this.reversedS(result);
      result = this.X(result, this.iterKeys[i]);
    }
    return result;
  }
};
