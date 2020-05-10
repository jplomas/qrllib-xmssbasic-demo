let QRLLIBLoaded = false;
module.exports = {
  QRLLIBLoaded: QRLLIBLoaded,
  waitForQRLLIB: function(callBack) {
    setTimeout(() => {
      // Test the QRLLIB object has the str2bin function.
      // This is sufficient to tell us QRLLIB has loaded.
      if (typeof QRLLIB.str2bin === 'function' && QRLLIBLoaded === true) {
        callBack();
      } else {
        QRLLIBLoaded = true;
        return this.waitForQRLLIB(callBack);
      }
      return false;
    }, 50);
  },
  bytesToHex: function (byteArray) {
    return Array.from(byteArray, function (byte) {
      return ('00' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  },
  binaryToBytes: function (convertMe) {
    const thisBytes = new Uint8Array(convertMe.size());
    for (let i = 0; i < convertMe.size(); i += 1) {
      thisBytes[i] = convertMe.get(i);
    }
    return thisBytes;
  },
  toUint8Vector: function (arr) {
    const vec = new QRLLIB.Uint8Vector();
      for (let i = 0; i < arr.length; i += 1) {
        vec.push_back(arr[i]);
      }
    return vec;
  },
};