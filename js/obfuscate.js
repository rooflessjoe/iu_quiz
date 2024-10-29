function obfuscateAndExecute(code) {
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true
    }).getObfuscatedCode();
    eval(obfuscatedCode);
  }