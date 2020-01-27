let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    buildInputs = with pkgs; [
        hello
        #(import ~/src/trusktr+nixpkgs/nodejs/default.nix {pkgs})."13.6.0"
    ];
  }
