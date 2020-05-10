var { QRLLIBmodule } = require('qrllib/build/offline-libjsqrl');
var QRLNodeJSTools = require('./functions.js');

const a = new Uint8Array(48); // NB NOT random here for testing purposes as in Python example

QRLNodeJSTools.waitForQRLLIB(async _ => {
  
  try {

    const WOTSParamW = 4

    // create XmssBasic object

    XMSS_OBJECT = await new QRLLIB.XmssBasic.fromParameters(
      QRLNodeJSTools.toUint8Vector(a), // again, not random -- use random entropy here (or existing SK data)
      6, // tree height
      QRLLIB.eHashFunction.SHAKE_128, // one of the hash functions
      QRLLIB.eAddrFormatType.SHA256_2X, // there is only this format
      WOTSParamW // WOTSParamW set to 4 as per Python demo
    );

      const pk = XMSS_OBJECT.getPK();
      console.log('pk:', pk);
      const pkBinary = QRLNodeJSTools.toUint8Vector(Buffer.from(pk, 'hex'))

      // set to OTS = 0
      XMSS_OBJECT.setIndex(0);
      console.log('OTS index set to: ', XMSS_OBJECT.getIndex());

      const message = '56454c9621c549cd05c112de496ba32f';
      let messageBinary = QRLNodeJSTools.toUint8Vector(Buffer.from(message, 'hex'));
      let signedBinary = XMSS_OBJECT.sign(messageBinary);
      let signedBytes = QRLNodeJSTools.binaryToBytes(signedBinary);
      let signedHex = QRLNodeJSTools.bytesToHex(signedBytes);

      console.log('signed message:', signedHex);

      let verification = QRLLIB.XmssBasic.verify(messageBinary, signedBinary, pkBinary, WOTSParamW);

      console.log('verification status:', verification);

      console.log('\nnow with OTS=1');

      XMSS_OBJECT.setIndex(1);
      console.log('OTS index set to: ', XMSS_OBJECT.getIndex());
      messageBinary = QRLNodeJSTools.toUint8Vector(Buffer.from(message, 'hex'));
      signedBinary = XMSS_OBJECT.sign(messageBinary);
      signedBytes = QRLNodeJSTools.binaryToBytes(signedBinary);
      signedHex = QRLNodeJSTools.bytesToHex(signedBytes);
      console.log('signed message:', signedHex);
      verification = QRLLIB.XmssBasic.verify(messageBinary, signedBinary, pkBinary, WOTSParamW);
      console.log('verification status:', verification);

  } catch (e) {
    console.log('error', e);
    throw e;
  }
});
