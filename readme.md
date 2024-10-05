## Setup

These instructions are for Ubuntu.

```bash
sudo apt update
sudo apt install build-essential dotnet-sdk-8.0
```

Install [VSCodium].

Switch extension registry [from Open VSX to Microsoft's VS Code][how-to-use-a-different-extension-gallery] by replacing the content of `~/.config/VSCodium/product.json` with the following:

```json
{
    "extensionsGallery": {
        "serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
        "itemUrl": "https://marketplace.visualstudio.com/items",
        "cacheUrl": "https://vscode.blob.core.windows.net/gallery/index",
        "controlUrl": ""
    }
}
```

Install required software for each language.

*   C# support: [C#], [C# Dev Kit].
*   C++ support: [C/C++ Extension Pack].
*   Rust support: [rust-analyzer].
*   Java support: [vscode-java].

[how-to-use-a-different-extension-gallery]: https://github.com/VSCodium/vscodium/blob/f3a6b95/docs/index.md#how-to-use-a-different-extension-gallery
[VSCodium]: https://vscodium.com/
[C#]: https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp
[C# Dev Kit]: https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit
[C/C++ Extension Pack]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack
[Homebrew]: https://brew.sh/
[rust-analyzer]: https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer
[vscode-java]: https://marketplace.visualstudio.com/items?itemName=redhat.java
