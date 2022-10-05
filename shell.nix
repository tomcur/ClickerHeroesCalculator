with import <nixpkgs> {};
pkgs.mkShell {
  buildInputs = [
    bashInteractive
    yarn
    nodejs-16_x
  ];
}
